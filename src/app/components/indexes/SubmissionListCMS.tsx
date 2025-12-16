"use client";
import { getSubmissionTiming } from "@/lib/date-time-manipulation";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ChevronRight, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import TableCellCMS from "../elements/TableCellCMS";
import TableHeadCMS from "../elements/TableHeadCMS";
import SubmissionDetailsCMS from "../modals/SubmissionDetailsCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import TitleRevealCMS from "../titles/TitleRevealCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";

dayjs.extend(localizedFormat);

interface SubmissionListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
  projectId: number;
}

export default function SubmissionListCMS(props: SubmissionListCMSProps) {
  const router = useRouter();
  const searchParam = useSearchParams();
  const params = new URLSearchParams(searchParam.toString());
  const selectedId = searchParam.get("id");
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(selectedId);

  const allowedRolesDetailsSubmission = [0, 1, 2, 3];
  const isAllowedDetailsSubmission = allowedRolesDetailsSubmission.includes(
    props.sessionUserRole
  );

  // Push Parameter to URL
  const viewSubmissionDetails = (submissionId: string) => {
    setOpenDetailsId(submissionId);
    params.set("id", submissionId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Close modal when close
  const handleClose = () => {
    setOpenDetailsId(null);
    params.delete("id");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch tRPC for Project Details
  const {
    data: projectDetails,
    isLoading: isLoadingProjectDetails,
    isError: isErrorProjectDetails,
  } = trpc.read.project.useQuery(
    { id: props.projectId },
    { enabled: !!props.sessionToken }
  );
  const projectDetailsData = projectDetails?.project;

  // Fetch tRPC for Submissions List
  const {
    data: submissionData,
    isLoading: isLoadingSubmissionData,
    isError: isErrorSubmissionData,
  } = trpc.list.submissions.useQuery({ project_id: props.projectId });
  const submissionList = submissionData?.list;

  const submissionListAttributes = submissionList?.map((post) => {
    const { isEarly, shortMessage } = getSubmissionTiming(
      post.created_at,
      projectDetailsData?.deadline_at
    );

    return { ...post, isEarly, shortMessage };
  });

  const isLoading = isLoadingProjectDetails || isLoadingSubmissionData;
  const isError = isErrorProjectDetails || isErrorSubmissionData;

  return (
    <React.Fragment>
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
        <div className="root container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem href={`/cohorts/${props.cohortId}`}>
                Details
              </AppBreadcrumbItem>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>
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
          <div className="progress-review grid grid-cols-5 w-full gap-3">
            <ScorecardItemCMS
              scorecardName="Total Submissions"
              scorecardValue={submissionListAttributes?.length || 0}
              scorecardBackground="bg-primary"
            />
            <ScorecardItemCMS
              scorecardName="Reviewed"
              scorecardValue={
                submissionListAttributes?.filter((item) => !!item.comment)
                  .length || 0
              }
              scorecardBackground="bg-success-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Not Reviewed"
              scorecardValue={
                submissionListAttributes?.filter((item) => !item.comment)
                  .length || 0
              }
              scorecardBackground="bg-secondary"
            />
            <ScorecardItemCMS
              scorecardName="Deadline"
              scorecardValue={dayjs(projectDetailsData?.deadline_at).format(
                "D/MM/YYYY [-] HH:mm"
              )}
              scorecardBackground="bg-warning-foreground"
            />
          </div>
          <div className="submission-list flex flex-col gap-2">
            <h3 className="font-bold font-bodycopy">Users Submission</h3>
            <table className="table-submission relative w-full rounded-sm">
              <thead className="bg-[#FAFAFA] text-[#111111]/70">
                <tr>
                  <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Submitted at`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Timing Status`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Review Status`.toUpperCase()}</TableHeadCMS>
                  {isAllowedDetailsSubmission && (
                    <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                  )}
                </tr>
              </thead>
              <tbody>
                {submissionListAttributes
                  ?.sort(
                    (a, b) =>
                      dayjs(a.created_at).valueOf() -
                      dayjs(b.created_at).valueOf()
                  )
                  .map((post, index) => (
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
                        <p className={post.isEarly ? "" : "text-destructive"}>
                          {post.shortMessage}
                        </p>
                      </TableCellCMS>
                      <TableCellCMS>
                        {!post.comment ? (
                          <p className="label-container inline-flex py-[2px] px-[10px] w-fit rounded-full text-xs font-semibold font-bodycopy bg-danger-background text-danger-foreground">
                            NOT REVIEWED
                          </p>
                        ) : (
                          <p className="label-container inline-flex py-[2px] px-[10px] w-fit rounded-full text-xs font-semibold font-bodycopy bg-success-background text-success-foreground">
                            REVIEWED
                          </p>
                        )}
                      </TableCellCMS>
                      {isAllowedDetailsSubmission && (
                        <TableCellCMS>
                          <AppButton
                            variant="outline"
                            size="small"
                            onClick={() =>
                              viewSubmissionDetails(String(post.id))
                            }
                          >
                            <Eye className="size-4" />
                            Preview
                          </AppButton>
                        </TableCellCMS>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Open Submission Details */}
      {openDetailsId && (
        <SubmissionDetailsCMS
          sessionToken={props.sessionToken}
          sessionUserRole={props.sessionUserRole}
          projectDeadline={projectDetailsData?.deadline_at}
          submissionId={Number(selectedId)}
          isOpen={!!openDetailsId}
          onClose={handleClose}
        />
      )}
    </React.Fragment>
  );
}
