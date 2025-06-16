import "@/app/globals.css";
import { cookies, headers } from "next/headers";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TRPCProvider } from "@/trpc/client";
import { trpc } from "@/trpc/server";
import { Mona_Sans, Plus_Jakarta_Sans } from "next/font/google";
import SidebarCMS from "@/app/components/templates/SidebarCMS";
import localFont from "next/font/local";
import { createCallerFactory, createTRPCContext } from "@/trpc/init";
import { authRouter } from "@/trpc/routers/auth";
import { Toaster } from "sonner";

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

export default async function AdminLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  // --- Define Google Oauth
  const googleOauthId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ID;
  if (!googleOauthId) {
    throw new Error(
      "Missing NEXT_PUBLIC_GOOGLE_OAUTH_ID in environment variables"
    );
  }

  // --- Get Cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;

  return (
    <TRPCProvider baseURL={baseURL}>
      <html lang="en" className="bg-white">
        <body
          className={`${monaSans.variable} ${plusJakartaSans.variable} ${openSauceOne.variable} antialiased`}
        >
          <GoogleOAuthProvider clientId={googleOauthId}>
            <SidebarCMS sessionToken={sessionToken} currentDomain={domain} />
            {props.children}
            <Toaster richColors />
          </GoogleOAuthProvider>
        </body>
      </html>
    </TRPCProvider>
  );
}
