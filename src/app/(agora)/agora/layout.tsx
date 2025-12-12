import "@/app/globals.css";
import SidebarLMS, {
  AIResultListProps,
} from "@/app/components/navigations/SidebarLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { TRPCProvider } from "@/trpc/client";
import DisallowedMobile from "@/app/components/states/DisallowedMobile";

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

let baseURL = "https://api.sevenpreneur.com/trpc";
if (process.env.DOMAIN_MODE === "local")
  baseURL = "https://api.example.com:3000/trpc";

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
    const [aiToolsRes, aiConversationRes] = await Promise.all([
      trpc.list.aiResults({}),
      trpc.list.aiConversations(),
    ]);
    const aiToolsResultList = aiToolsRes.list.map((item) => ({
      ...item,
      created_at: item.created_at.toISOString(),
    }));
    const aiConversationResultList = aiConversationRes.list.map((item) => ({
      ...item,
      created_at: item.created_at.toISOString(),
      ai_tool_slug_url: "chat",
    }));

    aiResultList = [...aiToolsResultList, ...aiConversationResultList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    aiResultList = [];
  }

  return (
    <TRPCProvider baseURL={baseURL}>
      <div className="root relative w-full min-h-screen bg-section-background">
        <SidebarLMS aiResultList={aiResultList} />
        {children}
        {/* <DisallowedMobile /> */}
        <Toaster richColors position="top-center" />
      </div>
    </TRPCProvider>
  );
}
