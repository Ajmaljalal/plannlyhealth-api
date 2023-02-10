import Joi from "joi";

export const CategoryIssuingSchema = Joi.object({
  id: Joi.string(),
  benefits_program: Joi.string().required(),
  benefits_program_list: Joi.array().items(Joi.string()),
  code: Joi.string().required(),
  description: Joi.string().required(),
  icon: Joi.string().required(),
  name: Joi.string().required(),
  program_name: Joi.string().required(),
  status: Joi.boolean().required(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});

export interface CategoryIssuing {
  id: string;
  benefits_program: string;
  benefits_program_list: string[];
  code: string;
  description: string;
  icon: string;
  name: string;
  program_name: string;
  status: boolean;
  owner: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}