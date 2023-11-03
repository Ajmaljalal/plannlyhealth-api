import AWS from "aws-sdk";
import { generateComprehensiveRiskProfile, updateComprehensiveRiskProfile } from "../lib/helpers";
import { RiskProfile } from "../lib/types/assessment";
import { createRiskProfileService, getRiskProfileService, updateRiskProfileService, } from "../services/risk-profile";
import { Assessment } from "../models/assessments";

const riskProfileGenerators = {
  update: updateComprehensiveRiskProfile,
  create: generateComprehensiveRiskProfile,
  updateService: updateRiskProfileService,
  createService: createRiskProfileService,
}

export const createRiskProfile = async (req: any, res: any) => {
  const dynamoDBAssessment: any = req.body;
  const assessment = AWS.DynamoDB.Converter.unmarshall(dynamoDBAssessment) as Assessment;

  if (!assessment) {
    return res.status(400).json({
      message: 'INVALID_REQUEST_BODY',
      code: 'BAD_REQUEST',
    });
  }

  try {
    const oldRiskProfile = await getRiskProfileService(assessment.user_id);
    let newRiskProfile: RiskProfile;
    let response: any;

    if (oldRiskProfile) {
      newRiskProfile = riskProfileGenerators.update(assessment, oldRiskProfile);
    } else {
      newRiskProfile = riskProfileGenerators.create(assessment);
    }

    response = await riskProfileGenerators.createService(newRiskProfile);

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