import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateTransactionDto } from '../../application/dtos/create-transaction.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input format',
  })
  @ApiResponse({
    status: 422,
    description: 'Unprocessable Entity - Business rule violation',
  })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = await this.createTransactionUseCase.execute(createTransactionDto);
      return {
        message: 'Transaction created successfully',
        data: {
          id: transaction.id,
          amount: transaction.amount,
          timestamp: transaction.timestamp.toISOString(),
        },
      };
    } catch (error) {
      if (error.message.includes('future') || error.message.includes('negative')) {
        throw new UnprocessableEntityException(error.message);
      }
      throw new BadRequestException('Invalid transaction data');
    }
  }
} 