import { Configuration } from './configuration.interface';
import { Environment } from './validation';

export default (): Configuration => {
  process.env.DATABASE_URL = `postgresql://${encodeURIComponent(process.env.POSTGRESQL_USER)}:${encodeURIComponent(process.env.POSTGRESQL_PASSWORD)}@${process.env.POSTGRESQL_HOST}:${process.env.POSTGRESQL_PORT}/${process.env.POSTGRESQL_DB}`;
  return {
    env: process.env.NODE_ENV as Environment,
    tz: process.env.TZ,
    port: parseInt(process.env.PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL,
    openWeatherApi: {
      apiKey: process.env.OPEN_WEATHER_API_KEY,
    },
    location: {
      latitude: 1.3586,
      longitude: 103.8198,
    },
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379'),
    redisMode: process.env.REDIS_MODE || 'client',
    redisClusterNodes: process.env.REDIS_CLUSTER_NODES?.split(','),
    rateLimit: {
      enabled: /^true$/i.test(process.env.RATE_LIMIT_ENABLED || 'true'),
      limit: parseInt(process.env.RATE_LIMIT || '100'),
      timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '1000'),
    },
  };
};
