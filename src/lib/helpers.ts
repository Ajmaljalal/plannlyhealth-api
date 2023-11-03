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

export const generateComprehensiveRiskProfile = (assessment: Assessment) => {
  const historicalData: Record<string, number[]> = {
    burnout: [],
    stress: [],
    turnover: [],
    workload: [],
    resources: []
  };
  const riskProfile: any = {
    user_id: assessment.user_id,
    company_id: assessment.company_id,
    user_job_title: assessment.user_job_title || null,
    user_department: assessment.user_department || null,
    user_birthday: assessment.user_birthday || null,
    user_marital_status: assessment.user_marital_status || null,
    user_gender: assessment.user_gender || null,
    assessment_date: new Date().toLocaleDateString(),
    detailed_breakdown: {
      burnout: {},
      stress: {},
      turnover: {},
      workload: {},
      resources: {}
    },
    risk_summary: {
      burnout: {},
      stress: {},
      turnover: {},
      workload: {},
      resources: {}
    },
    key_insights: [],
    historical_data: {
      burnout: [],
      stress: [],
      turnover: [],
      workload: [],
      resources: []
    }
  };

  const categories: Set<string> = new Set();
  const maxScores: { [key: string]: number } = {};

  assessment.answers.forEach(answer => {
    const categoryList = answer.category.split(',').map(cat => cat.trim()); // Split the category string and trim any whitespace
    categoryList.forEach(category => {
      categories.add(category);
      maxScores[category] = (maxScores[category] || 0) + Math.max(...Object.values(answer.scores) as any);
    });
  });

  categories.forEach(category => {
    // Filter responses where the category list contains the current category
    const responses = assessment.answers.filter(answer => {
      const categoryList = answer.category.split(',').map(cat => cat.trim());
      return categoryList.includes(category);
    });

    const score = responses.reduce((acc, answer) => acc + answer.scores[answer.selected_option], 0);
    const symptomsCount = responses.length;
    const percentage = calculateRiskPercentage(score, maxScores[category])
    const riskLevel = determineRiskLevel(percentage) || null;

    const trend = predictTrend(category, historicalData, percentage) || null

    riskProfile.detailed_breakdown[category] = {
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

    riskProfile.risk_summary[category] = {
      percentage: percentage,
      riskLevel: riskLevel
    };

    const insight = generateInsight(riskLevel, percentage, trend, category);
    if (insight) {
      riskProfile.key_insights.push(insight);
    }
  });

  // add new values to historical data 
  categories.forEach(category => {
    if (!historicalData[category]) {
      historicalData[category] = [];
    }
    const percentage = riskProfile.risk_summary[category].percentage;
    historicalData[category.toLowerCase().trim()].push(percentage);
  });

  riskProfile.historical_data = historicalData;

  return riskProfile;
}

export const updateComprehensiveRiskProfile = (assessment: Assessment, existingProfile: any) => {

  const riskProfile: any = existingProfile || {
    ...existingProfile,
    assessment_date: new Date(assessment.created_at).toLocaleDateString(),
    detailed_breakdown: existingProfile.detailed_breakdown || {
      burnout: {},
      stress: {},
      turnover: {},
      workload: {},
      resources: {}
    },
    risk_summary: existingProfile.risk_summary || {
      burnout: {},
      stress: {},
      turnover: {},
      workload: {},
      resources: {}
    },
    historical_data: existingProfile.historical_data || {
      burnout: [],
      stress: [],
      turnover: [],
      workload: [],
      resources: []
    },
    key_insights: []
  };

  const categories: Set<string> = new Set();
  const maxScores: { [key: string]: number } = {};

  assessment.answers.forEach(answer => {
    const categoryList = answer.category.split(',').map(cat => cat.trim()); // Split the category string and trim any whitespace
    categoryList.forEach(category => {
      categories.add(category);
      maxScores[category] = (maxScores[category] || 0) + Math.max(...Object.values(answer.scores) as any);
    });
  });

  categories.forEach(category => {
    // Filter responses where the category list contains the current category
    const responses = assessment.answers.filter(answer => {
      const categoryList = answer.category.split(',').map(cat => cat.trim());
      return categoryList.includes(category);
    });

    const score = responses.reduce((acc, answer) => acc + answer.scores[answer.selected_option], 0);
    const symptomsCount = responses.length;
    const percentage = calculateRiskPercentage(score, maxScores[category])
    const riskLevel = determineRiskLevel(percentage) || null;

    const trend = predictTrend(category, riskProfile.historical_data, percentage) || null

    riskProfile.detailed_breakdown[category] = {
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

    riskProfile.risk_summary[category] = {
      percentage: percentage,
      riskLevel: riskLevel
    };

    const insight = generateInsight(riskLevel, percentage, trend, category);
    if (insight) {
      riskProfile.key_insights.push(insight);
    }
  });

  // Update historical data
  categories.forEach(category => {
    const percentage = riskProfile.risk_summary[category].percentage;
    riskProfile.historical_data[category] = (riskProfile.historical_data[category] || []).concat(percentage);
  });

  return riskProfile;
}



function predictTrend(category: string, historicalData: Record<string, number[]>, currentScorePercentage: number): string {
  const categoryData = historicalData[category];
  if (!categoryData || categoryData.length < 1) {
    // Not enough data to determine a trend.
    return "Stable";
  }

  const latestScore = categoryData[categoryData.length - 1];

  if (currentScorePercentage > latestScore) {
    return "Increasing";
  } else if (currentScorePercentage < latestScore) {
    return "Decreasing";
  } else {
    return "Stable";
  }
}

function generateInsight(riskLevel: any, percentage: number, trend: any, category: string): string | null {
  return `Your risk of ${category.toLowerCase()} is ${riskLevel?.toLowerCase()} with a ${trend?.toLowerCase() || percentage} trend.`;
}

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
