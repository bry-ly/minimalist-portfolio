"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";

import type { GithubActivity } from "@/lib/live-activity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LiveActivityResponse = {
  data: {
    github: GithubActivity | null;
  };
  errors?: Record<string, string>;
  fetchedAt: string;
};

type ComponentState = {
  github: GithubActivity | null;
  errors: Record<string, string>;
  isLoading: boolean;
  isRefreshing: boolean;
  fetchedAt?: string;
};

const INITIAL_STATE: ComponentState = {
  github: null,
  errors: {},
  isLoading: true,
  isRefreshing: false,
};

const REFRESH_INTERVAL_MS = 60_000;

export function LiveActivity() {
  const [{ github, errors, isLoading, isRefreshing, fetchedAt }, setState] =
    useState<ComponentState>(INITIAL_STATE);

  useEffect(() => {
    let isMounted = true;

    async function load(initial: boolean) {
      if (!isMounted) return;

      setState((prev) => ({
        ...prev,
        isLoading: initial ? true : prev.isLoading,
        isRefreshing: initial ? prev.isRefreshing : true,
      }));

      try {
        const response = await fetch("/api/activity", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const body = (await response.json()) as LiveActivityResponse;

        if (!isMounted) return;

        setState({
          github: body.data.github ?? null,
          errors: body.errors ?? {},
          isLoading: false,
          isRefreshing: false,
          fetchedAt: body.fetchedAt,
        });
      } catch (error) {
        if (!isMounted) return;

        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            global:
              error instanceof Error
                ? error.message
                : "Unable to load live activity.",
          },
          isLoading: false,
          isRefreshing: false,
        }));
      }
    }

    load(true);
    const interval = setInterval(() => load(false), REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  let githubContent: ReactNode;

  if (isLoading) {
    githubContent = (
      <div className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full rounded" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
    );
  } else if (!github) {
    githubContent = (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          No recent activity
        </p>
        <p className="text-xs text-muted-foreground max-w-[280px]">
          Push something new to GitHub to see your latest commits appear here in
          real-time.
        </p>
      </div>
    );
  } else {
    githubContent = (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2 flex-shrink-0">
            <svg
              className="h-4 w-4 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Link
                href={`https://github.com/${github.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200 truncate"
              >
                {github.repo}
              </Link>
              {github.branch && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 3v12" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                  </svg>
                  {github.branch}
                </span>
              )}
            </div>

            {github.message && (
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border rounded-full" />
                <p className="text-sm leading-relaxed text-muted-foreground pl-4 break-words">
                  {github.message}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatRelativeTime(github.timestamp)}</span>
          </div>
          {github.url && (
            <Link
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-200"
            >
              View commit
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl sm:text-4xl font-light">Live Activity</h2>
            {isRefreshing && !isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <svg
                  className="h-3.5 w-3.5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Updating
              </div>
            )}
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Real-time feed of my latest public GitHub commits. Updates
            automatically every minute.
          </p>
        </div>
        {!isLoading && fetchedAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Last updated {formatRelativeTime(fetchedAt)}
          </div>
        )}
      </div>

      {errors.global && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3">
          <svg
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="font-medium mb-1">Connection Error</p>
            <p className="text-xs opacity-90">{errors.global}</p>
          </div>
        </div>
      )}

      <Card className="border-border/50 hover:border-border transition-colors duration-300 overflow-hidden group">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="text-lg sm:text-xl">
                Latest Commit Activity
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Streaming live from my GitHub profile
              </CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors duration-300">
              <svg
                className="h-4 w-4 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">{githubContent}</CardContent>
        {errors.github && (
          <div className="px-6 pb-4 flex items-center gap-2 text-xs text-destructive">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {errors.github}
          </div>
        )}
      </Card>
    </div>
  );
}

function formatRelativeTime(timestamp?: string) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = Date.now();
  const diff = now - date.getTime();
  if (Math.abs(diff) < 30_000) {
    return "just now";
  }

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const minutes = Math.round(diff / 60_000);
  if (Math.abs(minutes) < 60) {
    return rtf.format(-minutes, "minute");
  }

  const hours = Math.round(diff / 3_600_000);
  if (Math.abs(hours) < 24) {
    return rtf.format(-hours, "hour");
  }

  const days = Math.round(diff / 86_400_000);
  if (Math.abs(days) < 7) {
    return rtf.format(-days, "day");
  }

  const weeks = Math.round(diff / (86_400_000 * 7));
  if (Math.abs(weeks) < 5) {
    return rtf.format(-weeks, "week");
  }

  const months = Math.round(diff / (86_400_000 * 30));
  if (Math.abs(months) < 12) {
    return rtf.format(-months, "month");
  }

  const years = Math.round(diff / (86_400_000 * 365));
  return rtf.format(-years, "year");
}
