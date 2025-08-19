import { IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction amount',
    example: 12.34,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0, { message: 'Amount cannot be negative' })
  amount: number;

  @ApiProperty({
    description: 'Transaction timestamp in ISO 8601 UTC format',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsDateString({}, { message: 'Timestamp must be a valid ISO 8601 date string' })
  timestamp: string;
} 