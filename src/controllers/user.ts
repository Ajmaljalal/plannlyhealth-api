import {
  createUserService,
  getUserByIdService,
  getAllUsersService,
  updateUserService,
  deleteUserService,
} from '../services/user';
import { Request, Response } from 'express';
import { User } from '../lib/types/user';


export async function createUser(req: Request, res: Response) {
  const user: User = req.body;
  // validate the request body before creating a new company
  if (!user.first_name?.trim() || !user.last_name?.trim() || !user.location?.trim() || !user.photo?.trim()) {
    return res.status(400).json({
      message: 'Missing required fields. Please provide first name, last name, photo, and location.',
      code: 'MissingRequiredFields'
    });
  }
  const response: any = await createUserService(user);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(201).json(response);
  }
}

export async function getUserById(req: Request, res: Response) {
  const userId: string = req.params.id;
  const response: any = await getUserByIdService(userId);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response.Item);
  }
}

export async function getAllUsers(req: Request, res: Response) {
  const response: any = await getAllUsersService();
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response.Items);
  }
}

export async function updateUser(req: Request, res: Response) {
  const userId: string = req.params.id;
  const updates: Partial<User> = req.body;

  // check if user exists
  const user: any = await getUserByIdService(userId);
  if (!user.Item) {
    return res.status(404).json({
      message: 'User not found.',
      code: 'UserNotFound'
    });
  }
  const response: any = await updateUserService(userId, updates);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response.Attributes);
  }
}

export async function deleteUser(req: Request, res: Response) {
  // check if user exists
  const user: any = await getUserByIdService(req.params.id);
  if (user.Item) {
    // check if current user is the owner of the user
    // @ts-ignore
    const currentUser: any = {};
    // @ts-ignore
    currentUser?.role = 'owner';
    // @ts-ignore
    currentUser?.id = user.Item.owner
    const userId: string = user.Item.id;
    const userOwner: string = user.Item.owner;
    if (currentUser?.role === 'owner' && currentUser?.id === userOwner) {
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
  } else {
    return res.status(404).json({
      message: 'User not found.',
      code: 'UserNotFound'
    });
  }
}
