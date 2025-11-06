import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitStore>();

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limiter using sliding window algorithm
 * @param request - Next.js request object
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  // Get identifier (IP address or fallback)
  const identifier = getIdentifier(request);
  const now = Date.now();
  const { interval, uniqueTokenPerInterval: limit } = config;

  // Get or create rate limit entry
  let tokenCount = rateLimitStore.get(identifier);

  if (!tokenCount || now > tokenCount.resetTime) {
    // Create new entry or reset expired entry
    tokenCount = {
      count: 0,
      resetTime: now + interval,
    };
  }

  tokenCount.count += 1;
  const remaining = Math.max(0, limit - tokenCount.count);
  const success = tokenCount.count <= limit;

  // Update store
  rateLimitStore.set(identifier, tokenCount);

  // Clean up old entries periodically (simple cleanup)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  return {
    success,
    limit,
    remaining,
    reset: tokenCount.resetTime,
  };
}

/**
 * Get unique identifier from request (IP address)
 */
function getIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (for proxies/load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a default identifier
  return "unknown";
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.reset).toISOString(),
  };
}
