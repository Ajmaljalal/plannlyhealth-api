import Joi from "joi";

export const CategoryLimitsSchema = Joi.object({
  id: Joi.string(),
  amount: Joi.number().required(),
  category_list: Joi.array().items(Joi.string()),
  user: Joi.string().required(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});


export interface CategoryLimits {
  id: string;
  amount: number;
  category_list: string[];
  user: string;
  owner: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}