import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RATE_LIMIT_KEY } from './metadata.constant';

interface RateLimitOptions {
  /**
   * Maximum number of requests per time window.
   */
  limit: number;
  /**
   * Time window in milliseconds.
   */
  ttl: number;
}

export const RateLimit = ({
  limit,
  ttl,
}: RateLimitOptions): MethodDecorator & ClassDecorator =>
  applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, true),
    Throttle({ default: { limit, ttl } }),
  );
