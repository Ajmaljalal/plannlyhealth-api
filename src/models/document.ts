import Joi from "joi";

export const CreateDocumentSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  file: Joi.string().required(),
  name: Joi.string(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
});

export const UpdateDocumentSchema = Joi.object({
  id: Joi.string(),
  company_id: Joi.string(),
  file: Joi.string(),
  name: Joi.string(),
  owner: Joi.string(),
  created_date: Joi.date(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
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