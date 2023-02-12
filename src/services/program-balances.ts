import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ProgramBalance } from "../models/program-balance";
import db from "../configs/aws";

const TABLE_NAME = `program-balances_${process.env.DYNAMODB_TABLE_ENV}`;

export const createProgramBalanceService = async (programBalance: ProgramBalance) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: programBalance
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

export const getProgramBalancesByProgramIdService = async (programId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'benefit_program_id-index',
    KeyConditionExpression: 'benefit_program_id = :benefit_program_id',
    ExpressionAttributeValues: {
      ':benefit_program_id': programId
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getProgramBalancesByCompanyIdService = async (companyId: string) => {
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

export const getProgramBalancesByBeneficiaryService = async (beneficiaryId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'beneficiary_id-index',
    KeyConditionExpression: 'beneficiary_id = :beneficiary_id',
    ExpressionAttributeValues: {
      ':beneficiary_id': beneficiaryId
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getAllProgramBalancesService = async () => {
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