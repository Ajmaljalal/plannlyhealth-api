import Joi from "joi";
import { DepartmentSchema, RoleSchema } from "../lib/options";

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
  expired_date: Joi.date(),
  phone: Joi.string(),
  job_title: Joi.string(),
  role: RoleSchema.required(),
  created_at: Joi.date().required(),
  modified_at: Joi.date().required(),

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
  expired_date: Joi.date(),
  phone: Joi.string(),
  job_title: Joi.string(),
  role: RoleSchema,
  created_at: Joi.date(),
  modified_at: Joi.date().required(),
});

export type NewUser = {
  id: string;
  address: string;
  birthday: Date;
  company_id: string;
  department: string;
  email: string;
  first_name: string;
  last_name: string;
  is_deleted: boolean;
  expired_date: null
  phone: string;
  job_title: string;
  role: string;
  created_at: Date;
  modified_at: Date;
}
