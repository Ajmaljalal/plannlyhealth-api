import Joi from "joi"
import { ProgramModel, SubscriptionStatus } from "../lib/enums"

export interface Company {
  type?: 'Company'
  id: string | ''
  name: string
  logo: string
  website: string
  company_size: string
  monthly_charge_active?: boolean
  restrict_signup_to_domain_only?: boolean
  restrict_domain?: string
  employees_count?: number
  wellness_committee?: ['User']
  mission?: string
  seats?: number
  wellness_champion?: ['User']
  plaid_account_id?: string
  plaid_instruction?: string
  wellness_goals?: [string]
  wellness_policy?: string
  wellness_budget?: number
  effective_start?: Date
  program_model?: ProgramModel
  stripe_id?: string
  subscription?: string
  subscription_status?: SubscriptionStatus
  wellness_support_email?: string
  addOns?: [string]
  address?: string
  location?: string
  SCBankId?: string
  stripe?: string
  subscription_frequency?: string
  support_email?: string
  slug?: string
  onboarding_steps?: [number]
  sc_account_d?: string
  SC_bank_status?: string
  SC_bank_topups?: boolean
  stripe_card?: [string]
  stripe_subItem_id?: string
  subscription_cancel_old?: boolean
  subscription_id?: string
  usersLimit?: boolean
  wellness_admin_email?: string
  creator?: 'User'
  owner?: 'User'
  modified_date?: Date
  created_date?: Date
}

export const CreateCompanySchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  logo: Joi.string().required(),
  website: Joi.string(),
  company_size: Joi.string().required(),
  monthly_charge_active: Joi.boolean(),
  restrict_signup_to_domain_only: Joi.boolean(),
  restrict_domain: Joi.string(),
  employees_count: Joi.number(),
  wellness_committee: Joi.array(),
  mission: Joi.string(),
  seats: Joi.number(),
  wellness_champion: Joi.array(),
  plaid_account_id: Joi.string(),
  plaid_instruction: Joi.string(),
  wellness_goals: Joi.array(),
  wellness_policy: Joi.string(),
  wellness_budget: Joi.number(),
  effective_start: Joi.date(),
  program_model: Joi.string(),
  stripe_id: Joi.string(),
  subscription: Joi.string(),
  subscription_status: Joi.string(),
  wellness_support_email: Joi.string(),
  addOns: Joi.array(),
  address: Joi.string(),
  location: Joi.string(),
  SCBankId: Joi.string(),
  stripe: Joi.string(),
  subscription_frequency: Joi.string(),
  support_email: Joi.string(),
  slug: Joi.string(),
  onboarding_steps: Joi.array(),
  sc_account_d: Joi.string(),
  SC_bank_status: Joi.string(),
  SC_bank_topups: Joi.boolean(),
  stripe_card: Joi.array(),
  stripe_subItem_id: Joi.string(),
  subscription_cancel_old: Joi.boolean(),
  subscription_id: Joi.string(),
  usersLimit: Joi.boolean(),
  wellness_admin_email: Joi.string(),
  creator: Joi.string(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date().required(),
})

export const UpdateCompanySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  logo: Joi.string(),
  website: Joi.string(),
  company_size: Joi.string(),
  monthly_charge_active: Joi.boolean(),
  restrict_signup_to_domain_only: Joi.boolean(),
  restrict_domain: Joi.string(),
  employees_count: Joi.number(),
  wellness_committee: Joi.array(),
  mission: Joi.string(),
  seats: Joi.number(),
  wellness_champion: Joi.array(),
  plaid_account_id: Joi.string(),
  plaid_instruction: Joi.string(),
  wellness_goals: Joi.array(),
  wellness_policy: Joi.string(),
  wellness_budget: Joi.number(),
  effective_start: Joi.date(),
  program_model: Joi.string(),
  stripe_id: Joi.string(),
  subscription: Joi.string(),
  subscription_status: Joi.string(),
  wellness_support_email: Joi.string(),
  addOns: Joi.array(),
  address: Joi.string(),
  location: Joi.string(),
  SCBankId: Joi.string(),
  stripe: Joi.string(),
  subscription_frequency: Joi.string(),
  support_email: Joi.string(),
  slug: Joi.string(),
  onboarding_steps: Joi.array(),
  sc_account_d: Joi.string(),
  SC_bank_status: Joi.string(),
  SC_bank_topups: Joi.boolean(),
  stripe_card: Joi.array(),
  stripe_subItem_id: Joi.string(),
  subscription_cancel_old: Joi.boolean(),
  subscription_id: Joi.string(),
  usersLimit: Joi.boolean(),
  wellness_admin_email: Joi.string(),
  creator: Joi.string(),
  owner: Joi.string(),
  modified_date: Joi.date().required(),
  created_date: Joi.date(),
})




