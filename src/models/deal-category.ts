import Joi from "joi";

export const dealCategorySchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});


export interface DealCategory {
  id: string;
  name: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}