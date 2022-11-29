import { Logger, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class ExchangeRateHttpService {
  private readonly logger: Logger;
  constructor(private readonly httpService: HttpService) {
    this.logger = new Logger(ExchangeRateHttpService.name);
  }

  async sendGetRequest(url: string): Promise<Record<string, number>> {
    this.logger.log(`In ${ExchangeRateHttpService.name}`);
    this.logger.log('Calling Exchange rate API to fetch rates');
    try {
      const data = this.httpService
        .get(url)
        .pipe(map((response) => response.data));
      const response = await lastValueFrom(data, { defaultValue: null });
      const { conversion_rates } = response;
      return conversion_rates;
    } catch (error) {
      this.logger.log(`Error: ${error}`);
      throw new HttpException(
        error.response?.data['error-type'] || 'Unknown Error',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
