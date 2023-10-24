import { DocumentClient } from "aws-sdk/clients/dynamodb";
import db from "../configs/aws";
import { Assessment } from "../models/assessments";

const TABLE_NAME = `assessments`;

export const createAssessmentService = async (assessment: Assessment) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: assessment,
  };
  try {
    const result = await db.put(params).promise();
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
    const result = await db.get(params).promise();
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
    const result = await db.query(params).promise();
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
    const result: any = await db.query(params).promise();
    return result.Items
  } catch (err) {
    return err;
  }
}

export async function updateAssessmentService(id: string, updates: Partial<Assessment>) {
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
    const result = await db.update(params).promise();
    return result;
  } catch (err) {
    return err;
  }
}