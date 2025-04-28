import { Environment } from './validation';

export interface Configuration {
  tz: string;
  port: number;
  env: Environment;
  databaseUrl: string;
  openWeatherApi: {
    apiKey: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  redisHost: string;
  redisPort: number;
  redisMode: string;
  redisClusterNodes: string[];
  rateLimit: {
    enabled: boolean;
    limit: number;
    timeWindow: number;
  }
}
