"use client";
import { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";

interface AppInterstitialBannerProps {
  isOpen: boolean;
  redirectUrl: string;
  interstitialImageMobile: string;
  interstitialImageDesktop: string;
  onClose: () => void;
}

export default function AppInterstitialBanner({
  isOpen,
  redirectUrl,
  interstitialImageMobile,
  interstitialImageDesktop,
  onClose,
}: AppInterstitialBannerProps) {
  const [interstitialImage, setInterstitialImage] = useState(
    interstitialImageMobile
  );

  // --- Blocked scroll behind
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // --- Dynamic KV
  useEffect(() => {
    function updateImage() {
      if (window.innerWidth >= 640) {
        setInterstitialImage(interstitialImageDesktop);
      } else {
        setInterstitialImage(interstitialImageMobile);
      }
    }
    updateImage();
    window.addEventListener("resize", updateImage);
    return () => window.removeEventListener("resize", updateImage);
  }, [interstitialImageMobile, interstitialImageDesktop]);

  if (!isOpen) return null;

  return (
    <div>
      <div className="interstitial-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]">
        <div className="interstitial-container fixed flex bg-white outline-8 max-w-[312px] w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <Link
            href={redirectUrl}
            className="interstitial-content relative flex flex-col aspect-interstitial-banner w-full rounded-lg overflow-hidden sm:hover:cursor-pointer sm:aspect-web-popup"
            onClick={() => {
              onClose();
            }}
          >
            {/* Key Visual */}
            <Image
              className="flex object-cover w-full h-full"
              src={interstitialImage}
              alt={"Buy Now"}
              width={1200}
              height={1200}
            />

            {/* CTA */}
            <div className="button-action absolute flex bottom-10 left-1/2 -translate-x-1/2 z-[30] sm:bottom-4 lg:bottom-5 xl:bottom-7">
              <AppButton
                className="w-[180px]"
                variant="secondary"
                size="mediumRounded"
                featureName="interstitial_banner_promotion"
              >
                Buy Ticket Now
              </AppButton>
            </div>
            {/* Overlay */}
            <div
              className={`overlay absolute inset-0 bg-linear-to-t from-0% from-black/50 to-30% to-black/0`}
            />
          </Link>
          {/* Button Close */}
          <div
            className="absolute flex p-1.5 text-white bg-[#3E3E3E] -top-4 -right-4 rounded-full hover:cursor-pointer"
            onClick={onClose}
          >
            <X className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
