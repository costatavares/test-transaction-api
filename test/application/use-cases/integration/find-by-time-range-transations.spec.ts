import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Transaction } from '../../../../src/domain/entities/transaction.entity';
import { InMemoryTransactionRepository } from '../../../../src/infrastructure/repositories/in-memory-transaction.repository';

describe('Integration in inMemoryRepository FindByTimeRange', () => {
  let module: TestingModule;
  let inMemoryRepository: InMemoryTransactionRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [InMemoryTransactionRepository],
    }).compile();

    inMemoryRepository = module.get<InMemoryTransactionRepository>(
      InMemoryTransactionRepository,
    );
  });

  afterEach(async () => {
    await module.close();
  });

  it('should return correct data for recent transaction', async () => {
    const now = new Date();
    const id = faker.string.uuid();
    const amount = faker.number.int({ min: 1, max: 10000 });
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

    const fakerTransaction = new Transaction(amount, now, id);

    const saveSpy = jest.spyOn(inMemoryRepository, 'save');
    const saved = await inMemoryRepository.save(fakerTransaction);

    expect(saved).toBe(fakerTransaction);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(await inMemoryRepository.count()).toBe(1);

    const timeRange = await inMemoryRepository.findByTimeRange(
      sixtySecondsAgo,
      now,
    );

    expect(timeRange[0].id).toBe(id);
    expect(timeRange[0].amount).toBe(amount);
    expect(timeRange[0].timestamp).toBe(now);
  });

  it('should return zero data', async () => {
    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

    const timeRangeSpy = jest.spyOn(inMemoryRepository, 'findByTimeRange');

    expect(await inMemoryRepository.count()).toBe(0);
    expect(
      await inMemoryRepository.findByTimeRange(sixtySecondsAgo, now),
    ).toEqual([]);
    expect(timeRangeSpy).toHaveBeenCalledTimes(1);
  });
});
