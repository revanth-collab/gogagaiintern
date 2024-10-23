const request = require('supertest');
const { app, server } = require('./app');

afterAll(async () => {
    await new Promise((resolve) => server.close(resolve)); // Close the server after tests
});

describe('API Tests', () => {
    let transactionId; // To store the ID of the created transaction

    beforeAll(async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                type: 'expense',
                category: 1,
                amount: 50,
                date: '2024-10-22',
                description: 'Groceries'
            });
        transactionId = res.body.id; // Store the ID for later tests
    });

    it('should create a new transaction', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({
                type: 'expense',
                category: 1,
                amount: 50,
                date: '2024-10-22',
                description: 'Groceries'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should retrieve all transactions', async () => {
        const res = await request(app).get('/transactions');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should retrieve a transaction by ID', async () => {
        const res = await request(app).get(`/transactions/${transactionId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', transactionId);
    });

    it('should update a transaction by ID', async () => {
        const res = await request(app)
            .put(`/transactions/${transactionId}`)
            .send({
                type: 'income',
                category: 1,
                amount: 100,
                date: '2024-10-22',
                description: 'Salary'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Transaction updated');
    });

    it('should delete a transaction by ID', async () => {
        const res = await request(app).delete(`/transactions/${transactionId}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should get a summary of transactions', async () => {
        const res = await request(app).get('/summary');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('totalIncome');
        expect(res.body).toHaveProperty('totalExpenses');
    });
});

