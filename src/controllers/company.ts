
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Role } from '../lib/enums';
import { CreateCompanySchema, UpdateCompanySchema } from '../models/company';
import {
  createCompanyService,
  deleteCompanyService,
  getAllCompaniesService,
  getCompanyByIdService,
  updateCompanyService,
} from '../services/company';

export async function createNewCompany(req: any, res: Response) {
  const company = req.body;

  // 1. check if the request body is empty
  if (!Object.keys(company).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  // 2. modify the company object to add default values
  company.id = company.id || uuid();
  company.created_date = company.created_date || Date();
  company.modified_date = company.modified_date || Date();

  // 3. validate the request body before creating the company using the CreateCompanySchema
  const { error } = CreateCompanySchema.validate(company);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 'INVALID_REQUEST_BODY'
    });
  }

  try {

    // 4. call the createCompanyService to create the company
    const response: any = await createCompanyService(company);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the company
      return res.status(201).json(company);
    }
  } catch (err: any) {
    // 7. catch any other error and send the error message
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

export async function getCompanyById(req: Request, res: Response) {
  const companyId: string = req.params.id;

  // 1. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. call the getCompanyByIdService to get the company by id
    const response: any = await getCompanyByIdService(companyId);
    // 3. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 4. if the response is not an error, send the company
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

export async function getAllCompanies(req: Request, res: Response) {
  try {
    // 1. call the getAllCompaniesService to get all the companies
    const response: any = await getAllCompaniesService();
    // 2. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
      // 3. if the response is not an error, send the companies
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

export async function updateCompany(req: Request, res: Response) {
  const companyId: string = req.params.id;
  const company = req.body;

  // 1. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  // 2. check if the request body is empty
  if (!Object.keys(company).length) {
    return res.status(400).json({
      message: 'Request body is empty',
      code: 'EMPTY_REQUEST_BODY'
    });
  }

  try {
    // 3. check if the company exists in db
    const companyExists: any = await getCompanyByIdService(companyId);
    if (!companyExists.Item) {
      return res.status(404).json({
        message: 'Company not found',
        code: 'COMPANY_NOT_FOUND'
      });
    }

    // 4. check if the current user is the owner of the company
    // @ts-ignore
    const currentUser = req.user;
    const isOwner = currentUser && currentUser.id === companyExists.Item.owner;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isOwner || isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. add the required modifications to the company
    delete company.id; // this is because the id is not allowed to be updated
    delete companyExists.Item?.id; // this is because the id is not allowed to be updated
    company.modified_date = Date();

    const companyToUpdate = { ...companyExists.Item, ...company };

    // 5. validate the request body before updating the company using the UpdateCompanySchema
    const { error } = UpdateCompanySchema.validate(companyToUpdate);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        code: 'INVALID_REQUEST_BODY'
      });
    }

    // 6. call the updateCompanyService to update the company
    const response: any = await updateCompanyService(companyId, companyToUpdate);

    // 7. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    }
    else {
      // 8. if the response is not an error, send the company
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

export async function deleteCompany(req: Request, res: Response) {
  const companyId: string = req.params.id;

  // 1. check if company id is empty
  if (!companyId) {
    return res.status(400).json({
      message: 'Company id in params cannot be empty',
      code: 'EMPTY_REQUEST_PARAM'
    });
  }

  try {
    // 2. check if the company exists in db
    const companyExists: any = await getCompanyByIdService(companyId);
    if (!companyExists.Item) {
      return res.status(404).json({
        message: 'Company not found',
        code: 'COMPANY_NOT_FOUND'
      });
    }

    // 3. check if the current user is the owner of the company
    // @ts-ignore
    const currentUser = req.user;
    const isOwner = currentUser && currentUser.id === companyExists.Item.owner;
    const isAdmin = currentUser && currentUser.role === Role.Admin;
    const isSuperAdmin = currentUser && currentUser.role === Role.SuperAdmin
    const isAuthorized = isOwner || isAdmin || isSuperAdmin;
    if (!isAuthorized) {
      return res.status(403).json({
        message: 'You are not authorized to perform this action',
        code: "UNAUTHORIZED"
      });
    }

    // 4. call the deleteCompanyService to delete the company
    const response: any = await deleteCompanyService(companyId);

    // 5. check if the response is an error
    if (response.code) {
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code
      });
    } else {
      // 6. if the response is not an error, send the company
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


