import { addDoc, collection } from "firebase/firestore";
import { db } from "../configs/firebase";
import { RiskProfile } from "../lib/types/assessment";


const RISK_PROFILE_TABLE_NAME = `risk-profiles`;

export const createRiskProfileService = async (riskProfile: RiskProfile) => {
  try {
    const collectionRef = collection(db, RISK_PROFILE_TABLE_NAME);
    const docRef = await addDoc(collectionRef, riskProfile);
    return docRef
  } catch (error) {
    console.error('ERROR: ', error)
    return error
  }
}