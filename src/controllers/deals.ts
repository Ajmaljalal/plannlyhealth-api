import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { Role } from "../lib/enums";
import { CreateDealSchema, Deal, UpdateDealSchema } from "../models/deal";
import {
  createDealService,
  deleteDealService,
  getAllDealsService,
  getDealByIdService,
  updateDealService
} from "../services/deals";

export const createDeal = async (req: any, res: Response) => {
  const deal = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(deal).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 2. add the required modifications to the deal
    deal.id = uuid();
    deal.created_date = deal.created_date || Date();
    deal.modified_date = deal.modified_date || Date();
    deal.owner = deal.owner || req?.user?.id;

    // 3. validate the request body before creating the deal using the CreateDealSchema
    const { error } = CreateDealSchema.validate(deal);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 4. call the createDealService to create the deal
    const response: any = await createDealService(deal);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the deal
      return res.status(200).json(response.Attributes);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const getDealById = async (req: Request, res: Response) => {
  const dealId: string = req.params.id;

  // 1. check if deal id is empty
  if (!dealId) {
    return res.status(400).json({
      message: 'Deal id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getDealByIdService to get the deal by id
    const response: any = await getDealByIdService(dealId);

    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the deal
    } else {
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

export const getAllDeals = async (req: Request, res: Response) => {
  try {
    // 1. call the getAllDealsService to get all the deals
    const response: any = await getAllDealsService();

    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 3. if the response is not an error, send the deals
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

export const updateDeal = async (req: any, res: Response) => {
  const dealId: string = req.params.id;
  const deal = req.body;

  // 1. check if deal id is empty
  if (!dealId) {
    return res.status(400).json({
      message: 'Deal id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(deal).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 3. check if the deal exists in db
    const dealExists: any = await getDealByIdService(dealId);
    if (!dealExists.Item) {
      return res.status(404).json({
        message: 'Deal not found',
        code: 'DEAL_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the deal
    const currentUser = req.user;
    const isOwner = currentUser && currentUser.id === dealExists.Item.owner;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isOwner || isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. add the required modifications to the deal
    delete deal.id; // this is because the id is not allowed to be updated
    delete dealExists.Item?.id; // this is because the id is not allowed to be updated
    deal.modified_date = Date();
    const dealToUpdate = { ...dealExists.Item, ...deal };

    // 5. validate the request body before updating the deal using the UpdateDealSchema
    const { error } = UpdateDealSchema.validate(dealToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateDealService to update the deal
    const response: any = await updateDealService(dealId, dealToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }

    // 8. if the response is not an error, send the deal
    return res.status(200).json(response.Attributes);
  } catch (err: any) {
    // 9. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export const deleteDeal = async (req: Request, res: Response) => {
  const dealId: string = req.params.id;

  // 1. check if deal id is empty
  if (!dealId) {
    return res.status(400).json({
      message: 'Deal id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. check if the deal exists in db
    const dealExists: any = await getDealByIdService(dealId);
    if (!dealExists.Item) {
      return res.status(404).json({
        message: 'Deal not found',
        code: 'DEAL_NOT_FOUND'
      });
    }

    // 3. check if the current user is the owner of the deal
    // @ts-ignore
    const currentUser = req.user;
    const isOwner = currentUser && currentUser.id === dealExists.Item.owner;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isOwner || isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. call the deleteDealService to delete the deal
    const response: any = await deleteDealService(dealId);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the deal
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