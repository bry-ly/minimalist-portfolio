"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import React from "react";

// Website launch date - November 4, 2025
const LAUNCH_DATE = new Date("2025-11-04T00:00:00Z");
const LAUNCH_TIME = LAUNCH_DATE.getTime();

// Format number with leading zero - memoized outside component
const formatNumber = (num: number) => String(num).padStart(2, "0");

export function UptimeTimer() {
  const [uptime, setUptime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateUptime = () => {
      const now = Date.now();
      const diff = now - LAUNCH_TIME;

      if (diff < 0) {
        setUptime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      setUptime({
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
      });
    };

    calculateUptime();
    const interval = setInterval(calculateUptime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <span className="text-muted-foreground font-medium">Live Uptime</span>
      </div>
      <div className="flex items-center gap-1.5 font-mono">
        <TimeUnit value={uptime.days} label="Days" />
        <span className="text-muted-foreground pb-3">:</span>
        <TimeUnit value={uptime.hours} label="Hrs" />
        <span className="text-muted-foreground pb-3">:</span>
        <TimeUnit value={uptime.minutes} label="Min" />
        <span className="text-muted-foreground pb-3">:</span>
        <TimeUnit value={uptime.seconds} label="Sec" />
      </div>
    </div>
  );
}

// Memoized sub-component to prevent re-rendering of unchanged units
const TimeUnit = React.memo(({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-foreground font-semibold text-sm">
      {formatNumber(value)}
    </span>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
  </div>
));
TimeUnit.displayName = "TimeUnit";
