"use client";
import { trpc } from "@/trpc/client";
import { Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import ProjectItemCMS from "../items/ProjectItemCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface ProjectListCMSProps {
  sessionToken: string;
  sessionUserRoleName: string;
  cohortId: number;
  onClickAdd?: () => void;
}

export default function ProjectListCMS({
  sessionToken,
  sessionUserRoleName,
  cohortId,
  onClickAdd,
}: ProjectListCMSProps) {
  const utils = trpc.useUtils();

  const isAllowedCreate = [
    "Administrator",
    "Super Admin",
    "Class Manager",
  ].includes(sessionUserRoleName);

  const { data, isLoading } = trpc.list.projects.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  return (
    <SectionContainerCMS
      title="Projects"
      headerAction={
        isAllowedCreate && onClickAdd ? (
          <AppButton
            variant="neutral"
            size="small"
            onClick={onClickAdd}
          >
            <Plus className="size-3.5" />
            Add
          </AppButton>
        ) : undefined
      }
    >
      {isLoading ? (
        <AppLoadingComponents />
      ) : (data?.list ?? []).length > 0 ? (
        <div className="flex flex-col gap-2">
          {data?.list.map((post) => (
            <ProjectItemCMS
              key={post.id}
              sessionUserRoleName={sessionUserRoleName}
              cohortId={cohortId}
              projectId={post.id}
              projectName={post.name}
              lastSubmission={post.deadline_at}
              submissionPercentage={post.submission_percentage}
              onDeleteSuccess={() => utils.list.projects.invalidate()}
            />
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-center text-emphasis font-bodycopy py-2">
          No projects yet
        </p>
      )}
    </SectionContainerCMS>
  );
}
