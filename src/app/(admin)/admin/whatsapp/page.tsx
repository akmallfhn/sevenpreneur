import WhatsappConvsCMS from "@/components/indexes/WhatsappConvsCMS";
import ForbiddenComponent from "@/app/components/states/403Forbidden";
import UnderDevelopment from "@/app/components/states/UnderDevelopment";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function WhatsappPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  // Client-side Authorization
  const userSession = await trpc.auth.checkSession();
  const allowedRolesWhatsappChats = [0];

  if (!allowedRolesWhatsappChats.includes(userSession.user.role_id)) {
    return (
      <div className="forbidden flex w-full h-full pl-64">
        <ForbiddenComponent />
      </div>
    );
  }

  if (process.env.DOMAIN_MODE !== "local") {
    return <UnderDevelopment />;
  }

  return <WhatsappConvsCMS />;
}
