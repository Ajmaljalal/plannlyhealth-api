import Joi from 'joi';

export const FrequencySchema = Joi.string().valid('one time', 'monthly', 'quarterly', 'yearly')

export const OptionsSchema = Joi.string().valid('activate', 'deactivate', 'edit');

export const ProgramModelSchema = Joi.string().valid('allotment', 'allowance', 'both programs');

export const ClaimStatusSchema = Joi.string().valid('requested', 'approved', 'rejected');

export const DepartmentSchema = Joi.string().valid('sales', 'marketing', 'finance', 'operations', 'human resources', 'IT', 'support');

export const NotificationTypeSchema = Joi.string().valid('claim status', 'comment');

export const OptionsClaimSchema = Joi.string().valid('approve', 'approve all', 'decline', 'delete', 'details', 'edit');

export const OptionsCommentSchema = Joi.string().valid('delete', 'edit');

export const PaymentScheduleSchema = Joi.string().valid('annually', 'monthly');

export const RefundStatusSchema = Joi.string().valid('failed', 'success');

export const QuestionTypeSchema = Joi.string().valid('single Select', 'multi select');