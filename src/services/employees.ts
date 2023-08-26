import { DocumentClient } from "aws-sdk/clients/dynamodb";
import db from "../configs/aws";
import { Employee } from "../models/employee";

const TABLE_NAME = `employees`;

export const createEmployeeService = async (employee: any) => {
  const params: DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: employee
  };
  try {
    const result = await db.put(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getEmployeeByIdService = async (employeeId: string) => {
  const params: DocumentClient.GetItemInput = {
    TableName: TABLE_NAME,
    Key: {
      id: employeeId
    }
  };
  try {
    const result = await db.get(params).promise();
    return result
  } catch (err) {
    return err;
  }
}

export const getEmployeeByEmailService = async (email: string) => {
  const params: DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    IndexName: 'email-index',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };
  try {
    const result = await db.query(params).promise();
    return result.Items
  } catch (err) {
    return err;
  }
}

export const getEmployeesByCompanyIdService = async (companyId: string) => {
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


export const getAllEmployeesService = async () => {
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

export async function updateEmployeeService(id: string, updates: Partial<Employee>) {
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

export async function deleteEmployeeService(id: string) {
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