import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../../../../src/application/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from '../../../../src/application/use-cases/delete-all-transactions.use-case';
import { ITransactionRepository } from '../../../../src/domain/repositories/transaction.repository.interface';
import { Transaction } from '../../../../src/domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../../../src/application/dtos/create-transaction.dto';

describe('DeleteAllTransactionsUseCase', () => {
  let module: TestingModule;
  let transactions: Transaction[] = [];
  let useCaseDeleteAll: DeleteAllTransactionsUseCase;
  let useCaseCreateTransaction: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        DeleteAllTransactionsUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: {
            save: jest.fn().mockImplementation((transaction: Transaction) => {
              transactions.push(transaction);
              return transaction;
            }),
            findAll: jest.fn().mockImplementation(() => transactions),
            count: jest.fn().mockImplementation(() => transactions.length),
            deleteAll: jest.fn().mockImplementation(() => {
              transactions = [];
            }),
          },
        },
      ],
    }).compile();

    useCaseCreateTransaction = module.get<CreateTransactionUseCase>(
      CreateTransactionUseCase,
    );
    useCaseDeleteAll = module.get<DeleteAllTransactionsUseCase>(
      DeleteAllTransactionsUseCase,
    );
    transactionRepository = module.get('ITransactionRepository');
  });

  afterEach(async () => {
    await module.close(); // ✅ Fecha o módulo a cada teste
  });

  it('should delete all transactions successfully', async () => {
    const amount = faker.number.int({ min: 1, max: 10000 });
    const dto: CreateTransactionDto = {
      amount,
      timestamp: new Date().toISOString(),
    };

    await useCaseCreateTransaction.execute(dto);
    expect(await transactionRepository.count()).toBe(1);
    const findAll = await transactionRepository.findAll();
    expect(findAll[0].amount).toBe(amount);

    await useCaseDeleteAll.execute();
    const deleteAllSpy = jest.spyOn(transactionRepository, 'deleteAll');
    expect(deleteAllSpy).toHaveBeenCalledTimes(1);
    expect(await transactionRepository.count()).toBe(0);
    expect(await transactionRepository.findAll()).toEqual([]);
  });
});
