"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PageContainerCMS from "@/components/pages/PageContainerCMS";
import PageContainerSVP from "@/components/pages/PageContainerSVP";

export type PageLoadingType = "CMS" | "LMS" | "SVP";

export default function AppPageLoading({ type }: { type: PageLoadingType }) {
  if (type === "CMS") {
    return (
      <PageContainerCMS className="min-h-screen">
        <div className="flex w-full items-center justify-center">
          <DotLottieReact
            src="/animation/flying-list.lottie"
            loop
            autoplay
            speed={1}
            style={{ width: 900 }}
          />
        </div>
      </PageContainerCMS>
    );
  }

  if (type === "SVP") {
    return (
      <PageContainerSVP className="flex min-h-screen justify-center">
        <div className="flex w-full items-center justify-center">
          <DotLottieReact
            src="/animation/loading-spinner.lottie"
            loop
            autoplay
            speed={1}
            style={{ width: 200 }}
          />
        </div>
      </PageContainerSVP>
    );
  }

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
