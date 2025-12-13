import CohortDetailsLMS from "@/app/components/pages/CohortDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface CohortDetailsPageLMSProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function CohortDetailsPageLMS({
  params,
}: CohortDetailsPageLMSProps) {
  const { cohort_id } = await params;
  const cohortId = parseInt(cohort_id, 10);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const userData = (await trpc.auth.checkSession()).user;

  let enrolledCohortDetails;
  try {
    enrolledCohortDetails = await trpc.read.enrolledCohort({
      id: cohortId,
    });
  } catch {
    return notFound();
  }

  if (!enrolledCohortDetails) {
    return notFound();
  }

  const [learningListRest, moduleListRes, userListRes, projectListRes] =
    await Promise.all([
      trpc.list.learnings({ cohort_id: cohortId }),
      trpc.list.modules({ cohort_id: cohortId }),
      trpc.list.cohortMembers({ cohort_id: cohortId }),
      trpc.list.projects({ cohort_id: cohortId }),
    ]);

  const learningListRaw = learningListRest.list;
  const moduleList = moduleListRes.list;
  const userList = userListRes.list;
  const projectListRaw = projectListRes.list;

  const learningList = learningListRaw.map((item) => ({
    ...item,
    meeting_date: item.meeting_date ? item.meeting_date.toISOString() : "",
  }));
  const projectList = projectListRaw.map((item) => ({
    ...item,
    deadline_at: item.deadline_at ? item.deadline_at.toISOString() : "",
  }));

  return (
    <CohortDetailsLMS
      sessionUserId={userData.id}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      cohortId={enrolledCohortDetails.cohort.cohort_id}
      cohortName={enrolledCohortDetails.cohort.cohort.name}
      cohorImage={enrolledCohortDetails.cohort.cohort.image}
      attendanceCount={learningListRest.attendance_count}
      learningList={learningList}
      moduleList={moduleList}
      projectList={projectList}
      userList={userList}
    />
  );
}
