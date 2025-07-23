"use client";
import React, { useEffect, useState } from "react";
import { setSessionToken, trpc } from "@/trpc/client";
import { ChevronRight, Loader2, Settings2 } from "lucide-react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppButton from "../buttons/AppButton";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import TitleRevealCMS from "../titles/TitleRevealCMS";
import EditProjectFormCMS from "../forms/EditProjectFormCMS";

dayjs.extend(localizedFormat);

interface ProjectDetailsCMSProps {
  sessionToken: string;
  cohortId: number;
  projectId: number;
}

export default function ProjectDetailsCMS({
  sessionToken,
  cohortId,
  projectId,
}: ProjectDetailsCMSProps) {
  const [editProject, setEditProject] = useState(false);

  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Call data from tRPC
  const {
    data: projectDetailsData,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
  } = trpc.read.project.useQuery(
    { id: projectId },
    { enabled: !!sessionToken }
  );
  // --- Extract variable
  const isLoading = isLoadingProjectDetails;
  const isError = isErrorProjectDetails;
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href={`/cohorts/${cohortId}`}>
              Details
            </AppBreadcrumbItem>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem
              href={`/cohorts/${cohortId}/projects/${projectId}`}
              isCurrentPage
            >
              {projectDetailsData?.project.name}
            </AppBreadcrumbItem>
          </AppBreadcrumb>

          <div className="page-title-actions flex justify-between items-center">
            {/* --- Page Title */}
            <TitleRevealCMS
              titlePage={projectDetailsData?.project.name || ""}
              descPage={projectDetailsData?.project.description || ""}
            />
            {/* --- Page Actions */}
            <AppButton
              variant="cmsPrimary"
              onClick={() => setEditProject(true)}
            >
              <Settings2 className="size-5" />
              Edit Project
            </AppButton>
          </div>

          {/* --- DETAILS */}
        </div>
      </div>

      {editProject && (
        <EditProjectFormCMS
          projectId={projectId}
          initialData={projectDetailsData?.project}
          isOpen={editProject}
          onClose={() => setEditProject(false)}
        />
      )}
    </React.Fragment>
  );
}
