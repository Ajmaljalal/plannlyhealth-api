
const AWS = require('aws-sdk');

const configs = {
    accessKeyId: 'YOUR_ACCESS_KEY',
    secretAccessKey: 'YOUR_SECRET_KEY',
    region: 'REGION'
}

AWS.config.update({
  accessKeyId: 'YOUR_ACCESS_KEY',
  secretAccessKey: 'YOUR_SECRET_KEY',
  region: 'REGION'
});

const dynamodb = new AWS.DynamoDB().documentClient();

module.exports = dynamodb;