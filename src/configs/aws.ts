import AWS from 'aws-sdk';
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});


const db = new DocumentClient({ region: 'us-west-2', ...config });

export default db;