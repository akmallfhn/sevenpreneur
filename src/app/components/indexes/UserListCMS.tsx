"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { setSessionToken, trpc } from "@/trpc/client";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import {
  ChevronRight,
  PlusCircle,
  Loader2,
  EllipsisVertical,
  Settings2,
  Eye,
  Trash2,
} from "lucide-react";
import TableHeadCMS from "../elements/TableHeadCMS";
import TableCellCMS from "../elements/TableCellCMS";
import Image from "next/image";
import RolesLabelCMS, { RolesVariant } from "../labels/RolesLabelCMS";
import { toCamelCase } from "@/lib/camel-case";
import StatusLabelCMS, { StatusVariant } from "../labels/StatusLabelCMS";
import dayjs from "dayjs";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import { toast } from "sonner";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";

interface UserListCMSProps {
  sessionToken: string;
}

export default function UserListCMS({ sessionToken }: UserListCMSProps) {
  const [actionsOpened, setActionsOpened] = useState<string | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const wrapperRef = useRef<Record<string, HTMLDivElement | null>>({});
  const setWrapperRef = (id: string) => (el: HTMLDivElement | null) => {
    wrapperRef.current[id] = el;
  };
  const utils = trpc.useUtils();

  // Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // Open and close dropdown
  const handleActionsDropdown = (
    e: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    e.stopPropagation();
    setActionsOpened((prev) => (prev === userId ? null : userId));
  };

  // Close dropdown outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const clickedInsideAny = Object.values(wrapperRef.current).some(
        (el) => el && target && el.contains(target)
      );
      if (!clickedInsideAny) {
        setActionsOpened(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Return data from tRPC
  const { data, isLoading, isError } = trpc.list.users.useQuery(
    { page: 1, page_size: 80 },
    { enabled: !!sessionToken }
  );
  const userList = data?.list;

  // Function to delete user
  const deleteUser = trpc.delete.user.useMutation();
  const handleDelete = () => {
    if (!deleteTargetUser) return;
    deleteUser.mutate(
      { id: deleteTargetUser.id },
      {
        onSuccess: () => {
          toast.success("Delete success");
          utils.list.users.invalidate();
        },
        onError: (err) => {
          toast.error("Failed to delete user", {
            description: `${err}`,
          });
        },
      }
    );
  };

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
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/users" isCurrentPage>
              Users
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            {/* -- Page Title */}
            <TitleRevealCMS
              titlePage={"User List"}
              descPage={
                "View and manage all registered users in one place, with quick access to actions like edit or delete."
              }
            />
            {/* -- Page Actions */}
            <Link href={"/users/create"} className="w-fit h-fit">
              <AppButton variant="cmsPrimary">
                <PlusCircle className="size-5" />
                Add Account
              </AppButton>
            </Link>
          </div>
        </div>

        {/* --- TABLE */}
        <table className="relative w-full rounded-sm overflow-hidden">
          <thead className="bg-[#FAFAFA] text-alternative/70">
            <tr>
              <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
              <TableHeadCMS>{`User`.toUpperCase()}</TableHeadCMS>
              <TableHeadCMS>{`Roles`.toUpperCase()}</TableHeadCMS>
              <TableHeadCMS>{`Status`.toUpperCase()}</TableHeadCMS>
              <TableHeadCMS>{`Last Login`.toUpperCase()}</TableHeadCMS>
              <TableHeadCMS>{`Actions`.toUpperCase()}</TableHeadCMS>
            </tr>
          </thead>
          <tbody>
            {userList?.map((post, index) => (
              <tr
                className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                key={index}
              >
                <TableCellCMS>{index + 1}</TableCellCMS>

                {/* Name & Email */}
                <TableCellCMS>
                  <div className="user-id flex items-center gap-4 w-full shrink-0 max-w-[30vw] lg:max-w-[33vw] 2xl:max-w-[49vw]">
                    <div className="flex size-9 rounded-full overflow-hidden">
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
                      <Link href={`/users/${post.id}`}>
                        <h2 className="user-name font-bold font-bodycopy text-black line-clamp-1">
                          {post.full_name}
                        </h2>
                      </Link>
                      <p className="user-email flex items-center gap-2 text-alternative font-bodycopy text-sm">
                        {post.email}
                      </p>
                    </div>
                  </div>
                </TableCellCMS>

                {/* Roles */}
                <TableCellCMS>
                  <RolesLabelCMS
                    labelName={post.role_name}
                    variants={toCamelCase(post.role_name) as RolesVariant}
                  />
                </TableCellCMS>

                {/* Status */}
                <TableCellCMS>
                  <StatusLabelCMS
                    labelName={post.status}
                    variants={post.status as StatusVariant}
                  />
                </TableCellCMS>

                {/* Last Login */}
                <TableCellCMS>
                  {dayjs(post.last_login).format("D MMM YYYY HH:mm")}
                </TableCellCMS>

                {/* Actions */}
                <TableCellCMS>
                  <div
                    className="actions-button flex relative"
                    ref={setWrapperRef(post.id)}
                  >
                    <AppButton
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleActionsDropdown(e, post.id)}
                    >
                      <EllipsisVertical className="size-5" />
                    </AppButton>
                    <AppDropdown
                      isOpen={actionsOpened === post.id}
                      alignDesktop="right"
                      onClose={() => setActionsOpened(null)}
                      anchorEl={wrapperRef.current[post.id]}
                    >
                      {/* -- View */}
                      <Link href={`/users/${post.id}`}>
                        <AppDropdownItemList
                          menuIcon={<Eye className="size-4" />}
                          menuName="View Profile"
                        />
                      </Link>
                      {/* -- Edit */}
                      <Link href={`/users/${post.id}/edit`}>
                        <AppDropdownItemList
                          menuIcon={<Settings2 className="size-4" />}
                          menuName="Edit Profile"
                        />
                      </Link>
                      {/* -- Delete */}
                      <AppDropdownItemList
                        menuIcon={<Trash2 className="size-4" />}
                        menuName="Delete"
                        isDestructive
                        onClick={() => {
                          setDeleteTargetUser({
                            id: post.id,
                            name: post.full_name,
                          });
                          setIsOpenDeleteConfirmation(true);
                        }}
                      />
                    </AppDropdown>
                  </div>
                </TableCellCMS>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${deleteTargetUser?.name}? This action cannot be undone.`}
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
