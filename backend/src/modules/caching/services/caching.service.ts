import { Inject, Injectable } from '@nestjs/common';
import { Cluster, Redis, ScanStream } from 'ioredis';
import { Logger } from 'src/modules/loggers';

export const RedisClientInjectable = Symbol('redisClient');
let redisClient: Redis | Cluster = null;
export const CreateClient = (options: any): Redis | Cluster => {
  if (redisClient) {
    return redisClient;
  }

  if (options.redisMode === 'client') {
    redisClient = new Redis(
      `redis://${options.redisHost}:${options.redisPort}`,
    );
  } else if (options.redisMode === 'cluster') {
    const clusterNodes = options.redisClusterNodes;
    redisClient = new Cluster(
      clusterNodes.map((node: string) => ({ url: node })),
    );
  }

  return redisClient;
};

@Injectable()
export class CachingService {
  private readonly client: Redis | Cluster;
  private readonly logger = new Logger(CachingService.name);

  constructor(
    @Inject(RedisClientInjectable)
    redisClient: Redis | Cluster,
  ) {
    this.client = redisClient;
  }

  async keys(pattern?: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error('getting from Redis error:', error);
      return [];
    }
  }

  createKeyScanner(pattern?: string, countPerCall: number = 100): ScanStream {
    try {
      if (this.client instanceof Redis) {
        return this.client.scanStream({
          match: pattern,
          count: countPerCall,
        });
      }
      throw new Error('cannot create scanner for cluster mode');
    } catch (error) {
      this.logger.error('creating key scanner from Redis error:', error);
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return JSON.parse(value);
    } catch (error) {
      this.logger.error('getting from Redis error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      let args: any[] = [key, JSON.stringify(value)];
      if (ttl) {
        args = [...args, 'EX', ttl];
      }
      await this.client.set.call(this.client, ...args);
    } catch (error) {
      this.logger.error('setting in Redis error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error('deleting in Redis error:', error);
    }
  }

  async delMany(keys: string[]): Promise<void> {
    try {
      await Promise.all(keys.map((k) => this.client.del(k)));
    } catch (error) {
      this.logger.error('deleting in Redis error:', error);
    }
  }

  // Add other methods for Redis operations (e.g., del, hget, hset, etc.)
}
