import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const timestamp = new Date(createTransactionDto.timestamp);

    // Validação adicional para timestamp futuro
    const now = new Date();
    if (timestamp > now) {
      throw new Error('Transaction timestamp cannot be in the future');
    }

    const transaction = new Transaction(
      createTransactionDto.amount,
      timestamp,
      uuidv4(),
    );

    return await this.transactionRepository.save(transaction);
  }
}
