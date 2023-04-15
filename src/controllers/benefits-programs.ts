import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Role } from '../lib/enums';
import { BenefitsProgram } from '../lib/types/benefits-programs';
import { CreateBenefitsProgramsSchema, UpdateBenefitsProgramsSchema } from '../models/benefits-program';

import {
  createBenefitsProgramService,
  deleteBenefitsProgramService,
  getAllBenefitsProgramsService,
  getBenefitsProgramByIdService,
  getBenefitsProgramsByCompanyIdService,
  updateBenefitsProgramService,
} from '../services/benefits-program';


export async function createNewBenefitsProgram(req: any, res: Response) {
  const benefitsProgram: BenefitsProgram = req.body;
  const authorizedUser = req.user;

  // 1. check if the request body is empty
  if (!Object.keys(benefitsProgram).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      error: 'EMPTY_REQUEST_BODY',
      code: 400
    });
  }

  // 2. add default values to the benefitsProgram object if they are not present
  benefitsProgram.id = uuid();
  benefitsProgram.is_active = benefitsProgram.is_active || false;
  benefitsProgram.is_deleted = benefitsProgram.is_deleted || false;
  benefitsProgram.is_template = benefitsProgram.is_template || false;
  benefitsProgram.creation_date = benefitsProgram.creation_date || Date();
  benefitsProgram.modified_date = benefitsProgram.modified_date || Date();
  benefitsProgram.creator = benefitsProgram.creator || authorizedUser?.id;

  // 3. validate the request body before creating a new company using the benefitsProgramsSchema
  const { error } = CreateBenefitsProgramsSchema.validate(benefitsProgram);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      error: 'INVALID_REQUEST_BODY',
      code: 400
    });
  }

  try {
    // 4. call the createBenefitsProgramService to create a new benefits program
    const response: any = await createBenefitsProgramService(benefitsProgram);

    // 5. check if the response is an error
    if (response.code || response.statusCode >= 400) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode
      });
    }
    // 6. if the response is not an error, send the benefits program
    else {
      return res.status(201).json(response);
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      error: 'INTERNAL_SERVER_ERROR',
      code: 500
    });
  }
}

export async function getBenefitsProgramById(req: Request, res: Response) {
  // 1. get the benefits program id from the request params
  const benefitsProgramId: string = req.params.id;

  // 2. call the getBenefitsProgramByIdService to get the benefits program by id
  const response: any = await getBenefitsProgramByIdService(benefitsProgramId);
  // 3. check if the response is an error
  if (response.code || response.statusCode >= 400) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 4. if the response is not an error, send the benefits program
  else {
    return res.status(200).json(response.Item);
  }
}

export async function getBenefitsProgramsByCompanyId(req: Request, res: Response) {
  const companyId: string = req.params.companyId;

  // 1. call the getBenefitsProgramsByCompanyIdService to get the benefits programs by company id
  const response: any = await getBenefitsProgramsByCompanyIdService(companyId);
  // 2. check if the response is an error
  if (response.code || response.statusCode >= 400) {
    return res.status(response.statusCode).json({
      message: response.message,
      error: response.code,
      code: response.statusCode
    });
  }
  // 3. if the response is not an error, send the benefits program
  else {
    return res.status(200).json(response.Items);
  }
}

export async function getAllBenefitsPrograms(req: Request, res: Response) {
  // 1. call the getAllBenefitsProgramsService to get all the benefits programs
  const response: any = await getAllBenefitsProgramsService();
  // 2. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 3. if the response is not an error, send the benefits program
  else {
    return res.status(200).json(response.Items);
  }
}

export async function updateBenefitsProgram(req: Request, res: Response) {
  const benefitsProgramId: string = req.params.id;
  const benefitsProgram = req.body;
  // 1. check if the request body is empty
  if (!Object.keys(benefitsProgram).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      error: 'EMPTY_REQUEST_BODY',
      code: 400
    });
  }

  // 2. check if the benefits program id is present in the params 
  if (!benefitsProgramId) {
    return res.status(400).json({
      message: 'Benefits program id in params is required',
      error: 'MISSING_BENEFITS_PROGRAM_ID',
      code: 400
    });
  }

  // 2. check if the program exists
  const programExist: any = await getBenefitsProgramByIdService(benefitsProgramId);
  if (!programExist.Item) {
    return res.status(404).json({
      message: 'Program does not exist',
      error: "PROGRAM_DOES_NOT_EXIST",
      code: 404
    });
  }
  // 3. check if current user is the owner of the program
  // @ts-ignore
  const currentUser = req.user;
  const isAdmin = currentUser && currentUser.role === Role.Admin;
  const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
  const isWellnessCoordinator = currentUser && currentUser.role === Role.WellnessCoordinator;
  const isAuthorized = isWellnessCoordinator || isAdmin || isSuperAdmin;

  if (!isAuthorized) {
    return res.status(403).json({
      message: 'You are not allowed to perform this action',
      error: "UNAUTHORIZED",
      code: 403
    });
  }
  // 4. add is_active, is_deleted, is_template and modified_date to the benefitsProgram object if they are not present
  benefitsProgram.modified_date = Date();

  // remove the id from the benefitsProgram object
  delete benefitsProgram.id;
  // 5. validate the request body before creating a new company using the UpdateBenefitsProgramsSchema
  const { error } = UpdateBenefitsProgramsSchema.validate(benefitsProgram);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      error: 'INVALID_REQUEST_BODY',
      code: 400
    });
  }


  try {
    // 6. call the updateBenefitsProgramService to update the benefits program
    const response: any = await updateBenefitsProgramService(benefitsProgramId, benefitsProgram);
    // 7. check if the response is an error
    if (response.code || response.statusCode >= 400) {
      return res.status(response.statusCode).json({
        message: response.message,
        error: response.code,
        code: response.statusCode

      });
    }
    // 8. if the response is not an error, send the benefits program
    else {
      return res.status(200).json(response.Attributes);
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: 'INTERNAL_SERVER_ERROR',
      code: 500
    });
  }

}

export async function deleteBenefitsProgram(req: Request, res: Response) {
  const benefitsProgramId: string = req.params.id;

  // 1. check if the benefits program id is present in the params
  if (!benefitsProgramId) {
    return res.status(400).json({
      message: 'Benefits program id in params is required',
      code: 'MISSING_BENEFITS_PROGRAM_ID'
    });
  }
  // 2. check if the program exists
  const programExist: any = await getBenefitsProgramByIdService(benefitsProgramId);
  if (!programExist.Item) {
    return res.status(404).json({
      message: 'Program does not exist',
      code: "PROGRAM_DOES_NOT_EXIST"
    });
  }
  // 3. check if current user is the owner of the program
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
  // 4. call the deleteBenefitsProgramService to delete the benefits program
  const response: any = await deleteBenefitsProgramService(benefitsProgramId);
  // 5. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 6. if the response is not an error, send the benefits program
  else {
    return res.status(200).json(response);
  }
}


