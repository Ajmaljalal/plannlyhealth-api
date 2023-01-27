
import { Request, Response } from 'express';
import { Company } from '../models/company';
import { createCompanyService, getAllCompaniesService, getCompanyByIdService, updateCompanyService } from '../services/company';

export async function createNewCompany(req: Request, res: Response) {
    const company: Company = req.body;
    const response: any = await createCompanyService(company);
    if (response.code) {
        res.status(response.statusCode).json({
            message: response.message,
            code: response.code
        });
    } else {
        res.status(201).json(response);
    }
}

export async function getCompanyById(req: Request, res: Response) {
    const companyId: string = req.params.id;
    const response: any = await getCompanyByIdService(companyId);
    if (response.code) {
        res.status(response.statusCode).json({
            message: response.message,
            code: response.code
        });
    } else {
        res.status(200).json(response.Item);
    }
}

export async function getAllCompanies(req: Request, res: Response) {
    const response: any = await getAllCompaniesService();
    if (response.code) {
        res.status(response.statusCode).json({
            message: response.message,
            code: response.code
        });
    } else {
        res.status(200).json(response.Items);
    }
}

// create a company update controller

export async function updateCompany(req: Request, res: Response) {
    const companyId: string = req.params.id;
    const updates: Partial<Company> = req.body;
    const response: any = await updateCompanyService(companyId, updates);
    console.log('response', response)
    if (response.code) {
        res.status(response.statusCode).json({
            message: response.message,
            code: response.code
        });
    } else {
        res.status(200).json(response);
    }
}


