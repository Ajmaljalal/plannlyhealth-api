import { Department, Role } from "../enums";

export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  connected_account: string
  birthday: string;
  card_delivery_approved: boolean;
  company_id: string;
  department: Department;
  issuing_card_id: string;
  issuing_card_holder_id: string;
  location: string;
  onboarded: boolean;
  new_user_for_admin: boolean;
  phone: string;
  photo: string;
  physical_card_id: string;
  player_id: string;
  push_notifications_requested: boolean;
  role: Role;
  self_card: string
  signup_true: boolean;
  status: string;
  stripe_sub_item_id: string;
  title: string;
  verified_email: boolean;
  work_start_date: string;
  creator: string;
  modified_date: string;
  creation_date: string;
  slug: string;
}