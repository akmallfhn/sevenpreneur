"use client";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { BarChart3, Eye, Star } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import EditCohortMemberFormCMS from "../forms/EditCohortMemberFormCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import TableBodyCMS from "../tables/TableBodyCMS";
import TableCellCMS from "../tables/TableCellCMS";
import TableHeadCMS from "../tables/TableHeadCMS";
import TableHeaderCMS from "../tables/TableHeaderCMS";
import TableRowCMS from "../tables/TableRowCMS";
import PageHeaderCMS from "../titles/PageHeaderCMS";

dayjs.extend(localizedFormat);

interface CohortMembersPerformanceCMSProps {
  sessionToken: string;
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function CohortMembersPerformanceCMS(
  props: CohortMembersPerformanceCMSProps
) {
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
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
          <PageHeaderCMS
            name="Student Performance Tracker"
            desc="Track student attendance, assignment progress, and overall learning performance"
            icon={BarChart3}
          />

          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {!isLoading && !isError && (
            <React.Fragment>
              <div className="progress-review grid grid-cols-4 w-full gap-3 xl:grid-cols-5">
                <ScorecardItemCMS
                  scorecardName="Total Students"
                  scorecardValue={cohortMemberList?.length || 0}
                  scorecardBackground="bg-primary"
                />
                <ScorecardItemCMS
                  scorecardName="Student Scouts"
                  scorecardValue={
                    cohortMemberList?.filter((item) => item.is_scout).length ||
                    0
                  }
                  scorecardBackground="bg-warning-foreground"
                />
                <ScorecardItemCMS
                  scorecardName="Completed Information"
                  scorecardValue={
                    cohortMemberList?.filter(
                      (item) => item.has_completed_survey
                    ).length || 0
                  }
                  scorecardBackground="bg-tertiary"
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
                  <TableHeaderCMS>
                    <TableRowCMS>
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
                    </TableRowCMS>
                  </TableHeaderCMS>
                  <TableBodyCMS>
                    {cohortMemberList
                      ?.sort((a, b) => a.full_name.localeCompare(b.full_name))
                      .map((post, index) => (
                        <TableRowCMS key={index}>
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
                              <BooleanLabelCMS
                                label="UNFINISHED"
                                value={false}
                              />
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
                                {post.attended_learning_count}/
                                {post.learning_count}
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
                                {post.submitted_project_count}/
                                {post.project_count}
                              </p>
                            </div>
                          </TableCellCMS>
                          <TableCellCMS>
                            {!!post.certificate_url ? (
                              <BooleanLabelCMS label="UPLOADED" value={true} />
                            ) : (
                              <BooleanLabelCMS
                                label="NOT UPLOADED"
                                value={false}
                              />
                            )}
                          </TableCellCMS>
                          {isAllowedDetailsMembers && (
                            <TableCellCMS>
                              <AppButton
                                variant="light"
                                size="small"
                                onClick={() => viewMemberDetails(post.id)}
                              >
                                <Eye className="size-4" />
                                Preview
                              </AppButton>
                            </TableCellCMS>
                          )}
                        </TableRowCMS>
                      ))}
                  </TableBodyCMS>
                </table>
              </div>
            </React.Fragment>
          )}
        </div>
      </PageContainerCMS>

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
