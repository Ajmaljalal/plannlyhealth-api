import aiplatform, { helpers } from '@google-cloud/aiplatform';
import { getRiskProfileService } from '../../services/risk-profile';

const examples = [
  {
    id: 1,
    question_id: 'burnout_5',
    question: "How often do you feel disapointed or cynical about your job?",
    options: ["Always", "Often", "Sometimes", "Never"],
    scores: { Always: 5, Often: 4, Sometimes: 3, Never: 0 },
    category: "burnout"
  },
  {
    id: 2,
    question_id: 'turnover_2',
    question: "Are you satisfied with the opportunities for professional growth and advancement?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
    scores: { "Very satisfied": 0, "Satisfied": 1, "Neutral": 3, "Dissatisfied": 4, "Very dissatisfied": 5 },
    category: "turnover"
  },
  {
    id: 3,
    question_id: 'workload_1',
    question: "How would you rate your current workload?",
    options: ["Low", "Moderate", "High", "Very high"],
    scores: { Low: 0, Moderate: 2, High: 4, "Very high": 5 },
    category: "workload"
  },
]


const project = 'plannly-health';
const location = 'plann.ly';

// Imports the Google Cloud Prediction service client
const { PredictionServiceClient } = aiplatform.v1;

const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};

const publisher = 'google';
const model = 'text-bison-32k';

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);;



function constructPrompt(examples: any, riskProfileIndicators: any, keyAreasOfRisk: any) {
  return {
    prompt: `You are a sophisticated question generator bot. Your goal is to generate 7 unique and diverse questions based on the user's risk profile indicators and key areas of risk. Each question should be distinct in structure and tailored to the user's specific situation. Avoid repetitive phrasings and response options. Use a variety of question formats including frequency-based, scale-based, binary (yes/no), and multiple-choice. Tailor the response options to fit the context of each question appropriately. The questions should be an array of objects with fields: id as number, question_id as a string, question as a string, options as an array of strings, scores as an object with key:string and value:number, and a category as a string. Refer to the examples of questions for the format. Each question can have a positive or negative effect on the user's risk profile indicators, so ensure the score reflects this properly. For instance, a question like "Do you have the resources you need to do your job effectively?" should have scores from Never:5 to Always:0, whereas a question like "How frequently do you find yourself working overtime?" should have scores from Never:0 to Always:5.

    ## Examples:
      ${JSON.stringify(examples)}

    ## User risk profile indicators:
      * Burnout: ${riskProfileIndicators.burnout}
      * Stress: ${riskProfileIndicators.stress}
      * Workload: ${riskProfileIndicators.workload}
      * Resources: ${riskProfileIndicators.resources}
      * Turnover: ${riskProfileIndicators.turnover}

    ## Key areas of risk:
      ${keyAreasOfRisk}

    ## Questions:
    `,
  };
}

const getRiskProfileIndicators = (riskProfile: any) => {
  if (!riskProfile) return
  let riskProfileIndicators: any = {};
  riskProfileIndicators.burnout = riskProfile.risk_summary.burnout;
  riskProfileIndicators.stress = riskProfile.risk_summary.stress;
  riskProfileIndicators.workload = riskProfile.risk_summary.workload;
  riskProfileIndicators.resources = riskProfile.risk_summary.resources;
  riskProfileIndicators.turnover = riskProfile.risk_summary.turnover;
  return riskProfileIndicators;
}

const getKeyRiskAreas = (riskProfile: any) => {
  if (!riskProfile) return
  let keyAreasOfRisk: any = [];
  let riskSummary = riskProfile.risk_summary;
  // return the top 3 risk areas
  let sortedRiskSummary = Object.keys(riskSummary).sort(function (a, b) { return riskSummary[b] - riskSummary[a] });
  for (let i = 0; i < 5; i++) {
    keyAreasOfRisk.push(sortedRiskSummary[i]);
  }
  return keyAreasOfRisk;
}

// Helper function to parse and clean the response string
function cleanAndParseResponse(answer: any) {
  if (!answer) return [];

  answer = answer.replace(/'\n'\s*\+\s*'/g, '').trim();

  try {
    return JSON.parse(answer);
  } catch (error) {
    console.error('Parsing error:', error);
    return [];
  }
}

// The main function to call predict
export async function callPredict(userId: string) {
  const riskProfile = await getRiskProfileService(userId)
  const riskProfileIndicators = getRiskProfileIndicators(riskProfile);
  const keyAreasOfRisk = getKeyRiskAreas(riskProfile);
  try {
    // Configure the parent resource
    const endpoint = `projects/${project}/locations/${location}/publishers/${publisher}/models/${model}`;

    const prompt = constructPrompt(examples, riskProfileIndicators, keyAreasOfRisk);

    const instanceValue = helpers.toValue(prompt);
    const instances = [instanceValue];

    const parameter = {
      temperature: 0.5,
      maxOutputTokens: 1500,
      topP: 0.95,
      topK: 40,
    };
    const parameters = helpers.toValue(parameter);

    const request: any = {
      endpoint,
      instances,
      parameters,
    };

    // Predict request
    const [response] = await predictionServiceClient.predict(request);
    // @ts-ignore
    let answer = response && response.predictions[0]?.structValue?.fields.content.stringValue;

    // Clean and parse the response
    return cleanAndParseResponse(answer);
  } catch (error) {
    console.error('Error in callPredict:', error);
    return [];
  }
}