import Joi from "joi";
import { ClaimStatus, Frequency, ProgramModel, RefundStatus } from "../lib/enums";
import { ClaimStatusSchema, FrequencySchema, ProgramModelSchema, RefundStatusSchema } from "./options";

export const ClaimSchema = Joi.object({
  id: Joi.string().required(),
  admin: Joi.string().required(),
  attachments: Joi.array().items(Joi.string()),
  benefits_program: Joi.string().required(),
  category: Joi.string().required(),
  company_id: Joi.string().required(),
  date_approved: Joi.date(),
  date_submitted: Joi.date().required(),
  description: Joi.string().required(),
  frequency: FrequencySchema.required(),
  program_model: ProgramModelSchema.required(),
  program_balance: ProgramModelSchema.required(),
  refund_status: RefundStatusSchema.required(),
  reimbursed_amount: Joi.number().required(),
  requested_amount: Joi.number().required(),
  sc_transaction_id: Joi.string().required(),
  search_program: Joi.string().required(),
  search_user: Joi.string().required(),
  status: ClaimStatusSchema.required(),
  stripe_category: Joi.string().required(),
  title: Joi.string().required(),
  user_id: Joi.string().required(),
  owner: Joi.string().required(),
  modified_date: Joi.date(),
  created_date: Joi.date(),
  slug: Joi.string(),
});

export interface Claim {
  id: string;
  admin: string;
  attachments: string[];
  benefits_program: string;
  category: string;
  company_id: string;
  date_approved: Date;
  date_submitted: Date;
  description: string;
  frequency: Frequency;
  program_model: ProgramModel;
  program_balance: ProgramModel;
  refund_status: RefundStatus;
  reimbursed_amount: number;
  requested_amount: number;
  sc_transaction_id: string;
  search_program: string;
  search_user: string;
  status: ClaimStatus;
  stripe_category: string;
  title: string;
  user_id: string;
  owner: string;
  modified_date: Date;
  created_date: Date;
  slug: string;
}
