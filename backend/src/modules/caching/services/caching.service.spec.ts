import { Test, TestingModule } from '@nestjs/testing';
import {
  CachingService,
  CreateClient,
  RedisClientInjectable,
} from './caching.service';
import { Redis } from 'ioredis';

jest.mock('ioredis', () => ({
  Redis: jest.fn(),
}));

describe('CachingService', () => {
  let cachingService: CachingService;
  let redisClient = {
    get: jest.fn(),
    set: jest.fn(),
    keys: jest.fn(),
    scanStream: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CachingService,
        {
          provide: RedisClientInjectable,
          useValue: (redisClient = {
            get: jest.fn(),
            set: jest.fn(),
            keys: jest.fn(),
            scanStream: jest.fn(),
            del: jest.fn(),
          }),
        },
      ],
    }).compile();

    cachingService = module.get<CachingService>(CachingService);
    redisClient = module.get<Redis>(RedisClientInjectable) as any;
  });

  it('should create a standalone Redis client', () => {
    const options = {
      redisMode: 'client',
      redisHost: 'localhost',
      redisPort: 6379,
    };

    const client = CreateClient(options);

    expect(Redis).toHaveBeenCalledWith('redis://localhost:6379');
    expect(client).toBeInstanceOf(Redis);
  });

  it('should get a value from cache', async () => {
    const expectedResult = JSON.stringify({ foo: 'bar' });
    const testKey = 'testKey';
    redisClient.get.mockResolvedValue(expectedResult);
    const result = await cachingService.get(testKey);

    expect(redisClient.get).toHaveBeenCalledTimes(1);
    expect(redisClient.get).toHaveBeenCalledWith(testKey);
    expect(result).toEqual(JSON.parse(expectedResult));
  });
  it('should get a value from cache error', async () => {
    const err = new Error('error');
    const testKey = 'testKey';
    redisClient.get.mockRejectedValue(err);
    try {
      await cachingService.get(testKey);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
  it('should get keys from cache', async () => {
    const expectedResult = ['testKey'];
    const testKey = 'testKey';
    redisClient.keys.mockResolvedValue(expectedResult);

    const result = await cachingService.keys(testKey);

    expect(redisClient.keys).toHaveBeenCalledTimes(1);
    expect(redisClient.keys).toHaveBeenCalledWith(testKey);
    expect(result).toEqual(expectedResult);
  });
  it('should get keys from cache error', async () => {
    const err = new Error('error');
    redisClient.keys.mockRejectedValue(err);
    try {
      await cachingService.keys('testKey');
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
  it('should create key scanner from cache', () => {
    // TODO: Implement test
  });
  it('should create key scanner from cache error', async () => {
    const err = new Error('error');
    redisClient.get.mockRejectedValue(err);
    try {
      await cachingService.keys('testKey');
    } catch (error) {
      expect(error).toEqual(err);
    }
  });

  it('should set a value in cache', async () => {
    const key = 'testKey';
    const value = { foo: 'bar' };
    const ttl = 1000;
    await cachingService.set(key, value, ttl);
    expect(redisClient.set).toHaveBeenCalledTimes(1);
    expect(redisClient.set).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
      'EX',
      ttl,
    );
  });
  it('should set a value from cache error', async () => {
    const err = new Error('error');
    redisClient.set.mockRejectedValue(err);
    try {
      await cachingService.set('testKey', 'foo', 1000);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
  it('should del a value in cache', async () => {
    const testKey = 'testKey';
    await cachingService.del(testKey);
    expect(redisClient.del).toHaveBeenCalledTimes(1);
    expect(redisClient.del).toHaveBeenCalledWith(testKey);
  });
  it('should del a value from cache error', async () => {
    redisClient.del.mockRejectedValue(new Error('error'));
    try {
      await cachingService.del('testKey');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
  it('should delMany keys in cache', async () => {
    const testKeys = ['testKey', 'testKey2'];
    await cachingService.delMany(testKeys);
    expect(redisClient.del).toHaveBeenCalledTimes(2);
    expect(redisClient.del).toHaveBeenCalledWith(testKeys[0]);
    expect(redisClient.del).toHaveBeenCalledWith(testKeys[1]);
  });
  it('should delMany keys from cache error', async () => {
    const err = new Error('error');
    redisClient.del.mockRejectedValue(err);
    try {
      await cachingService.delMany(['testKey']);
    } catch (error) {
      expect(error).toEqual(err);
    }
  });
});
