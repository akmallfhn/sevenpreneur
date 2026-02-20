import HomeLMS from "@/app/components/pages/HomeLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function DashboardPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  const enrolledCourseData = (await trpc.list.enrolledCourses()).list;
  const enrolledCohortData = (await trpc.list.enrolledCohorts({})).list;
  const enrolledPlaylistsData = (await trpc.list.enrolledPlaylists({})).list;

  const enrolledCourseList = enrolledCourseData.map((item) => ({
    ...item,
    cohort_start_date: item.cohort_start_date
      ? item.cohort_start_date.toISOString()
      : "",
    cohort_end_date: item.cohort_end_date
      ? item.cohort_end_date.toISOString()
      : "",
  }));

  const enrolledCohortList = enrolledCohortData.map((variable) => ({
    ...variable,
    start_date: variable.start_date ? variable.start_date.toISOString() : "",
    end_date: variable.end_date ? variable.end_date.toISOString() : "",
  }));
  const enrolledPlaylists = enrolledPlaylistsData.map((item) => ({
    ...item,
    price: Number(item.price),
  }));

  return (
    <HomeLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      courseList={enrolledCourseList}
      cohortList={enrolledCohortList}
      playlist={enrolledPlaylists}
    />
  );
}
