import { addDoc, collection } from "firebase/firestore";
import { db } from "../configs/firebase";
import { RiskProfile } from "../lib/types/assessment";


const TABLE_NAME = `risk-profiles`;

export const createRiskProfileService = async (riskProfile: RiskProfile) => {
  try {
    const collectionRef = collection(db, TABLE_NAME);
    const docRef = await addDoc(collectionRef, riskProfile);
    return docRef
  } catch (err) {
    return err
  }
}