import Joi from "joi";
import { DepartmentSchema } from "./options";

export const CreateNewUserSchema = Joi.object({
  id: Joi.string().required(),
  address: Joi.string(),
  birthday: Joi.date(),
  company_id: Joi.string().required(),
  department: DepartmentSchema,
  email: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  is_deleted: Joi.boolean().default(false),
  phone: Joi.string(),
  title: Joi.string(),
  verified_email: Joi.boolean(),
  owner: Joi.string(),
  created_date: Joi.date().required(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
});

export const UpdateNewUserSchema = Joi.object({
  id: Joi.string(),
  address: Joi.string(),
  birthday: Joi.date(),
  company_id: Joi.string(),
  department: DepartmentSchema,
  email: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  is_deleted: Joi.boolean(),
  phone: Joi.string(),
  title: Joi.string(),
  verified_email: Joi.boolean(),
  owner: Joi.string(),
  created_date: Joi.date(),
  modified_date: Joi.date().required(),
  slug: Joi.string(),
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
