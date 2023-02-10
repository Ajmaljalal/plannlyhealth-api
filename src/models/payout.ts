import Joi from "joi";

export const PayoutSchema = Joi.object({
  id: Joi.string().required(),
  amount: Joi.number().default(0),
  balance: Joi.number().default(0),
  company_id: Joi.string().required(),
  declined: Joi.number().default(0),
  name: Joi.string().required(),
  not_processed: Joi.number().default(0),
  reimbursed: Joi.number().default(0),
  requested: Joi.number().default(0),
  user: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface Payout {
  id: string;
  amount: number;
  balance: number;
  company_id: string;
  declined: number;
  name: string;
  not_processed: number;
  reimbursed: number;
  requested: number;
  user: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}






