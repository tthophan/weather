import { Controller, Get, Param, Query } from '@nestjs/common';
import { RateLimit } from 'src/decorators';
import {
  WeatherCompareRequestParams,
  WeatherHistoryQueryParams,
  WeatherQueryParams,
  WeatherResponse,
} from '../models';
import { WeatherService } from '../services/weather.service';

@Controller({
  path: 'weather',
  version: '1.0',
})
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('current')
  @RateLimit({
    limit: 100,
    ttl: 5 * 1000, // 5 seconds
  })
  async getCurrentWeather(): Promise<WeatherResponse> {
    console.log('getCurrentWeather');
    return await this.weatherService.getCurrentWeather();
  }

  @Get()
  @RateLimit({
    limit: 100,
    ttl: 5 * 1000, // 5 seconds
  })
  async getWeather(@Query() queryParams: WeatherQueryParams): Promise<any> {
    return this.weatherService.getWeather(queryParams);
  }

  @Get('histories')
  @RateLimit({
    limit: 100,
    ttl: 5 * 1000, // 5 seconds
  })
  async getWeatherReportPaginate(
    @Query() queryParams: WeatherHistoryQueryParams,
  ): Promise<any> {
    console.log('getWeatherReportPaginate', { queryParams });
    return this.weatherService.weatherReportPaginate({
      limit: queryParams.limit,
      page: queryParams.page,
      sort: queryParams.sort,
    });
  }

  @Get('histories/compare/:id1/:id2')
  @RateLimit({
    limit: 100,
    ttl: 5 * 1000, // 5 seconds
  })
  async getWeatherReportCompare(
    @Param() params: WeatherCompareRequestParams,
  ): Promise<any> {
    return this.weatherService.getWeatherReportCompare([
      params.id1,
      params.id2,
    ]);
  }
}
