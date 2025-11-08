import "@/app/globals.css";
import SidebarLMS, {
  AIResultListProps,
} from "@/app/components/navigations/SidebarLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";

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
        url: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/meta-og-image-sevenpreneur-2.webp",
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
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  let aiResultList: AIResultListProps[] = [];
  try {
    aiResultList = (await trpc.list.aiResults({})).list;
  } catch (error) {
    aiResultList = [];
  }

  return (
    <div className="root relative w-full min-h-screen bg-section-background">
      <SidebarLMS aiResultList={aiResultList} />
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}
