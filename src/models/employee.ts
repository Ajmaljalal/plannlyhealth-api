import Joi from "joi";
import { AddressSchema, DepartmentSchema, RoleSchema } from "../lib/options";
import { Department, Role } from "../lib/enums";

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export interface Employee {
  id?: string;
  company_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday: string;
  photo: string;
  status: string;
  department: Department;
  address: Address;
  role: Role;
  job_title: string;
  onboarding_assessment_completed: boolean;
  last_assessment_date?: string;
  last_assessment_type?: string;
  push_notifications_id: string;
  modified_at?: string;
  created_at?: string;
}

export const CreateEmployeeSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  marital_status: Joi.string().allow("").allow(null),
  email: Joi.string().required(),
  phone: Joi.string().allow("").allow(null),
  birthday: Joi.string().allow("").allow(null),
  photo: Joi.string().allow("").allow(null),
  status: Joi.string().required(),
  department: DepartmentSchema.allow(null),
  address: AddressSchema.allow(null),
  role: RoleSchema.required(),
  job_title: Joi.string().allow("").allow(null),
  onboarding_assessment_completed: Joi.boolean().required(),
  last_assessment_date: Joi.date().allow("").allow(null),
  last_assessment_type: Joi.string().allow("").allow(null),
  push_notifications_id: Joi.string().allow("").allow(null),
  modified_at: Joi.date().required(),
  created_at: Joi.date().required(),
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
  address: AddressSchema.allow(null),
  role: RoleSchema,
  job_title: Joi.string().allow("").allow(null),
  onboarding_assessment_completed: Joi.boolean(),
  last_assessment_date: Joi.date().allow("").allow(null),
  last_assessment_type: Joi.string().allow("").allow(null),
  push_notifications_id: Joi.string().allow("").allow(null),
  modified_at: Joi.date(),
});