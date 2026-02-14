import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize Redis if both URL and token are configured
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limiters por endpoint
export const rateLimiters = {
  // Public endpoints: 60 req/min per IP
  public: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
  }) : null,

  // Auth endpoints: 10 req/min per IP
  auth: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
  }) : null,

  // API authenticated: 120 req/min per user
  api: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    analytics: true,
  }) : null,

  // Booking appointments: 5 req/min per IP (prevent spam)
  booking: redis ? new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
  }) : null,
};

export async function checkRateLimit(
  key: string,
  type: keyof typeof rateLimiters = "public"
): Promise<{ success: boolean; reset: number }> {
  try {
    // If Redis is not configured, skip rate limiting
    const limiter = rateLimiters[type];
    if (!limiter) {
      return { success: true, reset: 0 };
    }

    const result = await limiter.limit(key);
    return {
      success: result.success,
      reset: result.reset,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fallback: allow request if service is down
    return { success: true, reset: 0 };
  }
}
