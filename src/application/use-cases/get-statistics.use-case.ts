import { Injectable, Inject } from '@nestjs/common';
import type { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { StatisticsDto } from '../dtos/statistics.dto';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<StatisticsDto> {
    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);

    const transactions = await this.transactionRepository.findByTimeRange(
      sixtySecondsAgo,
      now,
    );

    if (transactions.length === 0) {
      return StatisticsDto.empty();
    }

    const amounts = transactions.map((transaction) => transaction.amount);
    const sum = amounts.reduce((acc, amount) => acc + amount, 0);
    const avg = sum / amounts.length;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return new StatisticsDto(
      transactions.length,
      Math.round(sum * 100) / 100, // Round to 2 decimal places
      Math.round(avg * 100) / 100, // Round to 2 decimal places
      min,
      max,
    );
  }
}
