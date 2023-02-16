import { DocumentClient } from "aws-sdk/clients/dynamodb";
import db from "../configs/aws";
import { Company } from "../lib/types/company";

const TABLE_NAME = `companies_${process.env.DYNAMODB_TABLE_ENV}`;

export const createCompanyService = async (company: Company) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: company
  };
  try {
    const result = await db.put(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getCompanyByIdService = async (companyId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: companyId
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}


export const getAllCompaniesService = async () => {
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


export async function updateCompanyService(id: string, updates: Partial<Company>) {
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

export async function deleteCompanyService(id: string) {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: { id: id },
  };

  try {
    const result = await db.delete(params).promise();
    return result;
  } catch (err) {
    return err;
  }
}

