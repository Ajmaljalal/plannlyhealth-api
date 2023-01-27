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
   InvalidSignatureException = 'InvalidSignatureException',
}