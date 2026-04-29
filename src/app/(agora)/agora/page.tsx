import HomeLMS from "@/components/pages/HomeLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

export default async function DashboardPageLMS() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  const enrolledCourseData = (await trpc.list.enrolledCourses()).list;
  const enrolledCourseList = enrolledCourseData.map((item) => ({
    ...item,
    cohort_start_date: item.cohort_start_date
      ? item.cohort_start_date.toISOString()
      : "",
    cohort_end_date: item.cohort_end_date
      ? item.cohort_end_date.toISOString()
      : "",
  }));

  const now = new Date();

  // Active cohorts that haven't expired
  const activeCohorts = enrolledCourseList.filter(
    (c) =>
      c.status === "ACTIVE" &&
      c.category === "COHORT" &&
      (!c.cohort_end_date || new Date(c.cohort_end_date) > now)
  );

  // Fetch learnings for each active cohort in parallel
  const learningResults = await Promise.all(
    activeCohorts.map((c) => trpc.list.learnings({ cohort_id: c.id }))
  );

  // Aggregate stats
  const totalAttendanceCount = learningResults.reduce(
    (sum, r) => sum + r.attendance_count,
    0
  );
  const totalSessionCount = learningResults.reduce(
    (sum, r) => sum + r.list.length,
    0
  );

  // Per-cohort attended sessions map
  const cohortAttendanceMap = activeCohorts.reduce(
    (map, cohort, i) => {
      map[cohort.id] = learningResults[i].attendance_count;
      return map;
    },
    {} as Record<number, number>
  );

  // Upcoming sessions (max 3, sorted by date)
  const upcomingSessions = learningResults
    .flatMap((r, i) =>
      r.list
        .filter(
          (l) =>
            l.status === "ACTIVE" &&
            l.meeting_date &&
            new Date(l.meeting_date).getTime() > now.getTime() - 2 * 60 * 60 * 1000
        )
        .map((l) => ({
          cohortId: activeCohorts[i].id,
          learningId: l.id,
          name: l.name,
          meeting_date: l.meeting_date!.toISOString(),
        }))
    )
    .sort(
      (a, b) =>
        new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime()
    )
    .slice(0, 3);

  // Mobile course list: active cohorts (not expired) + active playlists
  const activePlaylists = enrolledCourseList.filter(
    (c) => c.status === "ACTIVE" && c.category === "PLAYLIST"
  );

  const mobileCourses = [
    ...activeCohorts.map((c) => ({
      id: c.id,
      name: c.name,
      image_url: c.image_url,
      category: c.category as "COHORT",
      slug_category: c.slug_category as "cohorts",
      totalSessions: c.total_item,
      attendedSessions: cohortAttendanceMap[c.id] ?? 0,
    })),
    ...activePlaylists.map((c) => ({
      id: c.id,
      name: c.name,
      image_url: c.image_url,
      category: c.category as "PLAYLIST",
      slug_category: c.slug_category as "playlists",
      totalSessions: c.total_item,
      attendedSessions: 0,
    })),
  ];

  return (
    <HomeLMS
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      courseList={enrolledCourseList}
      mobileCourses={mobileCourses}
      upcomingSessions={upcomingSessions}
      totalAttendanceCount={totalAttendanceCount}
      totalSessionCount={totalSessionCount}
    />
  );
}
