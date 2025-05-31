import "./globals.css";
import { Plus_Jakarta_Sans, Mona_Sans } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import TopNavbar from "./components/templates/TopNavbarRestart25";
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
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png' },
      ],
    }
    
}}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <GoogleTagManager gtmId="GTM-MZJSK4G3"/>
      <body className={`${monaSans.variable} ${plusJakartaSans.variable} antialiased`}>
        <TopNavbar/>
        {children}
        <BottomFooter/>
        <GoogleAnalytics gaId="G-J8V0HJXTSM"/>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '725830956549523');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=725830956549523&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}