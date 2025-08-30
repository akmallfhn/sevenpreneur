"use client";
import { Loader2, Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import ProjectItemCMS from "../items/ProjectItemCMS";
import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import CreateProjectFormCMS from "../forms/CreateProjectFormCMS";

interface ProjectListCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function ProjectListCMS({
  sessionToken,
  cohortId,
}: ProjectListCMSProps) {
  const [createProject, setCreateProject] = useState(false);
  const utils = trpc.useUtils();

  // --- Call data from tRPC
  const {
    data: projectListData,
    isError,
    isLoading,
  } = trpc.list.projects.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  return (
    <React.Fragment>
      <div className="projects flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">
            Projects Assignment
          </h2>
          <AppButton
            variant="outline"
            size="small"
            onClick={() => setCreateProject(true)}
          >
            <Plus className="size-4" />
            Add project
          </AppButton>
        </div>
        {isLoading && (
          <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {(!projectListData?.list || projectListData.list.length === 0) && (
          <div className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {projectListData?.list.some((post) => post.id) && (
          <div className="project-list flex flex-col gap-2">
            {projectListData?.list.map((post, index) => (
              <ProjectItemCMS
                key={index}
                cohortId={cohortId}
                projectId={post.id}
                projectName={post.name}
                lastSubmission={post.deadline_at}
                submissionPercentage={post.submission_percentage}
                onDeleteSuccess={() => utils.list.projects.invalidate()}
              />
            ))}
          </div>
        )}
      </div>

      {createProject && (
        <CreateProjectFormCMS
          cohortId={cohortId}
          isOpen={createProject}
          onClose={() => setCreateProject(false)}
        />
      )}
    </React.Fragment>
  );
}
