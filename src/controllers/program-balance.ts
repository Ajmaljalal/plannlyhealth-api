import { Request, Response } from 'express';
import { Role } from '../lib/enums';
import { ProgramBalance, ProgramBalanceSchema } from '../models/program-balance';

import {
  createProgramBalanceService,
  deleteProgramBalanceService,
  getProgramBalanceByCompanyIdService,
  getProgramBalanceByIdService,
  getProgramBalanceByProgramIdService,
  updateProgramBalanceService
} from '../services/program-balance';

export async function createProgramBalance(req: Request, res: Response) {
  const programBalance: ProgramBalance = req.body;

  // check if the request body is empty
  if (Object.keys(programBalance).length === 0) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // add is_deleted, create_date and modified_date to the benefitsProgram object if they are not present
  programBalance.is_deleted = programBalance.is_deleted || false;
  programBalance.created_date = programBalance.created_date || Date();
  programBalance.modified_date = programBalance.modified_date || Date();

  // validate the request body before creating a new company using the programBalanceSchema
  const { error } = ProgramBalanceSchema.validate(programBalance);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // call the createProgramBalanceService to create a new program balance
  const response: any = await createProgramBalanceService(programBalance);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  else {
    return res.status(201).json(response);
  }
}

export async function getProgramBalanceById(req: Request, res: Response) {
  // get the program balance id from the request params
  const programBalanceId: string = req.params.id;

  // call the getProgramBalanceByIdService to get the program balance by id
  const response: any = await getProgramBalanceByIdService(programBalanceId);
  // check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  else {
    return res.status(200).json(response);
  }
}

export async function getProgramBalanceByProgramId(req: Request, res: Response) {
  // get the program balance id from the request params
  const programId: string = req.params.programId;

  // call the getProgramBalanceByProgramIdService to get the program balance by id
  const response: any = await getProgramBalanceByProgramIdService(programId);
  // check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  else {
    return res.status(200).json(response);
  }
}

export async function getProgramBalanceByCompanyId(req: Request, res: Response) {
  // get the program balance id from the request params
  const companyId: string = req.params.companyId;

  // call the getProgramBalanceByCompanyIdService to get the program balance by id
  const response: any = await getProgramBalanceByCompanyIdService(companyId);
  // check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  else {
    return res.status(200).json(response);
  }
}

export async function updateProgramBalance(req: Request, res: Response) {
  // get the program balance id from the request params
  const programBalanceId: string = req.params.id;

  // get the program balance object from the request body
  const programBalance: ProgramBalance = req.body;

  // check if the request body is empty
  if (Object.keys(programBalance).length === 0) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // check if the program exists
  const balance: any = await getProgramBalanceByIdService(programBalanceId);
  if (!balance.Item) {
    return res.status(404).json({
      message: 'Program Balance does not exist',
      code: "BALANCE_DOES_NOT_EXIST"
    });
  }

  // check if current user is the owner of the program
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== balance.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: 'UNAUTHORIZED'
    });
  }

  // add modified_date to the program balance object
  programBalance.modified_date = programBalance.modified_date || Date();


  // validate the request body before creating a new company using the programBalanceSchema
  const { error } = ProgramBalanceSchema.validate(programBalance);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // call the updateProgramBalanceService to update the program balance
  const response: any = await updateProgramBalanceService(programBalanceId, programBalance);
  // check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  else {
    return res.status(200).json(response);
  }
}

export async function deleteProgramBalance(req: Request, res: Response) {
  // get the program balance id from the request params
  const programBalanceId: string = req.params.id;

  // check if the program exists
  const balance: any = await getProgramBalanceByIdService(programBalanceId);
  if (!balance.Item) {
    return res.status(404).json({
      message: 'Program Balance does not exist',
      code: "BALANCE_DOES_NOT_EXIST"
    });
  }

  // check if current user is the owner of the program
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== balance.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: 'UNAUTHORIZED'
    });
  }

  // call the deleteProgramBalanceService to update the program balance
  const response: any = await deleteProgramBalanceService(programBalanceId);
  // check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  else {
    return res.status(200).json(response);
  }
}