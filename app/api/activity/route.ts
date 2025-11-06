import { NextRequest, NextResponse } from "next/server";

import { fetchLatestGithubActivity } from "@/lib/live-activity";
import { rateLimit, createRateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limiting: 30 requests per minute
  const rateLimitResult = await rateLimit(request, {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30,
  });

  // If rate limit exceeded, return 429 error
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: createRateLimitHeaders(rateLimitResult),
      }
    );
  }

  let githubActivity = null;

  const errors: Record<string, string> = {};

  try {
    githubActivity = await fetchLatestGithubActivity();
  } catch (error) {
    errors.github =
      error instanceof Error
        ? error.message
        : "Unable to fetch GitHub activity.";
  }

  const payload = {
    github: githubActivity,
  };

  return NextResponse.json(
    {
      data: payload,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
        ...createRateLimitHeaders(rateLimitResult),
      },
    }
  );
}
