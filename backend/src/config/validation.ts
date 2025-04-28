import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsString()
  TZ: string;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  POSTGRESQL_USER: string;

  @IsString()
  POSTGRESQL_PASSWORD: string;

  @IsString()
  POSTGRESQL_DB: string;

  @IsString()
  POSTGRESQL_HOST: string;

  @IsString()
  REDIS_HOST: string;
  
  @IsNumber()
  REDIS_PORT: number;

  @IsEnum(['client', 'cluster'])
  REDIS_MODE: string;

  @IsString()
  OPEN_WEATHER_API_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const message = errors
      .flatMap(({ constraints }) =>
        Object.keys(constraints).flatMap((key) => constraints[key]),
      )
      .join('\n');
    console.error(`ENV Missing:\n${message}`);
    throw new Error('ENV missing');
  }
  return validatedConfig;
}
