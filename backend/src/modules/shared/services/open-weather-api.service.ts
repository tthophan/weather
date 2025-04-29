import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Configuration } from 'src/config/configuration.interface';
import { ExternalHttpClientService } from 'src/modules/http';
import { OpenWeatherApiResponse } from '../models';

@Injectable()
export class OpenWeatherApiService {
  private readonly apiKey: string;
  private endpoint: string = `https://api.openweathermap.org`;

  constructor(
    private readonly externalHttpService: ExternalHttpClientService,
    private readonly configService: ConfigService,
  ) {
    const config =
      this.configService.get<Configuration['openWeatherApi']>('openWeatherApi');
    this.apiKey = config.apiKey;
  }

  async getCurrentWeather(
    latitude: number,
    longitude: number,
  ): Promise<OpenWeatherApiResponse> {
    const response = await this.externalHttpService.get<any>(
      `${this.endpoint}/data/2.5/weather`,
      {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: this.apiKey,
      },
    );

    return plainToInstance(OpenWeatherApiResponse, response, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  // Unsupported by Free tier
  async getWeather(
    latitude: number,
    longitude: number,
    from?: Date,
    to?: Date,
  ): Promise<OpenWeatherApiResponse> {
    const response = await this.externalHttpService.get<any>(
      `https://history.openweathermap.org/data/2.5/history/city`,
      instanceToPlain(
        {
          appid: this.apiKey,
          lat: latitude,
          lon: longitude,
          type: 'hour',
          units: 'metric',
          start: from?.getTime(),
          end: to?.getTime(),
        },
        {
          exposeUnsetFields: false,
        },
      ),
    );

    return plainToInstance(OpenWeatherApiResponse, response, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
