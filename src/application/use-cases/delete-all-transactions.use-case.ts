import { Injectable, Inject } from '@nestjs/common';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<void> {
    await this.transactionRepository.deleteAll();
  }
}
