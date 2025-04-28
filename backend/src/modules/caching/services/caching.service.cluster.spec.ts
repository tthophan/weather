import { CreateClient } from './caching.service';
import { Cluster } from 'ioredis';

jest.mock('ioredis', () => ({
  Cluster: jest.fn(),
}));

describe('CachingService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe('CachingService by Redis Cluster', () => {
    it('should create Redis Cluster', () => {
      const options = {
        redisMode: 'cluster',
        redisClusterNodes: ['localhost:6379'],
      };

      const client = CreateClient(options);
      expect(Cluster).toHaveBeenCalledWith(
        options.redisClusterNodes.map((node: string) => ({ url: node })),
      );
      expect(client).toBeInstanceOf(Cluster);
    });
  });
});
