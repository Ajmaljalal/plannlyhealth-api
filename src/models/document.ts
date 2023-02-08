import Joi from "joi";

export const documentSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  file: Joi.string().required(),
  name: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface Document {
  id: string;
  company_id: string;
  file: string;
  name: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}