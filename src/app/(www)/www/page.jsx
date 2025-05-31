import HeroEventRestart2025 from "./components/templates/HeroEventRestart25";
import VisionQuotesRestart25 from "./components/templates/VisionQuotesRestart25";
import ContentEventRestart25 from "./components/templates/ContentEventRestart25";
import TicketCarouselRestart25 from "./components/templates/TicketCarouselRestart25";
import BannerEventRestart25 from "./components/templates/BannerEventRestart25";
import FAQEventRestart25 from "./components/templates/FAQEventRestart25";
import TopicsRunningText from "./components/templates/TopicsRunningText";

export const metadata = {
  title: "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
  description: "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
  keywords: "konferensi bisnis untuk millennial Indonesia, event bisnis generasi Z Indonesia, RESTART, Sevenpreneur, Raymond Chin, konferensi entrepreneur muda Indonesia, tren bisnis masa depan Indonesia, acara startup Indonesia 2025, Sevenpreneur business conference, event inovasi dan teknologi bisnis Indonesia",
  authors: [{name: "Sevenpreneur"}],
  publisher: "Sevenpreneur",
  referrer: 'origin-when-cross-origin',
  alternates: {
      canonical: "/"
  },
  openGraph: {
      title: "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
      description: "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
      url: "https://www.sevenpreneur.com",
      siteName: "Sevenpreneur",
      images: [
          {
            url: "https://static.wixstatic.com/media/02a5b1_75a55654d4b445da8c4500b84f0cb7a2~mv2.webp",
            width: 800,
            height: 600,
          }
      ],
  },
  twitter: {
      card: 'summary_large_image',
      title: "RE:START Conference by Sevenpreneur and Raymond Chin | Business Conference for Indonesia's Millennial and Gen Z Entrepreneurs 2025",
      description: "Ikuti RE:START, konferensi bisnis dari Sevenpreneur dan Raymond Chin untuk generasi Millennial dan Gen Z Indonesia. Jelajahi tren, teknologi, strategi, dan mindset yang membentuk masa depan bisnis. Saatnya Anda menjadi entrepreneur global berikutnya.",
      images: "https://static.wixstatic.com/media/02a5b1_75a55654d4b445da8c4500b84f0cb7a2~mv2.webp",
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