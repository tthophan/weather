import { Global, Module } from '@nestjs/common';
import { OpenWeatherApiService } from './services';

@Global()
@Module({
  imports: [],
  providers: [OpenWeatherApiService],
  exports: [OpenWeatherApiService],
})
export class SharedModule {}
