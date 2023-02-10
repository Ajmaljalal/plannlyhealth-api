import Joi from 'joi';

export const FrequencySchema = Joi.string().valid('one time', 'monthly', 'quarterly', 'yearly').required();

export const OptionsSchema = Joi.string().valid('activate', 'deactivate', 'edit').required();

export const ProgramModelSchema = Joi.string().valid('allotment', 'allowance', 'both programs').required();

export const ClaimStatusSchema = Joi.string().valid('requested', 'approved', 'rejected').required();

export const DepartmentSchema = Joi.string().valid('sales', 'marketing', 'finance', 'operations', 'human resources', 'IT', 'support').required();

export const NotificationTypeSchema = Joi.string().valid('claim status', 'comment').required();

export const OptionsClaimSchema = Joi.string().valid('approve', 'approve all', 'decline', 'delete', 'details', 'edit').required();

export const OptionsCommentSchema = Joi.string().valid('delete', 'edit').required();

export const PaymentScheduleSchema = Joi.string().valid('annually', 'monthly').required();

export const RefundStatusSchema = Joi.string().valid('failed', 'success');

export const QuestionTypeSchema = Joi.string().valid('single Select', 'multi select').required();