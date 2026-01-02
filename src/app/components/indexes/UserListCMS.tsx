"use client";
import AppButton from "@/app/components/buttons/AppButton";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { RolesUser, StatusType } from "@/lib/app-types";
import { toCamelCase } from "@/lib/convert-case";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  ChevronRight,
  EllipsisVertical,
  Eye,
  Loader2,
  PlusCircle,
  Settings2,
  Trash2,
  UserSearch,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import TableCellCMS from "../elements/TableCellCMS";
import TableHeadCMS from "../elements/TableHeadCMS";
import InputCMS from "../fields/InputCMS";
import RolesLabelCMS from "../labels/RolesLabelCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppNumberPagination from "../navigations/AppNumberPagination";

interface UserListCMSProps {
  sessionToken: string;
}

export default function UserListCMS({ sessionToken }: UserListCMSProps) {
  const router = useRouter();
  const pageSize = 20;
  const searchParam = useSearchParams();
  const pageParam = searchParam.get("page");
  const currentPage = Number(pageParam) || 1;
  const utils = trpc.useUtils();
  const [actionsOpened, setActionsOpened] = useState<string | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string | undefined>(
    ""
  );
  const wrapperRef = useRef<Record<string, HTMLDivElement | null>>({});
  const setWrapperRef = (id: string) => (el: HTMLDivElement | null) => {
    wrapperRef.current[id] = el;
  };

  // Debounce Typing for 1 second
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim() === "" ? undefined : keyword);
    }, 600);
    return () => clearTimeout(handler);
  }, [keyword]);

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

  // Fetch tRPC User List
  const { data, isLoading, isError } = trpc.list.users.useQuery(
    { page: currentPage, page_size: pageSize, keyword: debouncedKeyword },
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

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/users" isCurrentPage>
              Users
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage="User List"
              descPage="View and manage all registered users in one place, with quick access to actions like edit or delete."
            />
            <Link href={"/users/create"} className="w-fit h-fit">
              <AppButton variant="cmsPrimary">
                <PlusCircle className="size-5" />
                Add Account
              </AppButton>
            </Link>
          </div>
        </div>
        <div className="filter-search flex w-full items-center">
          <div className="max-w-96 w-full">
            <InputCMS
              inputId="search-user"
              inputType="search"
              inputIcon={<UserSearch className="size-5" />}
              inputPlaceholder="Search users..."
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
        {userList && !isLoading && !isError && (
          <table className="table-users relative w-full rounded-sm">
            <thead className="bg-[#FAFAFA] text-[#111111]/60">
              <tr>
                <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`User`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Roles`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Status`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Register at`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Actions`.toUpperCase()}</TableHeadCMS>
              </tr>
            </thead>
            <tbody>
              {userList?.map((post, index) => (
                <tr
                  className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                  key={index}
                >
                  {/* No */}
                  <TableCellCMS>
                    {(currentPage - 1) * pageSize + (index + 1)}
                  </TableCellCMS>

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
                      variants={toCamelCase(post.role_name) as RolesUser}
                    />
                  </TableCellCMS>

                  {/* Status */}
                  <TableCellCMS>
                    <StatusLabelCMS variants={post.status as StatusType} />
                  </TableCellCMS>

                  {/* Last Login */}
                  <TableCellCMS>
                    {dayjs(post.created_at).format("D MMM YYYY HH:mm")}
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
                        // anchorEl={wrapperRef.current[post.id]}
                      >
                        <Link href={`/users/${post.id}`}>
                          <AppDropdownItemList
                            menuIcon={<Eye className="size-4" />}
                            menuName="View Profile"
                          />
                        </Link>
                        <Link href={`/users/${post.id}/edit`}>
                          <AppDropdownItemList
                            menuIcon={<Settings2 className="size-4" />}
                            menuName="Edit Profile"
                          />
                        </Link>
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
        )}
        {userList?.length === 0 && (
          <p className="mt-2 font-bodycopy text-center text-alternative">{`Looks like there are no results for "${debouncedKeyword}"`}</p>
        )}
        {!isLoading && !isError && (
          <div className="pagination flex flex-col w-full items-center gap-3">
            <AppNumberPagination
              currentPage={currentPage}
              totalPages={data?.metapaging.total_page ?? 1}
            />
            <p className="text-sm text-alternative text-center font-bodycopy font-medium">{`Showing all ${data?.metapaging.total_data} users`}</p>
          </div>
        )}
      </div>

      {/* Open Delete User */}
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
    </div>
  );
}
