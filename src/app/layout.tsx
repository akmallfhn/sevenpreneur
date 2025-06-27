import "@/app/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Plus_Jakarta_Sans, Mona_Sans } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { Metadata } from "next";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const openSauceOne = localFont({
  variable: "--font-open-sauce-one",
  display: "swap",
  src: [
    {
      path: "././fonts/OpenSauceOne-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "././fonts/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "././fonts/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "././fonts/OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "././fonts/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "././fonts/OpenSauceOne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "././fonts/OpenSauceOne-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;
  const googleTagManagerId = process.env.GOOGLE_TAG_MANAGER_ID;
  const googleOauthId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ID;

  return (
    <html lang="en" className="scroll-smooth">
      {/* --- Google Tag Manager */}
      <GoogleTagManager gtmId={googleTagManagerId!} />

      <body
        className={`${monaSans.variable} ${plusJakartaSans.variable} ${openSauceOne.variable} antialiased`}
      >
        {/* --- Google Oauth Login */}
        <GoogleOAuthProvider clientId={googleOauthId!}>
          {children}
        </GoogleOAuthProvider>

        {/* --- Google Analytics */}
        <GoogleAnalytics gaId={googleAnalyticsId!} />

        {/* --- Tiktok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;
              var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
              ttq.setAndDefer=function(t,e){
                t[e]=function(){
                  t.push([e].concat(Array.prototype.slice.call(arguments,0)))
                }
              };
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){
                for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
                return e
              },
              ttq.load=function(e,n){
                var r="https://analytics.tiktok.com/i18n/pixel/events.js",
                o=n&&n.partner;
                ttq._i=ttq._i||{},
                ttq._i[e]=[],
                ttq._i[e]._u=r,
                ttq._t=ttq._t||{},
                ttq._t[e]=+new Date,
                ttq._o=ttq._o||{},
                ttq._o[e]=n||{};
                n=document.createElement("script");
                n.type="text/javascript",
                n.async=!0,
                n.src=r+"?sdkid="+e+"&lib="+t;
                e=document.getElementsByTagName("script")[0]
                e.parentNode.insertBefore(n,e)
              };

              ttq.load('D0UN4FBC77U2P4BEBL0G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        {/* --- Meta Pixel */}
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
