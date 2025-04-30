import "./globals.css";
import { Plus_Jakarta_Sans, Mona_Sans } from "next/font/google";
import TopNavbar from "./components/templates/TopNavbarRestart25";
import { GoogleAnalytics } from "@next/third-parties/google";
import BottomFooter from "./components/templates/BottomFooter";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"]
})

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export function generateMetadata() {
  const BASE_URL = "https://www.sevenpreneur.com"
  return{
    metadataBase: BASE_URL,
    alternates: {
        canonical: '/',
    },
}}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${monaSans.variable} ${plusJakartaSans.variable} antialiased`}>
        <TopNavbar/>
        {children}
        <BottomFooter/>
        <GoogleAnalytics gaId="G-J8V0HJXTSM"/>
      </body>
    </html>
  );
}
