import AWS from 'aws-sdk';
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// AWS Config
const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const db = new DocumentClient({ region: 'us-west-2', ...config });
export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
export default db;