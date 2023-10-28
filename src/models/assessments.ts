import Joi from "joi";

type AssessmentType = 'monthly' | 'onboarding';

type Answer = {
  id: number;
  question_id: string;
  question: string;
  options: string[];
  selected_option: string;
  scores: any;
  category: string;
};
export type Assessment = {
  id: string;
  company_id: string;
  type: AssessmentType;
  user_job_title: string;
  user_department: string;
  user_birthday: string;
  user_marital_status: string;
  user_id: string;
  is_completed: boolean;
  answers: Answer[]
  created_at: string;
  modified_at: string;
  risk_scores?: {
    burnout: any;
    stress: any;
    turnover: any;
    workload: any;
  }
};

export const CreateAssessmentSchema = Joi.object({
  id: Joi.string().required(),
  company_id: Joi.string().required(),
  type: Joi.string().valid('monthly', 'onboarding').required(),
  user_job_title: Joi.string().allow(null),
  user_department: Joi.string().allow(null),
  user_birthday: Joi.string().allow(null),
  user_marital_status: Joi.string().allow(null),
  user_id: Joi.string().required(),
  is_completed: Joi.boolean().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    question_id: Joi.string().required(),
    question: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    selected_option: Joi.string().required(),
    scores: Joi.any().allow(null),
    category: Joi.string().required(),
  })).required(),
  created_at: Joi.string().required(),
  modified_at: Joi.string().required(),
  risk_scores: Joi.object({
    burnout: Joi.any().allow(null),
    stress: Joi.any().allow(null),
    turnover: Joi.any().allow(null),
    workload: Joi.any().allow(null),
  }),
});

export const UpdateAssessmentSchema = Joi.object({
  is_completed: Joi.boolean().required(),
  answers: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    question_id: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    selected_option: Joi.string().required(),
    scores: Joi.any().allow(null),
    category: Joi.string().allow(null),
  })).required(),
  modified_at: Joi.string().required(),
  risk_scores: Joi.object({
    burnout: Joi.any().allow(null),
    stress: Joi.any().allow(null),
    turnover: Joi.any().allow(null),
    workload: Joi.any().allow(null),
  }),
});

