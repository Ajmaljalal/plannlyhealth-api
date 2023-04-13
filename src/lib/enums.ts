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

export enum ProgramAccess {
  limited = 'limited',
  unlimited = 'unlimited',
}

export enum ClaimStatus {
  requested = 'requested',
  approved = 'approved',
  rejected = 'rejected',
}

export enum Department {
  sales = 'sales',
  marketing = 'marketing',
  finance = 'finance',
  operations = 'operations',
  'human resources' = 'human resources',
  it = 'IT',
  support = 'support',
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
  Admin = 'Admin',
  Finance = 'Finance',
  Standard = 'Standard',
  Owner = 'Owner',
  SuperAdmin = 'Super Admin',
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










