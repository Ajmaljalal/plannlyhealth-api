
export const baseline_questions: string[] = [
  'burnout_2',
  'burnout_1',
  'burnout_3',
  'burnout_7',
  'burnout_9',
  'burnout_48',
  'burnout_49',
  'burnout_16',
  'burnout_23',
  'burnout_41',
  'burnout_46',
  'burnout_4',
  'burnout_6',
  'burnout_45',
  'burnout_47',
]

export const burnout_questions_bank: any = {
  burnout_1: {
    question_id: 'burnout_1',
    question: "How often do you physically feel drained or tired due to your job?",
    options: ["Always", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Sometimes: 4, Rarely: 2, Never: 1 },
    category: "burnout, stress, workload"
  },
  burnout_2: {
    question_id: 'burnout_2',
    question: "How would you describe your overall physical and mental health in relation to your work?",
    options: ["Excellent", "Good", "Fair", "Poor"],
    scores: { Excellent: 1, Good: 2, Fair: 3, Poor: 4 },
    category: "burnout, stress, workload, turnover"
  },
  burnout_3: {
    question_id: 'burnout_3',
    question: "Do you frequently feel emotionally overwhelmed due to work?",
    options: ["Always", "Often", "Sometimes", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Never: 1 },
    category: "burnout, stress"
  },
  burnout_4: {
    question_id: 'burnout_4',
    question: "Do you currently feel burnt out due to your work or other factors?",
    options: ["Yes", "No", "Sometimes", "Not sure"],
    scores: { Yes: 5, No: 1, Sometimes: 4, "Not sure": 3 },
    category: "burnout, turnover"
  },
  burnout_5: {
    question_id: 'burnout_5',
    question: "How often do you feel disapointed or cynical about your job?",
    options: ["Always", "Often", "Sometimes", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Never: 1 },
    category: "burnout, turnover"
  },
  burnout_6: {
    question_id: 'burnout-6',
    question: "Can you identify specific reasons or triggers for your burnout?",
    options: [
      "Excessive workload and long work hours",
      "Lack of control or autonomy",
      "Not feeling valued, no recognition, low pay",
      "Factors outside work (e.g., family, health)",
      "Absence of fairness (e.g., favoritism, discrimination)",
      "Conflicting values with the employer",
      "Lack of support from coworkers or supervisors",
    ],
    scores: {
      "Excessive workload and long work hours": 5,
      "Lack of control or autonomy": 4,
      "Not feeling valued, no recognition, low pay": 5,
      "Factors outside work (e.g., family, health)": 5,
      "Absence of fairness (e.g., favoritism, discrimination)": 5,
      "Conflicting values with the employer": 4,
      "Lack of support from coworkers or supervisors": 4
    },
    category: "burnout"
  },
  burnout_7: {
    question_id: 'burnout_7',
    question: "How would you rate your current workload?",
    options: ["Low", "Moderate", "High", "Very high"],
    scores: { Low: 1, Moderate: 3, High: 4, "Very high": 5 },
    category: "workload, stress, burnout"
  },
  burnout_8: {
    question_id: 'burnout_8',
    question: "How would you describe your control over your tasks and decisions at work?",
    options: ["Complete control", "Some control", "Neutral", "Little control", "No control"],
    scores: { "Complete control": 1, "Some control": 2, Neutral: 3, "Little control": 4, "No control": 5 },
    category: "burnout"
  },
  burnout_9: {
    question_id: 'burnout_9',
    question: "Do you feel that your current workload is sustainable in the long term?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { Yes: 5, No: 1, Maybe: 4, "Not sure": 3 },
    category: "workload, stress, burnout"
  },
  burnout_10: {
    question_id: 'burnout_10',
    question: "Do you have the necessary resources and tools to manage your workload effectively?",
    options: ["Always", "Often", "Sometimes", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Never: 1 },
    category: "workload, stress, burnout"
  },
  burnout_11: {
    question_id: 'burnout_11',
    question: "How supported or understood do you feel by your colleagues?",
    options: ["Very supported", "Somewhat supported", "Neutral", "Not supported"],
    scores: { "Very supported": 1, "Somewhat supported": 2, Neutral: 3, "Not supported": 5 },
    category: "burnout"
  },
  burnout_12: {
    question_id: 'burnout_12',
    question: "How well do you think your team works together?",
    options: ["Very well", "Well", "Neutral", "Poorly", "Very poorly"],
    scores: { "Very well": 1, Well: 2, Neutral: 3, Poorly: 4, "Very poorly": 5 },
    category: "burnout"
  },
  burnout_13: {
    question_id: 'burnout_13',
    question: "Have you experienced conflicts or disagreements with colleagues recently?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { Yes: 5, No: 1, Maybe: 4, "Not sure": 3 },
    category: "burnout, stress"
  },
  burnout_14: {
    question_id: 'burnout_14',
    question: "Do you feel you have someone at work you can openly talk to about work-related issues?",
    options: ["Always", "Often", "Sometimes", "Never"],
    scores: { Yes: 5, No: 1, Sometimes: 3 },
    category: "burnout"
  },
  burnout_15: {
    question_id: 'burnout_15',
    question: "Have you recently experienced life changes that might be affecting your work in a negative way?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { Yes: 5, No: 1, Maybe: 4, "Not sure": 3 },
    categor: "burnout, stress"
  },
  burnout_16: {
    question_id: 'burnout_16',
    question: "How satisfied are you with your current pay scale?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
    scores: { "Very satisfied": 1, Satisfied: 2, Neutral: 3, Dissatisfied: 4, "Very dissatisfied": 5 },
    category: "burnout, turnover"
  },
  burnout_17: {
    question_id: 'burnout_17',
    question: "Have you ever felt discriminated against at work?",
    options: ["Yes", "No", "Occasionally", "Not sure"],
    scores: { Yes: 5, No: 1, Occasionally: 4, "Not sure": 3 },
    category: "burnout, stress, turnover"
  },
  burnout_18: {
    question_id: 'burnout_18',
    question: "How would you describe your work-life balance?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
    scores: { Excellent: 1, Good: 2, Fair: 3, Poor: 4, "Very poor": 5 },
    category: "burnout, stress, workload, turnover"
  },
  burnout_19: {
    question_id: 'burnout_19',
    question: "Have you considered looking for a new job in the past three months?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { Yes: 5, No: 1, Maybe: 4, "Not sure": 3 },
    category: "burnout, turnover"
  },
  burnout_20: {
    question_id: 'burnout_20',
    question: "How supported do you feel by your employer in terms of professional growth?",
    options: ["Very supported", "Somewhat supported", "Neutral", "Not supported"],
    scores: { "Very supported": 1, "Somewhat supported": 2, Neutral: 3, "Not supported": 5 },
    category: "burnout"
  },
  burnout_21: {
    question_id: 'burnout_21',
    question: "How often do you receive constructive feedback about your work?",
    options: ["Always", "Often", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Rarely: 2, Never: 1 },
    category: "burnout"
  },
  burnout_22: {
    question_id: 'burnout_22',
    question: "Do you believe that your employer values your contributions?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { "Yes": 1, No: 5, Maybe: 3, "Not sure": 2 },
    category: "burnout"
  },
  burnout_23: {
    question_id: 'burnout_23',
    question: "How often are you able to take breaks and rest during work?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "workload, stress, burnout"
  },
  burnout_24: {
    question_id: 'burnout_24',
    question: "Do you feel that your work environment is supportive to doing your best work?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 1, Often: 2, Sometimes: 3, Rarely: 4, Never: 5 },
    category: "burnout"
  },
  burnout_25: {
    question_id: 'burnout_25',
    question: "Do external factors financial or family obligations stress you in relation to your job?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { Yes: 5, No: 1, Maybe: 4, "Not sure": 3 },
    category: "burnout, stress"
  },
  burnout_26: {
    question_id: 'burnout_26',
    question: "Do you feel that your job role and responsibilities are clearly defined?",
    options: ["Always clear", "Often clear", "Sometimes clear", "Rarely clear", "Never clear"],
    scores: { "Always clear": 1, "Often clear": 2, "Sometimes clear": 3, "Rarely clear": 4, "Never clear": 5 },
    category: "burnout"
  },
  burnout_27: {
    question_id: 'burnout_27',
    question: "How often do you find yourself working outside of regular hours?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "workload, stress, burnout"
  },
  burnout_28: {
    question_id: 'burnout_28',
    question: "How do you perceive the overall morale among your colleagues?",
    options: ["Very high", "High", "Neutral", "Low", "Very low"],
    scores: { "Very high": 1, High: 2, Neutral: 3, Low: 4, "Very low": 5 },
    category: "burnout"
  },
  burnout_29: {
    question_id: 'burnout_29',
    question: "Have there been recent organizational changes that affect your work?",
    options: ["Yes, positively", "Yes, negatively", "No change", "Not aware of any"],
    scores: { "Yes, positively": 1, "Yes, negatively": 5, "No change": 1, "Not aware of any": 2 },
    category: "burnout"
  },
  burnout_30: {
    question_id: 'burnout_30',
    question: "Do you feel that you receive adequate training and resources to perform your job effectively?",
    options: ["Always adequate", "Often adequate", "Sometimes adequate", "Rarely adequate", "Never adequate"],
    scores: { "Always adequate": 1, "Often adequate": 2, "Sometimes adequate": 3, "Rarely adequate": 4, "Never adequate": 5 },
    category: "burnout"
  },
  burnout_31: {
    question_id: 'burnout_31',
    question: "How satisfied are you with the opportunities for professional development offered by your employer?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
    scores: { "Very satisfied": 1, Satisfied: 2, Neutral: 3, Dissatisfied: 4, "Very dissatisfied": 5 },
    category: "burnout"
  },
  burnout_32: {
    question_id: 'burnout_32',
    question: "Do you feel isolated or left out in your work environment?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "burnout"
  },
  burnout_33: {
    question_id: 'burnout_33',
    question: "How would you rate the quality of communication between you and your immediate supervisor?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
    scores: { Excellent: 1, Good: 2, Fair: 3, Poor: 4, "Very poor": 5 },
    category: "burnout, stress"
  },
  burnout_34: {
    question_id: 'burnout_34',
    question: "Do you have any concerns about job security?",
    options: ["Very concerned", "Concerned", "Neutral", "Not very concerned", "Not at all concerned"],
    scores: { "Very concerned": 5, Concerned: 4, Neutral: 3, "Not very concerned": 2, "Not at all concerned": 1 },
    category: "burnout, stress"
  },
  burnout_35: {
    question_id: 'burnout_35',
    question: "How often do you feel recognized and appreciated for your contributions at work?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "burnout"
  },
  burnout_36: {
    question_id: 'burnout_36',
    question: "Do you feel that patient care demands exceed the time you have available?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "workload, stress, burnout, turnover"
  },
  burnout_37: {
    question_id: 'burnout_37',
    question: "How frequently do you interact with patients who are emotionally challenging?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "burnout, stress, turnover"
  },
  burnout_38: {
    question_id: 'burnout_38',
    question: "Do you believe you have adequate support to handle the emotional aspects of patient care?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 1, Often: 2, Sometimes: 3, Rarely: 4, Never: 5 },
    category: "burnout"
  },
  burnout_39: {
    question_id: 'burnout_39',
    question: "How would you rate your workload compared to your colleagues in similar roles?",
    options: ["Much heavier", "Heavier", "Similar", "Lighter", "Much lighter"],
    scores: { "Much heavier": 5, Heavier: 4, Similar: 3, Lighter: 2, "Much lighter": 1 },
    category: "workload, stress, burnout"
  },
  burnout_40: {
    question_id: 'burnout_40',
    question: "How often do you feel that administrative tasks prevent you from spending adequate time with patients?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "workload, stress, burnout"
  },
  burnout_41: {
    question_id: 'burnout_41',
    question: "Are you concerned about making mistakes due to work load and stress?",
    options: ["Very concerned", "Concerned", "Neutral", "Not very concerned", "Not at all concerned"],
    scores: { "Very concerned": 5, Concerned: 4, Neutral: 3, "Not very concerned": 2, "Not at all concerned": 1 },
    category: "workload, stress, burnout, turnover"
  },
  burnout_42: {
    question_id: 'burnout_42',
    question: "Do you feel that the expectations placed on you are realistic and attainable?",
    options: ["Always realistic", "Often realistic", "Sometimes unrealistic", "Rarely realistic", "Never realistic"],
    scores: { "Always realistic": 1, "Often realistic": 2, "Sometimes unrealistic": 3, "Rarely realistic": 4, "Never realistic": 5 },
    category: "workload, stress, burnout"
  },
  burnout_43: {
    question_id: 'burnout_43',
    question: "How well do you think your employer addresses concerns regarding staff burnout?",
    options: ["Very effectively", "Effectively", "Neutral", "Ineffectively", "Very ineffectively"],
    scores: { "Very effectively": 1, Effectively: 2, Neutral: 3, Ineffectively: 4, "Very ineffectively": 5 },
    category: "burnout, turnover"
  },
  burnout_44: {
    question_id: 'burnout_44',
    question: "Have you ever skipped a break or meal due to the intensity of your workload?",
    options: ["Frequently", "Occasionally", "Rarely", "Never"],
    scores: { Frequently: 5, Occasionally: 4, Rarely: 3, Never: 1 },
    category: "workload, stress, burnout"
  },
  burnout_45: {
    question_id: 'burnout_45',
    question: "Are you thinking about leaving your current job due to burnout?",
    options: ["Yes", "No", "Maybe", "Not sure"],
    scores: { Yes: 5, No: 1, Maybe: 4, "Not sure": 3 },
    category: "burnout, turnover"
  },
  burnout_46: {
    question_id: 'burnout_46',
    question: "How would you rate your overall job satisfaction?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
    scores: { "Very satisfied": 1, Satisfied: 2, Neutral: 3, Dissatisfied: 4, "Very dissatisfied": 5 },
    category: "burnout, turnover"
  },
  burnout_47: {
    question_id: 'burnout_47',
    question: "How often do you think about quitting your job due to workload, stress or burnout?",
    options: ["Daily", "Weekly", "Monthly", "Never"],
    scores: { Daily: 5, Weekly: 4, Monthly: 3, Never: 1 },
    category: "burnout, turnover, stress, workload"
  },
  burnout_48: {
    question_id: 'burnout_48',
    question: "How often do you feel stressed?",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Rarely: 2, Never: 1 },
    category: "stress, burnout, turnover"
  },
  burnout_49: {
    question_id: 'burnout_49',
    question: "What is your current level of stress?",
    options: ["Very high", "High", "Neutral", "Low", "Very low"],
    scores: { "Very high": 5, High: 4, Neutral: 3, Low: 2, "Very low": 1 },
    category: "stress, burnout, turnover"
  }

}




