import Joi from "joi";
import { DepartmentSchema } from "./options";

export const newUserSchema = Joi.object({
  id: Joi.string().required(),
  address: Joi.string().required(),
  birthday: Joi.date().required(),
  company_id: Joi.string().required(),
  department: DepartmentSchema.required(),
  email: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  is_deleted: Joi.boolean().required(),
  phone: Joi.string().required(),
  title: Joi.string().required(),
  verified_email: Joi.boolean().required(),
  owner: Joi.string().required(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string().required(),
});

export interface NewUser {
  id: string;
  address: string;
  birthday: Date;
  company_id: string;
  department: string;
  email: string;
  first_name: string;
  last_name: string;
  is_deleted: boolean;
  phone: string;
  title: string;
  verified_email: boolean;
  owner: string;
  created_date: Date;
  modified_date: Date;
  slug: string;
}
