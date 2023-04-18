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
import { activateUserCognitoService, deactivateUserCognitoService, updateUserCognitoAttributesService } from '../services/auth';
import { UserAccountStatus } from '../lib/enums';


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

  // 2. check if the request body is empty
  const { error: validationError } = UpdateUserSchema.validate(user);
  if (validationError) {
    return res.status(400).json({
      message: validationError.details[0].message,
      error: 'INVALID_REQUEST_BODY',
      code: 400
    });
  }

  try {
    // 3. check if the user exists in db
    const userExists: any = await getUserByIdService(userId);
    if (!userExists.Item) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND',
        code: 404
      });
    }

    // 4. check if the current user is the owner of the user
    // @ts-ignore
    const currentUser = req.user;
    let isAuthorized = false;
    switch (currentUser?.role) {
      case Role.Admin:
      case Role.SuperAdmin:
      case Role.WellnessCoordinator:
      case Role.CustomerSuccess:
        isAuthorized = true;
        break;
      default:
        isAuthorized = currentUser?.id === userExists.Item?.id;
        break;
    }
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        error: "UNAUTHORIZED",
        code: 403
      });
    }

    // 4. add the required modifications to the user
    delete user.id; // this is because the id is not allowed to be updated
    delete userExists.Item?.id; // this is because the id is not allowed to be updated
    user.creator = user.creator || currentUser.id

    // 6. call the updateUserService to update the user
    const response: any = await updateUserService(userId, { ...userExists.Item, ...user, modified_date: Date() });

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
    }

    // 8. update the user in cognito
    if (user.role !== userExists.Item.role) {
      const userRole = user.role
      const updatedCognitoUser: any = await updateUserCognitoAttributesService(user.email, [{ 'Name': 'custom:role', 'Value': userRole }])
      if (updatedCognitoUser && updatedCognitoUser.code) {
        await updateUserService(userId, userExists.Item);
        return res.status(updatedCognitoUser.statusCode).json({
          message: updatedCognitoUser.message,
          error: updatedCognitoUser.code,
          code: updatedCognitoUser.statusCode
        });
      }
    }


    // 9. deactivate the user in cognito
    if (user.status !== userExists.Item.status && user.status === UserAccountStatus.Deactivated) {
      const updatedCognitoUser: any = await deactivateUserCognitoService(user.email)
      if (updatedCognitoUser && updatedCognitoUser.code) {
        await updateUserService(userId, userExists.Item);
        return res.status(updatedCognitoUser.statusCode).json({
          message: updatedCognitoUser.message,
          error: updatedCognitoUser.code,
          code: updatedCognitoUser.statusCode
        });
      }
    }

    // 10. activate the user in cognito
    if (user.status !== userExists.Item.status && user.status === UserAccountStatus.Active) {
      const updatedCognitoUser: any = await activateUserCognitoService(user.email)
      if (updatedCognitoUser && updatedCognitoUser.code) {
        await updateUserService(userId, userExists.Item);
        return res.status(updatedCognitoUser.statusCode).json({
          message: updatedCognitoUser.message,
          error: updatedCognitoUser.code,
          code: updatedCognitoUser.statusCode
        });
      }
    }

    // 11. if the response is not an error, send the user
    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    // 12. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500
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
