export type RiskProfile = {
  user_id: string;
  company_id: string;
  user_job_title: string | null;
  user_department: string | null;
  user_birthday: string | null;
  user_marital_status: string | null;
  user_gender: string | null;
  assessment_date: string;
  risk_summary: Record<string, { percentage: number, riskLevel: string }>;
  detailed_breakdown: Record<string, { total_score: number; number_of_symptoms: number; key_responses: any[] }>;
  key_insights: string[];
  historical_data: Record<string, number[]>;
};

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type RiskTrend = 'Increasing' | 'Stable' | 'Decreasing';

export interface RiskTrendCounters {
  increasing: number;
  stable: number;
  decreasing: number;
}

interface DepartmentRiskLevel {
  [departmentName: string]: RiskLevel;
}

interface JobTitleRiskLevel {
  [jobTitle: string]: RiskLevel;
}

interface GenderRiskLevel {
  [gender: string]: RiskLevel;
}

interface Risk {
  risk_name: string;
  risk_score: number;
  risk_trend: RiskTrend;
  risk_level: {
    overall: RiskLevel;
    by_department: DepartmentRiskLevel;
    by_job_title: JobTitleRiskLevel;
    by_gender: GenderRiskLevel
  };
  risk_factors: string[];
  mitigation_strategies: string[];
}

export interface DemographicRiskLevel {
  [demographicKey: string]: { [riskCategory: string]: { averageRiskScore: number; numberOfUsers: number; riskLevel: RiskLevel } };
}

export interface CompanyRiskProfile {
  company_id: string;
  company_size: number;
  type: string
  created_at: Date;
  updated_at: Date;
  overall_risk_score: number;
  risk_trend_counters: { [riskCategory: string]: RiskTrendCounters };
  key_insights: string[];
  demographic_analysis: {
    age_groups: DemographicRiskLevel;
    gender: DemographicRiskLevel;
    marital_status: DemographicRiskLevel;
    job_title: DemographicRiskLevel;
    department: DemographicRiskLevel;
  };
  historical_comparison: { [date: string]: { [riskCategory: string]: RiskLevel } };
  predictive_insights: { [riskCategory: string]: string };
  top_risks: Risk[];
  employee_engagement_and_satisfaction: {
    engagement_score: number;
    satisfaction_score: number;
    areas_for_improvement: string[];
  };
}