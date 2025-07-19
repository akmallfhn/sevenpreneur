"use client";
import { useEffect, useState } from "react";
import HeroEventRestart2025 from "@/app/components/templates/HeroEventRestart25";
import ContentEventRestart25 from "@/app/components/templates/ContentEventRestart25";
import TicketCarouselRestart25 from "@/app/components/indexes/TicketCarouselRestart25";
import BannerEventRestart25 from "@/app/components/templates/BannerEventRestart25";
import FAQEventRestart25 from "@/app/components/indexes/FAQEventRestart25";
import SpeakersLineUpRestart25 from "@/app/components/indexes/SpeakersLineUpRestart25";
import EventExperienceRestart25 from "@/app/components/indexes/EventExperienceRestart25";
import CustomFloatingRestart25 from "@/app/components/buttons/CustomFloatingRestart25";
import TopicSpeakerListRestart25 from "@/app/components/indexes/TopicSpeakerListRestart25";
import TopNavbar from "@/app/components/navigations/TopNavbarRestart25";
import AttendeeRoleListRestart25 from "@/app/components/indexes/AttendeeRoleListRestart25";
import AppInterstitialBanner from "../modals/AppInterstitialBanner";

export default function Restart25Page() {
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const bannerTimeInterval = 1000 * 15;

  // Logic untuk tampilkan banner hanya jika belum muncul dalam interval
  useEffect(() => {
    // Retrieves the timestamp value of the last time the popup was closed (saved previously) from localStorage.
    const lastShown = localStorage.getItem("interstitial_last_shown");
    const now = Date.now();
    // !lastShown → If no timestamp has been saved before, it means the banner has never been closed → show the banner.
    // now - parseInt(lastShown) → Calculate the difference between the current time and the last time the banner was closed.
    // > bannerTimeInterval → Compare whether the time difference has exceeded the set interval
    if (!lastShown || now - parseInt(lastShown) > bannerTimeInterval) {
      setIsBannerOpen(true);
    }
  }, [bannerTimeInterval]);

  // Function to set the time when the user actually interacts
  const handleBannerClosed = () => {
    const now = Date.now();
    // Store timestamp only after user action.
    localStorage.setItem("interstitial_last_shown", now.toString());
    setIsBannerOpen(false);
  };

  return (
    <div className="root relative bg-black items-center">
      <TopNavbar />
      <HeroEventRestart2025 />
      <ContentEventRestart25 />
      <TopicSpeakerListRestart25 />
      <SpeakersLineUpRestart25 />
      <TicketCarouselRestart25 />
      <AttendeeRoleListRestart25 />
      <EventExperienceRestart25 />
      <FAQEventRestart25 />
      <BannerEventRestart25 />
      <CustomFloatingRestart25 />

      <AppInterstitialBanner
        isOpen={isBannerOpen}
        redirectUrl="https://vesta.halofans.id/event/v2/re-start"
        interstitialImageMobile="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//insterstitial-dseven.webp"
        interstitialImageDesktop="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//web-popup-dseven.webp"
        onClose={handleBannerClosed}
      />
    </div>
  );
}
