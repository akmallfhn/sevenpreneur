"use client";
import { trpc } from "@/trpc/client";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import CreateProjectFormCMS from "../forms/CreateProjectFormCMS";
import ProjectItemCMS from "../items/ProjectItemCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface ProjectListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function ProjectListCMS(props: ProjectListCMSProps) {
  const utils = trpc.useUtils();
  const [createProject, setCreateProject] = useState(false);

  const allowedRolesCreateProject = [0, 2];
  const allowedRolesListProject = [0, 1, 2, 3];
  const isAllowedCreateProject = allowedRolesCreateProject.includes(
    props.sessionUserRole
  );
  const isAllowedListProject = allowedRolesListProject.includes(
    props.sessionUserRole
  );

  // Fetch tRPC data
  const {
    data: projectListData,
    isError,
    isLoading,
  } = trpc.list.projects.useQuery(
    { cohort_id: props.cohortId },
    { enabled: !!props.sessionToken }
  );

  if (!isAllowedListProject) return;

  return (
    <React.Fragment>
      <div className="projects flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">
            Projects Assignment
          </h2>
          {isAllowedCreateProject && (
            <AppButton
              variant="light"
              size="small"
              onClick={() => setCreateProject(true)}
            >
              <Plus className="size-4" />
              Add project
            </AppButton>
          )}
        </div>

        {isLoading && <AppLoadingComponents />}
        {isError && <AppErrorComponents />}

        {!isLoading && !isError && projectListData && (
          <>
            {(projectListData.list ?? []).length > 0 ? (
              <div className="project-list flex flex-col gap-2">
                {projectListData.list.map((post) => (
                  <ProjectItemCMS
                    key={post.id}
                    sessionUserRole={props.sessionUserRole}
                    cohortId={props.cohortId}
                    projectId={post.id}
                    projectName={post.name}
                    lastSubmission={post.deadline_at}
                    submissionPercentage={post.submission_percentage}
                    onDeleteSuccess={() => utils.list.projects.invalidate()}
                  />
                ))}
              </div>
            ) : (
              <p className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
                No Data
              </p>
            )}
          </>
        )}
      </div>

      {/* Create Project */}
      {createProject && (
        <CreateProjectFormCMS
          cohortId={props.cohortId}
          isOpen={createProject}
          onClose={() => setCreateProject(false)}
        />
      )}
    </React.Fragment>
  );
}
