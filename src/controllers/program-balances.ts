import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Role } from '../lib/enums';
import { CreateProgramBalanceSchema, UpdateProgramBalanceSchema, } from '../models/program-balance';

import {
  createProgramBalanceService,
  deleteProgramBalanceService,
  getAllProgramBalancesService,
  getProgramBalancesByBeneficiaryService,
  getProgramBalancesByCompanyIdService,
  getProgramBalanceByIdService,
  getProgramBalancesByProgramIdService,
  updateProgramBalanceService
} from '../services/program-balances';

export const createProgramBalance = async (req: any, res: Response) => {
  const balance = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(balance).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. add the required modifications to the comment
  balance.id = uuid(); // dynamodb does not have an auto generated id
  balance.created_date = balance.created_date || Date();
  balance.modified_date = balance.modified_date || Date();
  balance.owner = balance.owner || req.user.id;

  try {
    // 3. validate the request body before creating the balance using the CreateBalanceSchema
    const { error } = CreateProgramBalanceSchema.validate(balance);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 4. call the createBalanceService to create the balance
    const response: any = await createProgramBalanceService(balance);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 6. if the response is not an error, send the balance
    } else {
      return res.status(201).json(response.Item);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getProgramBalanceById = async (req: Request, res: Response) => {
  const programId: string = req.params.id;

  // 1. check if program id is empty
  if (!programId) {
    return res.status(400).json({
      message: 'Program id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getProgramBalanceByIdService to get the program balance
    const response: any = await getProgramBalanceByIdService(programId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 4. if the response is not an error, send the program balance
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

export const getProgramBalancesByProgramId = async (req: Request, res: Response) => {
  const programId: string = req.params.programId;

  // 1. check if program id is empty
  if (!programId) {
    return res.status(400).json({
      message: 'Program id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getProgramBalanceByProgramIdService to get the program balance by program id
    const response: any = await getProgramBalancesByProgramIdService(programId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 4. if the response is not an error, send the program balance
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getProgramBalancesByCompanyId = async (req: Request, res: Response) => {
  const companyId: string = req.params.companyId;

  // 1. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getProgramBalanceByCompanyIdService to get the program balance by company id
    const response: any = await getProgramBalancesByCompanyIdService(companyId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 4. if the response is not an error, send the program balance
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getProgramBalanceByBeneficiary = async (req: Request, res: Response) => {
  const beneficiaryId: string = req.params.id;

  // 1. check if beneficiary id is empty
  if (!beneficiaryId) {
    return res.status(400).json({
      message: 'Beneficiary id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getProgramBalanceByBeneficiaryService to get the program balance by beneficiary id
    const response: any = await getProgramBalancesByBeneficiaryService(beneficiaryId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the program balance
    } else {
      return res.status(200).json(response.Items);
    }
  } catch (err: any) {
    // 5. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getAllProgramBalances = async (req: Request, res: Response) => {
  try {
    // 1. call the getAllProgramBalancesService to get all program balances
    const response: any = await getAllProgramBalancesService();
    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 3. if the response is not an error, send the program balance
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
};

export const updateProgramBalance = async (req: Request, res: Response) => {
  const programId: string = req.params.id;
  const program = req.body;

  // 1. check if program id is empty
  if (!programId) {
    return res.status(400).json({
      message: 'Program id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(program).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 3. check if the program exists in db
    const programExists: any = await getProgramBalanceByIdService(programId);
    if (!programExists.Item) {
      return res.status(404).json({
        message: 'Program not found',
        code: 'PROGRAM_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the program
    // @ts-ignore
    const currentUser = req.user;
    const isOwner = currentUser && currentUser.id === programExists.Item?.owner;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isOwner || isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. add the required modifications to the program
    delete program.id; // this is because the id is not allowed to be updated
    delete programExists.Item?.id; // this is because the id is not allowed to be updated
    program.modified_date = Date();
    const programToUpdate = { ...programExists.Item, ...program };

    // 5. validate the request body before updating the program using the UpdateProgramSchema
    const { error } = UpdateProgramBalanceSchema.validate(programToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateProgramService to update the program
    const response: any = await updateProgramBalanceService(programId, programToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 8. if the response is not an error, send the program
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

export const deleteProgramBalance = async (req: Request, res: Response) => {
  const programId: string = req.params.id;

  // 1. check if program id is empty
  if (!programId) {
    return res.status(400).json({
      message: 'Program id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. check if the program exists in db
    const programExists: any = await getProgramBalanceByIdService(programId);
    if (!programExists.Item) {
      return res.status(404).json({
        message: 'Program not found',
        code: 'PROGRAM_NOT_FOUND'
      });
    }

    // 3. check if the current user is the owner of the program
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

    // 4. call the deleteProgramBalanceService to delete the program balance
    const response: any = await deleteProgramBalanceService(programId);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the program balance
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}