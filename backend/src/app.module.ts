import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { Environment, validate } from './config/validation';
import { CoreAppModule } from './core-app.module';
import { HttpModule } from './modules/http';
import { SharedModule } from './modules/shared';
import { WeatherModule } from './modules/weathers/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      validationOptions: {
        abortEarly: true,
      },
    }),
    CoreAppModule.forRootAsync({
      useFactory: (configSerivce: ConfigService) => ({
        env: configSerivce.get<Environment>('env'),
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    SharedModule,
    WeatherModule,
  ],
})
export class AppModule {}
