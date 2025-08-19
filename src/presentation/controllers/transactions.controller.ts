import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnprocessableEntityException,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateTransactionDto } from '../../application/dtos/create-transaction.dto';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from 'src/application/use-cases/delete-all-transactions.use-case';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
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
      const transaction =
        await this.createTransactionUseCase.execute(createTransactionDto);
      return {
        message: 'Transaction created successfully',
        data: {
          id: transaction.id,
          amount: transaction.amount,
          timestamp: transaction.timestamp.toISOString(),
        },
      };
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.message.includes('future') || error.message.includes('negative'))
      ) {
        throw new UnprocessableEntityException(error.message);
      }
      throw new BadRequestException('Invalid transaction data');
    }
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all transactions' })
  @ApiResponse({
    status: 200,
    description: 'All transactions deleted successfully',
  })
  async deleteAllTransactions() {
    await this.deleteAllTransactionsUseCase.execute();
    return {
      message: 'All transactions deleted successfully',
    };
  }
}
