"use client";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ChevronRight, Eye, Loader2, Star } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import TableCellCMS from "../elements/TableCellCMS";
import TableHeadCMS from "../elements/TableHeadCMS";
import EditCohortMemberFormCMS from "../forms/EditCohortMemberFormCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import TitleRevealCMS from "../titles/TitleRevealCMS";

dayjs.extend(localizedFormat);

interface CohortMemberListCMSProps {
  sessionToken: string;
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function CohortMemberListCMS(props: CohortMemberListCMSProps) {
  const router = useRouter();
  const searchParam = useSearchParams();
  const params = new URLSearchParams(searchParam.toString());
  const selectedId = searchParam.get("id");
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(selectedId);

  const allowedRolesDetailsMembers = [0, 1, 2];
  const isAllowedDetailsMembers = allowedRolesDetailsMembers.includes(
    props.sessionUserRole
  );

  // Push Parameter to URL
  const viewMemberDetails = (userId: string) => {
    setOpenDetailsId(userId);
    params.set("id", userId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Close modal when close
  const handleClose = () => {
    setOpenDetailsId(null);
    params.delete("id");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Fetch tRPC for Cohort Member List
  const { data, isLoading, isError } = trpc.list.cohortMembers.useQuery({
    cohort_id: props.cohortId,
  });

  const cohortMemberList = data?.list.filter((item) => item.role_id === 3);

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
              <AppBreadcrumbItem isCurrentPage>Performance</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <TitleRevealCMS
                titlePage="Student Performance Tracker"
                descPage="Track student attendance, assignment progress, and overall learning performance"
              />
            </div>
          </div>
          <div className="progress-review grid grid-cols-4 w-full gap-3 xl:grid-cols-5">
            <ScorecardItemCMS
              scorecardName="Total Students"
              scorecardValue={cohortMemberList?.length || 0}
              scorecardBackground="bg-primary"
            />
            <ScorecardItemCMS
              scorecardName="Student Scouts"
              scorecardValue={
                cohortMemberList?.filter((item) => item.is_scout).length || 0
              }
              scorecardBackground="bg-warning-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Completed Information"
              scorecardValue={
                cohortMemberList?.filter((item) => item.has_completed_survey)
                  .length || 0
              }
              scorecardBackground="bg-cms-primary"
            />
            <ScorecardItemCMS
              scorecardName="Certified Students"
              scorecardValue={
                cohortMemberList?.filter((item) => !!item.certificate_url)
                  .length || 0
              }
              scorecardBackground="bg-success-foreground"
            />
          </div>
          <div className="submission-list flex flex-col gap-2">
            <table className="table-submission relative w-full rounded-sm">
              <thead className="bg-[#FAFAFA] text-[#111111]/70">
                <tr>
                  <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Sct`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Biz Info`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Attendance`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Assignment`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Certificate`.toUpperCase()}</TableHeadCMS>
                  {isAllowedDetailsMembers && (
                    <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                  )}
                </tr>
              </thead>
              <tbody>
                {cohortMemberList
                  ?.sort((a, b) => a.full_name.localeCompare(b.full_name))
                  .map((post, index) => (
                    <tr
                      className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                      key={index}
                    >
                      <TableCellCMS>{index + 1}</TableCellCMS>
                      <TableCellCMS>
                        <div className="user-id flex items-center gap-4 w-full">
                          <div className="flex size-6 rounded-full shrink-0 overflow-hidden">
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
                          <p className="user-name font-semibold line-clamp-1">
                            {post.full_name}
                          </p>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>
                        {!!post.is_scout && (
                          <Star
                            className="size-5"
                            fill={!!post.is_scout ? "#E5BA39" : "none"}
                            strokeWidth={!!post.is_scout ? 0 : 2}
                          />
                        )}
                      </TableCellCMS>
                      <TableCellCMS>
                        {post.has_completed_survey ? (
                          <BooleanLabelCMS label="COMPLETED" value={true} />
                        ) : (
                          <BooleanLabelCMS label="UNFINISHED" value={false} />
                        )}
                      </TableCellCMS>
                      <TableCellCMS>
                        <div className="flex items-center gap-2 w-full">
                          <Progress
                            value={Math.round(
                              (post.attended_learning_count /
                                post.learning_count) *
                                100
                            )}
                          />
                          <p className="text-xs">
                            {post.attended_learning_count}/{post.learning_count}
                          </p>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>
                        <div className="flex items-center gap-2 w-full">
                          <Progress
                            value={Math.round(
                              (post.submitted_project_count /
                                post.project_count) *
                                100
                            )}
                          />
                          <p className="text-xs">
                            {post.submitted_project_count}/{post.project_count}
                          </p>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>
                        {!!post.certificate_url ? (
                          <BooleanLabelCMS label="UPLOADED" value={true} />
                        ) : (
                          <BooleanLabelCMS label="NOT UPLOADED" value={false} />
                        )}
                      </TableCellCMS>
                      {isAllowedDetailsMembers && (
                        <TableCellCMS>
                          <AppButton
                            variant="outline"
                            size="small"
                            onClick={() => viewMemberDetails(post.id)}
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
        <EditCohortMemberFormCMS
          sessionToken={props.sessionToken}
          sessionUserId={props.sessionUserId}
          sessionUserRole={props.sessionUserRole}
          userId={openDetailsId}
          cohortId={props.cohortId}
          isOpen={!!openDetailsId}
          onClose={handleClose}
        />
      )}
    </React.Fragment>
  );
}
