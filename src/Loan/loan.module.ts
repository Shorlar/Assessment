import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ExchangeRateHttpService } from './exchangeRate.service';
import { GetLoanValueQueryHandler } from './handler';
import { LoanRepaymentController } from './loanRepayment.controller';
@Module({
  imports: [CqrsModule, HttpModule],
  controllers: [LoanRepaymentController],
  providers: [GetLoanValueQueryHandler, ExchangeRateHttpService],
})
export class LoanModule {}
