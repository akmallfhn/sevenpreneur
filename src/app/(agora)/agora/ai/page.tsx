import AIListLMS, { AIList } from "@/app/components/indexes/AIListLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function AIPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const hasAIAccess = await trpc.check.aiTools();

  const userData = (await trpc.auth.checkSession()).user;
  let aiList: AIList[] = [];
  try {
    aiList = (await trpc.list.aiTools()).list;
  } catch (error) {
    aiList = [];
  }

  return (
    <AIListLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      hasAIAccess={hasAIAccess}
      aiList={aiList}
    />
  );
}
