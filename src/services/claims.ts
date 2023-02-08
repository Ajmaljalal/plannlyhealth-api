import { DocumentClient } from "aws-sdk/clients/dynamodb";
import db from "../configs/dynamodb";
import { v4 as uuid } from 'uuid';
import { Claim } from "../models/claim";

const TABLE_NAME = `claims_${process.env.DYNAMODB_TABLE_ENV}`;

export const createClaimService = async (claim: Claim) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      ...claim,
      id: uuid()
    }
  };
  try {
    const result = await db.put(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getClaimByIdService = async (claimId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: claimId,
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getClaimByCompanyIdService = async (companyId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'company_id-index',
    KeyConditionExpression: 'company_id = :company_id',
    ExpressionAttributeValues: {
      ':company_id': companyId
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getAllClaimService = async () => {
  const params: DocumentClient.ScanInput = {
    TableName: TABLE_NAME
  };
  try {
    const result = db.scan(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const updateClaimService = async (claimId: string, updates: Claim) => {
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
    Key: {
      id: claimId
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  };
  try {
    const result = await db.update(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const deleteClaimService = async (claimId: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: claimId
    }
  };
  try {
    const result = await db.delete(params).promise();
    return result
  } catch (err) {
    return err;
  }
}