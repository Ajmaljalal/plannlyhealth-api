import Joi from 'joi';

export const FrequencySchema = Joi.string().valid('One Time', 'Monthly', 'Quarterly', 'Yearly').required();

export const OptionsSchema = Joi.string().valid('Activate', 'Deactivate', 'Edit').required();

export const ProgramModelSchema = Joi.string().valid('Allotment', 'Allowance', 'Both Programs').required();

export const ClaimStatusSchema = Joi.string().valid('Requested', 'Approved', 'Rejected').required();

export const DepartmentSchema = Joi.string().valid('Sales', 'Marketing', 'Finance', 'Operations', 'Human Resources', 'IT', 'Support').required();

export const NotificationTypeSchema = Joi.string().valid('Claim Status', 'Comment').required();

export const OptionsClaimSchema = Joi.string().valid('Approve', 'Approve All', 'Decline', 'Delete', 'Details', 'Edit').required();

export const OptionsCommentSchema = Joi.string().valid('Delete', 'Edit').required();

export const PaymentScheduleSchema = Joi.string().valid('Annually', 'Monthly').required();