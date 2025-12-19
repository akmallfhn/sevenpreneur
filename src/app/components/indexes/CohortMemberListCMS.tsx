"use client";
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
import EditCertificateFormCMS from "../forms/EditCertificateFormCMS";
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
              <AppBreadcrumbItem isCurrentPage>Members</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <TitleRevealCMS
                titlePage="Cohort Members"
                descPage={`Browse and review all submissions for `}
              />
            </div>
          </div>
          <div className="progress-review grid grid-cols-5 w-full gap-3">
            <ScorecardItemCMS
              scorecardName="Total Members"
              scorecardValue={cohortMemberList?.length || 0}
              scorecardBackground="bg-primary"
            />
            <ScorecardItemCMS
              scorecardName="Certified Members"
              scorecardValue={
                cohortMemberList?.filter((item) => !!item.certificate_url)
                  .length || 0
              }
              scorecardBackground="bg-success-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Uncertified Members"
              scorecardValue={
                cohortMemberList?.filter((item) => !item.certificate_url)
                  .length || 0
              }
              scorecardBackground="bg-destructive"
            />
          </div>
          <div className="submission-list flex flex-col gap-2">
            <table className="table-submission relative w-full rounded-sm">
              <thead className="bg-[#FAFAFA] text-[#111111]/70">
                <tr>
                  <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Certified`.toUpperCase()}</TableHeadCMS>
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
                        {!!post.certificate_url ? (
                          <BooleanLabelCMS label="Certified" value={true} />
                        ) : (
                          <BooleanLabelCMS label="Uncertified" value={false} />
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
        <EditCertificateFormCMS
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
