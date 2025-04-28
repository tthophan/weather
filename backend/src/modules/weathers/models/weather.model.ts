import { Transform, Type } from 'class-transformer';
import { IsOptional, IsDate, IsArray, IsNumber, IsEnum } from 'class-validator';

export class Location {
  latitude: number;
  longitude: number;
  name: string;
}

export class WeatherResponse {
  temperature: number;
  pressure: number;
  humidity: number;
  cloudCover: number;
  timestamp: number;
  location: Location;

  constructor(weather: Partial<WeatherResponse>) {
    Object.assign(this, weather);
  }
}

export class WeatherQueryParams {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date;
}

export enum SortKey {
  TIMESTAMP = 'timestamp',
  TEMPERATURE = 'temperature',
  PRESSURE = 'pressure',
  HUMiDITY = 'humidity',
  CLOUDCOVER = 'cloudCover',
}
export class WeatherHistoryQueryParams {
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value || undefined)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  readonly limit: number = 10;

  @IsOptional()
  @Type(() => Map<SortKey, 'asc' | 'desc'>)
  sort?: Map<SortKey, 'asc' | 'desc'>;
}

export class WeatherCompareRequestParams {
  @Type(() => Number)
  @IsNumber()
  id1?: number;

  @Type(() => Number)
  @IsNumber()
  id2?: number;
}
