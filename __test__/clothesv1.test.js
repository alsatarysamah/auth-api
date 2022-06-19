'use strict';
const { server } = require('../src/server'); // destructing assignment 
const supertest = require('supertest');
const mockRequest = supertest(server);
const { db } = require('../src/auth/models/index');


beforeAll(async () => {
    await db.sync();
});

describe('Web server', () => {
    it('bad route', async () => {
        const response = await mockRequest.get('/bad');
        expect(response.status).toBe(404);
    });

    // it('bad method', async () => {
    //     const response = await mockRequest.delete('/api/v1/clothes');
    //     expect(response.status).toBe(404);
    // });

    // it('adding a clothes', async () => {
    //     const response = await mockRequest.post('/api/v1/clothes').send({
    //         name:"sushi",
    //     });
    //     expect(response.status).toBe(201);
    // });

    // it('geting all clothes', async () => {
    //     const response = await mockRequest.get('/api/v1/clothes');
    //     expect(response.status).toBe(200);

    // });

    // // test('updating a record', async () => {
    // //     const response = await mockRequest.put('/api/v1/food/2');
    // //     expect(response.status).toBe(201);
    // // });
    // it('deleting a record', async () => {
    //     const response = await mockRequest.delete('/api/v1/clothes/3');
    //     expect(response.status).toBe(204);
    // });

})
