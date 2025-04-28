import { Module } from '@nestjs/common';
import { CachingModule } from '../caching';
import { PrismaModule } from '../prisma';
import { WeatherController } from './controllers/weather.controller';
import { WeatherReportRepository } from './repositories';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [PrismaModule, CachingModule],
  controllers: [WeatherController],
  providers: [WeatherReportRepository, WeatherService],
})
export class WeatherModule {}
