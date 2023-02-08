import Joi from "joi";

export const commentSchema = Joi.object({
  id: Joi.string().required(),
  author: Joi.string().required(),
  text: Joi.string().required(),
  claim_id: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface Comment {
  id: string;
  author: string;
  text: string;
  claim_id: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}