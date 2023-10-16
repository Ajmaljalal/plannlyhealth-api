import CryptoJS from 'crypto-js';
import { burnout_questions_bank, baseline_questions, burnout_questions_options } from './assessment/questions_bank';
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
      question.options = burnout_questions_options[questionId];
      questions.push(question);
      id++;
    }
  }

  return questions;
}