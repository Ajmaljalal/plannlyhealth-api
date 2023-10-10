import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { EmployeeAccountStatus, Role } from '../lib/enums';
import {
  createNewUserService,
  getNewUserByEmailService,
  getNewUserByFirstNameService,
  getNewUserByIdService,
  getNewUserByLastNameService,
  getNewUsersByCompanyIdService,
  updateNewUserService,
  deleteNewUserService,
  createBulkUsersService
} from '../services/new-users';
import { generateRandomPassword } from '../lib/helpers';
import { CreateEmployeeSchema, Employee, UpdateEmployeeSchema } from '../models/employee';
import { inviteNewUserService } from '../services/auth';
import { createEmployeeService, deleteEmployeeService } from '../services/employees';
import { sendEmailWithTemplateService } from '../services/sendgrid/email';


export const inviteNewUser = async (req: any, res: Response) => {
  const { userData } = req.body;
  const authenticatedUser = req.user
  // const isAuthorized = [Role.Admin, Role.SuperAdmin, Role.ProgramAdmin, Role.WellnessCoordinator].includes(authenticatedUser?.role)

  // if (!isAuthorized) {
  //   return res.status(403).json({
  //     message: 'You are not authorized to perform this action',
  //     error: 'NOT_AUTHORIZED',
  //     code: 403,
  //   });
  // }

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
    const userWithRole: Employee = {
      ...userData,
      role: userData.role || Role.Standard,
    }
    const cognitoUser: any = await inviteNewUserService(userWithRole, password);
    if (cognitoUser.code || cognitoUser.message) {
      return res.status(400).send({
        message: cognitoUser.message,
        error: cognitoUser.code,
        code: 400
      });
    }

    const newDynamodbUser = {
      ...userWithRole,
      id: cognitoUser.User.Attributes.find((attribute: any) => attribute.Name === 'sub').Value,
      creation_date: new Date().toISOString(),
      modified_date: new Date().toISOString(),
      creator: authenticatedUser.id,
      status: EmployeeAccountStatus.Invited,
    }
    const newUser: any = createEmployeeService(newDynamodbUser);
    if (newUser.statusCode >= 400) {
      await deleteEmployeeService(userData.email);
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

export const createNewUser = async (req: any, res: Response) => {
  // 1. get the user from the request body
  const user = req.body;

  // 2. check if the request body is empty
  if (!Object.keys(user).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 3.  add the required modifications to the user
  user.created_at = Date();
  user.modified_at = Date();
  user.id = uuid();
  user.role = user.role || Role.Standard;
  user.status = EmployeeAccountStatus.Invited;

  // 4. validate the request body before creating the user using the CreateUserSchema
  const { error } = CreateEmployeeSchema.validate(user);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  try {
    // 5. call the createUserService to create the user
    const response: any = await createNewUserService(user);

    // 6. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 7. if the response is not an error, send the user
      return res.status(201).json(response.Item);
    }
  }
  catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const createBulkUsers = async (req: Request, res: Response) => {
  // 1. get the users from the request body and the company id from the request params
  const users = req.body;
  const companyId = req.params.companyId;

  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in request params con not be empty',
      code: 'EMPTY_REQUEST_PARAMS'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(users).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 3.  add the required modifications to the users
  users.forEach((user: any) => {
    user.created_at = Date();
    user.modified_at = Date();
    user.id = uuid();
    user.role = user.role || Role.Standard;
    user.company_id = companyId;
    user.status = EmployeeAccountStatus.Invited;
    // // 4. validate the request body before creating the users using the CreateUserSchema
    // const { error } = CreateEmployeeSchema.validate(user);
    // if (error) {
    //   return res.status(400).json({
    //     message: error.details[0].message,
    //     code: 'INVALID_REQUEST_BODY'
    //   });
    // }
  });


  try {
    // 5. call the createBulkUsersService to create the users
    const response: any = await createBulkUsersService(users);

    // 6. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 7. if the response is not an error, send the users
      return res.status(201).json(response);
    }
  }
  catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }

}

export const getNewUserById = async (req: Request, res: Response) => {
  // 1. get the user id from the request params
  const userId = req.params.id;
  // 2. check if user id is empty
  if (!userId) {
    return res.status(400).json({
      message: 'User id in the request params cannot be empty',
      code: 'EMPTY_REQUEST_PARAMS'
    });
  }

  try {
    // 2. call the getUserByIdService to get the user
    const response: any = await getNewUserByIdService(userId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 4. if the response is not an error, send the user
      return res.status(200).json(response.Item);
    }
  }
  catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getNewUserByEmail = async (req: Request, res: Response) => {
  // 1. get the user email from the request params
  const email = req.params.email;

  // 2. check if email is empty
  if (!email) {
    return res.status(400).json({
      message: 'Email in the request params cannot be empty',
      code: 'EMPTY_REQUEST_PARAMS'
    });
  }

  try {
    // 3. call the getUserByEmailService to get the user
    const response: any = await getNewUserByEmailService(email);

    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 5. if the response is not an error, send the user
      return res.status(200).json(response.Items);
    }
  }
  catch (err: any) {
    // 6. catch any errors
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getNewUsersByCompanyId = async (req: Request, res: Response) => {
  // 1. get the company id from the request params
  const companyId = req.params.companyId;

  // 2. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in request params con not be empty',
      code: 'EMPTY_REQUEST_PARAMS'
    });
  }

  try {
    // 3. call the getUsersByCompanyIdService to get the user
    const response: any = await getNewUsersByCompanyIdService(companyId);

    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 5. if the response is not an error, send the user
      return res.status(200).json(response.Items);
    }
  }
  // 6. catch any errors
  catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getNewUserByFirstName = async (req: Request, res: Response) => {
  // 1. get the user id from the request params
  const firstName: string = req.params.firstName;
  // 2. check if user id is empty
  if (!firstName) {
    return res.status(400).json({
      message: 'First name in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getUserByIdService to get the user
    const response: any = await getNewUserByFirstNameService(firstName);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 5. if the response is not an error, send the user
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 6. catch any errors
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getNewUserByLastName = async (req: Request, res: Response) => {
  // 1. get the user id from the request params
  const lastName: string = req.params.lastName;

  // 2. check if user id is empty
  if (!lastName) {
    return res.status(400).json({
      message: 'Last name in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getUserByIdService to get the user
    const response: any = await getNewUserByLastNameService(lastName);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 5. if the response is not an error, send the user
    } else {
      return res.status(200).json(response.Items);
    }
    // 6. catch any errors
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const updateNewUser = async (req: Request, res: Response) => {
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
    const userExists: any = await getNewUserByIdService(userId);
    if (!userExists.Item) {
      return res.status(404).json({
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the comment
    // @ts-ignore
    const currentUser = req.user;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. add the required modifications to the user
    delete user.id; // this is because the id is not allowed to be updated
    delete userExists.Item?.id; // this is because the id is not allowed to be updated
    user.modified_at = Date();
    const userToUpdate = { ...userExists.Item, ...user };

    // 5. validate the request body before updating the user using the UpdateUserSchema
    const { error } = UpdateEmployeeSchema.validate(userToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateUserService to update the user
    const response: any = await updateNewUserService(userId, userToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 8. if the response is not an error, send the user
      return res.status(200).json(response.Attributes);
    }
  } catch (err: any) {
    // 9. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const deleteNewUser = async (req: Request, res: Response) => {
  const userId: string = req.params.id;

  // 1. check if user id is empty
  if (!userId) {
    return res.status(400).json({
      message: 'User id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. check if the user exists in db
    const userExists: any = await getNewUserByIdService(userId);
    if (!userExists.Item) {
      return res.status(404).json({
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 3. check if the current user is the owner of the user
    // @ts-ignore
    // const authorizedUser: any = req.user;
    // const currentUser = req.user;
    // const isAdmin = currentUser && currentUser.role === Role.Admin;
    // const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    // const isAuthorized = isAdmin || isSuperAdmin;
    // if (!isAuthorized) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: "UNAUTHORIZED"
    //   });
    // }

    // 4. call the deleteUserService to delete the user
    const response: any = await deleteNewUserService(userId);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the user
      return res.status(200).json(response);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

