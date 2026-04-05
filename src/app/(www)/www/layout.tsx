import "@/app/globals.css";
import FooterNavbarSVP from "@/components/navigations/FooterNavbarSVP";
import HeaderNavbarSVP from "@/components/navigations/HeaderNavbarSVP";
import { StatusType } from "@/lib/app-types";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sevenpreneur.com"),
  alternates: {
    canonical: "/",
  },
};

interface MainLayoutProps {
  children: ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  setSecretKey(secretKey!);

  // Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  let userData = null;

  if (sessionToken) {
    try {
      const userSession = (await trpc.auth.checkSession()).user;
      userData = userSession ?? null;
    } catch {
      userData = null;
    }
  }

  let tickerDataRaw = null;
  try {
    tickerDataRaw = (await trpc.read.ticker({ id: 1 })).ticker;
  } catch {
    tickerDataRaw = null;
  }
  const tickerData = {
    ...tickerDataRaw,
    start_date: tickerDataRaw?.start_date.toISOString(),
    end_date: tickerDataRaw?.end_date.toISOString(),
  };

  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="light">
        <HeaderNavbarSVP
          userName={userData?.full_name ?? null}
          userAvatar={userData?.avatar ?? null}
          userRole={userData?.role_id ?? null}
          userEmail={userData?.email ?? null}
          isLoggedIn={!!userData}
          tickerTitle={tickerData.title ?? ""}
          tickerCallout={tickerData.callout ?? ""}
          tickerTargetURL={tickerData.target_url ?? ""}
          tickerStatus={tickerData.status as StatusType}
          tickerStartDate={tickerData.start_date ?? ""}
          tickerEndDate={tickerData.end_date ?? ""}
        />
        {children}
        <Toaster richColors position="top-center" />
        <FooterNavbarSVP />
      </ThemeProvider>
    </div>
  );
}
