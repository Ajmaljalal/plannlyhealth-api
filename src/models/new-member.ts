import Joi from "joi";

export const newMemberSchema = Joi.object({
  id: Joi.string().required(),
  email: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface NewMember {
  id: string;
  email: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}