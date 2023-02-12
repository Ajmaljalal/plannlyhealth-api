import { DocumentClient } from "aws-sdk/clients/dynamodb";
import db from "../configs/aws";
import { User } from "../lib/types/user";

const TABLE_NAME = `new-users_${process.env.DYNAMODB_TABLE_ENV}`;


export const createNewUserService = async (user: User) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: user
  };
  try {
    const result = await db.put(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getNewUserByIdService = async (userId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: userId,
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getNewUserByEmailService = async (email: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getNewUsersByCompanyIdService = async (companyId: string) => {
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

export const getNewUserByFirstNameService = async (firstName: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'first_name-index',
    KeyConditionExpression: 'first_name = :first_name',
    ExpressionAttributeValues: {
      ':first_name': firstName
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getNewUserByLastNameService = async (lastName: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'last_name-index',
    KeyConditionExpression: 'last_name = :last_name',
    ExpressionAttributeValues: {
      ':last_name': lastName
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const updateNewUserService = async (userId: string, updates: User) => {
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
      id: userId
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

export const deleteNewUserService = async (userId: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: userId
    }
  };
  try {
    const result = await db.delete(params).promise();
    return result
  } catch (err) {
    return err;
  }
}
