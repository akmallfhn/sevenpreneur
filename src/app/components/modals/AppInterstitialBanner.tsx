"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";

interface AppInterstitialBannerProps {
  bannerTimeInterval: number;
  redirectUrl: string;
  interstitialImageMobile: string;
  interstitialImageDesktop: string;
}

export default function AppInterstitialBanner({
  bannerTimeInterval,
  redirectUrl,
  interstitialImageMobile,
  interstitialImageDesktop,
}: AppInterstitialBannerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [interstitialImage, setInterstitialImage] = useState(
    interstitialImageMobile
  );

  // Determine if banner should show
  useEffect(() => {
    // Retrieves the timestamp value of the last time the popup was closed (saved previously) from localStorage.
    const lastShown = localStorage.getItem("interstitial_last_shown");
    const now = Date.now();
    // !lastShown → If no timestamp has been saved before, it means the banner has never been closed → show the banner.
    // now - parseInt(lastShown) → Calculate the difference between the current time and the last time the banner was closed.
    // > bannerTimeInterval → Compare whether the time difference has exceeded the set interval
    if (!lastShown || now - parseInt(lastShown) > bannerTimeInterval) {
      queueMicrotask(() => setIsOpen(true));
    }
  }, [bannerTimeInterval]);

  // Blocked scroll behind
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Dynamic KV
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dataLayer?.push({
      event: "click",
      feature_name: "interstitial_banner_promotion",
    });
    setTimeout(() => {
      localStorage.setItem("interstitial_last_shown", Date.now().toString());
      setIsOpen(false);
      router.push(redirectUrl);
    }, 50);
  };

  // Function to set the time when the user actually interacts
  const handleClose = () => {
    // Store timestamp only after user action.
    localStorage.setItem("interstitial_last_shown", Date.now().toString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="interstitial-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]">
        <div className="interstitial-container fixed flex bg-white outline-8 max-w-[312px] w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <a
            href={redirectUrl}
            className="interstitial-content relative flex flex-col aspect-interstitial-banner w-full rounded-lg overflow-hidden sm:hover:cursor-pointer sm:aspect-web-popup"
            onClick={handleLinkClick}
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
          </a>
          {/* Button Close */}
          <div
            className="absolute flex p-1.5 text-white bg-[#3E3E3E] -top-4 -right-4 rounded-full hover:cursor-pointer"
            onClick={handleClose}
          >
            <X className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
