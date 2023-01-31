import { Role } from "aws-sdk/clients/budgets";
import { Department } from "../lib/types/options";

export interface User {
  type: 'User';
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  connected_accounts: string
  birthday: Date;
  card_delivery_approved: boolean;
  company_id: string;
  department: Department;
  issuing_card_id: string;
  issuing_car_holder: string;
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
  modified_date: Date;
  created_date: Date;
  slug: string;
}