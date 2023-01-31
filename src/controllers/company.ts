
import { Request, Response } from 'express';
import { Company } from '../lib/types/company';
import {
  createCompanyService,
  deleteCompanyService,
  getAllCompaniesService,
  getCompanyByIdService,
  updateCompanyService,
} from '../services/company';

export async function createNewCompany(req: Request, res: Response) {
  const company: Company = req.body;

  // validate the request body before creating a new company
  if (!company.name?.trim() || !company.logo?.trim() || !company.website?.trim() || !company.company_size?.trim()) {
    return res.status(400).json({
      message: 'Missing required fields. Please provide name, logo, website and company size.',
      code: 'MissingRequiredFields'
    });
  }

  const response: any = await createCompanyService(company);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(201).json(response);
  }
}

export async function getCompanyById(req: Request, res: Response) {
  const companyId: string = req.params.id;
  const response: any = await getCompanyByIdService(companyId);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response.Item);
  }
}

export async function getAllCompanies(req: Request, res: Response) {
  const response: any = await getAllCompaniesService();
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response.Items);
  }
}

export async function updateCompany(req: Request, res: Response) {
  const companyId: string = req.params.id;
  const updates: Partial<Company> = req.body;

  // check if company exists
  const company: any = await getCompanyByIdService(companyId);
  if (!company.Item) {
    return res.status(404).json({
      message: 'Company not found',
      code: 'CompanyNotFound'
    });
  }
  const response: any = await updateCompanyService(companyId, updates);
  if (response.code) {
    return res.status(response.statusCode).json({
      message: response.message,
      code: response.code
    });
  } else {
    return res.status(200).json(response.Attributes);
  }
}

export async function deleteCompany(req: Request, res: Response) {
  // check if company exists
  const company: any = await getCompanyByIdService(req.params.id);
  if (company.Item) {
    // check if current user is the owner of the company
    // @ts-ignore
    const user: any = {};
    // @ts-ignore
    user?.role = 'owner';
    // @ts-ignore
    user?.id = company.Item.owner
    const companyId: string = company.Item.id;
    const companyOwner: string = company.Item.owner;
    if (user?.role === 'owner' && user?.id === companyOwner) {
      const response: any = await deleteCompanyService(companyId);
      if (response.code) {
        return res.status(response.statusCode).json({
          message: response.message,
          code: response.code
        });
      } else {
        return res.status(200).json(response);
      }
    } else {
      return res.status(403).json({
        message: 'You are not authorized to delete this company.',
        code: 'Unauthorized'
      });
    }
  } else {
    return res.status(404).json({
      message: 'Company not found.',
      code: 'CompanyNotFound'
    });
  }
}


