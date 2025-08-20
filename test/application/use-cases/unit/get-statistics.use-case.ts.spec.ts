import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { GetStatisticsUseCase } from '../../../../src/application/use-cases/get-statistics.use-case';
import { ITransactionRepository } from '../../../../src/domain/repositories/transaction.repository.interface';
import { Transaction } from '../../../../src/domain/entities/transaction.entity';

describe('GetStatisticsUseCase', () => {
  let useCase: GetStatisticsUseCase;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        GetStatisticsUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: {
            findByTimeRange: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetStatisticsUseCase>(GetStatisticsUseCase);
    transactionRepository = module.get('ITransactionRepository');
  });

  afterEach(async () => {
    await module.close(); // ✅ Fecha o módulo a cada teste
  });

  type StatisticsResponse = {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
  };

  const fakerTransactions: Transaction[] = Array.from({ length: 10 }, () => {
    const amount = faker.number.int({ min: 1, max: 10000 });
    const timestamp = new Date(Date.now() - 30000).toISOString();
    const id = faker.string.uuid();

    return new Transaction(amount, new Date(timestamp), id);
  });

  //   { amount: faker.number.int({ min: 1, max: 10000 }), timestamp: new Date().toISOString(), id: faker.string.uuid()};

  it('should return empty statistics when no transactions exist', async () => {
    const expectedStatistics: StatisticsResponse = {
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    };

    // Mock do findByTimeRange
    transactionRepository.findByTimeRange.mockResolvedValue([]);

    const result = await useCase.execute();
    const response = result as StatisticsResponse;
    expect(response).toEqual(expectedStatistics);
    expect(response.count).toEqual(0);
    expect(response.sum).toEqual(0);
    expect(response.avg).toEqual(0);
    expect(response.min).toEqual(0);
    expect(response.max).toEqual(0);
  });

  it('should return correct statistics for recent transaction', async () => {
    const amounts = fakerTransactions.map((transaction) => transaction.amount);
    const sum = amounts.reduce((acc, amount) => acc + amount, 0);
    const avg = sum / amounts.length;

    const expectedStatistics: StatisticsResponse = {
      count: fakerTransactions.length,
      sum: Math.round(sum * 100) / 100,
      avg: Math.round(avg * 100) / 100,
      min: Math.min(...amounts),
      max: Math.max(...amounts),
    };

    transactionRepository.findByTimeRange.mockResolvedValue(fakerTransactions);

    const result = await useCase.execute();
    const response = result as StatisticsResponse;
    expect(response).toEqual(expectedStatistics);
  });
});
