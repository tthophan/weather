import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './docs/docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api', { exclude: ['healthcheck'] });

  const configService = await app.resolve(ConfigService);
  const logLevel = (configService.get<string>('logLevel') ||
    'debug') as LogLevel;
  Logger.overrideLogger([logLevel]);

  // Enable version
  app.enableVersioning({
    defaultVersion: '1.0',
    type: VersioningType.URI,
    prefix: 'v',
  });

  // enable graceful shutdown
  app.enableShutdownHooks();
  // Swagger setup
  if (configService.get<string>('env') !== 'production') {
    setupSwagger(app);
  }

  const port = configService.get<number>('port');
  await app.listen(port);
  Logger.log(`Server running on port ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
