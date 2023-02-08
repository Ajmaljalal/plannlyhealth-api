import { DocumentClient } from "aws-sdk/clients/dynamodb";
import db from "../configs/dynamodb";
import { v4 as uuid } from 'uuid';
import { Comment } from "../models/comment";

const TABLE_NAME = `comments_${process.env.DYNAMODB_TABLE_ENV}`;

export const createCommentService = async (comment: Comment) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: {
      ...comment,
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

export const getCommentByIdService = async (commentId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: commentId,
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getCommentByClaimIdService = async (claimId: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'claim_id-index',
    KeyConditionExpression: 'claim_id = :claim_id',
    ExpressionAttributeValues: {
      ':claim_id': claimId
    }
  };
  try {
    const result = db.query(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getAllCommentService = async () => {
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

export const updateCommentService = async (commentId: string, updates: Comment) => {
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
      id: commentId
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

export const deleteCommentService = async (commentId: string) => {
  const params: DocumentClient.DeleteItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: commentId
    }
  };
  try {
    const result = await db.delete(params).promise();
    return result
  } catch (err) {
    return err;
  }
}