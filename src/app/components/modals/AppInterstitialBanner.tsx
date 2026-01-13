"use client";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";

interface AppInterstitialBannerProps {
  interstitialImageMobile: string;
  interstitialImageDesktop: string;
  interstitialURL: string;
  interstitialTimeInterval: number;
  interstitialAction: string;
}

export default function AppInterstitialBanner(
  props: AppInterstitialBannerProps
) {
  const [isOpen, setIsOpen] = useState(false);
  const [interstitialImage, setInterstitialImage] = useState(
    props.interstitialImageMobile
  );

  // Determine if banner should show
  useEffect(() => {
    // Retrieves the timestamp value of the last time the popup was closed (saved previously) from localStorage.
    const lastShown = localStorage.getItem("interstitial_last_shown");
    const now = Date.now();
    // !lastShown → If no timestamp has been saved before, it means the banner has never been closed → show the banner.
    // now - parseInt(lastShown) → Calculate the difference between the current time and the last time the banner was closed.
    // > bannerTimeInterval → Compare whether the time difference has exceeded the set interval
    if (
      !lastShown ||
      now - parseInt(lastShown) > props.interstitialTimeInterval
    ) {
      queueMicrotask(() => setIsOpen(true));
    }
  }, [props.interstitialTimeInterval]);

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
        setInterstitialImage(props.interstitialImageDesktop);
      } else {
        setInterstitialImage(props.interstitialImageMobile);
      }
    }
    updateImage();
    window.addEventListener("resize", updateImage);
    return () => window.removeEventListener("resize", updateImage);
  }, [props.interstitialImageMobile, props.interstitialImageDesktop]);

  // Click banner and set local storage
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dataLayer?.push({
      event: "click",
      feature_name: "interstitial_banner_promotion",
    });
    setTimeout(() => {
      localStorage.setItem("interstitial_last_shown", Date.now().toString());
      setIsOpen(false);

      window.open(props.interstitialURL, "_blank", "noopener,noreferrer");
    }, 50);
  };

  // Function to set the time when the user actually interacts
  const handleClose = () => {
    localStorage.setItem("interstitial_last_shown", Date.now().toString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div>
      <div className="interstitial-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]">
        <div className="interstitial-container fixed flex bg-white outline-8 max-w-[312px] w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-[800px]">
          <Link
            href={props.interstitialURL}
            className="interstitial-content relative flex flex-col aspect-interstitial-banner w-full rounded-lg overflow-hidden sm:hover:cursor-pointer sm:aspect-web-popup"
            onClick={handleLinkClick}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="interstitial-image flex object-cover w-full h-full"
              src={interstitialImage}
              alt={"Buy Now"}
              width={1200}
              height={1200}
            />
            <div className="interstitial-action absolute flex bottom-10 left-1/2 -translate-x-1/2 z-[30] sm:bottom-4 lg:bottom-5 2xl:bottom-8">
              <AppButton
                className={
                  interstitialImage === props.interstitialImageMobile
                    ? "w-[180px]"
                    : "w-[240px]"
                }
                size={
                  interstitialImage === props.interstitialImageMobile
                    ? "mediumRounded"
                    : "defaultRounded"
                }
                variant="outline"
                featureName="interstitial_banner_promotion"
              >
                Buy Ticket Now
              </AppButton>
            </div>
            <div
              className={`overlay absolute inset-0 bg-linear-to-t from-0% from-black/50 to-30% to-black/0`}
            />
          </Link>
          <div
            className="interstitial-close absolute flex p-1.5 text-white bg-[#3E3E3E] -top-4 -right-4 rounded-full hover:cursor-pointer"
            onClick={handleClose}
          >
            <X className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
