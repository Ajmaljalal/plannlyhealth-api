import Joi from "joi";

export const ResponseSchema = Joi.object({
  id: Joi.string().required(),
  answer_options: Joi.array().items(Joi.string()),
  company_id: Joi.string().required(),
  question_id: Joi.string().required(),
  order: Joi.number().required(),
  response: Joi.string().required(),
  user: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});


export interface Response {
  id: string;
  answer_options: string[];
  company_id: string;
  question_id: string;
  order: number;
  response: string;
  user: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}