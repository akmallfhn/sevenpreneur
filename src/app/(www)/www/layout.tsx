import "@/app/globals.css";
import { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
import { cookies } from "next/headers";
import { setSessionToken, trpc } from "@/trpc/server";
import BottomFooterSVP from "@/app/components/navigations/BottomFooterSVP";
import { ThemeProvider } from "next-themes";

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
  // --- Get Token for Header Navbar
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  // --- Check User Session for Header Navbar
  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }
  return (
    <div>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <HeaderNavbarSVP
          userName={userData?.full_name}
          userAvatar={userData?.avatar ?? null}
          userRole={userData?.role_id}
          isLoggedIn={!!userData}
        />
        {children}
        <Toaster richColors position="top-center" />
        <BottomFooterSVP />
      </ThemeProvider>
    </div>
  );
}
