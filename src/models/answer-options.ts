import Joi from "joi";

export const AnswerOptionsSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string().required(),
  number: Joi.number().required(),
  order: Joi.number().required(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});

export interface AnswerOptions {
  id: string;
  name: string;
  number: number;
  order: number;
  owner: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}