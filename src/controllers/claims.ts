import { Request, Response } from 'express';
import { Role } from '../lib/enums';
import { ClaimSchema } from '../models/claim';
import { createClaimService, deleteClaimService, getAllClaimService, getClaimByCompanyIdService, getClaimByIdService, getClaimByUserIdService, updateClaimService } from '../services/claims';

export const createClaim = async (req: Request, res: Response) => {
  const claim = req.body;

  // check if the claim is empty
  if (!claim) {
    return res.status(400).json({
      message: 'Claim cannot be empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // add create_date and modified_date to the object if they are not present
  claim.created_date = claim.created_date || Date();
  claim.modified_date = claim.modified_date || Date();

  // validate the request body before creating a new company using the programBalanceSchema
  const { error } = ClaimSchema.validate(claim);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // call the createClaimService to create a new claim
  const response: any = await createClaimService(claim);
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

export const getClaimById = async (req: Request, res: Response) => {
  // get the claim id from the request params
  const claimId: string = req.params.id;

  // call the getClaimByIdService to get the claim by id
  const response: any = await getClaimByIdService(claimId);
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

export const getAllClaims = async (req: Request, res: Response) => {

  // call the getAllClaimsService to get the claims by id
  const response: any = await getAllClaimService();
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

export const getClaimsByCompanyId = async (req: Request, res: Response) => {
  // get the company id from the request params
  const companyId: string = req.params.id;

  // call the getClaimByCompanyIdService to get the claims by company id
  const response: any = await getClaimByCompanyIdService(companyId);
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

export const getClaimsByUserId = async (req: Request, res: Response) => {
  // get the user id from the request params
  const userId: string = req.params.id;

  // call the getClaimByUserIdService to get the claims by user id
  const response: any = await getClaimByUserIdService(userId);
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

export const getClaimsByStatus = async (req: Request, res: Response) => {
  // get the status from the request params
  const status: string = req.params.status;

  // call the getClaimByUserIdService to get the claims by user id
  const response: any = await getClaimByUserIdService(status);
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

export const updateClaim = async (req: Request, res: Response) => {
  // get the claim id from the request params
  const claimId: string = req.params.id;
  const claim = req.body;

  // check if the claim is empty
  if (!Object.keys(claim).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // check if the claim exists in db
  const claimExists: any = await getClaimByIdService(claimId);
  if (!claimExists.Item) {
    return res.status(404).json({
      message: 'Claim does not exist',
      code: 'CLAIM_NOT_FOUND'
    });
  }

  // check if current user is the owner of the program
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== claimExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: 'UNAUTHORIZED'
    });
  }

  // add modified_date to the object if it is not present
  claim.modified_date = claim.modified_date || Date();

  // validate the request body before updating the claim using the claimSchema
  const { error } = ClaimSchema.validate(claim);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  // call the updateClaimService to update the claim
  const response: any = await updateClaimService(claimId, claim);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response);
  }
}

export const deleteClaim = async (req: Request, res: Response) => {
  // get the claim id from the request params
  const claimId: string = req.params.id;

  // check if the claim exists in db
  const claimExists: any = await getClaimByIdService(claimId);
  if (!claimExists.Item) {
    return res.status(404).json({
      message: 'Claim does not exist',
      code: 'CLAIM_NOT_FOUND'
    });
  }

  // check if current user is the owner of the program
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== claimExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: 'UNAUTHORIZED'
    });
  }

  // call the deleteClaimService to delete the claim
  const response: any = await deleteClaimService(claimId);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response);
  }
}