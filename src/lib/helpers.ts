import CryptoJS from 'crypto-js';
import { general_questions_bank, baseline_questions } from './assessment/questions_bank';
import { Question, RiskProfile } from './types/assessment';
import { Assessment } from '../models/assessments';

export const decryptData = (data: string) => {
  if (!data) return null;
  const decryptedData = CryptoJS.AES.decrypt(data, process.env.NEXT_PUBLIC_PLANNLY_ENCRYPT_KEY as string).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

export const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^*()_-+=<>';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function getRandom(arr: string) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const randomPassword = [
    getRandom(upperChars),
    getRandom(specialChars),
    getRandom(specialChars),
    getRandom(numbers),
  ];

  while (randomPassword.length < 10) {
    randomPassword.push(getRandom(chars));
  }

  return randomPassword.sort(() => Math.random() - 0.5).join('');
}

export const extractQuestions = () => {
  const questions: Question[] = [];
  let id = 1;

  for (const questionId of baseline_questions) {
    const question = general_questions_bank[questionId];
    if (question) {
      question.id = id;
      questions.push(question);
      id++;
    }
  }

  return questions;
}

export const calculateScores = (assessment: any): any => {
  let scores: any = {
    burnout: {
      score: 0,
      symptoms_count: 0,
      percentage: 0,
    },
    stress: {
      score: 0,
      symptoms_count: 0,
      percentage: 0,
    },
    turnover: {
      score: 0,
      symptoms_count: 0,
      percentage: 0,
    },
    workload: {
      score: 0,
      symptoms_count: 0,
      percentage: 0,
    },
    resources: {
      score: 0,
      symptoms_count: 0,
      percentage: 0,
    },
  };

  for (const answer of assessment.answers) {
    const scoreValue = answer.scores[answer.selected_option]; // Retrieve the score for the selected option
    if (scoreValue === undefined || scoreValue === null) {
      continue;
    }

    const categories = answer.category.split(',');

    for (const category of categories) {
      const currentCategory = category.trim();
      if (scores[currentCategory] !== undefined) {
        scores[currentCategory].score += scoreValue;
        scores[currentCategory].symptoms_count++;
      }
    }
  }

  // remove scores that have zero score and symptoms count
  for (const category in scores) {
    if (scores[category].score === 0 && scores[category].symptoms_count === 0) {
      delete scores[category];
    }
  }

  // Normalize the scores to ensure they do not exceed 100 and calculate the percentage
  for (const category in scores) {
    scores[category].score = scores[category].score > 100 ? 100 : scores[category].score;
    scores[category].percentage = Math.round((scores[category].score / (scores[category].symptoms_count * 5)) * 100);
  }

  return scores;
};

export const generateRiskProfile = (assessment: Assessment): RiskProfile => {
  const profileOverview = {
    user_id: assessment.user_id,
    company_id: assessment.company_id,
    user_job_title: assessment.user_job_title || null,
    user_department: assessment.user_department || null,
    user_birthday: assessment.user_birthday || null,
    user_marital_status: assessment.user_marital_status || null,
    user_gender: assessment.user_gender || null,
    assessment_date: new Date(assessment.created_at).toLocaleDateString(),
  };

  const riskSummary: Record<string, number> = {};
  for (const [key, value] of Object.entries(assessment.risk_scores as any)) {
    // @ts-ignore
    riskSummary[key] = value.percentage;
  }

  const detailedBreakdown: Record<string, { total_score: number; number_of_symptoms: number; key_responses: any[] }> = {};

  for (const [key, value] of Object.entries(assessment.risk_scores as any)) {
    const keyResponses: any = [];
    for (const answer of assessment.answers) {
      if (answer.category.includes(key)) {
        keyResponses.push({
          question_id: answer.question_id,
          question: answer.question,
          option: answer.selected_option,
        })
      };
    }
    detailedBreakdown[key] = {
      // @ts-ignore
      total_score: value.score,
      // @ts-ignore
      number_of_symptoms: value.symptoms_count,
      key_responses: keyResponses
    };
  }

  const keyInsights: string[] = [];
  if (riskSummary.burnout > 50) {
    keyInsights.push("Your burnout score is above average. It may be beneficial to reflect on the specific causes and consider discussing your feelings with a supervisor or HR.");
  }
  if (riskSummary.stress > 50) {
    keyInsights.push("Your stress level is high. Identifying specific stressors and seeking ways to manage them can help improve your well-being.");
  }
  if (riskSummary.turnover > 50) {
    keyInsights.push("Your turnover risk is high. Consider discussing your feelings with a supervisor or HR.");
  }
  if (riskSummary.workload > 50) {
    keyInsights.push("Your workload score is high. Consider discussing your workload with a supervisor or HR.");
  }

  return {
    ...profileOverview,
    risk_summary: riskSummary,
    detailed_breakdown: detailedBreakdown,
    key_insights: keyInsights
  };
}

