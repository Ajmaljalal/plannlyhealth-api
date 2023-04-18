import Joi from 'joi';

export const FrequencySchema = Joi.string().valid('One Time', 'Monthly', 'Quarterly', 'Yearly')

export const OptionsSchema = Joi.string().valid('Activate', 'Deactivate', 'Edit');

export const ProgramModelSchema = Joi.string().valid('Allotment', 'Allowance', 'Both Programs');

export const ProgramAccessSchema = Joi.string().valid('Limited', 'Unlimited');

export const ClaimStatusSchema = Joi.string().valid('Requested', 'Approved', 'Rejected');

export const DepartmentSchema = Joi.string().valid('Sales', 'Marketing', 'Finance', 'Operations', 'Human Resources', 'IT', 'Support', 'Other');

export const NotificationTypeSchema = Joi.string().valid('Claim Status', 'Comment');

export const OptionsClaimSchema = Joi.string().valid('Approve', 'Approve All', 'Decline', 'Delete', 'Details', 'Edit');

export const OptionsCommentSchema = Joi.string().valid('Delete', 'Edit');

export const PaymentScheduleSchema = Joi.string().valid('Annually', 'Monthly');

export const RefundStatusSchema = Joi.string().valid('Failed', 'Success');

export const QuestionTypeSchema = Joi.string().valid('Single Select', 'Multi Select');

export const RoleSchema = Joi.string().valid('Admin', 'Program Admin', 'Super Admin', 'Wellness Coordinator', 'Customer Success', 'Finance', 'Standard',);

export const UserAccountStatusSchema = Joi.string().valid('Active', 'Invited', 'Deactivated');