import CohortListLMS from "@/app/components/indexes/CohortListLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function CohortsPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;
  const enrolledCohortData = (await trpc.list.enrolledCohorts({})).list;

  const enrolledCohortList = enrolledCohortData.map((variable) => ({
    ...variable,
    start_date: variable.start_date ? variable.start_date.toISOString() : "",
    end_date: variable.end_date ? variable.end_date.toISOString() : "",
  }));

  return (
    <CohortListLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      cohortList={enrolledCohortList}
    />
  );
}
