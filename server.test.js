import request from 'supertest';
import app from './server.js';
import { generateRandomString } from './src/utils/stringUtils.js';
import { describe, it, expect } from '@jest/globals';

describe('POST /api/transactions/topup', () => {
    it('should return 200 and process the request successfully', async () => {
        const requestBody = {
            request_id: `TEST${generateRandomString(7)}`,
            amount: "5.00"
        };

        const response = await request(app)
            .post('/api/transactions/topup')
            .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
            .send(requestBody)
            .set('Accept', 'application/json');

        console.log('CHECK SUCCESS RESPONSE', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            success: expect.any(Boolean),
            // balance: expect.any(String),
            user_id: expect.any(String)
        });
    });

    it('should return 400 if fields are missing', async () => {
        const response = await request(app)
            .post('/api/transactions/topup')
            .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
            .send({})
            .set('Accept', 'application/json');
        console.log('CHECK FAILED RESPONSE', response.body);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('success', false);
    });
});
