import { determineRiskLevel } from './helpers';
import { DemographicRiskLevel, RiskProfile, RiskTrendCounters } from './types/risk-profile';

export const calculateUpdatedOverallCompanyRiskScore = (
  existingOverallRiskScore: number, // Current overall risk score
  existingNumberOfProfiles: number, // Number of profiles that contributed to the existing overall risk score
  newUserRiskProfile: RiskProfile // New user risk profile
): number => {
  // Calculate total risk percentage from the new user profile
  let newUserTotalRiskPercentage =
    newUserRiskProfile.risk_summary.workload.percentage +
    newUserRiskProfile.risk_summary.stress.percentage +
    newUserRiskProfile.risk_summary.burnout.percentage +
    newUserRiskProfile.risk_summary.turnover.percentage +
    newUserRiskProfile.risk_summary.resources.percentage;

  // Calculate average risk percentage for the new profile
  let newUserAverageRisk = newUserTotalRiskPercentage / Object.keys(newUserRiskProfile.risk_summary).length;

  // Calculate updated overall risk score by weighting the existing score and the new profile
  let totalNumberOfProfiles = existingNumberOfProfiles + 1;
  let updatedOverallRiskScore = ((existingOverallRiskScore * existingNumberOfProfiles) + newUserAverageRisk) / totalNumberOfProfiles;

  // Return updated average as a percentage (you can round it if necessary)
  return Math.round(updatedOverallRiskScore);
}


export const updateRiskTrends = (
  riskTrendCounters: { [riskCategory: string]: RiskTrendCounters },
  userRiskProfile: RiskProfile
): { [riskCategory: string]: RiskTrendCounters } => {
  let updatedRiskTrendCounters: { [riskCategory: string]: RiskTrendCounters } = { ...riskTrendCounters };

  for (const [riskCategory, riskData] of Object.entries(userRiskProfile.risk_summary)) {
    let newUserRiskTrend = riskData.riskLevel;

    // Initialize counters if not already present
    if (!updatedRiskTrendCounters[riskCategory]) {
      updatedRiskTrendCounters[riskCategory] = { increasing: 0, stable: 0, decreasing: 0 };
    }

    // Determine the trend based on comparison and update counters
    if (newUserRiskTrend === 'Increasing') {
      updatedRiskTrendCounters[riskCategory].increasing += 1;
    } else if (newUserRiskTrend === 'Decreasing') {
      updatedRiskTrendCounters[riskCategory].decreasing += 1;
    } else {
      updatedRiskTrendCounters[riskCategory].stable += 1;
    }
  }
  return updatedRiskTrendCounters;
}


export const updateDemographicRiskLevel = (
  demographicRiskLevel: DemographicRiskLevel,
  category: string,
  userRiskProfile: RiskProfile
) => {
  // Check if the category exists, if not, initialize
  let newDemographicRiskLevel = { ...demographicRiskLevel };
  if (!newDemographicRiskLevel[category]) {
    newDemographicRiskLevel[category] = {};
  }

  for (const [riskCategory, riskData] of Object.entries(userRiskProfile.risk_summary)) {
    // Check if the risk category exists within the demographic category, if not, initialize
    if (!newDemographicRiskLevel[category][riskCategory]) {
      newDemographicRiskLevel[category][riskCategory] = { averageRiskScore: 0, numberOfUsers: 0, riskLevel: 'Low' };
    }

    // Calculating the new average first
    newDemographicRiskLevel[category][riskCategory].averageRiskScore =
      ((newDemographicRiskLevel[category][riskCategory].averageRiskScore * newDemographicRiskLevel[category][riskCategory].numberOfUsers) +
        riskData.percentage) / (newDemographicRiskLevel[category][riskCategory].numberOfUsers + 1);

    // Then incrementing the user count for the demographic category
    newDemographicRiskLevel[category][riskCategory].numberOfUsers += 1;

    // Update the risk level based on the new average risk score
    newDemographicRiskLevel[category][riskCategory].riskLevel = determineRiskLevel(newDemographicRiskLevel[category][riskCategory].averageRiskScore);
  }
  return newDemographicRiskLevel;
}