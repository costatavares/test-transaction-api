import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Transaction } from '../../../../src/domain/entities/transaction.entity';
import { InMemoryTransactionRepository } from '../../../../src/infrastructure/repositories/in-memory-transaction.repository';

describe('Integration in inMemoryRepository DeleteAll', () => {
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

  it('should delete all transactions successfully', async () => {
    const fakerTransaction = new Transaction(
      faker.number.int({ min: 1, max: 10000 }),
      new Date(),
      faker.string.uuid(),
    );

    const saveSpy = jest.spyOn(inMemoryRepository, 'save');
    const saved = await inMemoryRepository.save(fakerTransaction);

    expect(saved).toBe(fakerTransaction);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(await inMemoryRepository.count()).toBe(1);

    await inMemoryRepository.deleteAll();

    expect(await inMemoryRepository.count()).toBe(0);
    expect(await inMemoryRepository.findAll()).toEqual([]);
  });
});
