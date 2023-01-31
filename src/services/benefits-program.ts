import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from 'uuid';
import db from "../configs/dynamodb";
import { BenefitsProgram } from "../lib/types/benefits-programs";

const TABLE_NAME = `benefits-programs_${process.env.DYNAMODB_TABLE_ENV}`;

export const createBenefitsProgramService = async (benefitsProgram: BenefitsProgram) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      ...benefitsProgram,
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

export const getBenefitsProgramByIdService = async (benefitsProgramId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: benefitsProgramId,
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getBenefitsProgramsByCompanyIdService = async (companyId: string) => {
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
    return result
  } catch (err) {
    return err;
  }
}

export const getAllBenefitsProgramsService = async () => {
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

export const updateBenefitsProgramService = async (benefitsProgramId: string, updates: BenefitsProgram) => {
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
      id: benefitsProgramId
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

export const deleteBenefitsProgramService = async (benefitsProgramId: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: benefitsProgramId
    }
  };
  try {
    const result = await db.delete(params).promise();
    return result
  } catch (err) {
    return err;
  }
}
