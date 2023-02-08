import Joi from "joi";

export const StrTestSchema = Joi.object({
  id: Joi.string().required(),
  acc_id: Joi.string().required(),
  email: Joi.string().required(),
  link: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface StrTest {
  id: string;
  acc_id: string;
  email: string;
  link: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}