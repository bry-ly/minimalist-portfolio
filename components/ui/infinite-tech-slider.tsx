'use client';

import React, { useEffect, useRef } from 'react';
import { TextEffect } from './text-effect';
import { cn } from '@/lib/utils';

interface InfiniteTechSliderProps {
  technologies: string[];
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
}

export function InfiniteTechSlider({
  technologies,
  className,
  speed = 20,
  direction = 'left',
}: InfiniteTechSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    if (!scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);

    // Duplicate items for seamless loop
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true) as HTMLElement;
      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });

    setIsAnimating(true);
  }, []);

  return (
    <div
      className={cn('w-full overflow-hidden mask-gradient', className)}
      style={{
        maskImage:
          'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, white 10%, white 90%, transparent)',
      }}
    >
      <div
        ref={scrollerRef}
        className={cn(
          'flex gap-4 w-max',
          isAnimating && direction === 'left' && 'animate-scroll-left',
          isAnimating && direction === 'right' && 'animate-scroll-right'
        )}
        style={
          isAnimating
            ? {
                animationDuration: `${speed}s`,
              }
            : {}
        }
      >
        {technologies.map((tech, index) => (
          <div
            key={`tech-${index}`}
            className="flex-shrink-0 px-4 py-2 transition-all duration-300"
          >
            <TextEffect
              per="char"
              preset="fade-in-blur"
              className="text-xs font-medium text-foreground whitespace-nowrap"
              speedReveal={2}
              speedSegment={0.8}
            >
              {tech}
            </TextEffect>
          </div>
        ))}
      </div>
    </div>
  );
}
