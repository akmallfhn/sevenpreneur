import SurveyBusinessUpdateSVP from "@/app/components/forms/SurveyBusinessUpdatesSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UpdateBusinessPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/survey/business-updates`);
  }
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  const industriesData = (await trpc.list.industries()).list;

  return (
    <SurveyBusinessUpdateSVP
      sessionUserId={userData.id}
      sessionUserName={userData.full_name}
      sessionUserEmail={userData.email}
      industriesData={industriesData}
    />
  );
}
