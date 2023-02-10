export enum AddOns {
  'HRIS Integration',
  'Slack Integration',
  'Single Sign-On (SSO)',
  'Domain Whitelisting',
  'Dedicated Wellness Coordinator',
  'Broker (partner) Portal',
}

export enum Frequency {
  'One Time',
  Monthly,
  Quarterly,
  Yearly
}

export enum Options {
  Activate,
  Deactivate,
  Edit
}

export enum ProgramModel {
  Allotment,
  Allowance,
  'Both Programs'
}

export enum ClaimStatus {
  requested,
  approved,
  rejected
}

export enum Department {
  Sales,
  Marketing,
  Finance,
  Operations,
  'Human Resources',
  IT,
  Support,
}

export enum NotificationType {
  'Claim Status',
  Comment,
}

export enum OptionsClaim {
  Approve,
  'Approve All',
  Decline,
  Delete,
  Details,
  Edit
}

export enum OptionsComment {
  Delete,
  Edit
}

export enum PaymentSchedule {
  Annually,
  Monthly,
}

export enum RefundStatus {
  Failed,
  Success,
}

export enum Role {
  Admin,
  Finance,
  Standard,
  Owner,
  'Super Admin',
}

export enum UserAccountStatus {
  Active,
  Invited,
  Deactivated,
}


export enum SubscriptionStatus {
  Pending,
  Approved,
  Rejected
}

// An enum list of all aws dynamodb error codes
export enum AWS_DYNAMODB_ERROR_CODES {
  ConditionalCheckFailedException = 'ConditionalCheckFailedException',
  ProvisionedThroughputExceededException = 'ProvisionedThroughputExceededException',
  ResourceNotFoundException = 'ResourceNotFoundException',
  ItemCollectionSizeLimitExceededException = 'ItemCollectionSizeLimitExceededException',
  TransactionConflictException = 'TransactionConflictException',
  RequestLimitExceeded = 'RequestLimitExceeded',
  ThrottlingException = 'ThrottlingException',
  InternalServerError = 'InternalServerError',
  ServiceUnavailable = 'ServiceUnavailable',
  UnrecognizedClientException = 'UnrecognizedClientException',
  AccessDeniedException = 'AccessDeniedException',
  ExpiredTokenException = 'ExpiredTokenException',
  InvalidSignatureException = 'InvalidSignatureException'
}










