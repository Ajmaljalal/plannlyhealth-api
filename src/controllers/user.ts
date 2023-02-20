import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
} from '../services/user';
import { User } from '../lib/types/user';
import { Role } from '../lib/enums';
import { CreateUserSchema, UpdateUserSchema } from '../models/user';


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
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getUserByIdService to get the user by id
    const response: any = await getUserByIdService(userId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the user
    } else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
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
  const user = req.body;

  // 1. check if user id is empty
  if (!userId) {
    return res.status(400).json({
      message: 'User id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(user).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 3. check if the user exists in db
    const userExists: any = await getUserByIdService(userId);
    if (!userExists.Item) {
      return res.status(404).json({
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the user
    // @ts-ignore
    const currentUser = req.user;
    const isOwner = currentUser && currentUser.id === userExists.Item.id;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isOwner || isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. add the required modifications to the user
    delete user.id; // this is because the id is not allowed to be updated
    delete userExists.Item?.id; // this is because the id is not allowed to be updated
    user.modified_date = Date();
    const userToUpdate = { ...userExists.Item, ...user };

    // 5. validate the request body before updating the user using the UpdateUserSchema
    const { error } = UpdateUserSchema.validate(userToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateUserService to update the user
    const response: any = await updateUserService(userId, userToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }

    // 8. if the response is not an error, send the user
    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    // 9. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
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
