import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { GetStatisticsUseCase } from '../../../../src/application/use-cases/get-statistics.use-case';
import { CreateTransactionUseCase } from '../../../../src/application/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from '../../../../src/application/use-cases/delete-all-transactions.use-case';
import { ITransactionRepository } from '../../../../src/domain/repositories/transaction.repository.interface';
import { Transaction } from '../../../../src/domain/entities/transaction.entity';
import { CreateTransactionDto } from '../../../../src/application/dtos/create-transaction.dto';

describe('DeleteAllTransactionsUseCase', () => {
  let useCase: DeleteAllTransactionsUseCase;
  let getStatisticsUseCase: GetStatisticsUseCase;
  let createTransactionUseCase: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        GetStatisticsUseCase,
        CreateTransactionUseCase,
        DeleteAllTransactionsUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: {
            save: jest.fn(),
            deleteAll: jest.fn(),
            findByTimeRange: jest.fn(),
          },
        },
      ],
    }).compile();

    getStatisticsUseCase =
      module.get<GetStatisticsUseCase>(GetStatisticsUseCase);

    createTransactionUseCase = module.get<CreateTransactionUseCase>(
      CreateTransactionUseCase,
    );
    useCase = module.get<DeleteAllTransactionsUseCase>(
      DeleteAllTransactionsUseCase,
    );
    transactionRepository = module.get('ITransactionRepository');
  });

  afterEach(async () => {
    await module.close(); // ✅ Fecha o módulo a cada teste
  });

  const dto: CreateTransactionDto = {
    amount: faker.number.int({ min: 1, max: 10000 }),
    timestamp: new Date().toISOString(),
  };

  it('should delete all transactions successfully', async () => {
    const fakerTransaction = new Transaction(
      dto.amount,
      new Date(dto.timestamp),
      `${faker.string.uuid()}`,
    );
    
    const teste = await transactionRepository.save(fakerTransaction);
    console.log(teste);

    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

    console.log(
      await transactionRepository.findByTimeRange(sixtySecondsAgo, now),
    );

    // transactionRepository.save.mockResolvedValue(fakerTransaction);

    // const createTransaction = await createTransactionUseCase.execute(dto);
    // expect(createTransaction).toBe(fakerTransaction);

    // await useCase.execute();
    // const deleteAllSpy = jest.spyOn(transactionRepository, 'deleteAll');
    // expect(deleteAllSpy).toHaveBeenCalledTimes(1);

    // // Mock do findByTimeRange
    // transactionRepository.findByTimeRange.mockResolvedValue([]);
    // const statisticsZero = await getStatisticsUseCase.execute();
    // console.log(statisticsZero);
  });
});
