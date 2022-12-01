import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateHttpService } from './exchangeRate.service';
import { GetLoanValueQueryHandler } from './handler';
import { GetLoanValueQuery } from './query';
import * as helper from './../shared/helper';

describe(`${GetLoanValueQueryHandler.name}`, () => {
  let handler: GetLoanValueQueryHandler;

  const query = {} as unknown as GetLoanValueQuery;
  const ratesWithNGN = {
    NGN: 450,
    EUR: 1.2,
    GBP: 0.99,
  };

  const ratesWithoutNGN = {
    EUR: 1.2,
    GBP: 0.99,
  };

  let loanCalculatorSpy = jest
    .spyOn(helper, 'calculateLoanRepaymentValue')
    .mockReturnValue(49000.1111);

  const exchangeRateService = {
    sendGetRequest: jest.fn(),
  };

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLoanValueQueryHandler,
        ConfigService,
        { provide: ExchangeRateHttpService, useValue: exchangeRateService },
      ],
    }).compile();
    handler = module.get<GetLoanValueQueryHandler>(GetLoanValueQueryHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(handler).toBeInstanceOf(GetLoanValueQueryHandler);
  });

  it('should generate naira value of loan successfully', async () => {
    exchangeRateService.sendGetRequest.mockResolvedValue(ratesWithNGN);
    const response = await handler.execute(query);
    expect(exchangeRateService.sendGetRequest).toBeCalled();
    expect(helper.calculateLoanRepaymentValue).toBeCalled();
    expect(response).toEqual({ repaymentValue: 49000.1111 });
  });

  it('should throw error if NGN rate is undefined', async () => {
    exchangeRateService.sendGetRequest.mockResolvedValue(ratesWithoutNGN);
    try {
      await handler.execute(query);
      expect(exchangeRateService.sendGetRequest).toBeCalled();
    } catch (error) {
      expect(error.message).toEqual('Naira Rate not available');
      expect(error.status).toEqual(500);
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
