import { Request, Response } from 'express';
import { Role } from '../lib/enums';
import { BenefitsProgram } from '../lib/types/benefits-programs';
import BenefitsProgramsSchema from '../models/benefits-program';

import {
  createBenefitsProgramService,
  deleteBenefitsProgramService,
  getAllBenefitsProgramsService,
  getBenefitsProgramByIdService,
  getBenefitsProgramsByCompanyIdService,
  updateBenefitsProgramService,
} from '../services/benefits-program';


export async function createNewBenefitsProgram(req: Request, res: Response) {
  const benefitsProgram: BenefitsProgram = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(benefitsProgram).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. add default values to the benefitsProgram object if they are not present
  benefitsProgram.is_active = benefitsProgram.is_active || false;
  benefitsProgram.is_deleted = benefitsProgram.is_deleted || false;
  benefitsProgram.is_template = benefitsProgram.is_template || false;
  benefitsProgram.created_date = benefitsProgram.created_date || Date();
  benefitsProgram.modified_date = benefitsProgram.modified_date || Date();

  // 3. validate the request body before creating a new company using the benefitsProgramsSchema
  const { error } = BenefitsProgramsSchema.validate(benefitsProgram);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // 4. call the createBenefitsProgramService to create a new benefits program
  const response: any = await createBenefitsProgramService(benefitsProgram);

  // 5. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 6. if the response is not an error, send the benefits program
  else {
    return res.status(201).json(response);
  }

}

export async function getBenefitsProgramById(req: Request, res: Response) {
  // 1. get the benefits program id from the request params
  const benefitsProgramId: string = req.params.id;

  // 2. call the getBenefitsProgramByIdService to get the benefits program by id
  const response: any = await getBenefitsProgramByIdService(benefitsProgramId);
  // 3. check if the response is an error
  if (response.code) {
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
  const benefitsProgram: BenefitsProgram = req.body;
  // 1. check if the request body is empty
  if (!Object.keys(benefitsProgram).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }
  // 2. check if the program exists
  const program: any = await getBenefitsProgramByIdService(benefitsProgramId);
  if (!program.Item) {
    return res.status(404).json({
      message: 'Program does not exist',
      code: "PROGRAM_DOES_NOT_EXIST"
    });
  }
  // 3. check if current user is the owner of the program
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== program.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: "UNAUTHORIZED"
    });
  }
  // 4. add is_active, is_deleted, is_template and modified_date to the benefitsProgram object if they are not present
  benefitsProgram.is_active = benefitsProgram.is_active || false;
  benefitsProgram.is_deleted = benefitsProgram.is_deleted || false;
  benefitsProgram.is_template = benefitsProgram.is_template || false;
  benefitsProgram.modified_date = benefitsProgram.modified_date || Date();
  // 5. validate the request body before creating a new company using the benefitsProgramsSchema
  const { error } = BenefitsProgramsSchema.validate(benefitsProgram, { allowUnknown: true });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }
  // 6. call the updateBenefitsProgramService to update the benefits program
  const response: any = await updateBenefitsProgramService(benefitsProgramId, benefitsProgram);
  // 7. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 8. if the response is not an error, send the benefits program
  else {
    return res.status(200).json(response.Attributes);
  }
}

export async function deleteBenefitsProgram(req: Request, res: Response) {
  const benefitsProgramId: string = req.params.id;
  // 1. check if the program exists
  const program: any = await getBenefitsProgramByIdService(benefitsProgramId);
  if (!program.Item) {
    return res.status(404).json({
      message: 'Program does not exist',
      code: "PROGRAM_DOES_NOT_EXIST"
    });
  }
  // 2. check if current user is the owner of the program
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== program.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to delete this program',
      code: "UNAUTHORIZED"
    });
  }
  // 3. call the deleteBenefitsProgramService to delete the benefits program
  const response: any = await deleteBenefitsProgramService(benefitsProgramId);
  // 4. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 5. if the response is not an error, send the benefits program
  else {
    return res.status(200).json(response);
  }
}