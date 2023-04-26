import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
  getUsersByCompanyIdService,
} from '../services/user';
import { User } from '../lib/types/user';
import { Role } from '../lib/enums';
import { CreateUserSchema, UpdateUserSchema } from '../models/user';
import { activateUserCognitoService, deactivateUserCognitoService, inviteNewUserService, updateUserCognitoAttributesService } from '../services/auth';
import { UserAccountStatus } from '../lib/enums';
import { generateRandomPassword } from '../lib/helpers';
import { sendEmailWithTemplateService } from '../services/sendgrid/email';


export const inviteNewUser = async (req: any, res: Response) => {
  const { userData } = req.body;
  const authenticatedUser = req.user
  const isAuthorized = [Role.Admin, Role.SuperAdmin, Role.WellnessCoordinator].includes(authenticatedUser?.role)

  if (!isAuthorized) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      error: 'NOT_AUTHORIZED',
      code: 403,
    });
  }

  // check if email is valid
  if (!userData?.email?.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    return res.status(400).send({
      message: 'Email is invalid!',
      error: 'INVALID_EMAIL',
      code: 400
    });
  }

  try {
    const password = generateRandomPassword();
    const cognitoUser: any = await inviteNewUserService(userData, password);
    if (cognitoUser.code || cognitoUser.message) {
      return res.status(400).send({
        message: cognitoUser.message,
        error: cognitoUser.code,
        code: 400
      });
    }

    const newDynamodbUser = {
      ...userData,
      id: cognitoUser.User.Attributes.find((attribute: any) => attribute.Name === 'sub').Value,
      creation_date: cognitoUser.User.UserCreateDate,
      status: UserAccountStatus.Invited,
    }
    const newUser: any = createUserService(newDynamodbUser);
    if (newUser.statusCode >= 400) {
      await deleteUserService(userData.email);
      return res.status(newUser.statusCode).send({
        message: newUser.message,
        error: newUser.code,
        code: newUser.statusCode
      });
    }
    await sendEmailWithTemplateService({
      toEmail: userData.email,
      type: 'invite-user',
      data: {
        name: userData.first_name,
        employer: userData.company_name,
        companyId: userData.company_id,
        subject: "Setup your Plannly Account",
        setup_user_link: `http://localhost:3000/activate-account?email=${userData.email}&sid=${password}&cid=${userData.company_id}`
      }
    })
    return res.status(201).send(newDynamodbUser);
  }
  catch (error: any) {
    return res.status(500).send({
      message: error.message,
      error: error.code,
      code: 500
    });
  }
}

export async function createUser(req: any, res: Response) {
  const user = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(user).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. modify the user object to add the required fields
  user.id = uuid();
  user.created_date = Date();
  user.modified_date = Date();
  user.owner = req.user.id

  // 3. validate the request body before creating the user using the CreateUserSchema
  const { error } = CreateUserSchema.validate(user);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // 4. call the createUserService to create the user
  try {
    const response: any = await createUserService(user);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the user
      return res.status(200).json(response.Item);
    }
  }
  catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const userId: string = req.params.id;

  // 1. check if user id is empty
  if (!userId) {
    return res.status(400).json({
      message: 'User id in params cannot be empty',
      error: 'EMPTY_REQUEST_PARAM',
      code: 400
    });
  }

  try {
    // 2. call the getUserByIdService to get the user by id
    const response: any = await getUserByIdService(userId);
    // 3. check if the response is an error
    if (response.code || response.statusCode) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
      // 4. if the response is not an error, send the user
    } else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500
    });
  }
}

export async function getUsersByCompanyId(req: Request, res: Response) {
  const companyId: string = req.params.id;

  // 1. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      error: 'EMPTY_REQUEST_PARAM',
      code: 400
    });
  }

  try {
    // 2. call the getUsersByCompanyIdService to get the user by companyId
    const response: any = await getUsersByCompanyIdService(companyId);
    // 3. check if the response is an error
    if (response.code || response.statusCode) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
      // 4. if the response is not an error, send the users
    } else {
      return res.status(200).json(response);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500
    });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    // 1. call the getAllUsersService to get all users
    const response: any = await getAllUsersService();
    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 3. if the response is not an error, send the users
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 4. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export async function updateUser(req: any, res: Response) {
  const userId: string = req.params.id;
  const user: User = req.body;

  const { error: validationError } = UpdateUserSchema.validate(user);
  if (validationError) {
    return res.status(400).json({
      message: validationError.details[0].message,
      error: 'INVALID_REQUEST_BODY',
      code: 400,
    });
  }

  try {
    const existingUser = await getUserByIdService(userId) as any;
    if (!existingUser.Item) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        code: 404,
      });
    }

    const currentUser = req.user;
    const isAuthorized =
      [Role.Admin, Role.SuperAdmin, Role.WellnessCoordinator, Role.CustomerSuccess].includes(currentUser?.role) ||
      currentUser?.id === existingUser.Item?.id;

    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        error: 'UNAUTHORIZED',
        code: 403,
      });
    }

    delete user.id;
    delete existingUser.Item?.id;
    user.creator = user.creator || currentUser.id;

    const updatedUser = { ...existingUser.Item, ...user, modified_date: Date() };
    const response = await updateUserService(userId, updatedUser) as any

    if (response?.code || response?.statusCode >= 400) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode,
      });
    }

    if (user.role !== existingUser.Item.role) {
      const userRole = user.role;
      const updatedCognitoUser = await updateUserCognitoAttributesService(user.email, [
        { Name: 'custom:role', Value: userRole },
      ]) as any

      if (updatedCognitoUser && updatedCognitoUser.code) {
        await updateUserService(userId, existingUser.Item);
        return res.status(updatedCognitoUser.statusCode).json({
          message: updatedCognitoUser.message,
          error: updatedCognitoUser.code,
          code: updatedCognitoUser.statusCode,
        });
      }
    }

    if (user.status !== existingUser.Item.status) {
      const cognitoService =
        user.status === UserAccountStatus.Deactivated
          ? deactivateUserCognitoService
          : activateUserCognitoService;
      const updatedCognitoUser = await cognitoService(user.email) as any

      if (updatedCognitoUser && updatedCognitoUser.code) {
        await updateUserService(userId, existingUser.Item);
        return res.status(updatedCognitoUser.statusCode).json({
          message: updatedCognitoUser.message,
          error: updatedCognitoUser.code,
          code: updatedCognitoUser.statusCode,
        });
      }
    }

    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500,
    });
  }
}

export async function deleteUser(req: any, res: Response) {
  const userId = req.params.id;

  // check if user id is empty
  if (!userId) {
    return res.status(400).json({
      message: 'User id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }
  const userToDelete: any = await getUserByIdService(req.params.id);
  if (userToDelete.Item) {
    return res.status(404).json({
      message: 'User not found.',
      code: 'UserNotFound'
    });
  }
  // check if current user is the owner of the user
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.role === Role.SuperAdmin || authorizedUser?.role === Role.Owner) {
    const response: any = await deleteUserService(userId);
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      return res.status(200).json(response);
    }
  } else {
    return res.status(403).json({
      message: 'You are not authorized to delete this user.',
      code: 'Unauthorized'
    });
  }
}
