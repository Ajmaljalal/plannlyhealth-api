const AWS = require('aws-sdk');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

let cognitoAttributeList: typeof AmazonCognitoIdentity = [];

const poolData = {
  UserPoolId: process.env.AWS_USER_POOL_ID,
  ClientId: process.env.AWS_APP_CLIENT_ID,
  AutoVerifiedAttributes: ['email']
};


function setCognitoAttributeList(attributeList: any) {

  Object.keys(attributeList).forEach((key: string, idx: number) => {
    cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: key, Value: attributeList[key] }));
  });
}

function getCognitoAttributeList() {
  return cognitoAttributeList;
}

function getCognitoUser(email: string) {
  const userData = {
    Username: email,
    Pool: getUserPool()
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData)
}

function getAuthDetails(email: string, password: string) {
  var authenticationData = {
    Username: email,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function initAWS(region = process.env.APP_AWS_REGION, identityPoolId = process.env.AWS_IDENTITY_POOL_ID) {
  AWS.config.region = region; // Region
  AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY,
    AWS.config.secretAccessKey = process.env.AWS_SECRET_KEY,
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
    });
}

export const AwsConfig = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
}