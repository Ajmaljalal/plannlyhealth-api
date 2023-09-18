import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import {
  createEmployeeService,
  getEmployeeByIdService,
  getAllEmployeesService,
  updateEmployeeService,
  deleteEmployeeService,
  getEmployeesByCompanyIdService,
  getEmployeeByEmailService,
} from '../services/employees';
import { Role } from '../lib/enums';
import {
  CreateEmployeeSchema,
  UpdateEmployeeSchema,
  Employee
} from '../models/employee';
import { EmployeeAccountStatus } from '../lib/enums';


export async function createEmployee(req: any, res: Response) {
  const employee = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(employee).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. modify the employee object to add the required fields
  employee.id = uuid();
  employee.created_at = Date();
  employee.modified_at = Date();
  employee.role = employee.role || Role.Standard;
  employee.status = employee.status || EmployeeAccountStatus.Invited;

  // 3. validate the request body before creating the employee using the CreateemployeeSchema
  const { error } = CreateEmployeeSchema.validate(employee);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // 4. call the createemployeeService to create the user
  try {
    const response: any = await createEmployeeService(employee);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the employee
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

export async function getEmployeeById(req: Request, res: Response) {
  const employeeId: string = req.params.id;

  // 1. check if employee id is empty
  if (!employeeId) {
    return res.status(400).json({
      message: 'employee id in params cannot be empty',
      error: 'EMPTY_REQUEST_PARAM',
      code: 400
    });
  }

  try {
    // 2. call the getEmployeeByIdService to get the employee by id
    const response: any = await getEmployeeByIdService(employeeId);
    // 3. check if the response is an error
    if (response.code || response.statusCode) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
      // 4. if the response is not an error, send the employee
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

export async function getEmployeeByEmail(req: Request, res: Response) {
  const email: string = req.params.email;

  // 1. check if email is empty
  if (!email) {
    return res.status(400).json({
      message: 'Email in params cannot be empty',
      error: 'EMPTY_REQUEST_PARAM',
      code: 400
    });
  }

  try {
    // 2. call the getEmployeeByEmailService to get the employee by email
    const response: any = await getEmployeeByEmailService(email);
    // 3. check if the response is an error
    if (response.code || response.statusCode) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
      // 4. if the response is not an error, send the employee
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

export async function getEmployeesByCompanyId(req: Request, res: Response) {
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
    // 2. call the getEmployeesByCompanyIdService to get the employee by companyId
    const response: any = await getEmployeesByCompanyIdService(companyId);
    // 3. check if the response is an error
    if (response.code || response.statusCode) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
      // 4. if the response is not an error, send the employees
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

export async function getAllEmployees(req: Request, res: Response) {
  try {
    // 1. call the getAllEmployeesService to get all Employees
    const response: any = await getAllEmployeesService();
    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 3. if the response is not an error, send the Employees
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

export async function updateEmployee(req: any, res: Response) {
  const employeeId: string = req.params.id;
  const employee: Employee = req.body;

  const { error: validationError } = UpdateEmployeeSchema.validate(employee);
  if (validationError) {
    return res.status(400).json({
      message: validationError.details[0].message,
      error: 'INVALID_REQUEST_BODY',
      code: 400,
    });
  }

  try {
    const existingEmployee = await getEmployeeByIdService(employeeId) as any;
    if (!existingEmployee.Item) {
      return res.status(404).json({
        message: 'Employee not found',
        error: 'EMPLOYEE_NOT_FOUND',
        code: 404,
      });
    }

    // const currentUser = req.user;
    // const isAuthorized =
    //   [Role.Admin, Role.SuperAdmin, Role.Owner, Role.WellnessCoordinator, Role.ProgramAdmin].includes(currentUser?.role) ||
    //   currentUser?.id === existingEmployee.Item?.id;

    // if (!isAuthorized) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     error: 'NOT_AUTHORIZED',
    //     code: 403,
    //   });
    // }

    delete employee.id;
    delete existingEmployee.Item?.id;

    const updatedEmployee = { ...existingEmployee.Item, ...employee, modified_at: Date() };
    const response = await updateEmployeeService(employeeId, updatedEmployee) as any

    if (response?.code || response?.statusCode >= 400) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode,
      });
    }

    // if (employee.role !== existingEmployee.Item.role) {
    //   const employeeRole = employee.role;
    //   const updatedCognitoUser = await updateUserCognitoAttributesService(employee.email, [
    //     { Name: 'custom:role', Value: employeeRole },
    //   ]) as any

    //   if (updatedCognitoUser && updatedCognitoUser.code) {
    //     await updateEmployeeService(employeeId, existingEmployee.Item);
    //     return res.status(updatedCognitoUser.statusCode).json({
    //       message: updatedCognitoUser.message,
    //       error: updatedCognitoUser.code,
    //       code: updatedCognitoUser.statusCode,
    //     });
    //   }
    // }

    // if (employee.status !== existingEmployee.Item.status) {
    //   const cognitoService =
    //     employee.status === EmployeeAccountStatus.Deactivated
    //       ? deactivateUserCognitoService
    //       : activateUserCognitoService;
    //   const updatedCognitoUser = await cognitoService(employee.email) as any

    //   if (updatedCognitoUser && updatedCognitoUser.code) {
    //     await updateEmployeeService(employeeId, existingEmployee.Item);
    //     return res.status(updatedCognitoUser.statusCode).json({
    //       message: updatedCognitoUser.message,
    //       error: updatedCognitoUser.code,
    //       code: updatedCognitoUser.statusCode,
    //     });
    //   }
    // }

    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500,
    });
  }
}

export async function deleteEmployee(req: any, res: Response) {
  const employeeIdId = req.params.id;

  // check if user id is empty
  if (!employeeIdId) {
    return res.status(400).json({
      message: 'Employee id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }
  const employeeToDelete: any = await getEmployeeByIdService(req.params.id);
  if (employeeToDelete.Item) {
    return res.status(404).json({
      message: 'Employee not found.',
      code: 'EmployeeNotFound'
    });
  }
  // check if current user is the owner of the user
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.role === Role.SuperAdmin || authorizedUser?.role === Role.Admin) {
    const response: any = await deleteEmployeeService(employeeIdId);
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
      message: 'You are not authorized to delete this employee.',
      code: 'Unauthorized'
    });
  }
}
