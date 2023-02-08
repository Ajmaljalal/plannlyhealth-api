import Joi from "joi";

export const ProgramBalanceSchema = Joi.object({
  id: Joi.string().required(),
  amount: Joi.number().required(),
  benefit_program: Joi.string().required(),
  company_id: Joi.string().required(),
  date_end: Joi.date().required(),
  date_start: Joi.date().required(),
  is_deleted: Joi.boolean().required(),
  user: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface ProgramBalance {
  id: string;
  amount: number;
  benefit_program: string;
  company_id: string;
  date_end: Date;
  date_start: Date;
  is_deleted: boolean;
  user: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}
