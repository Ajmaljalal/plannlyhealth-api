import {
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import { cognitoIdentityServiceProvider } from '../configs/aws';
import { AwsConfig } from '../configs/cognito';


// TODO: Add email confirmation flow
export const signUpService = (userData: any) => {
  const userAttributes = {
    email: userData.email,
    given_name: userData.first_name,
    family_name: userData.last_name,
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
            username: result.user.getUsername(),
            email: result.user.getUsername(),
            first_name: result.user.userGivenName,
            last_name: result.user.userFamilyName,
            role: result.user.role,
            company_id: result.user.company_id,
            user_id: result.userSub,
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
    await new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const session = result.getIdToken().payload;
          const role = session['custom:role'];
          const company_id = session['custom:company_id'];
          const user_id = session['sub'];
          const first_name = session['given_name'];
          const last_name = session['family_name'];
          const email = session['email'];
          const refreshToken = result.getRefreshToken().getToken();
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const response = {
            username,
            email,
            first_name,
            last_name,
            role,
            company_id,
            user_id,
            refreshToken,
            accessToken,
            idToken
          }

          resolve(response);
        },
        onFailure: (err) => {
          reject(err);
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