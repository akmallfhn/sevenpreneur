"use client";
import HeroEventRestart25 from "@/app/components/templates/HeroEventRestart25";
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
import PartnerLogosRestart25 from "../templates/PartnerLogosRestart25";

export default function Restart25Page() {
  let bannerTimeInterval = 1000 * 60 * 60;
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    bannerTimeInterval = 1000 * 40;
  }

  return (
    <div className="root relative bg-black items-center">
      <TopNavbar />
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
