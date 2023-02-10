import { Request, Response } from "express";
import { Role } from "../lib/enums";
import { Deal, dealSchema } from "../models/deal";
import {
  createDealService,
  deleteDealService,
  getAllDealsService,
  getDealByIdService,
  updateDealService
} from "../services/deal";

export async function createDeal(req: Request, res: Response) {
  const deal: Deal = req.body;
  // 1. check if the request body is empty
  if (!Object.keys(deal).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }
  // 2. add created_date to the deal object if they are not present
  deal.created_date = deal.created_date || Date();
  deal.modified_date = deal.modified_date || Date();
  // 3. validate the request body before creating a new company using the dealSchema
  const { error } = dealSchema.validate(deal, { allowUnknown: true });
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
  }
  // 6. if the response is not an error, send the deal
  else {
    return res.status(201).json(response.Attributes);
  }
}

export async function getDealById(req: Request, res: Response) {
  const dealId: string = req.params.id;
  // 1. call the getDealByIdService to get the deal
  const response: any = await getDealByIdService(dealId);
  // 2. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 3. if the response is not an error, send the deal
  else {
    return res.status(200).json(response.Item);
  }
}

export async function getAllDeals(req: Request, res: Response) {
  // 1. call the getDealsService to get the deals
  const response: any = await getAllDealsService();
  // 2. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 3. if the response is not an error, send the deals
  else {
    return res.status(200).json(response.Items);
  }
}

export async function updateDeal(req: Request, res: Response) {
  const dealId: string = req.params.id;
  const deal: Deal = req.body;
  // 1. check if the request body is empty
  if (!Object.keys(deal).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }
  // 2. check if the deal exists
  const dealExists: any = await getDealByIdService(dealId);
  if (!dealExists.Item) {
    return res.status(404).json({
      message: 'Deal does not exist',
      code: "DEAL_DOES_NOT_EXIST"
    });
  }
  // 3. check if current user is the owner of the deal
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== dealExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: "UNAUTHORIZED"
    });
  }
  // 4. update modified_date to the deal object if they are not present
  deal.modified_date = deal.modified_date || Date();
  // 5. validate the request body before creating a new company using the dealSchema
  const { error } = dealSchema.validate(deal, { allowUnknown: true });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }
  // 6. call the updateDealService to update the deal
  const response: any = await updateDealService(dealId, deal);
  // 7. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 8. if the response is not an error, send the deal
  else {
    return res.status(200).json(response.Attributes);
  }
}

export async function deleteDeal(req: Request, res: Response) {
  const dealId: string = req.params.id;
  // 1. check if the deal exists
  const dealExists: any = await getDealByIdService(dealId);
  if (!dealExists.Item) {
    return res.status(404).json({
      message: 'Deal does not exist',
      code: "DEAL_DOES_NOT_EXIST"
    });
  }
  // 2. check if current user is the owner of the deal
  // @ts-ignore
  const authorizedUser: User = req?.user;
  if (authorizedUser?.id !== dealExists.Item.owner && (authorizedUser?.role !== Role.Admin || authorizedUser?.role !== Role.Owner)) {
    return res.status(403).json({
      message: 'You are not authorized to perform this action',
      code: "UNAUTHORIZED"
    });
  }
  // 3. call the deleteDealService to delete the deal
  const response: any = await deleteDealService(dealId);
  // 4. check if the response is an error
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  }
  // 5. if the response is not an error, send the deal
  else {
    return res.status(200).json(response);
  }
}