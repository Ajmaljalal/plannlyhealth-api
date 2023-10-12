import Joi from "joi";

type AssessmentType = 'monthly' | 'onboarding';

type Answer = {
  id: string;
  question_id: string;
  options: string[];
  selected_option: string;
  score: number;
};
export type Assessment = {
  id: string;
  company_id: string;
  type: AssessmentType;
  user_id: string;
  is_completed: boolean;
  answers: Answer[]
  created_at: string;
  modified_at: string;
};

export const CreateAssessmentSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  type: Joi.string().valid('monthly', 'onboarding').required(),
  user_id: Joi.string().required(),
  is_completed: Joi.boolean().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    question_id: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    selected_option: Joi.string().required(),
    score: Joi.number().allow(null),
  })).required(),
  created_at: Joi.string().required(),
  modified_at: Joi.string().required(),
});

export const UpdateAssessmentSchema = Joi.object({
  is_completed: Joi.boolean().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    question_id: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    selected_option: Joi.string().required(),
    score: Joi.number().allow(null),
  })).required(),
  modified_at: Joi.string().required(),
});

