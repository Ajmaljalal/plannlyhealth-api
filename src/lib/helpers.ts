import CryptoJS from 'crypto-js';
import { burnout_questions_bank, baseline_questions } from './assessment/questions_bank';
import { Question } from './types/assessment';

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
    const question = burnout_questions_bank[questionId];
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
    const question = burnout_questions_bank[answer.question_id];
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