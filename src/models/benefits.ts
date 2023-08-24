import Joi from 'joi';

export interface Benefits {
  id: string;
  title: string;
  description: string;
  company_id: string;
  icon: string;
  is_primary: boolean;
  how_to_enroll: string;
  how_to_enroll_link: string;
  is_active: boolean;
  logo: string;
  eligibility: string;
  integration: string | null;
  recommended: boolean;
  labels: string;
  archived: boolean;
  created_at: string;
  modified_at: string;
}

export const CreateBenefitsSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  icon: Joi.string(),
  is_primary: Joi.boolean(),
  how_to_enroll: Joi.string(),
  how_to_enroll_link: Joi.string(),
  is_active: Joi.boolean(),
  logo: Joi.string(),
  eligibility: Joi.string(),
  integration: Joi.string().allow(null),
  recommended: Joi.boolean(),
  labels: Joi.string(),
  archived: Joi.boolean(),
  created_at: Joi.string(),
  modified_at: Joi.string(),
});

export const UpdateBenefitsSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  icon: Joi.string(),
  is_primary: Joi.boolean(),
  how_to_enroll: Joi.string(),
  how_to_enroll_link: Joi.string(),
  is_active: Joi.boolean(),
  logo: Joi.string(),
  eligibility: Joi.string(),
  integration: Joi.string().allow(null),
  recommended: Joi.boolean(),
  labels: Joi.string(),
  archived: Joi.boolean(),
  modified_at: Joi.string().required(),
});
