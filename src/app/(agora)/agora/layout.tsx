import "@/app/globals.css";
import HeaderNavbarLMS from "@/app/components/navigations/HeaderPageLMS";
import SidebarLMS from "@/app/components/navigations/SidebarLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";

// Metadata
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
  return (
    <div className="root relative w-full min-h-screen bg-[#F0E5F2]">
      <SidebarLMS />
      {children}
      <Toaster richColors position="top-center" />
    </div>
  );
}
