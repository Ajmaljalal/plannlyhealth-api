import Joi from "joi";
import { ClaimStatus, Frequency, ProgramModel, RefundStatus } from "../lib/enums";
import { ClaimStatusSchema, FrequencySchema, ProgramModelSchema, RefundStatusSchema } from "../lib/options";

export const CreateClaimSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  benefits_program_id: Joi.string().required(),
  user_name: Joi.string().required(), // search_user in the old schema
  date: Joi.date().required(),
  description: Joi.string(),
  attachments: Joi.array().items(Joi.string()),
  company_id: Joi.string().required(),
  program_name: Joi.string().required(), // search_program in the old schema
  frequency: FrequencySchema.required(),
  claim_status: ClaimStatusSchema.required(),
  requested_amount: Joi.number().required(),
  program_model: ProgramModelSchema.required(),
  admin: Joi.string(),
  date_approved: Joi.date(),
  program_balance_id: Joi.string().required(),
  refund_status: RefundStatusSchema,
  reimbursed_amount: Joi.number(),
  sc_transaction_id: Joi.string(),
  stripe_category: Joi.string(),
  owner: Joi.string().required(),
  category: Joi.string(),
  modified_date: Joi.date(),
  created_date: Joi.date().required(),
  slug: Joi.string(),
});

export const UpdateClaimSchema = Joi.object({
  id: Joi.string(),
  title: Joi.string(),
  benefits_program_id: Joi.string(),
  user_name: Joi.string(), // search_user in the old schema
  date: Joi.date(),
  description: Joi.string(),
  attachments: Joi.array().items(Joi.string()),
  company_id: Joi.string(),
  program_name: Joi.string(), // search_program in the old schema
  frequency: FrequencySchema,
  claim_status: ClaimStatusSchema,
  requested_amount: Joi.number(),
  program_model: ProgramModelSchema,
  admin: Joi.string(),
  date_approved: Joi.date(),
  program_balance_id: Joi.string(),
  refund_status: RefundStatusSchema,
  reimbursed_amount: Joi.number(),
  sc_transaction_id: Joi.string(),
  stripe_category: Joi.string(),
  owner: Joi.string(),
  category: Joi.string(),
  modified_date: Joi.date().required(),
  created_date: Joi.date(),
  slug: Joi.string(),
});

export interface Claim {
  id: string;
  title: string;
  benefits_program_id: string;
  user_name: string; // search_user in the old schema
  date: Date;
  description: string;
  attachments: string[];
  company_id: string;
  program_name: string; // search_program in the old schema
  frequency: Frequency;
  claim_status: ClaimStatus; // status in the old schema
  requested_amount: number;
  program_model: ProgramModel;
  admin: string;
  date_approved: Date;
  program_balance_id: string;
  refund_status: RefundStatus;
  reimbursed_amount: number;
  sc_transaction_id: string;
  stripe_category: string;
  owner: string;
  category: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}
