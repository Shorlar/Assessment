import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLoanValueQuery } from './query';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeRateHttpService } from './exchangeRate.service';
import { calculateLoanRepaymentValue, LoanParameters } from '../shared/helper';

@QueryHandler(GetLoanValueQuery)
export class GetLoanValueQueryHandler
  implements IQueryHandler<GetLoanValueQuery>
{
  private logger: Logger;
  constructor(
    private readonly exchangeRateService: ExchangeRateHttpService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(GetLoanValueQueryHandler.name);
  }

  async execute(query: GetLoanValueQuery): Promise<Record<string, number>> {
    this.logger.log(`In ${GetLoanValueQueryHandler.name}`);
    this.logger.log('Calling Exchange rate service');
    const apiKey = this.configService.get<string>('API_KEY');
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
    const rates = await this.exchangeRateService.sendGetRequest(url);
    const { NGN } = rates;
    if (!NGN) {
      throw new HttpException(
        'Naira Rate not available',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const USDLoanPrincipalValue = 100;
    const monthlyRate = 2;
    const nairaLoanPrincipalValue = USDLoanPrincipalValue * NGN;
    const loanParameters: LoanParameters = {
      principal: nairaLoanPrincipalValue,
      monthlyRate,
      months: 10,
    };
    this.logger.log('Calculating Repayment Value');
    const repaymentValue = calculateLoanRepaymentValue(loanParameters);
    return { repaymentValue };
  }
}
