"use client";
import AppButton from "@/components/buttons/AppButton";
import PageTitleSectionCMS from "@/components/titles/PageTitleSectionCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  ChevronRight,
  EllipsisVertical,
  PlusCircle,
  Settings2,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import CreateEventFormCMS from "../forms/CreateEventFormCMS";
import EditEventFormCMS from "../forms/EditEventFormCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import TableBodyCMS from "../tables/TableBodyCMS";
import TableCellCMS from "../tables/TableCellCMS";
import TableHeadCMS from "../tables/TableHeadCMS";
import TableHeaderCMS from "../tables/TableHeaderCMS";
import TableRowCMS from "../tables/TableRowCMS";

dayjs.extend(localizedFormat);

interface EventListCMSProps {
  sessionToken: string;
}

export default function EventListCMS({ sessionToken }: EventListCMSProps) {
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
    eventId: number
  ) => {
    e.stopPropagation();
    setActionsOpened((prev) => (prev === eventId ? null : eventId));
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
  const editEventForm = (eventId: number) => {
    setIsOpenEditForm(String(eventId));
    router.push(`/events?id=${eventId}`, { scroll: false });
  };

  // Close edit form when close
  const handleCloseEditEvent = () => {
    setIsOpenEditForm(null);
    router.push("/events", { scroll: false });
  };

  // Fetch tRPC for Event List
  const { data, isLoading, isError } = trpc.list.events.useQuery(
    {},
    { enabled: !!sessionToken }
  );
  const eventList = data?.list;

  // Function to delete
  const deleteEvent = trpc.delete.event.useMutation();
  const handleDelete = () => {
    if (!deleteTargetItem) return;
    deleteEvent.mutate(
      { id: deleteTargetItem.id },
      {
        onSuccess: () => {
          toast.success("Delete success");
          utils.list.events.invalidate();
        },
        onError: (err) => {
          toast.error("Failed to delete event", {
            description: `${err}`,
          });
        },
      }
    );
  };

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="index w-full flex flex-col gap-4">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>Events</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <PageTitleSectionCMS
                pageTitle="Event List"
                pageDesc="Manage event listings, details, and maintain content efficiently"
              />
              <AppButton
                variant="tertiary"
                onClick={() => setIsOpenCreateForm(true)}
              >
                <PlusCircle className="size-5" />
                Create Event
              </AppButton>
            </div>
          </div>

          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {/* TABLE */}
          {!isLoading && !isError && (
            <table className="relative w-full rounded-sm">
              <TableHeaderCMS>
                <TableRowCMS>
                  <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Name`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Event date`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Status`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Location`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Actions`.toUpperCase()}</TableHeadCMS>
                </TableRowCMS>
              </TableHeaderCMS>
              <TableBodyCMS>
                {eventList?.map((post, index) => (
                  <TableRowCMS key={index}>
                    <TableCellCMS>{index + 1}</TableCellCMS>
                    <TableCellCMS>{post.name}</TableCellCMS>
                    <TableCellCMS>
                      {dayjs(post.start_date).format("D MMM YYYY HH:mm")}
                    </TableCellCMS>
                    <TableCellCMS>
                      <StatusLabelCMS variants={post.status} />
                    </TableCellCMS>
                    <TableCellCMS>{post.location_name}</TableCellCMS>
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
                            onClick={() => editEventForm(post.id)}
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
                  </TableRowCMS>
                ))}
              </TableBodyCMS>
            </table>
          )}
        </div>
      </PageContainerCMS>

      {/* Open Create Form */}
      {isOpenCreateForm && (
        <CreateEventFormCMS
          isOpen={isOpenCreateForm}
          onClose={() => setIsOpenCreateForm(false)}
        />
      )}

      {/* Open Edit Form */}
      {isOpenEditForm && (
        <EditEventFormCMS
          sessionToken={sessionToken}
          eventId={Number(selectedId)}
          isOpen={!!isOpenEditForm}
          onClose={handleCloseEditEvent}
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
