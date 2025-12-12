"use client";
import AppButton from "@/app/components/buttons/AppButton";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  ChevronRight,
  EllipsisVertical,
  Loader2,
  PlusCircle,
  Settings2,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import TableCellCMS from "../elements/TableCellCMS";
import TableHeadCMS from "../elements/TableHeadCMS";
import CreateDiscountFormCMS from "../forms/CreateDiscountFormCMS";
import EditDiscountFormCMS from "../forms/EditDiscountFormCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";

dayjs.extend(localizedFormat);

interface DiscountListCMSProps {
  sessionToken: string;
}

export default function DiscountListCMS({
  sessionToken,
}: DiscountListCMSProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [isOpenEditForm, setIsOpenEditForm] = useState<string | null>(
    selectedId
  );
  const [isOpenCreateForm, setIsOpenCreateForm] = useState(false);
  const [actionsOpened, setActionsOpened] = useState<number | null>(null);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);
  const [deleteTargetItem, setDeleteTargetItem] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const wrapperRef = useRef<Record<string, HTMLDivElement | null>>({});
  const setWrapperRef = (id: number) => (el: HTMLDivElement | null) => {
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
    discountId: number
  ) => {
    e.stopPropagation();
    setActionsOpened((prev) => (prev === discountId ? null : discountId));
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

  // Push Parameter to URL
  const editDiscountForm = (discountId: number) => {
    setIsOpenEditForm(String(discountId));
    router.push(`/discounts?id=${discountId}`, { scroll: false });
  };

  // Close edit form when close
  const handleCloseEditDiscount = () => {
    setIsOpenEditForm(null);
    router.push("/discounts", { scroll: false });
  };

  // Fetch tRPC for Discount List
  const { data, isLoading, isError } = trpc.list.discounts.useQuery(
    {},
    { enabled: !!sessionToken }
  );
  const discountList = data?.list;

  // Function to delete user
  const deleteDiscount = trpc.delete.discount.useMutation();
  const handleDelete = () => {
    if (!deleteTargetItem) return;
    deleteDiscount.mutate(
      { id: deleteTargetItem.id },
      {
        onSuccess: () => {
          toast.success("Delete success");
          utils.list.discounts.invalidate();
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
    <React.Fragment>
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        {/* PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/discounts" isCurrentPage>
              Discounts
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage={"Discount List"}
              descPage={"Manage discounts for all product easily"}
            />
            <AppButton
              variant="cmsPrimary"
              onClick={() => setIsOpenCreateForm(true)}
            >
              <PlusCircle className="size-5" />
              New Discount
            </AppButton>
          </div>
        </div>

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

        {/* TABLE */}
        {!isLoading && !isError && (
          <table className="relative w-full rounded-sm">
            <thead className="bg-[#FAFAFA] text-alternative/70">
              <tr>
                <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Discount Code`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Rate`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Status`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Start date`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Expired date`.toUpperCase()}</TableHeadCMS>
                <TableHeadCMS>{`Actions`.toUpperCase()}</TableHeadCMS>
              </tr>
            </thead>
            <tbody>
              {discountList?.map((post, index) => (
                <tr
                  className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                  key={index}
                >
                  <TableCellCMS>{index + 1}</TableCellCMS>
                  <TableCellCMS>{post.name}</TableCellCMS>
                  <TableCellCMS>{post.code}</TableCellCMS>
                  <TableCellCMS>{`${post.calc_percent}%`}</TableCellCMS>
                  <TableCellCMS>
                    <StatusLabelCMS variants={post.status} />
                  </TableCellCMS>
                  <TableCellCMS>
                    {dayjs(post.start_date).format("D MMM YYYY HH:mm")}
                  </TableCellCMS>
                  <TableCellCMS>
                    {dayjs(post.end_date).format("D MMM YYYY HH:mm")}
                  </TableCellCMS>
                  <TableCellCMS>
                    <div
                      className="actions-button flex relative"
                      ref={setWrapperRef(post.id)}
                    >
                      <AppButton
                        variant="ghost"
                        size="small"
                        onClick={(e) => handleActionsDropdown(e, post.id)}
                      >
                        <EllipsisVertical className="size-4" />
                      </AppButton>
                      <AppDropdown
                        isOpen={actionsOpened === post.id}
                        alignDesktop="right"
                        onClose={() => setActionsOpened(null)}
                      >
                        <AppDropdownItemList
                          menuIcon={<Settings2 className="size-4" />}
                          menuName="Edit Details"
                          onClick={() => editDiscountForm(post.id)}
                        />
                        <AppDropdownItemList
                          menuIcon={<Trash2 className="size-4" />}
                          menuName="Delete"
                          isDestructive
                          onClick={() => {
                            setDeleteTargetItem({
                              id: post.id,
                              name: post.name,
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
      </div>

      {/* Open Create Form */}
      {isOpenCreateForm && (
        <CreateDiscountFormCMS
          sessionToken={sessionToken}
          isOpen={isOpenCreateForm}
          onClose={() => setIsOpenCreateForm(false)}
        />
      )}

      {/* Open Edit Form */}
      {isOpenEditForm && (
        <EditDiscountFormCMS
          sessionToken={sessionToken}
          discountId={Number(selectedId)}
          isOpen={!!isOpenEditForm}
          onClose={handleCloseEditDiscount}
        />
      )}

      {/* Open Dropdown */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete ${deleteTargetItem?.name}? This action cannot be undone.`}
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
