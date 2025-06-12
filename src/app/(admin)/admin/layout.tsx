import SidebarCMS from "@/app/components/templates/SidebarCMS";
import "@/app/globals.css";
import { TRPCProvider } from "@/trpc/client";
import { Mona_Sans, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

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
      path: "../../fonts/OpenSauceOne-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../fonts/OpenSauceOne-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

// --- Pass the base URL to the client
let baseURL = "https://api.sevenpreneur.com/trpc";
if (process.env.DOMAIN_MODE === "staging")
  baseURL = "https://api.staging.sevenpreneur.com/trpc";
if (process.env.DOMAIN_MODE === "local")
  baseURL = "https://api.example.com:3000/trpc";

// --- Current Domain
let domain = "sevenpreneur.com";
if (process.env.DOMAIN_MODE === "local") {
  domain = "example.com:3000";
}

export default function RootLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  return (
    <TRPCProvider baseURL={baseURL}>
      <html lang="en">
        <body
          className={`${monaSans.variable} ${plusJakartaSans.variable} ${openSauceOne.variable} antialiased`}
        >
          <SidebarCMS currentDomain={domain} />
          {props.children}
        </body>
      </html>
    </TRPCProvider>
  );
}
