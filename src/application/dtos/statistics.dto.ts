import { ApiProperty } from '@nestjs/swagger';

export class StatisticsDto {
  @ApiProperty({
    description: 'Number of transactions in the last 60 seconds',
    example: 5,
  })
  count: number;

  @ApiProperty({
    description: 'Sum of all transaction amounts in the last 60 seconds',
    example: 150.75,
  })
  sum: number;

  @ApiProperty({
    description: 'Average of all transaction amounts in the last 60 seconds',
    example: 30.15,
  })
  avg: number;

  @ApiProperty({
    description: 'Minimum transaction amount in the last 60 seconds',
    example: 10.5,
  })
  min: number;

  @ApiProperty({
    description: 'Maximum transaction amount in the last 60 seconds',
    example: 75.25,
  })
  max: number;

  constructor(
    count: number,
    sum: number,
    avg: number,
    min: number,
    max: number,
  ) {
    this.count = count;
    this.sum = sum;
    this.avg = avg;
    this.min = min;
    this.max = max;
  }

  static empty(): StatisticsDto {
    return new StatisticsDto(0, 0, 0, 0, 0);
  }
}
