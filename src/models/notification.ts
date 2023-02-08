import Joi from "joi";
import { NotificationTypeSchema } from "./options";

export const NotificationSchema = Joi.object({
  id: Joi.string().required(),
  user: Joi.string().required(),
  type: NotificationTypeSchema.required(),
  text: Joi.string().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface Notification {
  id: string;
  user: string;
  type: string;
  text: string;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}