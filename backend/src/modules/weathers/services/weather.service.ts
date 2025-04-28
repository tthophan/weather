import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, WeatherReport } from '@prisma/client';
import dayjs from 'dayjs';
import { Configuration } from 'src/config/configuration.interface';
import { CachingService } from 'src/modules/caching';
import {
  OpenWeatherApiResponse,
  OpenWeatherApiService,
} from 'src/modules/shared';
import {
  Location,
  SortKey,
  WeatherQueryParams,
  WeatherResponse,
} from '../models';
import { WeatherReportRepository } from '../repositories';

@Injectable()
export class WeatherService {
  private readonly userId: string = '5f158d31-a39d-4bde-a5e6-32f5f6e75e0d';
  private readonly ttl: number = 60; // 1 minute
  private readonly location: Configuration['location'];
  constructor(
    private readonly openWeatherApiService: OpenWeatherApiService,
    private readonly weatherReportRepository: WeatherReportRepository,
    protected readonly configService: ConfigService,
    private readonly cacheService: CachingService,
  ) {
    this.location = configService.get('location');
  }

  private getLocation(latitude: number, longitude: number): Location {
    // For now we are hardcoding the location, we will get this from the location service later
    return {
      latitude,
      longitude,
      name: 'Changi Airport',
    };
  }

  async getCurrentWeather(): Promise<WeatherResponse> {
    const YYYYMMDDHHMM = dayjs().format('YYYY-MM-DD-HH-MM');
    const cacheKey = `weather:${this.location.latitude}:${this.location.longitude}:${YYYYMMDDHHMM}`;

    let weather = await this.cacheService.get<OpenWeatherApiResponse>(cacheKey);

    if (!weather) {
      weather = await this.openWeatherApiService.getCurrentWeather(
        this.location.latitude,
        this.location.longitude,
      );
      this.cacheService.set(cacheKey, weather, this.ttl).then();
    } else {
      // Update the timestamp
      weather.timestamp = Date.now();
    }

    await this.weatherReportRepository.create({
      temperature: weather.main.temp,
      pressure: weather.main.pressure,
      humidity: weather.main.humidity,
      cloudCover: weather.cloudCover,
      timestamp: new Date(weather.timestamp),
      longitude: this.location.longitude,
      latitude: this.location.latitude,
      // Currently we are hardcoding the user id, we will get this from the auth service later
      userId: this.userId,
    });

    return new WeatherResponse({
      temperature: weather.main.temp,
      pressure: weather.main.pressure,
      humidity: weather.main.humidity,
      cloudCover: weather.cloudCover,
      timestamp: weather.timestamp,
      location: this.getLocation(
        this.location.latitude,
        this.location.longitude,
      ),
    });
  }

  async getWeather(query: WeatherQueryParams) {
    const weathers = await this.openWeatherApiService.getWeather(
      this.location.latitude,
      this.location.longitude,
      query?.from,
      query?.to,
    );
    return {
      ...weathers,
      location: this.getLocation(
        this.location.latitude,
        this.location.longitude,
      ),
    };
  }

  async weatherReportPaginate({
    limit,
    page,
    sort,
  }: {
    limit: number;
    page?: number;
    sort: Map<SortKey, 'asc' | 'desc'>;
  }) {
    const orderBy: Prisma.WeatherReportOrderByWithRelationInput[] = [];
    if (sort?.size > 0)
      for (const [key, value] of sort) {
        orderBy.push({
          [key]: value,
        });
      }

    const reports = await this.weatherReportRepository.paginate({
      limit,
      page,
      orderBy: orderBy,
    });

    return {
      ...reports,
      items: reports.items.map((report) => ({
        ...report,
        location: this.getLocation(report.latitude, report.longitude),
      })),
    };
  }

  async getWeatherReportCompare(ids: number[]) {
    const reports = await this.weatherReportRepository.gets({
      id: {
        in: ids,
      },
    });
    const map: Record<number, WeatherReport & { location: Location }> = {};
    reports.forEach((report) => {
      map[report.id] = {
        ...report,
        location: this.getLocation(report.latitude, report.longitude),
      };
    });
    return map;
  }
}