export const getAssessmentProgressStatus = (progress: any) => {
  const { onboarding_assessment_completed, last_assessment_date } = progress;
  const lastAssessmentDate = new Date(last_assessment_date);
  const currentDate = new Date();

  const isSameMonth = lastAssessmentDate.getMonth() === currentDate.getMonth()
    && lastAssessmentDate.getFullYear() === currentDate.getFullYear();

  let monthly_assessment_completed = isSameMonth;

  return {
    onboarding_assessment_completed: onboarding_assessment_completed,
    monthly_assessment_completed: monthly_assessment_completed
  };
}

export const updateRiskProfile = (oldProfile: RiskProfile, newAssessment: Assessment): RiskProfile => {
  // Update only the assessment_date in the profile overview
  const updatedProfileOverview = {
    ...oldProfile,
    assessment_date: new Date(newAssessment.created_at).toLocaleDateString(),
  };

  // Update riskSummary based on new assessment data
  const updatedRiskSummary: Record<string, number> = { ...oldProfile.risk_summary };
  for (const [key, value] of Object.entries(newAssessment.risk_scores as any)) {
    // If the new assessment contains data for a specific risk category, update it
    // @ts-ignore
    if (value?.percentage) {
      // @ts-ignore
      updatedRiskSummary[key] = value.percentage;
    }
  }

  // Update detailedBreakdown based on new assessment data
  const updatedDetailedBreakdown: Record<string, { total_score: number; number_of_symptoms: number; key_responses: any[] }> = { ...oldProfile.detailed_breakdown };
  for (const [key, value] of Object.entries(newAssessment.risk_scores as any)) {
    const keyResponses: any = [];
    for (const answer of newAssessment.answers) {
      if (answer.category.includes(key)) {
        keyResponses.push({
          question_id: answer.question_id,
          question: answer.question,
          option: answer.selected_option,
        });
      }
    }
    if (keyResponses.length > 0) {
      updatedDetailedBreakdown[key] = {
        // @ts-ignore
        total_score: value.score,
        // @ts-ignore
        number_of_symptoms: value.symptoms_count,
        key_responses: keyResponses
      };
    }
  }

  // Update key insights based on updated risk summary
  const updatedKeyInsights: string[] = [];
  if (updatedRiskSummary.burnout > 50) {
    updatedKeyInsights.push("Your burnout score is above average. It may be beneficial to reflect on the specific causes and consider discussing your feelings with a supervisor or HR.");
  }
  if (updatedRiskSummary.stress > 50) {
    updatedKeyInsights.push("Your stress level is high. Identifying specific stressors and seeking ways to manage them can help improve your well-being.");
  }
  if (updatedRiskSummary.turnover > 50) {
    updatedKeyInsights.push("Your turnover risk is high. Consider discussing your feelings with a supervisor or HR.");
  }
  if (updatedRiskSummary.workload > 50) {
    updatedKeyInsights.push("Your workload score is high. Consider discussing your workload with a supervisor or HR.");
  }

  // Return the updated risk profile
  return {
    ...updatedProfileOverview,
    risk_summary: updatedRiskSummary,
    detailed_breakdown: updatedDetailedBreakdown,
    key_insights: updatedKeyInsights.length > 0 ? updatedKeyInsights : oldProfile.key_insights
  };
};



