"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingStateLMS() {
  return (
    <div className="flex">
      <DotLottieReact
        src="/animation/robot-arms.lottie"
        loop
        autoplay
        speed={1}
        style={{ width: 600 }}
      />
    </div>
  );
}
