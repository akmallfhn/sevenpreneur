"use client";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingStateCMS() {
  return (
    <div className="hidden lg:flex">
      <DotLottieReact
        src="/animation/flying-list.lottie"
        loop
        autoplay
        speed={1}
        style={{ width: 900 }}
      />
    </div>
  );
}
