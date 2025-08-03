import HeaderNavbarLMS from "@/app/components/navigations/HeaderNavbarLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";

// --- Metadata
export const metadata: Metadata = {
  title: {
    template: "%s | Agora Learning Sevenpreneur",
    default: "Agora Learning Sevenpreneur",
  },
  description:
    "Central hub to manage all operations of the Sevenpreneur ecosystem",
  metadataBase: new URL("https://agora.sevenpreneur.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    images: [
      {
        url: "https://static.wixstatic.com/media/02a5b1_75a55654d4b445da8c4500b84f0cb7a2~mv2.webp",
        width: 800,
        height: 600,
      },
    ],
  },
};

interface AgoraLayoutProps {
  children: ReactNode;
}

export default async function AgoraLayout({ children }: AgoraLayoutProps) {
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
      <HeaderNavbarLMS
        userName={userData?.full_name}
        userAvatar={userData?.avatar ?? null}
        userRole={userData?.role_id}
        isLoggedIn={!!userData}
      />
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}
