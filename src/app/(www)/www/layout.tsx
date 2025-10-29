import "@/app/globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
import { cookies } from "next/headers";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { ThemeProvider } from "next-themes";
import FooterNavbarSVP from "@/app/components/navigations/FooterNavbarSVP";
import { StatusType } from "@/lib/app-types";

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

  // Check User Session for Header Navbar
  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }

  let tickerDataRaw;
  try {
    tickerDataRaw = (await trpc.read.ticker({ id: 1 })).ticker;
  } catch (error) {
    console.error;
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
          userName={userData?.full_name}
          userAvatar={userData?.avatar ?? null}
          userRole={userData?.role_id}
          isLoggedIn={!!userData}
          tickerTitle={tickerData?.title ?? ""}
          tickerCallout={tickerData?.callout ?? ""}
          tickerTargetURL={tickerData.target_url ?? ""}
          tickerStatus={tickerData?.status as StatusType}
          tickerStartDate={tickerData?.start_date ?? ""}
          tickerEndDate={tickerData?.end_date ?? ""}
        />
        {children}
        <Toaster richColors position="top-center" />
        <FooterNavbarSVP />
      </ThemeProvider>
    </div>
  );
}
