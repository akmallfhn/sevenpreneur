import "@/app/globals.css";
import AppPageState from "@/components/states/AppPageState";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { TRPCProvider } from "@/trpc/client";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
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

  if (!checkUser) {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return (
    <TRPCProvider baseURL={baseURL}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="ailene-theme"
      >
        <SidebarProvider>
          <div className="font-read min-h-screen bg-dashboard-bg dark:bg-black">
            {props.children}
            <div className="lg:hidden">
              <AppPageState variant="ONLY_MOBILE" />
            </div>
            <Toaster richColors position="top-center" />
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </TRPCProvider>
  );
}
