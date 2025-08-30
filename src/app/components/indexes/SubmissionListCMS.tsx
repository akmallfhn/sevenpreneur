"use client";
import React, { useEffect, useState } from "react";
import { setSessionToken, trpc } from "@/trpc/client";
import { ChevronRight, Eye, Loader2, Settings2 } from "lucide-react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import TitleRevealCMS from "../titles/TitleRevealCMS";
import TableHeadCMS from "../elements/TableHeadCMS";
import TableCellCMS from "../elements/TableCellCMS";
import Image from "next/image";
import AppButton from "../buttons/AppButton";

dayjs.extend(localizedFormat);

interface SubmissionsListCMSProps {
  sessionToken: string;
  cohortId: number;
  projectId: number;
}

export default function SubmissionListCMS({
  sessionToken,
  cohortId,
  projectId,
}: SubmissionsListCMSProps) {
  // Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // Fetch tRPC for Project Details
  const {
    data: projectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
  } = trpc.read.project.useQuery(
    { id: projectId },
    { enabled: !!sessionToken }
  );
  const projectDetailsData = projectDetails?.project;

  // Fetch tRPC for Submissions List
  const {
    data: submissionData,
    isLoading: isLoadingSubmissionData,
    isError: isErrorSubmissionData,
  } = trpc.list.submissions.useQuery({ project_id: projectId });
  const submissionList = submissionData?.list;

  // Extract variable
  const isLoading = isLoadingProjectDetails || isLoadingSubmissionData;
  const isError = isErrorProjectDetails || isErrorSubmissionData;

  return (
    <React.Fragment>
      {/* Conditional Rendering */}
      {isLoading && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}

      {!isLoading && !isError && (
        <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
          {/* PAGE HEADER */}
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
                href={`/cohorts/${cohortId}/projects/${projectId}/submissions`}
                isCurrentPage
              >
                {projectDetailsData?.name}
              </AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <TitleRevealCMS
                titlePage={"Assignment Submissions"}
                descPage={`Browse and review all submissions for ${projectDetailsData?.name}`}
              />
            </div>
          </div>

          {/* TABLE */}
          <table className="relative w-full rounded-sm">
            <thead className="bg-[#FAFAFA] text-alternative/70">
              <tr>
                <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Submitted at`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
              </tr>
            </thead>
            <tbody>
              {submissionList?.map((post, index) => (
                <tr
                  className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                  key={index}
                >
                  <TableCellCMS>{index + 1}</TableCellCMS>
                  <TableCellCMS>
                    <div className="user-id flex items-center gap-4 w-full shrink-0 max-w-[30vw] lg:max-w-[33vw] 2xl:max-w-[49vw]">
                      <div className="flex size-7 rounded-full overflow-hidden">
                        <Image
                          className="object-cover w-full h-full"
                          src={
                            post.avatar ||
                            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                          }
                          alt={`Image ${post.full_name}`}
                          width={300}
                          height={300}
                        />
                      </div>
                      <div className="user-name-email flex flex-col">
                        <h2 className="user-name font-semibold font-bodycopy text-black line-clamp-1">
                          {post.full_name}
                        </h2>
                      </div>
                    </div>
                  </TableCellCMS>
                  <TableCellCMS>
                    {dayjs(post.created_at).format("D MMM YYYY [at] HH:mm")}
                  </TableCellCMS>
                  <TableCellCMS>
                    <AppButton variant="outline" size="small">
                      <Eye className="size-4" />
                      Preview
                    </AppButton>
                  </TableCellCMS>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </React.Fragment>
  );
}
