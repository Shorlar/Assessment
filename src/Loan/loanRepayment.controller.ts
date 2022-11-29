import { Controller, Get, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetLoanValueQuery } from './query';

@Controller('/loan-repayment')
export class LoanRepaymentController {
  private logger: Logger;
  constructor(private readonly queryBus: QueryBus) {
    this.logger = new Logger(LoanRepaymentController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/get-naira-value')
  async getLoanValue() {
    this.logger.log('In Get loan Value controller');
    this.logger.log(
      `Calling queryBus.execute with an instance of ${GetLoanValueQuery.name}`,
    );
    return await this.queryBus.execute(new GetLoanValueQuery());
  }
}
