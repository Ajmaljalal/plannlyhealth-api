import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Document } from "../models/document";
import db from "../configs/dynamodb";

const TABLE_NAME = `documents_${process.env.DYNAMODB_TABLE_ENV}`;

export const createDocumentService = async (document: Document) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: document
  };
  try {
    const result = await db.put(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getDocumentByIdService = async (documentId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: documentId,
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getDocumentsByCompanyIdService = async (companyId: string) => {
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

export const getAllDocumentsService = async () => {
  const params: DocumentClient.ScanInput = {
    TableName: TABLE_NAME,
  };
  try {
    const result = db.scan(params).promise();
    return result
  } catch (err) {
    return err;
  }
}


export const getDocumentsByOwnerIdService = async (ownerId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'owner-index',
    ExpressionAttributeNames: {
      '#owner': 'owner'
    },
    KeyConditionExpression: '#owner = :owner',
    ExpressionAttributeValues: {
      ':owner': ownerId
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const updateDocumentService = async (documentId: string, updates: Partial<Document>) => {
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
      id: documentId,
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

export const deleteDocumentService = async (documentId: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: documentId
    }
  };
  try {
    const result = await db.delete(params).promise();
    return result
  } catch (err) {
    return err;
  }
}
