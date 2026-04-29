"use client";
import AppButton from "@/components/buttons/AppButton";
import PageTitleSectionCMS from "@/components/titles/PageTitleSectionCMS";
import { RolesUser, StatusType } from "@/lib/app-types";
import { toCamelCase } from "@/lib/convert-case";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  ChevronRight,
  EllipsisVertical,
  Eye,
  PlusCircle,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppInput from "../fields/AppInput";
import RolesLabelCMS from "../labels/RolesLabelCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppNumberPagination from "../navigations/AppNumberPagination";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import TableBodyCMS from "../tables/TableBodyCMS";
import TableCellCMS from "../tables/TableCellCMS";
import TableHeadCMS from "../tables/TableHeadCMS";
import TableHeaderCMS from "../tables/TableHeaderCMS";
import TableRowCMS from "../tables/TableRowCMS";

interface UserListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function UserListCMS(props: UserListCMSProps) {
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

  // State for Delete User
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // State for Dropdown
  const [actionsOpened, setActionsOpened] = useState<string | null>(null);
  const wrapperRef = useRef<Record<string, HTMLDivElement | null>>({});
  const setWrapperRef = (id: string) => (el: HTMLDivElement | null) => {
    wrapperRef.current[id] = el;
  };

  // Client-side Authorization
  const allowedRolesMutateUser = [0];
  const allowedRolesReadUser = [0, 1, 2];

  const isAllowedMutateUser = allowedRolesMutateUser.includes(
    props.sessionUserRole
  );
  const isAllowedReadUser = allowedRolesReadUser.includes(
    props.sessionUserRole
  );

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
    { enabled: !!props.sessionToken }
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
    <PageContainerCMS>
      <div className="index w-full flex flex-col gap-4">
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/users" isCurrentPage>
              Users
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <PageTitleSectionCMS
              pageTitle="User List"
              pageDesc="View and manage all registered users in one place, with quick access to actions like edit or delete."
            />
            {isAllowedMutateUser && (
              <Link href={"/users/create"} className="w-fit h-fit">
                <AppButton variant="tertiary">
                  <PlusCircle className="size-5" />
                  Add Account
                </AppButton>
              </Link>
            )}
          </div>
        </div>
        <div className="filter-search flex w-full items-center">
          <div className="max-w-96 w-full">
            <AppInput variant="CMS"
              inputId="search-user"
              inputType="search"
              inputIcon={<Search className="size-5" />}
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

        {/* Loading & Error State */}
        {isLoading && <AppLoadingComponents />}
        {isError && <AppErrorComponents />}

        {userList && !isLoading && !isError && (
          <table className="table-users relative w-full rounded-sm">
            <TableHeaderCMS>
              <TableRowCMS>
                <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`User`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Roles`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Status`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Register at`.toUpperCase()}</TableHeadCMS>
                {isAllowedMutateUser && (
                  <TableHeadCMS>{`Actions`.toUpperCase()}</TableHeadCMS>
                )}
              </TableRowCMS>
            </TableHeaderCMS>
            <TableBodyCMS>
              {userList?.map((post, index) => (
                <TableRowCMS key={index}>
                  <TableCellCMS>
                    {(currentPage - 1) * pageSize + (index + 1)}
                  </TableCellCMS>
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
                        <p className="user-email flex items-center gap-2 text-emphasis font-bodycopy text-sm">
                          {post.email}
                        </p>
                      </div>
                    </div>
                  </TableCellCMS>
                  <TableCellCMS>
                    <RolesLabelCMS
                      labelName={post.role_name}
                      variants={toCamelCase(post.role_name) as RolesUser}
                    />
                  </TableCellCMS>
                  <TableCellCMS>
                    <StatusLabelCMS variants={post.status as StatusType} />
                  </TableCellCMS>
                  <TableCellCMS>
                    {dayjs(post.created_at).format("D MMM YYYY HH:mm")}
                  </TableCellCMS>
                  {(isAllowedMutateUser || isAllowedReadUser) && (
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
                        >
                          {isAllowedReadUser && (
                            <Link href={`/users/${post.id}`}>
                              <AppDropdownItemList
                                menuIcon={<Eye className="size-4" />}
                                menuName="View Profile"
                              />
                            </Link>
                          )}
                          {isAllowedMutateUser && (
                            <Link href={`/users/${post.id}/edit`}>
                              <AppDropdownItemList
                                menuIcon={<Settings2 className="size-4" />}
                                menuName="Edit Profile"
                              />
                            </Link>
                          )}
                          {isAllowedMutateUser && (
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
                          )}
                        </AppDropdown>
                      </div>
                    </TableCellCMS>
                  )}
                </TableRowCMS>
              ))}
            </TableBodyCMS>
          </table>
        )}
        {userList?.length === 0 && (
          <p className="empty-state mt-2 font-bodycopy text-center text-emphasis">{`Looks like there are no results for "${debouncedKeyword}"`}</p>
        )}
        {!isLoading && !isError && (
          <div className="pagination flex flex-col w-full items-center gap-3">
            <AppNumberPagination
              currentPage={currentPage}
              totalPages={data?.metapaging.total_page ?? 1}
            />
            <p className="text-sm text-emphasis text-center font-bodycopy font-medium">{`Showing all ${data?.metapaging.total_data} users`}</p>
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
    </PageContainerCMS>
  );
}
