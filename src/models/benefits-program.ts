import Joi from 'joi';
import { FrequencySchema, ProgramModelSchema } from './options';

export const CreateBenefitsProgramsSchema = Joi.object({
  id: Joi.string().required(),
  budget: Joi.number().required(),
  company_id: Joi.string(),
  description: Joi.string(),
  end_date: Joi.date(),
  frequency: FrequencySchema,
  is_active: Joi.boolean().default(false),
  is_deleted: Joi.boolean().default(false),
  is_template: Joi.boolean().default(false),
  logo_active: Joi.string(),
  logo_inactive: Joi.string(),
  name: Joi.string().required(),
  parent: Joi.string(),
  program_model: ProgramModelSchema.required(),
  owner: Joi.string().required(),
  modified_date: Joi.date().required(),
  created_date: Joi.date(),
  slug: Joi.string(),
});

export const UpdateBenefitsProgramsSchema = Joi.object({
  id: Joi.string(),
  budget: Joi.number(),
  company_id: Joi.string(),
  description: Joi.string(),
  end_date: Joi.date(),
  frequency: FrequencySchema,
  is_active: Joi.boolean(),
  is_deleted: Joi.boolean(),
  is_template: Joi.boolean(),
  logo_active: Joi.string(),
  logo_inactive: Joi.string(),
  name: Joi.string(),
  parent: Joi.string(),
  program_model: ProgramModelSchema,
  owner: Joi.string(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});


