import Image from "next/image";
import HeroEventRestart2025 from "./components/templates/HeroEventRestart25";
import VisionQuotesRestart25 from "./components/templates/VisionQuotesRestart25";
import ContentEventRestart25 from "./components/templates/ContentEventRestart25";
import TicketCarouselRestart25 from "./components/templates/TicketCarouselRestart25";
import BannerEventRestart25 from "./components/templates/BannerEventRestart25";
import FAQEventRestart25 from "./components/templates/FAQEventRestart25";
import TopicsRunningText from "./components/templates/TopicsRunningText";
import Link from "next/link";

export const metadata = {
  title: "RE:START Conference 2025 | powered by Sevenpreneur",
  description: "",
  keywords: "",
  authors: [{name: "Sevenpreneur"}],
  publisher: "Sevenpreneur",
  referrer: 'origin-when-cross-origin',
  alternates: {
      canonical: "/"
  },
  openGraph: {
      title: "RE:START Conference 2025 | powered by Sevenpreneur",
      description: "",
      url: "https://sevenpreneur.com",
      siteName: "Sevenpreneur",
      images: [
          {
            url: "",
            width: 800,
            height: 600,
          }
      ],
  },
  twitter: {
      card: 'summary_large_image',
      title: "RE:START Conference 2025 | powered by Sevenpreneur",
      description: "",
      images: "",
    },
  robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
  },
  other: {
      "googlebot-news": "index, follow",
    },
}

export default function HomePage() {
  return (
    <div className="root bg-black items-center">
      <HeroEventRestart2025/>
      <VisionQuotesRestart25/>
      <ContentEventRestart25 id={"contentEvent"}/>
      <TopicsRunningText/>
      <TicketCarouselRestart25/>
      <div className="container-faq flex items-center justify-center px-8 pb-8 lg:pb-[60px]">
        <FAQEventRestart25/>
      </div>
      <div className="container-banner flex items-center justify-center px-8 pb-20">
        <BannerEventRestart25/>
      </div>
    </div>
  );
}