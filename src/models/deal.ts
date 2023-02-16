import Joi from "joi";

export const CreateDealSchema = Joi.object({
  id: Joi.string().required(),
  bg_photo: Joi.string().required(),
  call_to_action: Joi.string().required(),
  category: Joi.string(),
  category_name: Joi.string(),
  city: Joi.array().items(Joi.string()).required(),
  description: Joi.string().required(),
  discount: Joi.string(),
  how_to_get: Joi.string(),
  link: Joi.string().required(),
  logo: Joi.string().required(),
  order: Joi.number(),
  price: Joi.string().required(),
  recommended: Joi.boolean(),
  relates_to_program: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  title: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
});

export const UpdateDealSchema = Joi.object({
  id: Joi.string(),
  bg_photo: Joi.string(),
  call_to_action: Joi.string(),
  category: Joi.string(),
  category_name: Joi.string(),
  city: Joi.array().items(Joi.string()),
  description: Joi.string(),
  discount: Joi.string(),
  how_to_get: Joi.string(),
  link: Joi.string(),
  logo: Joi.string(),
  order: Joi.number(),
  price: Joi.string(),
  recommended: Joi.boolean(),
  relates_to_program: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  title: Joi.string(),
  owner: Joi.string(),
  created_date: Joi.date(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
});

export interface Deal {
  id: string;
  bg_photo: string;
  call_to_action: string;
  category: string;
  category_name: string;
  city: string[];
  description: string;
  discount: string;
  how_to_get: string;
  link: string;
  logo: string;
  order: number;
  price: string;
  recommended: boolean;
  relates_to_program: string;
  tags: string[];
  title: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}
