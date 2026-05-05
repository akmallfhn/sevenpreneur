import "@/app/globals.css";
import SidebarLab from "@/components/navigations/SidebarLab";
import AppPageState from "@/components/states/AppPageState";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ThemeProvider } from "next-themes";
import { TRPCProvider } from "@/trpc/client";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | Lab Sevenpreneur",
    default: "Lab — AI Adoption Platform",
  },
  description: "Platform adopsi AI untuk tim dan perusahaan",
  metadataBase: new URL("https://lab.sevenpreneur.com"),
};

let baseURL = "https://api.sevenpreneur.com/trpc";
if (process.env.DOMAIN_MODE === "local")
  baseURL = "https://api.example.com:3000/trpc";

export default async function LabLayout(
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

  // Fetch the lab member profile to get stakeholder type
  let labMember;
  try {
    const result = await trpc.lab.myProfile();
    labMember = result.member;
  } catch {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return (
    <TRPCProvider baseURL={baseURL}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <div className="min-h-screen bg-dashboard-bg">
            <SidebarLab
              sessionToken={sessionToken}
              stakeholderType={labMember.stakeholder_type}
            />
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
