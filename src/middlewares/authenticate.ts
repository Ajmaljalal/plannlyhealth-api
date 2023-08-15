import { Response, NextFunction } from 'express';
import { authenticateUserService } from '../services/auth';


export const authenticationMiddleware = async (req: any, res: Response, next: NextFunction) => {
  // if (req.url === '/') {
  return next();
  // }
  // const authHeader = req.headers['authorization'] as string;
  // if (!authHeader) {
  //   return res.status(400).send({
  //     message: 'You are not authorized to access this resource.',
  //     error: 'NOT_AUTHORIZED',
  //     code: 400
  //   });
  // }

  // let [bearer, accessToken] = authHeader.split(' ');
  // if (bearer !== 'Bearer') {
  //   return res.status(401).send({
  //     message: 'You are not authorized to access this resource.',
  //     error: 'NOT_AUTHORIZED',
  //     code: 401
  //   });
  // }

  // check if accessToken is provided
  // if (!accessToken?.trim()) {
  //   return res.status(401).send({
  //     message: 'You are not authorized to access this resource.',
  //     error: 'NOT_AUTHORIZED',
  //     code: 401
  //   });
  // }

  // try {
  //   // const token = decryptData(accessToken.trim());
  //   const authenticatedUser = await authenticateUserService(accessToken.trim());
  //   if (authenticatedUser.statusCode >= 400 || authenticatedUser.code === 'NotAuthorizedException') {
  //     return res.status(401).send({
  //       message: 'You are not authorized to access this resource.',
  //       error: 'NOT_AUTHORIZED',
  //       code: 401

  //     });
  //   }

  //   req.user = authenticatedUser;
  //   next();
  // }
  // catch (error) {
  //   return res.status(500).send({
  //     message: 'Something went wrong!',
  //     error: 'INTERNAL_SERVER_ERROR',
  //     code: 500
  //   });
  // }
};
