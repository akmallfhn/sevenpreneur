"use client";
import { FeatureTrackingProps, useTrackClick } from "@/lib/feature-tracking";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

interface AppFloatingButtonProps extends FeatureTrackingProps {
  targetURL: string;
  children: ReactNode;
}

export default function AppFloatingButton(props: AppFloatingButtonProps) {
  const [showButton, setShowButton] = useState(false);

  // Appear after scroll 100 px
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tracking Click
  const trackClick = useTrackClick({
    featureName: props.featureName,
    featureId: props.featureId,
    featureProductCategory: props.featureProductCategory,
    featureProductName: props.featureProductName,
    featureProductAmount: props.featureProductAmount,
    featurePagePoint: props.featurePagePoint,
    featurePlacement: props.featurePlacement,
    featurePosition: props.featurePosition,
  });

  return (
    <div
      onClick={() => {
        trackClick();
      }}
      className={`floating-button fixed w-full max-w-[132px] bottom-16 right-5 transition transform ease-in-out z-[80] active:scale-75 md:max-w-[200px] md:bottom-7 md:right-7 ${
        showButton
          ? "opacity-100 pointer-events-auto translate-x-0 duration-500"
          : "opacity-0 pointer-events-none translate-x-full duration-300"
      }`}
    >
      <Link href={props.targetURL}>{props.children}</Link>
    </div>
  );
}
