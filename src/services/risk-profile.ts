import { addDoc, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../configs/firebase";
import { RiskProfile } from "../lib/types/risk-profile";


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

export const getRiskProfileService = async (userId: string) => {
  try {
    const q = query(
      collection(db, RISK_PROFILE_TABLE_NAME),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No risk profile found for employee with ID: ${userId}`);
      return null;
    } else {
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error('ERROR: ', error)
    return error
  }
}

export const updateRiskProfileService = async (userId: string, data: any) => {
  try {
    const q = query(
      collection(db, RISK_PROFILE_TABLE_NAME),
      where('user_id', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No risk profile found for employee with ID: ${userId}`);
      return null;
    } else {
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, RISK_PROFILE_TABLE_NAME, docId);
      await updateDoc(docRef, data);
      return data;
    }
  } catch (error) {
    console.error('ERROR: ', error);
    return error;
  }
}