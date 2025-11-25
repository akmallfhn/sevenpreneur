import GenerateAICompetitorGraderLMS from "@/app/components/forms/GenerateAICompetitorGraderLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function AICompetitorGraderLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const hasAIAccess = await trpc.check.aiTools();
  if (!hasAIAccess) return notFound();

  const userData = (await trpc.auth.checkSession()).user;
  const industryList = (await trpc.list.industries()).list;

  return (
    <GenerateAICompetitorGraderLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      indutryList={industryList ?? []}
    />
  );
}
