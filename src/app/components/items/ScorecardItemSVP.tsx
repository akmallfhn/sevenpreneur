"use client";

import { useEffect, useRef, useState } from "react";

interface ScorecardItemSVPProps {
  scorecardValue: number;
  scorecardName: string;
  isMoreValue?: boolean;
}

export default function ScorecardItemSVP({
  scorecardValue,
  scorecardName,
  isMoreValue = false,
}: ScorecardItemSVPProps) {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const hasAnimated = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const target = scorecardValue;
          const duration = 950;
          const start = performance.now();

          const animate = (timestamp: number) => {
            const progress = (timestamp - start) / duration; // Calculate how many percent of the animation is running.
            const easedProgress = Math.min(1, progress); // So that progress never goes beyond 100%
            const randomOffset = Math.floor(Math.random() * 20); // Add random numbers 0–19 to make the animation feel more "alive"
            const current = Math.floor(easedProgress * target + randomOffset); // Currently displayed = animation progress × target + random number.
            setDisplayedNumber(current >= target ? target : current); // The current has passed the target, force it straight to the target number so that it doesn't exceed it.

            // As long as the animation is not finished, keep calling animate() again in the next frame.
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          // Start the animation. The browser will call animate() for the first frame.
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [scorecardValue]);

  return (
    <div
      className="scorecard-item flex flex-col w-[68px] transform transition-all lg:w-[98px]"
      ref={containerRef}
    >
      <h5 className="text-white text-xl font-brand font-extrabold lg:text-2xl">
        {displayedNumber.toLocaleString()}
        {isMoreValue && <span>+</span>}
      </h5>
      <p className="text-white text-xs font-bodycopy lg:text-lg">
        {scorecardName}
      </p>
    </div>
  );
}
