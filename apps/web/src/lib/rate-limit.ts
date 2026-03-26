import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Distributed rate limiting using Upstash Redis.
 * Prevents spam across multiple serverless instances.
 */
export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rate_limit:${ip}`;
  const limit = 5; // 5 messages
  const window = 60; // 60 seconds

  try {
    const currentCount = await redis.incr(key);
    
    if (currentCount === 1) {
      await redis.expire(key, window);
    }

    return currentCount > limit;
  } catch (error) {
    console.error("Redis rate limit error:", error);
    return false; // Fail open in case of Redis issues
  }
}
