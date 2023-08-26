import Joi from "joi";
import { DepartmentSchema, RoleSchema } from "../lib/options";
import { Department, Role } from "../lib/enums";

export interface Employee {
  id?: string;
  company_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string;
  photo: string;
  status: string;
  department: Department;
  professional_title: string;
  location: string;
  user_agent: string;
  ip: string;
  address: string;
  role: Role;
  is_onboarded: boolean;
  push_notifications_id: string;
  modified_at: string;
  creation_at: string;
}

export const CreateEmployeeSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().allow("").allow(null),
  birthday: Joi.string().allow("").allow(null),
  photo: Joi.string().allow("").allow(null),
  status: Joi.string().required(),
  department: DepartmentSchema.required(),
  professional_title: Joi.string().allow("").allow(null),
  location: Joi.string().allow("").allow(null),
  user_agent: Joi.string().allow("").allow(null),
  ip: Joi.string().allow("").allow(null),
  address: Joi.string().allow("").allow(null),
  role: RoleSchema.required(),
  is_onboarded: Joi.boolean().required(),
  push_notifications_id: Joi.string().allow("").allow(null),
  modified_at: Joi.date().required(),
  creation_at: Joi.date().required(),
});

export const UpdateEmployeeSchema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string().allow("").allow(null),
  birthday: Joi.string().allow("").allow(null),
  photo: Joi.string().allow("").allow(null),
  status: Joi.string(),
  department: DepartmentSchema,
  professional_title: Joi.string().allow("").allow(null),
  location: Joi.string().allow("").allow(null),
  user_agent: Joi.string().allow("").allow(null),
  ip: Joi.string().allow("").allow(null),
  address: Joi.string().allow("").allow(null),
  role: RoleSchema,
  is_onboarded: Joi.boolean(),
  push_notifications_id: Joi.string().allow("").allow(null),
  modified_at: Joi.date().required(),
});