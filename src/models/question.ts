import Joi from "joi";
import { QuestionTypeSchema } from "./options";

export const QuestionSchema = Joi.object({
  id: Joi.string().required(),
  answer_max: Joi.number(),
  answer_options: Joi.array().items(Joi.string()),
  essential: Joi.boolean(),
  titleL: Joi.string().required(),
  order: Joi.number().required(),
  type: QuestionTypeSchema.required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface Question {
  id: string;
  answer_max: number;
  answer_options: string[];
  essential: boolean;
  title: string;
  order: number;
  type: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}