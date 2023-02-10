import { Request, Response } from 'express';
import { ClaimStatus, Role } from '../lib/enums';
import { Claim, CreateClaimSchema, UpdateClaimSchema } from '../models/claim';
import { v4 as uuid } from 'uuid';
import { createClaimService, deleteClaimService, getAllClaimService, getClaimByCompanyIdService, getClaimByIdService, getClaimByStatusService, getClaimsByOwnerService, updateClaimService } from '../services/claims';

export const createClaim = async (req: Request, res: Response) => {
  const claim: Claim = req.body;

  // 1. check if the claim is empty
  if (!claim) {
    return res.status(400).json({
      message: 'Claim cannot be empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. add create_date and modified_date to the object if they are not present
  claim.id = uuid()
  claim.created_date = claim.created_date || Date();
  claim.modified_date = claim.modified_date || Date();
  claim.date = claim.date || Date();
  claim.claim_status = claim.claim_status || ClaimStatus.requested;

  // 3. validate the request body before creating a new company using the programBalanceSchema
  const { error } = CreateClaimSchema.validate(claim);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  try {
    // 4. call the createClaimService to create a new claim
    const response: any = await createClaimService(claim);
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    else {
      // 5. return the response
      return res.status(201).json(response.Item);
    }
  } catch (err: any) {
    // 6. return the all other errors
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getClaimById = async (req: Request, res: Response) => {
  // 1. get the claim id from the request params
  const claimId: string = req.params.id;

  // 2. check if the claim id is empty
  if (!claimId) {
    return res.status(400).json({
      message: 'Claim id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }
  try {
    // 3. call the getClaimByIdService to get the claim by id
    const response: any = await getClaimByIdService(claimId);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 5. send the response
    else {
      return res.status(200).json(response.Item);
    }
  } catch (err: any) {
    // 6. return the all other errors
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getAllClaims = async (req: Request, res: Response) => {

  try {
    // 1. call the getAllClaimsService to get the claims by id
    const response: any = await getAllClaimService();
    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 3. send the response
    else {
      return res.status(200).json(response.Items);
    }
  } catch (error: any) {
    // 4. return the all other errors
    return res.status(500).json({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getClaimsByCompanyId = async (req: Request, res: Response) => {
  // 1. get the company id from the request params
  const companyId: string = req.params.id;

  // 2. check if the company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getClaimByCompanyIdService to get the claims by company id
    const response: any = await getClaimByCompanyIdService(companyId);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 5. send the response
    else {
      return res.status(200).json(response.Items);
    }
  } catch (error: any) {
    // 6. return the all other errors
    return res.status(500).json({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getClaimsByOwner = async (req: Request, res: Response) => {
  // 1. get the user id from the request params
  const userId: string = req.params.id;

  // 2. check if the user id is empty
  if (!userId) {
    return res.status(400).json({
      message: 'User id (owner id) in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getClaimsByOwnerService to get the claims by user id
    const response: any = await getClaimsByOwnerService(userId);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 5. send the response
    else {
      return res.status(200).json(response.Items);
    }
  } catch (error: any) {
    // 6. return the all other errors
    return res.status(500).json({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getClaimsByStatus = async (req: Request, res: Response) => {
  // 1. get the status from the request params
  const status = req.params.status as unknown as ClaimStatus;

  // 2. check if the status is empty
  if (!status) {
    return res.status(400).json({
      message: 'Status in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. call the getClaimByStatusService to get the claims by user id
    const response: any = await getClaimByStatusService(status);
    // 4. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 5. send the response
    else {
      return res.status(200).json(response.Items);
    }
  } catch (error: any) {
    // 6. return the all other errors
    return res.status(500).json({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const updateClaim = async (req: Request, res: Response) => {
  // 1. get the claim id and claim from the request params and body
  const claimId: string = req.params.id;
  const claim = req.body;

  // 2. check if the claim id is empty
  if (!claimId) {
    return res.status(400).json({
      message: 'Claim id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 3. check if the claim is empty
  if (!Object.keys(claim).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 4. check if the claim exists in db
    const claimExists: any = await getClaimByIdService(claimId);
    if (!claimExists.Item) {
      return res.status(404).json({
        message: 'Claim does not exist',
        code: 'CLAIM_NOT_FOUND'
      });
    }

    // 5. check if current user is the owner of the program
    // @ts-ignore
    // const authorizedUser: User = req?.user;
    // if (authorizedUser?.id !== claimExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: 'UNAUTHORIZED'
    //   });
    // }

    // 6. add required modifications to the claim object
    delete claim.id;
    delete claimExists.Item.id;
    claim.modified_date = claim.modified_date || Date();
    const claimToUpdate = { ...claimExists.Item, ...claim };

    // 7. validate the request body before updating the claim using the updateClaimSchema
    const { error } = UpdateClaimSchema.validate(claimToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 8. call the updateClaimService to update the claim
    const response: any = await updateClaimService(claimId, claimToUpdate);
    // 9. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 10. send the response
    else {
      return res.status(200).json(response.Attributes);
    }
  } catch (error: any) {
    // 11. return the all other errors
    return res.status(500).json({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const deleteClaim = async (req: Request, res: Response) => {
  // 1. get the claim id from the request params
  const claimId: string = req.params.id;

  // 2. check if the claim id is empty
  if (!claimId) {
    return res.status(400).json({
      message: 'Claim id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 3. check if the claim exists in db
    const claimExists: any = await getClaimByIdService(claimId);
    if (!claimExists.Item) {
      return res.status(404).json({
        message: 'Claim does not exist',
        code: 'CLAIM_NOT_FOUND'
      });
    }

    // 4. check if current user is the owner of the program
    // @ts-ignore
    // const authorizedUser: User = req?.user;
    // if (authorizedUser?.id !== claimExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    //   return res.status(403).json({
    //     message: 'You are not authorized to perform this action',
    //     code: 'UNAUTHORIZED'
    //   });
    // }

    // 5. call the deleteClaimService to delete the claim
    const response: any = await deleteClaimService(claimId);
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    // 6. send the response
    else {
      return res.status(200).json(response.Item);
    }
  } catch (error: any) {
    // 7. return the all other errors
    return res.status(500).json({
      message: error.message,
      code: 'INTERNAL_SERVER_ERROR'
    });

  }
}