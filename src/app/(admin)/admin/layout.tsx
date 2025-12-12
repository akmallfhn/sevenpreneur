import SidebarCMS from "@/app/components/navigations/SidebarCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
import DisallowedMobile from "@/app/components/states/DisallowedMobile";
import "@/app/globals.css";
import { TRPCProvider } from "@/trpc/client";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Toaster } from "sonner";

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

let baseURL = "https://api.sevenpreneur.com/trpc";
if (process.env.DOMAIN_MODE === "local")
  baseURL = "https://api.example.com:3000/trpc";

export default async function AdminLayout(
  props: Readonly<{ children: React.ReactNode }>
) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
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
