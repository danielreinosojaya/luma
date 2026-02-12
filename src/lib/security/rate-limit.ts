import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Rate limiters por endpoint
export const rateLimiters = {
  // Public endpoints: 60 req/min per IP
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
  }),

  // Auth endpoints: 10 req/min per IP
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
  }),

  // API authenticated: 120 req/min per user
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    analytics: true,
  }),

  // Booking appointments: 5 req/min per IP (prevent spam)
  booking: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
  }),
};

export async function checkRateLimit(
  key: string,
  type: keyof typeof rateLimiters = "public"
): Promise<{ success: boolean; reset: number }> {
  try {
    const result = await rateLimiters[type].limit(key);
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
