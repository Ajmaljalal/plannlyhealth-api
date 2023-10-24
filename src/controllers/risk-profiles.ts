import { generateRiskProfile } from "../lib/helpers";
import { RiskProfile } from "../lib/types/assessment";
import { createRiskProfileService } from "../services/risk-profile";


export const createRiskProfile = async (req: Request, res: any) => {
  const assessment: any = req.body;

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
      return res.status(response.statusCode).json({
        message: response.message,
        code: response.code,
      });
    } else {
      return res.status(201).json(response.Item);
    }
  } catch (err: any) {
    return res.status(500).json({
      message: err.message,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}