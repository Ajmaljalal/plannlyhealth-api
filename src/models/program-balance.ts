import Joi from "joi";

export const CreateProgramBalanceSchema = Joi.object({
  id: Joi.string(),
  amount: Joi.number().required(),
  benefit_program_id: Joi.string().required(),
  company_id: Joi.string().required(),
  date_end: Joi.date().required(),
  date_start: Joi.date().required(),
  is_deleted: Joi.boolean().required(),
  beneficiary_id: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
});

export const UpdateProgramBalanceSchema = Joi.object({
  id: Joi.string(),
  amount: Joi.number(),
  benefit_program_id: Joi.string(),
  company_id: Joi.string(),
  date_end: Joi.date(),
  date_start: Joi.date(),
  is_deleted: Joi.boolean(),
  beneficiary_id: Joi.string(),
  owner: Joi.string(),
  created_date: Joi.date(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
});

export interface ProgramBalance {
  id: string;
  amount: number;
  benefit_program_id: string;
  company_id: string;
  date_end: Date;
  date_start: Date;
  is_deleted: boolean;
  beneficiary_id: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}
