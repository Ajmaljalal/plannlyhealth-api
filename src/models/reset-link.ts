import Joi from "joi";

export const ResetLinkSchema = Joi.object({
  id: Joi.string().required(),
  activated: Joi.boolean().default(false),
  company_subscription: Joi.string().required(),
  old_link: Joi.string().required(),
  user_email: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface ResetLink {
  id: string;
  activated: boolean;
  company_subscription: string;
  old_link: string;
  user_email: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}