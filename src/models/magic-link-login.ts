import Joi from "joi";

export const magicLinkLoginSchema = Joi.object({
  id: Joi.string().required(),
  email: Joi.string().required(),
  user: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface MagicLinkLogin {
  id: string;
  email: string;
  user: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}