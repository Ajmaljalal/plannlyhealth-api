import AWS from 'aws-sdk';
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// AWS Config
const config = new AWS.Config({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string
  },
});

const db = new DocumentClient({ region: process.env.AWS_REGION, ...config });
export const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: process.env.AWS_REGION, ...config });
export default db;