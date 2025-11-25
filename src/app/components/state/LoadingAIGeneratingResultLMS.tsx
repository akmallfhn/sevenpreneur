"use client";
import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingAIGeneratingResult() {
  const states = [
    "Scanning the entire internet at hyperspeed…",
    "Compiling Agora AI’s neural intelligence matrix…",
    "Calibrating the response engine…",
    "Cooking something smart...",
    "Shaping the report…",
  ];

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Side effect to show multi step state
  useEffect(() => {
    const interval = setInterval(() => {
      // Stop entirely if already last index
      if (index === states.length - 1) {
        clearInterval(interval);
        return;
      }

      setVisible(false);

      setTimeout(() => {
        setIndex((prev) => (prev === states.length - 1 ? prev : prev + 1));
        setVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [index, states.length]);

  const isLast = index === states.length - 1;

  return (
    <div className="loading-component relative hidden lg:flex flex-col">
      <DotLottieReact
        src="/animation/flying-list.lottie"
        loop
        autoplay
        speed={1}
        style={{ width: 900 }}
      />
      <div className="state-text absolute flex flex-col bottom-24 left-1/2 -translate-x-1/2 gap-2 items-center">
        <p
          className={`state-description font-bodycopy text-center font-medium text-alternative transition-all duration-500 ${
            isLast
              ? "opacity-100 translate-y-0"
              : visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-1"
          }`}
        >
          {states[index]}
        </p>
      </div>
    </div>
  );
}
