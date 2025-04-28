import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class Weather {
  @Expose()
  @Type(() => Number)
  id: number;

  @Expose()
  @Type(() => String)
  main: string;

  @Expose()
  @Type(() => String)
  description: string;
}

export class MainWeather {
  @Expose()
  @Type(() => Number)
  temp: number;

  @Expose()
  @Type(() => Number)
  pressure: number;

  @Expose()
  @Type(() => Number)
  humidity: number;
}

export class OpenWeatherApiResponse {
  @Expose()
  @Type(() => Weather)
  weather: Weather[];

  @Expose()
  @Type(() => MainWeather)
  main: MainWeather;

  @Expose()
  @Type(() => Number)
  @Transform((data) => data.obj.clouds.all, {
    toClassOnly: true,
  })
  cloudCover: number;

  @Expose()
  @Type(() => Number)
  @Transform((data) => data.obj.dt * 1000, {
    toClassOnly: true,
  })
  timestamp: number;
}
