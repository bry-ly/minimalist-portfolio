"use client";

import React, { useEffect, useRef } from "react";
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

export function InfiniteTechSlider({
  technologies,
  className,
  speed = 30,
  direction = "left",
}: InfiniteTechSliderProps) {
  const renderTechItem = (
    tech: Tech,
    index: number,
    duplicate: boolean = false
  ) => (
    <div
      key={duplicate ? `tech-duplicate-${index}` : `tech-${index}`}
      className="flex-shrink-0 flex items-center gap-2 px-3 py-2"
    >
      <tech.icon className={`w-4 h-4 ${tech.color}`} />
      <span className="text-xs font-medium text-foreground whitespace-nowrap">
        {tech.name}
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        "w-full overflow-x-hidden overflow-y-visible touch-none pointer-events-none",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
      }}
    >
      <div
        className={cn(
          "flex gap-6 flex-nowrap animate-infinite-scroll whitespace-nowrap will-change-transform"
        )}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
          width: "max-content",
        }}
      >
        {technologies.map((tech, index) => renderTechItem(tech, index, false))}
        {technologies.map((tech, index) => renderTechItem(tech, index, true))}
      </div>
    </div>
  );
}
