import { ProgramModel, SubscriptionStatus } from "../lib/types/options"

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



