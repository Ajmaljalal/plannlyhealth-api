import { signUpService } from "../../services/auth";
import { createBenefitsService } from "../../services/benefits";
import { createClaimService } from "../../services/claims";
import { createCompanyService } from "../../services/company";
import { createEmployeeService, deleteEmployeeService } from "../../services/employees";

const services: any = {
  'companies': createCompanyService,
  'claims': createClaimService,
  'employees': createEmployeeService,
  'benefits-programs': createBenefitsService,
}

export const uploadBubbleDataToDynamoDb = async (req: any, res: any) => {
  const { data, tableName } = req.body;

  try {
    const service = services[tableName];
    if (!service) {
      return res.status(400).json({
        message: 'Invalid table name',
        code: 'INVALID_TABLE_NAME'
      });
    }

    const response: any = await service(data);

    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode

      });
    } else {
      return res.status(201).json(response);
    }
  }
  catch (error: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.code,
      code: 500
    });
  }
}

export const registerBubbleUser = async (req: any, res: any) => {
  const userData = { ...req.body }
  // check if userData is provided
  if (!Object.keys(userData).length) {
    return res.status(400).send({
      message: 'User data is required!',
      error: 'MISSING_USER_DATA',
      code: 400
    });
  }

  // check if email and password are provided
  if (!userData.email.trim() || !userData.password.trim()) {
    return res.status(400).send({
      message: 'Email and password are required!',
      error: 'MISSING_EMAIL_OR_PASSWORD',
      code: 400
    });
  }

  // check if email is valid
  if (!userData.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    return res.status(400).send({
      message: 'Email is invalid!',
      error: 'INVALID_EMAIL',
      code: 400
    });
  }

  try {
    createEmployeeService(userData).then(async (newUser: any) => {
      if (newUser.statusCode >= 400) {
        return res.status(newUser.statusCode).send({
          message: newUser.message,
          error: newUser.code,
          code: newUser.statusCode
        });
      }
      const userForCognito = {
        firs_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        company_id: userData.company_id,
        id: userData.id
      }

      const cognitoUser: any = await signUpService(userForCognito);
      // check if the user is already registered
      if (cognitoUser.code >= 400 && cognitoUser.code < 500) {
        // remove the user from the database
        await deleteEmployeeService(userData.id as string);
        return res.status(cognitoUser.code).send({
          message: cognitoUser.message,
          error: 'COGNITO_BAD_REQUEST',
          code: cognitoUser.code
        });
      }
      return res.status(201).send(cognitoUser);
    })
  } catch (error: any) {
    return res.status(500).send({
      message: error.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500
    });
  }
}