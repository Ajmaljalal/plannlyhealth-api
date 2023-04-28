import {
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { cognitoIdentityServiceProvider } from '../configs/aws';
import { AwsConfig } from '../configs/cognito';
import { User } from '../models/user';

export const signUpService = (userData: any) => {
  const userAttributes = {
    email: userData.email,
    given_name: userData.first_name,
    family_name: userData.last_name,
    'custom:role': userData.role,
    'custom:company_id': userData.company_id,
    'custom:dynamodb_id': userData.id
  }
  try {
    return new Promise((resolve) => {
      AwsConfig.initAWS();
      AwsConfig.setCognitoAttributeList(userAttributes);
      const attributeList = AwsConfig.getCognitoAttributeList()
      AwsConfig.getUserPool().signUp(
        userData.email,
        userData.password,
        attributeList,
        null,
        (err: any, result: any) => {
          if (err) {
            return resolve({
              code: 422,
              message: err.message
            });
          }
          const response = {
            email: result.user.getUsername(),
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
            company_id: userData.company_id,
            dynamodb_id: userData.id,
            id: result.userSub,
          }
          return resolve(response);
        });
    })
  } catch (error) {
    return error
  }
}

export const signInService = async (username: string, password: string) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  });

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: AwsConfig.getUserPool()
  });

  try {
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const session = result.getIdToken().payload;
          const id = session['sub'];
          const first_name = session['given_name'];
          const last_name = session['family_name'];
          const email = session['email'];
          const role = session['custom:role'];
          const company_id = session['custom:company_id'];
          const dynamodb_id = session['custom:dynamodb_id'];
          const refreshToken = result.getRefreshToken().getToken();
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const response: any = {
            email,
            first_name,
            last_name,
            id,
            role,
            company_id,
            refreshToken,
            accessToken,
            idToken,
            dynamodb_id
          }
          resolve(response);
        },
        onFailure: (err) => {
          return resolve(err);
        }
      });
    });
  } catch (err) {
    return err;
  }
};

export const authenticateUserService = async (accessToken: any) => {
  try {
    const user = await cognitoIdentityServiceProvider.getUser({
      AccessToken: accessToken
    }).promise();
    if (user) {
      const userData: any = {}
      user.UserAttributes.forEach((attribute: any) => {
        if (attribute.Name.includes('custom:')) {
          attribute.Name = attribute.Name.replace('custom:', '');
        }
        if (attribute.Name === 'sub') {
          attribute.Name = 'id';
        }
        userData[attribute.Name] = attribute.Value;
      });
      return userData;
    } else {
      return null;
    }
  }
  catch (error) {
    return error;
  }
}

export const signOutService = async (accessToken: string) => {
  try {
    const cognitoUser = await cognitoIdentityServiceProvider.globalSignOut({ AccessToken: accessToken }).promise();
    if (cognitoUser) {
      return cognitoUser;
    } else {
      return null;
    }
  } catch (error) {
    return error;
  }
}

export const forgotPasswordService = (email: string) => {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: AwsConfig.getUserPool()
  });
  try {
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: async (data) => {
          const response = {
            code: 200,
            message: 'Password reset link sent successfully',
            data,
          }
          return resolve(response);
        },
        onFailure: function (err) {
          return resolve({
            code: 422,
            message: err.message
          })
        },
      });
    })
  } catch (error) {
    return error;
  }
}

export const resetPasswordService = async (email: string, code: string, password: string) => {
  try {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: AwsConfig.getUserPool()
    });
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, password, {
        onSuccess: (result) => {
          const response = {
            code: 200,
            message: 'Password reset successfully',
            data: result,
          }
          return resolve(response);
        },
        onFailure: (err: any) => {
          const response = {
            code: err.code,
            message: err.message,
            error: 'PASSWORD_RESET_FAILED'
          }
          return resolve(response);
        },
      });
    })
  } catch (error) {
    return error;
  }
}

export const updateUserCognitoAttributesService = async (email: string, attributes: any) => {
  try {
    return await cognitoIdentityServiceProvider.adminUpdateUserAttributes({
      UserAttributes: attributes,
      UserPoolId: process.env.AWS_USER_POOL_ID as string,
      Username: email
    }, (err, data) => {
      if (err) {
        return err;
      } else {
        return data
      }
    }).promise();
  } catch (error) {
    return error;
  }
}

export const deactivateUserCognitoService = async (email: string) => {
  try {
    return await cognitoIdentityServiceProvider.adminDisableUser({
      UserPoolId: process.env.AWS_USER_POOL_ID as string,
      Username: email
    }, (err, data) => {
      if (err) {
        return err;
      } else {
        return data
      }
    }).promise();
  } catch (error) {
    return error;
  }
}

export const activateUserCognitoService = async (email: string) => {
  try {
    return await cognitoIdentityServiceProvider.adminEnableUser({
      UserPoolId: process.env.AWS_USER_POOL_ID as string,
      Username: email
    }, (err, data) => {
      if (err) {
        return err;
      } else {
        return data
      }
    }).promise();
  } catch (error) {
    return error;
  }
}

export const inviteNewUserService = async (userData: User, password: string) => {
  try {
    return await cognitoIdentityServiceProvider.adminCreateUser({
      UserPoolId: process.env.AWS_USER_POOL_ID as string,
      Username: userData.email,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'email',
          Value: userData.email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        },
        {
          Name: 'custom:role',
          Value: userData.role
        },
        {
          Name: 'custom:company_id',
          Value: userData.company_id
        },
        {
          Name: 'custom:company_name',
          Value: userData.company_name
        },
        {
          Name: 'given_name',
          Value: userData.first_name
        },
        {
          Name: 'family_name',
          Value: userData.last_name
        }
      ]
    }).promise();
  } catch (error) {
    return error;
  }
}

export const resendInvitationService = async (email: string) => {
  try {
    return await cognitoIdentityServiceProvider.adminCreateUser({
      UserPoolId: process.env.AWS_USER_POOL_ID as string,
      Username: email,
      MessageAction: 'RESEND',
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
      ]
    }, (err, data) => {
      if (err) {
        return err;
      } else {
        return data
      }
    }).promise();
  } catch (error) {
    return error;
  }
}

export const setupUserAccountService = async (userData: any) => {
  const authenticationDetails = new AuthenticationDetails({
    Username: userData.email,
    Password: userData.sid
  });
  const cognitoUser = new CognitoUser({
    Username: userData.email,
    Pool: AwsConfig.getUserPool()
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const response = {
          code: 200,
          message: 'User activated successfully',
          data: result,
        };
        return resolve(response);
      },
      onFailure: (err) => {
        return reject({
          code: 400,
          message: 'Cannot setup your account. Please contact support.',
          error: err.code
        });
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // TODO: fix this, sending empty userAttributes object as it throws error
        cognitoUser.completeNewPasswordChallenge(userData.password, {}, {
          onSuccess: (result: any) => {
            const response = {
              code: 200,
              message: 'User activated successfully',
              cognitoId: result.accessToken.payload.sub,
            };
            return resolve(response);
          },
          onFailure: (err) => {
            const response = {
              code: 400,
              message: err.message,
              error: err.code
            };
            return reject(response);
          },
        });
      }
    });
  });
};

export const deleteUserCognitoService = async (email: string) => {
  try {
    return await cognitoIdentityServiceProvider.adminDeleteUser({
      UserPoolId: process.env.AWS_USER_POOL_ID as string,
      Username: email
    }, (err, data) => {
      if (err) {
        return err;
      } else {
        return data
      }
    }).promise();
  } catch (error) {
    return error;
  }
}