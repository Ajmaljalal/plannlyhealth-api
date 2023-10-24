
export type Question = {
  id: number,
  question_id: string
  question: string,
  options: string[]
  scores: any
}

export type RiskProfile = {
  user_id: string;
  company_id: string;
  assessment_date: string;
  risk_summary: Record<string, number>;
  detailed_breakdown: Record<string, { total_score: number; number_of_symptoms: number; key_responses: any[] }>;
  key_insights: string[];
};