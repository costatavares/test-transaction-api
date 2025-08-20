import request, { type Response } from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import TestAgent from 'supertest/lib/agent';

describe('Test (e2e)', () => {
  let app: INestApplication<App>;
  let httpRequest: TestAgent;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    httpRequest = request(app.getHttpServer() as unknown as App);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('AppController', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer() as unknown as App)
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('Health check endpoint', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer() as unknown as App)
        .get('/health')
        .expect(200)
        .expect(({ body }: Response) => {
          expect(body).toHaveProperty('status', 'ok');
          expect(body).toHaveProperty('environment', 'test');
          expect(body).toHaveProperty('timestamp');
          expect(body).toHaveProperty('uptime');
        });
    });
  });

  describe('Transaction API', () => {
    describe('/transactions (POST)', () => {
      const timestamp = new Date().toISOString();

      type CreateTransactionResponse = {
        message: string;
        data: { id: string; amount: number; timestamp: string };
      };

      type CreateTransactionResponseError = {
        message: string;
        statusCode: number;
        error: string;
      };

      it('should create a transaction successfully', async () => {
        const transactionData = {
          amount: 100.5,
          timestamp: timestamp,
        };

        const res: Response = await httpRequest
          .post('/transactions')
          .send(transactionData);

        const body = res.body as CreateTransactionResponse;

        expect(res.status).toBe(201);
        expect(body.message).toBe('Transaction created successfully');
        expect(body.data.amount).toBe(100.5);
        expect(body.data.id).toBeDefined();
        expect(body.data.timestamp).toBe(timestamp);
      });

      it(`should return 422 for negative amount with message 'Amount cannot be negative'`, async () => {
        const res = await httpRequest.post('/transactions').send({
          amount: -10,
          timestamp: '2024-01-15T10:30:00.000Z',
        });

        const body = res.body as CreateTransactionResponseError;
        expect(res.status).toBe(422);
        expect(body.message).toEqual(['Amount cannot be negative']);
        expect(body.statusCode).toBe(422);
        expect(body.error).toBe('Unprocessable Entity');
      });

      it('should return 422 for future timestamp', async () => {
        const futureDate = new Date(Date.now() + 10000).toISOString();
        const res = await httpRequest.post('/transactions').send({
          amount: 100,
          timestamp: futureDate,
        });
        const body = res.body as CreateTransactionResponseError;
        expect(res.status).toBe(422);
        expect(body.message).toEqual(
          'Transaction timestamp cannot be in the future',
        );
        expect(body.statusCode).toBe(422);
        expect(body.error).toBe('Unprocessable Entity');
      });

      it('should return 422 for invalid timestamp format must be a valid ISO 8601 date string', async () => {
        const res = await httpRequest.post('/transactions').send({
          amount: 100,
          timestamp: 'invalid-date',
        });
        const body = res.body as CreateTransactionResponseError;
        expect(res.status).toBe(422);
        expect(body.message).toEqual([
          'Timestamp must be a valid ISO 8601 date string',
        ]);
        expect(body.statusCode).toBe(422);
        expect(body.error).toBe('Unprocessable Entity');
      });

      it('should return 422 for missing amount', async () => {
        const res = await httpRequest.post('/transactions').send({
          timestamp: timestamp,
        });
        const body = res.body as CreateTransactionResponseError;
        expect(res.status).toBe(422);
        expect(body.message).toEqual([
          'Amount cannot be negative',
          'Amount must be a number',
        ]);
        expect(body.statusCode).toBe(422);
        expect(body.error).toBe('Unprocessable Entity');
      });
    });

    describe('/transactions (DELETE)', () => {
      const timestamp = new Date().toISOString();
      type DeleteTransactionResponse = { message: string };

      it('should delete all transactions successfully', async () => {
        await httpRequest.post('/transactions').send({
          amount: 100,
          timestamp: timestamp,
        });

        const res = await httpRequest.delete('/transactions');
        const body = res.body as DeleteTransactionResponse;
        expect(res.status).toBe(200);
        expect(body.message).toBe('All transactions deleted successfully');
      });
    });

    describe('/statistics (GET)', () => {
      type StatisticsResponse = {
        count: number;
        sum: number;
        avg: number;
        min: number;
        max: number;
      };

      it('should return empty statistics when no transactions exist', async () => {
        const res = await httpRequest.get('/statistics');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          count: 0,
          sum: 0,
          avg: 0,
          min: 0,
          max: 0,
        });
      });

      it('should return correct statistics for recent transactions', async () => {
        const recentTimestamp = new Date(Date.now() - 30000).toISOString();

        await httpRequest
          .post('/transactions')
          .send({ amount: 10, timestamp: recentTimestamp });
        await httpRequest
          .post('/transactions')
          .send({ amount: 20, timestamp: recentTimestamp });
        await httpRequest
          .post('/transactions')
          .send({ amount: 30, timestamp: recentTimestamp });

        const res = await httpRequest.get('/statistics');
        const body = res.body as StatisticsResponse;

        expect(res.status).toBe(200);
        expect(body.count).toBe(3);
        expect(body.sum).toBe(60);
        expect(body.avg).toBe(20);
        expect(body.min).toBe(10);
        expect(body.max).toBe(30);
      });
    });

    describe('Integration flow', () => {
      type StatisticsResponse = {
        count: number;
        sum: number;
        avg: number;
        min: number;
        max: number;
      };

      it('should handle complete transaction lifecycle', async () => {
        // limpa as transações antes do teste
        await httpRequest.delete('/transactions').expect(200);

        // 1. Empty stats
        let res = await httpRequest.get('/statistics');
        const bodyStats = res.body as StatisticsResponse;
        expect(bodyStats.count).toBe(0);

        const recentTimestamp = new Date(Date.now() - 30000).toISOString();

        // 2. Create transactions
        await httpRequest
          .post('/transactions')
          .send({ amount: 25.5, timestamp: recentTimestamp });
        await httpRequest
          .post('/transactions')
          .send({ amount: 74.5, timestamp: recentTimestamp });

        // 3. Stats with data
        res = await httpRequest.get('/statistics');
        const bodyStatsData = res.body as StatisticsResponse;
        expect(bodyStatsData.count).toBe(2);
        expect(bodyStatsData.sum).toBe(100);
        expect(bodyStatsData.avg).toBe(50);

        // 4. Delete all
        await httpRequest.delete('/transactions');

        // 5. Stats empty again
        res = await httpRequest.get('/statistics');
        const bodyStatsEmpty = res.body as StatisticsResponse;
        expect(bodyStatsEmpty.count).toBe(0);
      });
    });
  });
});
