import LibraryLMS from "@/app/components/pages/LibraryLMS";
import { TemplateList } from "@/app/components/tabs/LibraryTabsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function LibraryPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const hasTemplateAccess = await trpc.check.aiTools();

  const userData = (await trpc.auth.checkSession()).user;
  let templateLists: TemplateList[] = [];
  try {
    templateLists = (await trpc.list.templates()).list;
  } catch {
    templateLists = [];
  }

  return (
    <LibraryLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      templateList={templateLists}
      hasTemplateAccess={hasTemplateAccess}
    />
  );
}
