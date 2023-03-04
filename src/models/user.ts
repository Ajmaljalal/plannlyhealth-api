import Joi from "joi";
import { Department, Role } from "../lib/enums";

export interface User {
  type?: 'User';
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  connected_accounts: string
  birth_date: Date;
  card_delivery_approved: boolean;
  company_id: string;
  department: Department;
  issuing_card_id: string;
  issuing_card_holder_id: string;
  location: string;
  onboarded: boolean;
  new_user: boolean;
  phone: string;
  photo: string;
  physical_card_id: string;
  player_id: string;
  push_notifications_requested: boolean;
  role: Role;
  self_card: string
  signup_true: boolean;
  status: string;
  stripe_subitem_id: string;
  title: string;
  verified_email: boolean;
  work_start_date: Date;
  owner: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}

export const CreateUserSchema = Joi.object({
  id: Joi.string().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string(),
  connected_accounts: Joi.string(),
  birth_date: Joi.date(),
  card_delivery_approved: Joi.boolean(),
  company_id: Joi.string(),
  department: Joi.string(),
  issuing_card_id: Joi.string(),
  issuing_card_holder_id: Joi.string(),
  location: Joi.string(),
  onboarded: Joi.boolean(),
  new_user: Joi.boolean(),
  phone: Joi.string(),
  photo: Joi.string(),
  physical_card_id: Joi.string(),
  player_id: Joi.string(),
  push_notifications_requested: Joi.boolean(),
  role: Joi.string(),
  self_card: Joi.string(),
  signup_true: Joi.boolean(),
  status: Joi.string(),
  stripe_subitem_id: Joi.string(),
  title: Joi.string(),
  verified_email: Joi.boolean(),
  work_start_date: Joi.date(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date().required(),
  slug: Joi.string(),
});

export const UpdateUserSchema = Joi.object({
  id: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string(),
  address: Joi.string(),
  connected_accounts: Joi.string(),
  birth_date: Joi.date(),
  card_delivery_approved: Joi.boolean(),
  company_id: Joi.string(),
  department: Joi.string(),
  issuing_card_id: Joi.string(),
  issuing_card_holder_id: Joi.string(),
  location: Joi.string(),
  onboarded: Joi.boolean(),
  new_user: Joi.boolean(),
  phone: Joi.string(),
  photo: Joi.string(),
  physical_card_id: Joi.string(),
  player_id: Joi.string(),
  push_notifications_requested: Joi.boolean(),
  role: Joi.string(),
  self_card: Joi.string(),
  signup_true: Joi.boolean(),
  status: Joi.string(),
  stripe_subitem_id: Joi.string(),
  title: Joi.string(),
  verified_email: Joi.boolean(),
  work_start_date: Joi.date(),
  owner: Joi.string(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});
