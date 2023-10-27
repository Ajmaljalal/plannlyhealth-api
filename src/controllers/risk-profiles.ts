import AWS from "aws-sdk";
import { generateRiskProfile } from "../lib/helpers";
import { RiskProfile } from "../lib/types/assessment";
import { createRiskProfileService, } from "../services/risk-profile";
import { Assessment } from "../models/assessments";

export const createRiskProfile = async (req: any, res: any) => {
  const dynamoDBAssessment: any = req.body;
  const assessment = AWS.DynamoDB.Converter.unmarshall(dynamoDBAssessment) as Assessment;

  if (!assessment) {
    return res.status(400).json({
      message: 'INVALID_REQUEST_BODY',
      code: 'BAD_REQUEST',
    });
  }

  const riskProfile: RiskProfile = generateRiskProfile(assessment)

  try {
    const response: any = await createRiskProfileService(riskProfile);

    if (response.code) {
      console.log('ERROR: ', response)
      return res.status(response.statusCode || 400).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(201).json(response.Item);
    }
  } catch (err: any) {
    console.log('ERROR: ', err)
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}