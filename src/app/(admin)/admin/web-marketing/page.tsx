import WebMarketingToolsCMS from "@/app/components/pages/WebMarketingToolsCMS";
import { setSessionToken } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function WebMarketingPageCMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <WebMarketingToolsCMS sessionToken={sessionToken} />;
}
