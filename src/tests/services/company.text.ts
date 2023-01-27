import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { Company } from '../../models/company';
import { createCompanyService } from '../../services/company';

describe('createCompanyService', () => {
    beforeEach(() => {
        AWSMock.setSDKInstance(AWS);
    });

    afterEach(() => {
        AWSMock.restore();
    });

    it('should create a new company', async () => {
        const company: Company = {
            type: 'Company',
            id: '123',
            name: 'Test Company',
            logo: 'https://example.com/logo.png',
            website: 'https://example.com',
            monthly_charge_active: true,
        };

        // mock the DynamoDB put method to return the company we're creating
        AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: any, callback: any) => {
            callback(null, { Attributes: company });
        });

        const result = await createCompanyService(company);
        expect(result).toEqual({ Attributes: company });
    });
});
