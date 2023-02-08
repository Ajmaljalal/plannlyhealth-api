import Joi from "joi";

export const dealSchema = Joi.object({
  id: Joi.string().required(),
  bg_photo: Joi.string().required(),
  call_to_action: Joi.string().required(),
  category: Joi.string().required(),
  category_name: Joi.string().required(),
  city: Joi.array().items(Joi.string()).required(),
  description: Joi.string().required(),
  discount: Joi.string().required(),
  how_to_get: Joi.string().required(),
  link: Joi.string().required(),
  logo: Joi.string().required(),
  order: Joi.number().required(),
  price: Joi.string().required(),
  recommended: Joi.boolean().required(),
  relates_to_program: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
  title: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
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


