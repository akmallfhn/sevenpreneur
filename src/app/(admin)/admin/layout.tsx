import "@/app/globals.css";
import { cookies } from "next/headers";
import { setSessionToken, trpc } from "@/trpc/server";
import { TRPCProvider } from "@/trpc/client";
import SidebarCMS from "@/app/components/navigations/SidebarCMS";
import { Toaster } from "sonner";
import { Metadata } from "next";
import DisallowedMobile from "@/app/components/state/DisallowedMobile";
import ForbiddenComponent from "@/app/components/state/403Forbidden";

// --- Metadata
export const metadata: Metadata = {
  title: {
    template: "%s | Admin Sevenpreneur",
    default: "Admin Sevenpreneur",
  },
  description:
    "Central hub to manage all operations of the Sevenpreneur ecosystem",
  metadataBase: new URL("https://admin.sevenpreneur.com"),
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

// --- Pass the base URL to the client
let baseURL = "https://api.sevenpreneur.com/trpc";
if (process.env.DOMAIN_MODE === "local")
  baseURL = "https://api.example.com:3000/trpc";

export default async function AdminLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  // --- Get Cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  // --- Checking Access
  setSessionToken(sessionToken);
  const checkUser = (await trpc.auth.checkSession()).user;
  if (!checkUser || checkUser.role_id === 3) {
    return <ForbiddenComponent />;
  }

  return (
    <TRPCProvider baseURL={baseURL}>
      <div>
        <SidebarCMS
          sessionToken={sessionToken}
          userSessionRole={checkUser.role_id}
        />
        {props.children}
        <DisallowedMobile />
        <Toaster richColors position="top-center" />
      </div>
    </TRPCProvider>
  );
}
