"use client";
import HeroEventRestart25 from "@/app/components/custom-components-restart25/HeroEventRestart25";
import ContentEventRestart25 from "@/app/components/custom-components-restart25/ContentEventRestart25";
import TicketCarouselRestart25 from "@/app/components/custom-components-restart25/TicketCarouselRestart25";
import BannerEventRestart25 from "@/app/components/custom-components-restart25/BannerEventRestart25";
import FAQEventRestart25 from "@/app/components/custom-components-restart25/FAQEventRestart25";
import SpeakersLineUpRestart25 from "@/app/components/custom-components-restart25/SpeakersLineUpRestart25";
import EventExperienceRestart25 from "@/app/components/custom-components-restart25/EventExperienceRestart25";
import CustomFloatingRestart25 from "@/app/components/custom-components-restart25/CustomFloatingRestart25";
import TopicSpeakerListRestart25 from "@/app/components/custom-components-restart25/TopicSpeakerListRestart25";
import TopNavbar from "@/app/components/custom-components-restart25/TopNavbarRestart25";
import AttendeeRoleListRestart25 from "@/app/components/custom-components-restart25/AttendeeRoleListRestart25";
import AppInterstitialBanner from "../modals/AppInterstitialBanner";
import PartnerLogosRestart25 from "../custom-components-restart25/PartnerLogosRestart25";

export default function RestartEventSVP() {
  let bannerTimeInterval = 1000 * 60 * 60;
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    bannerTimeInterval = 1000 * 40;
  }

  return (
    <div className="root relative bg-black items-center">
      <HeroEventRestart25 />
      <ContentEventRestart25 />
      <TopicSpeakerListRestart25 />
      <SpeakersLineUpRestart25 />
      <TicketCarouselRestart25 />
      <AttendeeRoleListRestart25 />
      <EventExperienceRestart25 />
      <FAQEventRestart25 />
      <BannerEventRestart25 />
      <PartnerLogosRestart25 />
      <CustomFloatingRestart25 />
      {/* <AppInterstitialBanner
        bannerTimeInterval={bannerTimeInterval}
        redirectUrl="https://vesta.halofans.id/event/v2/re-start"
        interstitialImageMobile="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//insterstitial-dseven.webp"
        interstitialImageDesktop="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//web-popup-dseven.webp"
      /> */}
    </div>
  );
}
