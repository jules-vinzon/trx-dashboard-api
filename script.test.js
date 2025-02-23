import request from 'supertest';
import { describe, it, expect } from '@jest/globals';

describe('GET httpbin.org/anything', () => {
    it('should return 200 and process the request successfully', async () => {
        const response = await request("https://httpbin.org")
            .get('/anything')
            .send()

        console.log('CHECK SUCCESS RESPONSE', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            args: {},
            data: expect.any(String),
            files: {},
            form: {},
            headers: expect.objectContaining({
                "Accept-Encoding": expect.any(String),
                "Host": expect.any(String),
                "X-Amzn-Trace-Id": expect.any(String),
            }),
            method: "GET",
            origin: expect.any(String),
            url: expect.stringMatching("https://httpbin.org/anything")
        });
    });
});
