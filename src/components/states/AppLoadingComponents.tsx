"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function AppLoadingComponents() {
  return (
    <div className="flex w-full h-full py-10 justify-center">
      <div className="flex">
        <DotLottieReact
          src="/animation/loading-spinner.lottie"
          loop
          autoplay
          speed={1}
          style={{ width: 120 }}
        />
      </div>
    </div>
  );
}
