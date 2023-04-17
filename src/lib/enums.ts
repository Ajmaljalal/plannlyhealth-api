export enum AddOns {
  HRISIntegration = 'HRIS Integration',
  SlackIntegration = 'Slack Integration',
  SingleSignOnSSO = 'Single Sign-On (SSO)',
  DomainWhitelisting = 'Domain Whitelisting',
  DedicatedWellnessCoordinator = 'Dedicated Wellness Coordinator',
  BrokerPortal = 'Broker (partner) Portal',
}

export enum Frequency {
  OneTime = 'One Time',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Yearly = 'Yearly',
}

export enum Options {
  Activate = 'Activate',
  Deactivate = 'Deactivate',
  Edit = 'Edit',
}

export enum ProgramModel {
  Allotment = 'Allotment',
  Allowance = 'Allowance',
  BothPrograms = 'Both Programs',
}

export enum ProgramAccess {
  Limited = 'limited',
  Unlimited = 'unlimited',
}

export enum ClaimStatus {
  Requested = 'requested',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum Department {
  Sales = 'sales',
  Marketing = 'marketing',
  Finance = 'finance',
  Operations = 'operations',
  HumanResources = 'human resources',
  IT = 'IT',
  Support = 'support',
  None = 'none',
}

export enum NotificationType {
  ClaimStatus = 'Claim Status',
  Comment = 'Comment',
}

export enum OptionsClaim {
  Approve = 'Approve',
  ApproveAll = 'Approve All',
  Decline = 'Decline',
  Delete = 'Delete',
  Details = 'Details',
  Edit = 'Edit',
}

export enum OptionsComment {
  Delete = 'Delete',
  Edit = 'Edit',
}

export enum PaymentSchedule {
  Annually = 'Annually',
  Monthly = 'Monthly',
}

export enum RefundStatus {
  Failed = 'Failed',
  Success = 'Success',
}

export enum Role {
  Admin = 'Admin',
  Finance = 'Finance',
  Standard = 'Standard',
  Owner = 'Owner',
  SuperAdmin = 'Super Admin',
  WellnessCoordinator = 'Wellness Coordinator',
  CustomerSuccess = 'Customer Success',
}

export enum UserAccountStatus {
  Active = 'Active',
  Invited = 'Invited',
  Deactivated = 'Deactivated',
}


export enum SubscriptionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
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










