import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '../../../../src/application/use-cases/create-transaction.use-case';
import { ITransactionRepository } from '../../../../src/domain/repositories/transaction.repository.interface';
import { CreateTransactionDto } from '../../../../src/application/dtos/create-transaction.dto';
import { Transaction } from '../../../../src/domain/entities/transaction.entity';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepository: jest.Mocked<ITransactionRepository>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: 'ITransactionRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    transactionRepository = module.get('ITransactionRepository');
  });

  afterEach(async () => {
    await module.close(); // ✅ Fecha o módulo a cada teste
  });

  it('should create a transaction successfully', async () => {
    const dto: CreateTransactionDto = {
      amount: 100,
      timestamp: new Date().toISOString(),
    };

    const expectedTransaction = new Transaction(
      dto.amount,
      new Date(dto.timestamp),
      'fake-uuid',
    );

    // Mock do save
    transactionRepository.save.mockResolvedValue(expectedTransaction);

    const result = await useCase.execute(dto);
    const saveSpy = jest.spyOn(transactionRepository, 'save');
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(expect.any(Transaction));
    expect(result).toBe(expectedTransaction);
  });

  it(`should return a throw with message 'Amount cannot be negative'`, async () => {
    const dtoAmoutNegative: CreateTransactionDto = {
      amount: -100,
      timestamp: new Date().toISOString(),
    };

    await expect(useCase.execute(dtoAmoutNegative)).rejects.toThrow(
      'Amount cannot be negative',
    );
  });

  it(`should return a throw with message 'Transaction timestamp cannot be in the future'`, async () => {
    const dtoTimestampFuture: CreateTransactionDto = {
      amount: 100,
      timestamp: new Date(Date.now() + 10000).toISOString(),
    };

    await expect(useCase.execute(dtoTimestampFuture)).rejects.toThrow(
      'Transaction timestamp cannot be in the future',
    );
  });
});
