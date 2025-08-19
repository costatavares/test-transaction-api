import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  async save(transaction: Transaction): Promise<Transaction> {
    const transactionWithId = new Transaction(
      transaction.amount,
      transaction.timestamp,
      transaction.id || uuidv4(),
    );
    
    this.transactions.push(transactionWithId);
    return transactionWithId;
  }

  async findAll(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Transaction[]> {
    return this.transactions.filter(
      transaction => 
        transaction.timestamp >= startTime && 
        transaction.timestamp <= endTime
    );
  }

  async deleteAll(): Promise<void> {
    this.transactions = [];
  }

  async count(): Promise<number> {
    return this.transactions.length;
  }
} 