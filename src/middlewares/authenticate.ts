import { Response, NextFunction } from 'express';
import { authenticateUserService } from '../services/auth';


export const authenticationMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string;
  if (!authHeader) {
    return res.status(200).send({
      message: 'You are not authorized to access this resource.',
      code: 'MISSING_AUTHORIZATION_HEADER'
    });
  }

  let [bearer, accessToken] = authHeader.split(' ');
  if (bearer !== 'Bearer') {
    return res.status(401).send({
      message: 'Authorization header is invalid. Bearer missing.',
      code: 'INVALID_AUTHORIZATION_HEADER'
    });
  }

  // check if accessToken is provided
  if (!accessToken?.trim()) {
    return res.status(400).send({
      message: 'You are not authorized to access this resource.',
      code: 'NOT_AUTHORIZED'
    });
  }

  try {
    // const token = decryptData(accessToken.trim());
    const authenticatedUser = await authenticateUserService(accessToken.trim());
    if (authenticatedUser.statusCode >= 400 || authenticatedUser.code === 'NotAuthorizedException') {
      return res.status(401).send({
        message: 'You are not authorized to access this resource.',
        code: 'NOT_AUTHORIZED'
      });
    }

    req.user = authenticatedUser;
    next();
  }
  catch (error) {
    return res.status(500).send({
      message: 'Something went wrong!',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};
