import { Department, Role } from "../enums";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  connected_accounts: string
  birthday: string;
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
  work_start_date: string;
  owner: string;
  modified_date: string;
  created_date: string;
  slug: string;
}