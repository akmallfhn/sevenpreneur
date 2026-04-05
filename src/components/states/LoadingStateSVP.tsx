"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingStateSVP() {
  return (
    <div className="flex">
      <DotLottieReact
        src="/animation/loading-spinner.lottie"
        loop
        autoplay
        speed={1}
        style={{ width: 200 }}
      />
    </div>
  );
}
