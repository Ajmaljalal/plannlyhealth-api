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
  };


  for (const answer of assessment.answers) {
    const question = general_questions_bank[answer.question_id];
    if (!question) continue; // Skip if question not found in bank

    const scoreValue = question.scores[answer.selected_option];

    const categories = question.category.split(', ');

    for (const category of categories) {
      if (scores[category] !== undefined) {
        scores[category].score += scoreValue;
        scores[category].symptoms_count++;
      }
    }
  }

  // Normalize the scores to ensure they do not exceed 100
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

