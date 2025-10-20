import ProjectDetailsLMS from "@/app/components/pages/ProjectDetailsLMS";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface ProjectDetailsPageLMSProps {
  params: Promise<{ cohort_id: string; project_id: string }>;
}

export default async function ProjectDetailsPageLMS({
  params,
}: ProjectDetailsPageLMSProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;

  if (sessionToken) {
    setSessionToken(sessionToken);
  }

  // Fetch tRPC
  const { cohort_id, project_id } = await params;
  const cohortId = parseInt(cohort_id, 10);
  const projectId = parseInt(project_id, 10);
  const userData = (await trpc.auth.checkSession()).user;

  let projectDetailsRaw;
  let submissionDetails;
  try {
    projectDetailsRaw = await trpc.read.project({
      id: projectId,
    });
  } catch (error) {
    return notFound();
  }

  const projectDetails = {
    ...projectDetailsRaw.project,
    deadline_at: projectDetailsRaw.project.deadline_at
      ? projectDetailsRaw.project.deadline_at.toISOString()
      : "",
  };

  return (
    <ProjectDetailsLMS
      cohortId={cohortId}
      cohortName={"Sevenpreneur Business Blueprint Program Batch 7"}
      sessionUserName={userData.full_name}
      sessionUserAvatar={
        userData.avatar ||
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
      }
      sessionUserRole={userData.role_id}
      projectName={projectDetails.name}
      projectDescription={projectDetails.description}
      projectDocumentURL={projectDetails.document_url}
      projectDeadline={projectDetails.deadline_at}
    />
  );
}
