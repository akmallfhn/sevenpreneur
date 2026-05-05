"use client";
import { RolesUser } from "@/lib/app-types";
import { toCamelCase } from "@/lib/convert-case";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { UserCog, UserPlus, UserRoundMinus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AddCohortMemberFormCMS from "../forms/AddCohortMemberFormCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import RolesLabelCMS from "../labels/RolesLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
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
  sessionUserRole: number;
  cohortId: number;
}

export default function CohortMemberListCMS(props: CohortMemberListCMSProps) {
  // State for Add Users
  const [isOpenInvitationForm, setIsOpenInvitationForm] = useState(false);

  // State for Revoke Access Users
  const utils = trpc.useUtils();
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [deleteTargetItem, setDeleteTargetItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch tRPC for Cohort Member List
  const { data, isLoading, isError } = trpc.list.cohortMembers.useQuery({
    cohort_id: props.cohortId,
  });
  const cohortMemberList = data?.list;

  // Function to delete discount
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
            <AppButton variant="tertiary" onClick={() => setIsOpenInvitationForm(true)}>
              <UserPlus className="size-5" />
              Add Members
            </AppButton>
          </PageHeaderCMS>

          <div className="members-stats grid grid-cols-4 w-full gap-3 xl:grid-cols-5">
            <ScorecardItemCMS
              scorecardName="Total Members"
              scorecardValue={cohortMemberList?.length || 0}
              scorecardBackground="bg-primary"
            />
            <ScorecardItemCMS
              scorecardName="Total Students"
              scorecardValue={
                cohortMemberList?.filter((item) => item.role_id === 3).length ||
                0
              }
              scorecardBackground="bg-warning-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Total Educators"
              scorecardValue={
                cohortMemberList?.filter((item) => item.role_id === 1).length ||
                0
              }
              scorecardBackground="bg-success-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Total Class Manager"
              scorecardValue={
                cohortMemberList?.filter((item) => item.role_id === 2).length ||
                0
              }
              scorecardBackground="bg-secondary"
            />
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
                    <TableHeadCMS>{`Roles`.toUpperCase()}</TableHeadCMS>
                    <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                  </TableRowCMS>
                </TableHeaderCMS>
                <TableBodyCMS>
                  {cohortMemberList
                    ?.sort((a, b) => a.role_id - b.role_id)
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
