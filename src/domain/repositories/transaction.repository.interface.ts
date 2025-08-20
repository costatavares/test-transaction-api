import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findByTimeRange(startTime: Date, endTime: Date): Promise<Transaction[]>;
  deleteAll(): Promise<void>;
  count(): Promise<number>;
}
