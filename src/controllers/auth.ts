import { Request, Response } from 'express';
import { signInService, signOutService, signUpService } from '../services/auth';
import { createUserService } from '../services/user';

export const registerUser = async (req: Request, res: Response) => {
  const userData = { ...req.body }

  // check if userData is provided
  if (!Object.keys(userData).length) {
    return res.status(400).send({
      message: 'User data is required!',
      code: 'MISSING_USER_DATA'
    });
  }

  // check if email and password are provided
  if (!userData.email.trim() || !userData.password.trim()) {
    return res.status(400).send({
      message: 'Email and password are required!',
      code: 'MISSING_EMAIL_OR_PASSWORD'
    });
  }

  // check if email is valid
  if (!userData.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    return res.status(400).send({
      message: 'Email is invalid!',
      code: 'INVALID_EMAIL'
    });
  }
  // check if password is valid
  if (!userData.password.match(/^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.*[A-Z])(?=.*[a-z]).{8,}$/)) {
    return res.status(400).send({
      message: 'Password should be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character!',
      code: 'INVALID_PASSWORD'
    });
  }

  try {
    const cognitoUser: any = await signUpService(userData);
    // check if the user is already registered
    if (cognitoUser.code >= 400) {
      return res.status(422).send({
        message: cognitoUser.message,
        code: 'BAD_REQUEST'
      });
    }
    // modify user data to match the schema
    cognitoUser.created_date = Date();
    delete cognitoUser.username;

    await createUserService(cognitoUser);
    // TODO: add error handling for the case when user is created but not added to the database

    return res.status(201).send(cognitoUser);
  }
  catch (error: any) {
    return res.status(500).send({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check if email and password are provided
  if (!email.trim() || !password.trim()) {
    return res.status(400).send({
      message: 'Email and password are required!',
      code: 'MISSING_EMAIL_OR_PASSWORD'
    });
  }

  // check if email is valid
  if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    return res.status(400).send({
      message: 'Email is invalid!',
      code: 'INVALID_EMAIL'
    });
  }

  try {
    const result: any = await signInService(email, password);

    // check if email or password is incorrect
    if (result.code || result.message) {
      return res.status(401).send({
        message: result.message,
        code: result.code
      });
    }

    return res.status(201).send(result);
  }
  catch (error: any) {
    return res.status(500).send({
      message: error.message,
      code: error.code
    });
  }
}

export const logoutUser = async (req: any, res: Response) => {
  const authHeader = req.headers['authorization'] as string;
  if (!authHeader) {
    return res.status(401).send({
      message: 'Authorization header is missing',
      code: 'MISSING_AUTHORIZATION_HEADER'
    });
  }

  let accessToken = authHeader.split(' ')[1];
  let bearer = authHeader.split(' ')[0];
  const token = accessToken.replace(/\"/g, '')
  if (bearer !== 'Bearer') {
    return res.status(401).send({
      message: 'Authorization header is invalid. Bearer missing.',
      code: 'INVALID_AUTHORIZATION_HEADER'
    });
  }

  // check if accessToken is provided
  if (!accessToken) {
    return res.status(400).send({
      message: 'Provide a valid access token!',
      code: 'MISSING_ACCESS_TOKEN'
    });
  }

  try {
    const result: any = await signOutService(token);
    if (result.statusCode >= 400) {
      return res.status(result.statusCode).send({
        message: result.message,
        code: result.code
      });
    }
    return res.status(201).send(result);
  }
  catch (error: any) {
    return res.status(500).send({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}
