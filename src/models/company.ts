import Joi from "joi"
import { ProgramModel, SubscriptionStatus } from "../lib/enums"

export interface Company {
  type?: 'Company'
  id: string | ''
  name: string
  logo?: string
  website?: string
  address?: string
  company_size?: number
  restrict_signup_to_domain_only?: boolean
  entity_type?: string
  mission?: string
  support_email?: string
  onboarding_steps?: string[]
  owner?: string
  modified_date?: Date
  created_date?: Date
}

export const CreateCompanySchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  logo: Joi.string(),
  website: Joi.string().required(),
  address: Joi.string(),
  company_size: Joi.number().required(),
  restrict_signup_to_domain_only: Joi.boolean(),
  entity_type: Joi.string(),
  mission: Joi.string(),
  support_email: Joi.string(),
  onboarding_steps: Joi.array(),
  owner: Joi.string(),
  modified_date: Joi.date(),
  created_date: Joi.date().required(),
})

export const UpdateCompanySchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  logo: Joi.string(),
  website: Joi.string(),
  address: Joi.string(),
  company_size: Joi.number(),
  restrict_signup_to_domain_only: Joi.boolean(),
  entity_type: Joi.string(),
  mission: Joi.string(),
  support_email: Joi.string(),
  onboarding_steps: Joi.array(),
  owner: Joi.string(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
})




