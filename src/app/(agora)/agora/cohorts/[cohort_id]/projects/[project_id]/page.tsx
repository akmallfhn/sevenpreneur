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

  const { cohort_id, project_id } = await params;
  const cohortId = parseInt(cohort_id, 10);
  const projectId = parseInt(project_id, 10);

  // Fetch tRPC
  const userData = (await trpc.auth.checkSession()).user;

  let projectDetailsRaw;
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

  let submissionUserRaw;
  try {
    submissionUserRaw = (
      await trpc.read.submissionByProject({ project_id: projectId })
    ).submission;
  } catch (error) {
    console.error;
  }
  const submissionUser = {
    ...submissionUserRaw,
    created_at: submissionUserRaw?.created_at
      ? submissionUserRaw.created_at.toISOString()
      : "",
    updated_at: submissionUserRaw?.updated_at
      ? submissionUserRaw.updated_at.toISOString()
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
      projectId={projectDetails.id}
      projectName={projectDetails.name}
      projectDescription={projectDetails.description}
      projectDocumentURL={projectDetails.document_url}
      projectDeadline={projectDetails.deadline_at}
      submissionId={submissionUser.id || null}
      submissionDocumentURL={submissionUser?.document_url || ""}
      submissionComment={submissionUser?.comment || ""}
      submissionCreatedAt={submissionUser.created_at}
      submissionUpdatedAt={submissionUser.updated_at}
      initialData={submissionUser}
    />
  );
}
