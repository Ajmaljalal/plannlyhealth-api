import Joi from 'joi';
import { FrequencySchema, ProgramModelSchema } from './options';

const BenefitsProgramsSchema = Joi.object({
  id: Joi.string(),
  budget: Joi.number().required(),
  company_id: Joi.string().required(),
  description: Joi.string().required(),
  end_date: Joi.date().required(),
  frequency: FrequencySchema.required(),
  is_active: Joi.boolean().default(false),
  is_deleted: Joi.boolean().default(false),
  is_template: Joi.boolean().default(false),
  logo_active: Joi.string().required(),
  logo_inactive: Joi.string().required(),
  name: Joi.string().required(),
  parent: Joi.string().required(),
  program_model: ProgramModelSchema.required(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});

export default BenefitsProgramsSchema;