function calculateRiskPercentage(score: number, maxScore: number): number {
  return Math.round((score / maxScore) * 100);
}

function determineRiskLevel(percentage: number): string {
  if (percentage > 66) {
    return "High";
  } else if (percentage > 33) {
    return "Medium";
  } else {
    return "Low";
  }
}

export const generateComprehensiveRiskProfile = (assessment: Assessment) => {
  console.log('generateComprehensiveRiskProfile functions')
  const historicalData: any = {
    "burnout": [50, 60],
    "turnover": [20, 25],
    "workload": [40, 50],
    "resources": [10, 15]
  }
  const riskProfile: any = {
    user_id: assessment.user_id,
    company_id: assessment.company_id,
    user_job_title: assessment.user_job_title || null,
    user_department: assessment.user_department || null,
    user_birthday: assessment.user_birthday || null,
    user_marital_status: assessment.user_marital_status || null,
    user_gender: assessment.user_gender || null,
    assessment_date: new Date(assessment.created_at).toLocaleDateString(),
  };

  const categories: Set<string> = new Set();
  const maxScores: { [key: string]: number } = {};

  assessment.answers.forEach(answer => {
    const category = answer.category;
    categories.add(category);
    maxScores[category] = (maxScores[category] || 0) + Math.max(...Object.values(answer.scores) as any);
  });

  categories.forEach(category => {
    const responses = assessment.answers.filter(answer => answer.category === category);
    const score = responses.reduce((acc, answer) => acc + answer.scores[answer.selected_option], 0);
    const symptomsCount = responses.length;
    const percentage = calculateRiskPercentage(score, maxScores[category])
    const riskLevel = determineRiskLevel(percentage) || null;

    const trend = predictTrend(assessment.user_id, category, historicalData) || null

    riskProfile.detailedBreakdown[category] = {
      keyResponses: responses.map(response => ({
        questionId: response.question_id,
        question: response.question,
        option: response.selected_option
      })),
      totalScore: score,
      numberOfSymptoms: symptomsCount,
      percentage: percentage,
      riskLevel: riskLevel,
      trend: trend
    };

    riskProfile.riskSummary[category] = {
      percentage: percentage,
      riskLevel: riskLevel
    };

    const companyAveragePercentage = companyAverages[category] || 0;
    const insight = generateInsight(riskLevel, percentage, companyAveragePercentage, trend);
    if (insight) {
      riskProfile.keyInsights.push(insight);
    }
  });

  // add new values to historical data 
  categories.forEach(category => {
    const percentage = riskProfile.riskSummary[category].percentage;
    historicalData[category].push(percentage);
  });

  riskProfile.historicalData = historicalData;

  return riskProfile;
}

function predictTrend(userId: string, category: string, historicalData: Record<string, number[]>): string {
  const categoryData = historicalData[category];

  if (categoryData?.length < 2) {
    // Not enough data to determine a trend.
    return "Unknown";
  }

  const latestScore = categoryData[categoryData.length - 1];
  const previousScore = categoryData[categoryData.length - 2];

  if (latestScore > previousScore) {
    return "Increasing";
  } else if (latestScore < previousScore) {
    return "Decreasing";
  } else {
    return "Stable";
  }
}

function generateInsight(riskLevel: any, percentage: number, companyAveragePercentage: number, trend: any): string | null {
  // Implement insight generation logic based on risk level, percentage, company averages, and trends.
  // For simplicity, we're returning a placeholder value.
  return `Your risk of ${riskLevel?.toLowerCase()} is ${riskLevel?.toLowerCase()} with a ${trend?.toLowerCase()} trend.`;
}

// Sample usage
const assessmentData: Assessment = JSON.parse(`{ }`);  // Your provided assessment data goes here.
const historicalData: any = JSON.parse(`{}`);  // Historical data goes here.
const companyAverages: any = JSON.parse(`{}`);  // Company averages go here.
// const comprehensiveRiskProfile = generateComprehensiveRiskProfile(assessmentData, historicalData, companyAverages);
// console.log(JSON.stringify(comprehensiveRiskProfile, null, 2));

