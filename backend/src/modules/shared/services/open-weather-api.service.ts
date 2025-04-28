import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalHttpClientService } from 'src/modules/http';
import { OpenWeatherApiResponse } from '../models';
import { Configuration } from 'src/config/configuration.interface';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class OpenWeatherApiService {
  private readonly apiKey: string;

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

    console.log({
      latitude,
    })
    /*
    const response = await this.externalHttpService.get<any>(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: this.apiKey,
      },
    );
    */
    const response = {
      coord: {
        lon: 103.8195,
        lat: 1.3571,
      },
      weather: [
        {
          id: 803,
          main: 'Clouds',
          description: 'broken clouds',
          icon: '04n',
        },
      ],
      base: 'stations',
      main: {
        temp: 26.36,
        feels_like: 26.36,
        temp_min: 25.78,
        temp_max: 26.76,
        pressure: 1010,
        humidity: 88,
        sea_level: 1010,
        grnd_level: 1009,
      },
      visibility: 9000,
      wind: {
        speed: 1.03,
        deg: 360,
      },
      clouds: {
        all: 75,
      },
      dt: 1745510799,
      sys: {
        type: 1,
        id: 9479,
        country: 'SG',
        sunrise: 1745535472,
        sunset: 1745579234,
      },
      timezone: 28800,
      id: 1880755,
      name: 'Bright Hill Crescent',
      cod: 200,
    };

    console.log({
      response,
    })

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
