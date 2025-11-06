"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Tech {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface InfiniteTechSliderProps {
  technologies: Tech[];
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}

const TechItem = React.memo(({ tech, keyPrefix }: { tech: Tech; keyPrefix: string }) => (
  <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2">
    <tech.icon className={`w-4 h-4 ${tech.color}`} />
    <span className="text-xs font-medium text-foreground whitespace-nowrap">
      {tech.name}
    </span>
  </div>
));
TechItem.displayName = "TechItem";

export const InfiniteTechSlider = React.memo(function InfiniteTechSlider({
  technologies,
  className,
  speed = 30,
  direction = "left",
}: InfiniteTechSliderProps) {
  // Memoize mask style to avoid recreating on every render
  const maskStyle = useMemo(
    () => ({
      maskImage:
        "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
      WebkitMaskImage:
        "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
    }),
    []
  );

  // Memoize animation style
  const animationStyle = useMemo(
    () => ({
      animationDuration: `${speed}s`,
      animationDirection: direction === "right" ? "reverse" : "normal",
      width: "max-content",
    }),
    [speed, direction]
  );

  return (
    <div
      className={cn(
        "w-full overflow-x-hidden overflow-y-visible touch-none pointer-events-none",
        className
      )}
      style={maskStyle}
    >
      <div
        className={cn(
          "flex gap-6 flex-nowrap animate-infinite-scroll whitespace-nowrap will-change-transform"
        )}
        style={animationStyle}
      >
        {technologies.map((tech, index) => (
          <TechItem key={`tech-${index}`} tech={tech} keyPrefix="tech" />
        ))}
        {technologies.map((tech, index) => (
          <TechItem key={`tech-dup-${index}`} tech={tech} keyPrefix="tech-dup" />
        ))}
      </div>
    </div>
  );
});
