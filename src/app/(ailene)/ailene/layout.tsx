import "@/app/globals.css";
import SidebarAilene from "@/components/navigations/SidebarAilene";
import AppPageState from "@/components/states/AppPageState";
import { SidebarProviderCMS } from "@/contexts/SidebarContextCMS";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TRPCProvider } from "@/trpc/client";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Ailene Sevenpreneur",
    default: "Ailene Sevenpreneur",
  },
  description: "Platform pelatihan AI internal Sevenpreneur",
  metadataBase: new URL("https://ailene.sevenpreneur.com"),
  alternates: { canonical: "/" },
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

export default async function AileneLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const checkUser = (await trpc.auth.checkSession()).user;

  if (!checkUser || checkUser.role_id === 3) {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return (
    <TRPCProvider baseURL={baseURL}>
      <ThemeProvider>
        <SidebarProviderCMS>
          <div className="min-h-screen bg-dashboard-bg">
            <SidebarAilene
              sessionToken={sessionToken}
              sessionUserRole={checkUser.role_id}
            />
            {props.children}
            <div className="lg:hidden">
              <AppPageState variant="ONLY_MOBILE" />
            </div>
            <Toaster richColors position="top-center" />
          </div>
        </SidebarProviderCMS>
      </ThemeProvider>
    </TRPCProvider>
  );
}
