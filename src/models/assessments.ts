type AssessmentType = 'monthly' | 'onboarding';

type Answer = {
  id: string;
  question_id: string;
  options: string[];
  selected_option: string;
  score: number;
  created_at: string;
  modified_at: string;
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

