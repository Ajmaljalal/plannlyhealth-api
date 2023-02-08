import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ProgramBalance } from "../models/program-balance";
import db from "../configs/dynamodb";
import { v4 as uuid } from 'uuid';

const TABLE_NAME = `program-balance_${process.env.DYNAMODB_TABLE_ENV}`;

export const createProgramBalanceService = async (programBalance: ProgramBalance) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      ...programBalance,
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

export const getProgramBalanceByIdService = async (programBalanceId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: programBalanceId,
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getProgramBalanceByProgramIdService = async (programId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'benefit_program-index',
    KeyConditionExpression: 'benefit_program = :benefit_program',
    ExpressionAttributeValues: {
      ':benefit_program': programId
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}


export const getProgramBalanceByCompanyIdService = async (companyId: string) => {
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

export const getAllProgramBalanceService = async () => {
  const params: DocumentClient.ScanInput = {
    TableName: TABLE_NAME
  };
  try {
    const result = await db.scan(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const updateProgramBalanceService = async (programBalanceId: string, updates: ProgramBalance) => {
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
      id: programBalanceId
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

export const deleteProgramBalanceService = async (programBalanceId: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: programBalanceId
    }
  };
  try {
    const result = await db.delete(params).promise();
    return result
  } catch (err) {
    return err;
  }
}