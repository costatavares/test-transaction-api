import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  save(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction);
    return Promise.resolve(transaction);
  }

  findAll(): Promise<Transaction[]> {
    console.log('findAll', this.transactions);
    return Promise.resolve([...this.transactions]);
  }

  findByTimeRange(startTime: Date, endTime: Date): Promise<Transaction[]> {
    const filtered = this.transactions.filter(
      (transaction) =>
        transaction.timestamp >= startTime && transaction.timestamp <= endTime,
    );
    return Promise.resolve(filtered);
  }

  deleteAll(): Promise<void> {
    this.transactions = [];
    return Promise.resolve();
  }

  count(): Promise<number> {
    return Promise.resolve(this.transactions.length);
  }
}
