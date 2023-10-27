import { DocumentClient } from "aws-sdk/clients/dynamodb";
import dynamobDB from "../configs/aws";
import { Assessment } from "../models/assessments";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../configs/firebase";

const TABLE_NAME = `assessments`
const ASSESSMENTS_PROGRESS_TABLE_NAME = `assessments-progress`;


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


export const createAssessmentProgressService = async (assessmentProgress: any) => {
  try {
    const collectionRef = collection(db, ASSESSMENTS_PROGRESS_TABLE_NAME);
    const docRef = await addDoc(collectionRef, assessmentProgress);
    return docRef
  } catch (error) {
    console.error('ERROR: ', error)
    return error
  }
}

export const getAssessmentProgressService = async (employeeId: string) => {
  try {
    const docRef = doc(db, ASSESSMENTS_PROGRESS_TABLE_NAME, employeeId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      console.log(`No assessment progress found for employee with ID: ${employeeId}`);
      return null;
    } else {
      return snapshot.data();
    }
  } catch (error) {
    console.error('ERROR: ', error);
    return error;
  }
}