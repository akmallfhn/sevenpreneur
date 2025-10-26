import LearningDetailsLMS from "@/app/components/pages/LearningDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface LearningDetailsPageLMSProps {
  params: Promise<{ cohort_id: string; learning_id: string }>;
}

export default async function LearningsDetailsPageLMS({
  params,
}: LearningDetailsPageLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  const { cohort_id, learning_id } = await params;
  const cohortId = parseInt(cohort_id, 10);
  const learningId = parseInt(learning_id, 10);

  const userData = (await trpc.auth.checkSession()).user;

  let learningDetailsRaw;
  try {
    learningDetailsRaw = (
      await trpc.read.learning({
        id: learningId,
      })
    ).learning;
  } catch (error) {
    return notFound();
  }

  if (!learningDetailsRaw) {
    return notFound();
  }

  const learningDetails = {
    ...learningDetailsRaw,
    meeting_date: learningDetailsRaw.meeting_date.toISOString(),
  };

  const [materialListRes, discussionStarterListRes] = await Promise.all([
    trpc.list.materials({ learning_id: learningDetails.id }),
    trpc.list.discussionStarters({ learning_id: learningDetails.id }),
  ]);

  const materialList = materialListRes.list;
  const discussionStarterList = discussionStarterListRes.list.map((item) => ({
    ...item,
    created_at: item.created_at.toISOString(),
    updated_at: item.updated_at.toISOString(),
  }));

  return (
    <LearningDetailsLMS
      cohortId={cohortId}
      cohortName={"Sevenpreneur Business Blueprint Program Batch 7"}
      sessionUserId={userData.id}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      learningSessionName={learningDetails.name}
      learningSessionDescription={learningDetails.description}
      learningSessionDate={learningDetails.meeting_date}
      learningSessionMethod={learningDetails.method}
      learningSessionURL={learningDetails.meeting_url || ""}
      learningLocationURL={learningDetails.location_url || ""}
      learningLocationName={learningDetails.location_name || ""}
      learningEducatorName={
        learningDetails.speaker?.full_name || "Sevenpreneur Educator"
      }
      learningEducatorAvatar={
        learningDetails.speaker?.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      learningVideoRecording={learningDetails.recording_url || ""}
      materialList={materialList}
      discussionStarterList={discussionStarterList}
    />
  );
}
