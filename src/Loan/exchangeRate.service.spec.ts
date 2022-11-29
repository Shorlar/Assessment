import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { ExchangeRateHttpService } from './exchangeRate.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe(`${ExchangeRateHttpService.name}`, () => {
  let service: ExchangeRateHttpService;

  const result: AxiosResponse = {
    data: {
      conversion_rates: {
        NGN: 450,
        EUR: 1.2,
        GBP: 0.99,
      },
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  const errorResult: AxiosResponse = {
    data: {},
    status: 404,
    statusText: 'unsupported-code',
    headers: {},
    config: {},
  };

  const httpService = {
    get: jest.fn().mockReturnValue({ pipe: jest.fn() }),
  } as unknown as HttpService;

  let httpSpy = jest
    .spyOn(httpService, 'get')
    .mockImplementation(() => of(result));

  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateHttpService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();
    service = module.get<ExchangeRateHttpService>(ExchangeRateHttpService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(ExchangeRateHttpService);
  });

  it('should fetch rates successfully', async () => {
    const response = await service.sendGetRequest('test url');
    expect(httpService.get).toBeCalled();
    expect(response).toMatchObject({
      NGN: 450,
      EUR: 1.2,
      GBP: 0.99,
    });
  });

  it('should throw error if any when call exchange rate api', async () => {
    httpSpy = jest
      .spyOn(httpService, 'get')
      .mockImplementationOnce(() => of(errorResult));
    try {
      await service.sendGetRequest('test url');
      expect(httpService.get).toBeCalled();
    } catch (error) {
      expect(error.status).toEqual(404 || 500);
      expect(error).toBeInstanceOf(HttpException);
    }
  });
});
