import Joi from "joi";

export const StripeIssuingCardSchema = Joi.object({
  id: Joi.string().required(),
  card_holder_id: Joi.string().required(),
  company_id: Joi.string().required(),
  issuing_card_id: Joi.string().required(),
  user: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface StripeIssuingCard {
  id: string;
  card_holder_id: string;
  company_id: string;
  issuing_card_id: string;
  user: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}