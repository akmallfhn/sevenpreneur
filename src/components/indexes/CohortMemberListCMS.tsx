"use client";
import { RolesUser } from "@/lib/app-types";
import { toCamelCase } from "@/lib/convert-case";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  GraduationCap,
  PenLine,
  Presentation,
  Search,
  UserCog,
  UserPlus,
  UserRoundMinus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppScorecardDashboard from "../cards/AppScorecardDashboard";
import AppInput from "../fields/AppInput";
import AddCohortMemberFormCMS from "../forms/AddCohortMemberFormCMS";
import RolesLabelCMS from "../labels/RolesLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppNumberPagination from "../navigations/AppNumberPagination";
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

interface CohortMemberListCMSProps {
  sessionToken: string;
  sessionUserId: string;
  sessionUserRoleName: string;
  cohortId: number;
}

export default function CohortMemberListCMS(props: CohortMemberListCMSProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  // State for Pagination
  const pageSize = 20;
  const searchParam = useSearchParams();
  const pageParam = searchParam.get("page");
  const currentPage = Number(pageParam) || 1;

  // State for Filter Search
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string | undefined>(
    ""
  );

  // State for Add Users
  const [isOpenInvitationForm, setIsOpenInvitationForm] = useState(false);

  // State for Revoke Access Users
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [deleteTargetItem, setDeleteTargetItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Debounce Typing for 600ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim() === "" ? undefined : keyword);
    }, 600);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Fetch tRPC for Cohort Member List (paginated + searched)
  const { data, isLoading, isError } = trpc.list.cohortMembers.useQuery(
    {
      cohort_id: props.cohortId,
      page: currentPage,
      page_size: pageSize,
      keyword: debouncedKeyword,
    },
    { enabled: !!props.sessionToken }
  );
  const cohortMemberList = data?.list;

  // Fetch unpaginated list for scorecards (independent of search/pagination)
  const { data: scorecardData } = trpc.list.cohortMembers.useQuery(
    { cohort_id: props.cohortId },
    { enabled: !!props.sessionToken }
  );
  const allCohortMembers = scorecardData?.list;

  // Function to revoke access
  const revokeMembers = trpc.delete.cohortMember.useMutation();
  const handleDelete = () => {
    if (!deleteTargetItem) return;
    revokeMembers.mutate(
      { user_id: deleteTargetItem.id, cohort_id: props.cohortId },
      {
        onSuccess: () => {
          toast.success("Revoke access success");
          utils.list.cohortMembers.invalidate();
        },
        onError: (err) => {
          toast.error("Failed to revoke access", {
            description: `${err}`,
          });
        },
      }
    );
  };

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
          <PageHeaderCMS
            name="Manage Members"
            desc="Invite fast. Revoke smarter. Stay in control."
            icon={UserCog}
          >
            <AppButton
              variant="tertiary"
              onClick={() => setIsOpenInvitationForm(true)}
            >
              <UserPlus className="size-5" />
              Add Members
            </AppButton>
          </PageHeaderCMS>

          <div className="members-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-3">
            <AppScorecardDashboard
              title="Total Members"
              value={allCohortMembers?.length || 0}
              icon={<Users className="size-5 text-white" />}
              iconClassName="bg-primary"
            />
            <AppScorecardDashboard
              title="Total Students"
              value={
                allCohortMembers?.filter((item) => item.role_id === 3).length ||
                0
              }
              icon={<GraduationCap className="size-5 text-white" />}
              iconClassName="bg-warning-foreground"
            />
            <AppScorecardDashboard
              title="Total Educators"
              value={
                allCohortMembers?.filter((item) => item.role_id === 1).length ||
                0
              }
              icon={<Presentation className="size-5 text-white" />}
              iconClassName="bg-success-foreground"
            />
            <AppScorecardDashboard
              title="Total Class Manager"
              value={
                allCohortMembers?.filter((item) => item.role_id === 2).length ||
                0
              }
              icon={<PenLine className="size-5 text-white" />}
              iconClassName="bg-secondary"
            />
          </div>

          <div className="filter-search flex w-full items-center">
            <div className="max-w-96 w-full">
              <AppInput
                variant="CMS"
                inputId="search-cohort-member"
                inputType="search"
                inputIcon={<Search className="size-5" />}
                inputPlaceholder="Search members..."
                value={keyword}
                onInputChange={(value) => {
                  setKeyword(value);
                  const params = new URLSearchParams(searchParam.toString());
                  params.set("page", "1");
                  router.push(`?${params.toString()}`);
                }}
              />
            </div>
          </div>

          {/* Loading & Error State */}
          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {cohortMemberList && !isLoading && !isError && (
            <div className="submission-list flex flex-col gap-2">
              <table className="table-submission relative w-full rounded-sm">
                <TableHeaderCMS>
                  <TableRowCMS>
                    <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                    <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                    <TableHeadCMS>{`Access Tier`.toUpperCase()}</TableHeadCMS>
                    <TableHeadCMS>{`Roles`.toUpperCase()}</TableHeadCMS>
                    <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                  </TableRowCMS>
                </TableHeaderCMS>
                <TableBodyCMS>
                  {cohortMemberList?.map((post, index) => (
                    <TableRowCMS key={index}>
                      <TableCellCMS>
                        {(currentPage - 1) * pageSize + (index + 1)}
                      </TableCellCMS>
                      <TableCellCMS>
                        <div className="user-id flex items-center gap-4 w-full">
                          <div className="flex size-9 rounded-full shrink-0 overflow-hidden">
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
                          <div className="user-info flex flex-col">
                            <p className="user-name font-semibold line-clamp-1 dark:text-sevenpreneur-white">
                              {post.full_name}
                            </p>
                            <p className="user-email text-sm text-emphasis line-clamp-1">
                              {post.email}
                            </p>
                          </div>
                        </div>
                      </TableCellCMS>
                      <TableCellCMS>{post.price_name || "-"}</TableCellCMS>
                      <TableCellCMS>
                        <RolesLabelCMS
                          labelName={post.role_name}
                          variants={toCamelCase(post.role_name) as RolesUser}
                        />
                      </TableCellCMS>
                      <TableCellCMS>
                        <AppButton
                          variant="destructive"
                          size="small"
                          onClick={() => {
                            setDeleteTargetItem({
                              id: post.id,
                              name: post.full_name,
                            });
                            setIsOpenDeleteConfirmation(true);
                          }}
                        >
                          <UserRoundMinus className="size-4" />
                          Revoke Access
                        </AppButton>
                      </TableCellCMS>
                    </TableRowCMS>
                  ))}
                </TableBodyCMS>
              </table>
            </div>
          )}
          {cohortMemberList?.length === 0 && (
            <p className="empty-state mt-2 font-bodycopy text-center text-emphasis">
              {debouncedKeyword
                ? `Looks like there are no results for "${debouncedKeyword}"`
                : "No members found in this cohort."}
            </p>
          )}
          {!isLoading && !isError && (
            <div className="pagination flex flex-col w-full items-center gap-3">
              <AppNumberPagination
                currentPage={currentPage}
                totalPages={data?.metapaging.total_page ?? 1}
              />
              <p className="text-sm text-emphasis text-center font-bodycopy font-medium">{`Showing all ${data?.metapaging.total_data} members`}</p>
            </div>
          )}
        </div>
      </PageContainerCMS>

      {/* Add User */}
      {isOpenInvitationForm && (
        <AddCohortMemberFormCMS
          sessionToken={props.sessionToken}
          cohortId={props.cohortId}
          isOpen={isOpenInvitationForm}
          onClose={() => setIsOpenInvitationForm(false)}
        />
      )}

      {/* Revoke Access User */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently revoke access this member?"
          alertDialogMessage={`Are you sure you want to revoke acess ${deleteTargetItem?.name}? This action cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={isOpenDeleteConfirmation}
          onClose={() => setIsOpenDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setIsOpenDeleteConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
