import Joi from 'joi';
import { FrequencySchema, ProgramAccessSchema, ProgramModelSchema } from '../lib/options';

export const CreateBenefitsProgramsSchema = Joi.object({
  id: Joi.string().required(),
  budget: Joi.number().required(),
  budget_old: Joi.number().allow(null).allow(''),
  company_id: Joi.string().required(),
  description: Joi.string(),
  frequency: FrequencySchema.required(),
  is_active: Joi.boolean().default(false),
  is_deleted: Joi.boolean().default(false),
  is_template: Joi.boolean().default(false),
  logo_active: Joi.string().allow(null).allow(''),
  logo_inactive: Joi.string().allow(null).allow(''),
  name: Joi.string().required(),
  parent: Joi.string().allow(null).allow(''),
  program_model: ProgramModelSchema,
  creator: Joi.string().required(),
  program_access: ProgramAccessSchema.required(),
  modified_date: Joi.date().required(),
  creation_date: Joi.date(),
  slug: Joi.string().allow(null).allow(''),
});

export const UpdateBenefitsProgramsSchema = Joi.object({
  id: Joi.string(),
  budget: Joi.number().required(),
  budget_old: Joi.number().allow(null).allow(''),
  company_id: Joi.string().required(),
  description: Joi.string(),
  frequency: FrequencySchema.required(),
  is_active: Joi.boolean(),
  is_deleted: Joi.boolean(),
  is_template: Joi.boolean(),
  logo_active: Joi.string().allow(null).allow(''),
  logo_inactive: Joi.string().allow(null).allow(''),
  name: Joi.string().required(),
  parent: Joi.string().allow(null).allow(''),
  program_model: ProgramModelSchema,
  creator: Joi.string(),
  program_access: ProgramAccessSchema.required(),
  modified_date: Joi.date().required(),
  creation_date: Joi.date(),
  slug: Joi.string().allow(null).allow(''),
});


