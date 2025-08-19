import { Module } from '@nestjs/common';
import { TransactionsController } from '../controllers/transactions.controller';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { InMemoryTransactionRepository } from '../../infrastructure/repositories/in-memory-transaction.repository';
import { DeleteAllTransactionsUseCase } from 'src/application/use-cases/delete-all-transactions.use-case';

@Module({
  controllers: [TransactionsController],
  providers: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    {
      provide: 'ITransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
  ],
  exports: ['ITransactionRepository'],
})
export class TransactionsModule {}
