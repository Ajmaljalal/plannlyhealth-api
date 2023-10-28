import { DocumentClient } from "aws-sdk/clients/dynamodb";
import dynamobDB from "../configs/aws";
import { Assessment } from "../models/assessments";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../configs/firebase";

const TABLE_NAME = 'assessments'
const ASSESSMENTS_PROGRESS_TABLE_NAME = 'assessments-progress';


export const createAssessmentService = async (assessment: Assessment) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: assessment,
  };
  try {
    const result = await dynamobDB.put(params).promise();
    return result
  } catch (err) {
    return err;
  }
};

export const getAssessmentByIdService = async (id: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  try {
    const result = await dynamobDB.get(params).promise();
    return result.Item;
  } catch (err) {
    return err;
  }
}

export const getAssessmentsByCompanyIdService = async (companyId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'company_id-index',
    KeyConditionExpression: 'company_id = :company_id',
    ExpressionAttributeValues: {
      ':company_id': companyId
    }
  };
  try {
    const result = await dynamobDB.query(params).promise();
    return result.Items
  } catch (err) {
    return err;
  }
}

export const getAssessmentsByUserIdService = async (userId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'user_id-index',
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: {
      ':user_id': userId
    }
  };
  try {
    const result: any = await dynamobDB.query(params).promise();
    return result.Items
  } catch (err) {
    return err;
  }
}

export const updateAssessmentService = async (id: string, updates: Partial<Assessment>) => {
  // Create UpdateExpression and ExpressionAttributeValues based on the updates provided
  const UpdateExpression = 'SET ' + Object.keys(updates).map((key, i) => {
    return `#${key} = :${key}`;
  }).join(', ');

  const ExpressionAttributeNames: any = {};
  Object.keys(updates).forEach((key, i) => {
    ExpressionAttributeNames[`#${key}`] = key;
  });

  const ExpressionAttributeValues: any = {};
  Object.keys(updates).forEach((key, i) => {
    // @ts-ignore
    ExpressionAttributeValues[`:${key}`] = updates[key];
  });

  const params: DocumentClient.UpdateItemInput = {
    TableName: TABLE_NAME,
    Key: { id: id },
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamobDB.update(params).promise();
    return result;
  } catch (err) {
    return err;
  }
}

export const createAssessmentProgressTrackerService = async (assessmentProgress: any) => {
  try {
    const collectionRef = collection(db, ASSESSMENTS_PROGRESS_TABLE_NAME);
    const docRef = await addDoc(collectionRef, assessmentProgress);
    return docRef
  } catch (error) {
    console.error('ERROR: ', error)
    return error
  }
}

export const getAssessmentProgressTrackerService = async (employeeId: string) => {
  try {
    const q = query(
      collection(db, ASSESSMENTS_PROGRESS_TABLE_NAME),
      where('user_id', '==', employeeId)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No assessment progress found for employee with ID: ${employeeId}`);
      return null;
    } else {
      return querySnapshot.docs[0].data();
    }
  } catch (error) {
    console.error('ERROR: ', error);
    return error;
  }
}

export const updateAssessmentProgressTrackerService = async (user_id: string, data: any) => {
  try {
    const q = query(
      collection(db, ASSESSMENTS_PROGRESS_TABLE_NAME),
      where('user_id', '==', user_id)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log(`No assessment progress found for employee with ID: ${user_id}`);
      return null;
    } else {
      const docId = querySnapshot.docs[0].id;
      const docRef = doc(db, ASSESSMENTS_PROGRESS_TABLE_NAME, docId);
      await updateDoc(docRef, data);
      return data;
    }
  } catch (error) {
    console.error('ERROR: ', error);
    return error;
  }
}