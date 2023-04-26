import Joi from "joi";
import { DepartmentSchema, RoleSchema } from "../lib/options";
import { Department, Role } from "../lib/enums";

export interface User {
  company_id: string;
  company_name: string;
  stripe_errors: string;
  photo: string;
  push_notifications_requested: boolean;
  status: string;
  email: string;
  verified_email: boolean;
  card_delivery_approved: boolean;
  signup_true: boolean;
  issuing_cardholder: string;
  connected_card_old: string;
  id: string;
  phone: string;
  work_start_date: string;
  stripe_sub_item_id: string;
  department: Department;
  location: string;
  connected_account: string;
  modified_date: string;
  user_agent: string;
  physical_card_id: string;
  ip: string;
  onboarded: boolean;
  address: string;
  player_id: string;
  creation_date: string;
  user_agent_time: string;
  role: Role;
  self_card: string;
  last_name: string;
  new_user_for_admin: string;
  first_name: string;
  issuing_card_id: string;
  birthday: string;
  title: string;
  slug: string;
}

export const CreateUserSchema = Joi.object({
  id: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().allow("").allow(null),
  connected_account: Joi.string().allow("").allow(null),
  birthday: Joi.string().allow("").allow(null),
  card_delivery_approved: Joi.boolean(),
  company_id: Joi.string().required(),
  company_name: Joi.string().allow(null).allow(""),
  department: DepartmentSchema.required(),
  issuing_card_id: Joi.string().allow("").allow(null),
  issuing_cardholder: Joi.string().allow("").allow(null),
  location: Joi.string().allow("").allow(null),
  onboarded: Joi.boolean(),
  phone: Joi.string().allow("").allow(null),
  photo: Joi.string().allow("").allow(null),
  physical_card_id: Joi.string().allow("").allow(null),
  player_id: Joi.string().allow("").allow(null),
  push_notifications_requested: Joi.boolean(),
  role: RoleSchema.required(),
  self_card: Joi.string().allow("").allow(null),
  signup_true: Joi.boolean(),
  status: Joi.string().required(),
  stripe_sub_item_id: Joi.string().allow("").allow(null),
  title: Joi.string().allow("").allow(null),
  verified_email: Joi.boolean(),
  work_start_date: Joi.date().allow("").allow(null) || Joi.string().allow("").allow(null),
  creator: Joi.string().required(),
  modified_date: Joi.date().required(),
  creation_date: Joi.date().required(),
  slug: Joi.string().allow("").allow(null),
  stripe_errors: Joi.string().allow("").allow(null),
  connected_card_old: Joi.string().allow("").allow(null),
  user_agent: Joi.string().allow("").allow(null),
  user_agent_time: Joi.string().allow("").allow(null),
  ip: Joi.string().allow("").allow(null),
  new_user_for_admin: Joi.string().allow("").allow(null),
});

export const UpdateUserSchema = Joi.object({
  id: Joi.string(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().allow("").allow(null),
  connected_account: Joi.string().allow("").allow(null),
  birthday: Joi.string().allow("").allow(null),
  card_delivery_approved: Joi.boolean(),
  company_id: Joi.string().required(),
  company_name: Joi.string().allow(null).allow(""),
  department: DepartmentSchema.required(),
  issuing_card_id: Joi.string().allow("").allow(null),
  issuing_cardholder: Joi.string().allow("").allow(null),
  location: Joi.string().allow("").allow(null),
  onboarded: Joi.boolean(),
  phone: Joi.string().allow("").allow(null),
  photo: Joi.string().allow("").allow(null),
  physical_card_id: Joi.string().allow("").allow(null),
  player_id: Joi.string().allow("").allow(null),
  push_notifications_requested: Joi.boolean(),
  role: RoleSchema.required(),
  self_card: Joi.string().allow("").allow(null),
  signup_true: Joi.boolean(),
  status: Joi.string().required(),
  stripe_sub_item_id: Joi.string().allow("").allow(null),
  title: Joi.string().allow("").allow(null),
  verified_email: Joi.boolean(),
  work_start_date: Joi.date().allow("").allow(null) || Joi.string().allow("").allow(null),
  creator: Joi.string().required(),
  modified_date: Joi.date().required(),
  creation_date: Joi.date().required(),
  slug: Joi.string().allow("").allow(null),
  stripe_errors: Joi.string().allow("").allow(null),
  connected_card_old: Joi.string().allow("").allow(null),
  user_agent: Joi.string().allow("").allow(null),
  user_agent_time: Joi.string().allow("").allow(null),
  ip: Joi.string().allow("").allow(null),
  new_user_for_admin: Joi.string().allow("").allow(null),
});
