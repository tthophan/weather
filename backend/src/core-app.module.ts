import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { Configuration } from './config/configuration.interface';
import {
  ConfigurableModuleClass,
  MODULE_ASYNC_OPTIONS_TYPE,
  MODULE_OPTIONS_TYPE,
} from './constants';
import { ERROR_CODES } from './constants/errors';
import { CoreExceptionFilter } from './filters';
import { CoreResponseInterceptor, LoggingInterceptor } from './interceptors';
import { RequestContextMiddleware } from './middlewares';
import { HealthModule } from './modules/health';
import { LoggerModule } from './modules/loggers';

@Module({
  imports: [
    HealthModule,
    LoggerModule,
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService, reflector: Reflector) => {
        const rateLimitConfiguration =
          configService.get<Configuration['rateLimit']>('rateLimit');
        return [
          {
            // default configuration
            ttl: rateLimitConfiguration.timeWindow,
            limit: rateLimitConfiguration.limit,
            errorMessage: ERROR_CODES.RATE_LIMIT_EXCEEDED,
            skipIf: () => {
              return !rateLimitConfiguration.enabled;
            },
          },
        ];
      },
      imports: [ConfigModule],
      inject: [ConfigService, Reflector],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CoreResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CoreExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          validationError: {
            target: false,
            value: false,
          },
          stopAtFirstError: true,
        }),
    },
  ],
})
export class CoreAppModule
  extends ConfigurableModuleClass
  implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
  static forRoot(options: typeof MODULE_OPTIONS_TYPE): DynamicModule {
    return {
      ...super.forRoot(options),
    };
  }

  static forRootAsync(
    options: typeof MODULE_ASYNC_OPTIONS_TYPE,
  ): DynamicModule {
    return {
      ...super.forRootAsync(options),
    };
  }
}
