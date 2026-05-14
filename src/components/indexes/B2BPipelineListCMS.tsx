"use client";
import AppButton from "@/components/buttons/AppButton";
import PageHeaderCMS from "@/components/titles/PageHeaderCMS";
import { getRupiahCurrency } from "@/lib/currency";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import {
  Building2,
  EllipsisVertical,
  PlusCircle,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppInput from "../fields/AppInput";
import CreateLeadsPipelineFormCMS from "../forms/CreateLeadsPipelineFormCMS";
import EditLeadsPipelineFormCMS from "../forms/EditLeadsPipelineFormCMS";
import B2BProductLabelCMS from "../labels/B2BProductLabelCMS";
import B2BStageLabelCMS from "../labels/B2BStageLabelCMS";
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

interface B2BPipelineListCMSProps {
  sessionToken: string;
}

export default function B2BPipelineListCMS(props: B2BPipelineListCMSProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const pageSize = 20;
  const searchParam = useSearchParams();
  const pageParam = searchParam.get("page");
  const currentPage = Number(pageParam) || 1;

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string | undefined>(
    ""
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [actionsOpened, setActionsOpened] = useState<number | null>(null);
  const wrapperRef = useRef<Record<number, HTMLDivElement | null>>({});
  const setWrapperRef = (id: number) => (el: HTMLDivElement | null) => {
    wrapperRef.current[id] = el;
  };

  useEffect(() => {
    if (props.sessionToken) setSessionToken(props.sessionToken);
  }, [props.sessionToken]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(keyword.trim() === "" ? undefined : keyword);
    }, 600);
    return () => clearTimeout(handler);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const clickedInsideAny = Object.values(wrapperRef.current).some(
        (el) => el && target && el.contains(target)
      );
      if (!clickedInsideAny) setActionsOpened(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const { data, isLoading, isError } = trpc.list.b2b.pipelines.useQuery(
    { page: currentPage, page_size: pageSize, keyword: debouncedKeyword },
    { enabled: !!props.sessionToken }
  );
  const pipelineList = data?.list.map((item) => ({
    ...item,
    project_value: Number(item.project_value),
  }));

  const deletePipeline = trpc.delete.b2b.pipeline.useMutation();
  const handleDelete = () => {
    if (!deleteTarget) return;
    deletePipeline.mutate(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          toast.success("Lead deleted");
          utils.list.b2b.pipelines.invalidate();
        },
        onError: (err) => {
          toast.error("Failed to delete lead", { description: `${err}` });
        },
      }
    );
  };

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="index w-full flex flex-col gap-4">
          <PageHeaderCMS
            name="B2B Sales Pipeline"
            desc="Track and manage every lead across your B2B sales pipeline"
            icon={Building2}
          >
            <AppButton variant="tertiary" onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="size-5" />
              Add Leads
            </AppButton>
          </PageHeaderCMS>

          <div className="filter-search flex w-full items-center">
            <div className="max-w-96 w-full">
              <AppInput
                variant="CMS"
                inputId="search-b2b-pipeline"
                inputType="search"
                inputIcon={<Search className="size-5" />}
                inputPlaceholder="Search company, PIC, or email..."
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

          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {pipelineList && !isLoading && !isError && (
            <table className="relative w-full rounded-sm">
              <TableHeaderCMS>
                <TableRowCMS>
                  <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Company`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Product`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Stage`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Probability`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Project Value`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Owner`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Created`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Action`.toUpperCase()}</TableHeadCMS>
                </TableRowCMS>
              </TableHeaderCMS>
              <TableBodyCMS>
                {pipelineList.map((post, index) => (
                  <TableRowCMS key={post.id}>
                    <TableCellCMS>
                      {(currentPage - 1) * pageSize + index + 1}
                    </TableCellCMS>
                    <TableCellCMS>
                      <p className="font-bodycopy font-semibold text-[15px] line-clamp-1 max-w-64">
                        {post.name}
                      </p>
                    </TableCellCMS>
                    <TableCellCMS>
                      <B2BProductLabelCMS variants={post.product} />
                    </TableCellCMS>
                    <TableCellCMS>
                      <B2BStageLabelCMS variants={post.stage} />
                    </TableCellCMS>
                    <TableCellCMS>
                      <span className="font-bodycopy font-medium text-sm">
                        {post.probability}%
                      </span>
                    </TableCellCMS>
                    <TableCellCMS>
                      <span className="font-bodycopy font-semibold text-sm whitespace-nowrap">
                        {getRupiahCurrency(post.project_value)}
                      </span>
                    </TableCellCMS>
                    <TableCellCMS>
                      <div className="flex items-center gap-2">
                        <div className="flex size-5 rounded-full overflow-hidden bg-card-inside-bg">
                          {post.owner_avatar && (
                            <Image
                              src={post.owner_avatar}
                              alt={post.owner_name}
                              width={20}
                              height={20}
                              className="size-full object-cover"
                            />
                          )}
                        </div>
                        <p className="font-bodycopy font-medium text-sm line-clamp-1 max-w-40">
                          {post.owner_name}
                        </p>
                      </div>
                    </TableCellCMS>
                    <TableCellCMS>
                      <span className="font-bodycopy text-sm text-emphasis whitespace-nowrap">
                        {dayjs(post.created_at).format("D MMM YYYY")}
                      </span>
                    </TableCellCMS>
                    <TableCellCMS>
                      <div
                        className="actions-button flex relative"
                        ref={setWrapperRef(post.id)}
                      >
                        <AppButton
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActionsOpened((prev) =>
                              prev === post.id ? null : post.id
                            );
                          }}
                        >
                          <EllipsisVertical className="size-5" />
                        </AppButton>
                        <AppDropdown
                          isOpen={actionsOpened === post.id}
                          alignDesktop="right"
                          onClose={() => setActionsOpened(null)}
                        >
                          <AppDropdownItemList
                            menuIcon={<Settings2 className="size-4" />}
                            menuName="Edit"
                            onClick={() => {
                              setEditTargetId(post.id);
                              setActionsOpened(null);
                            }}
                          />
                          <AppDropdownItemList
                            menuIcon={<Trash2 className="size-4" />}
                            menuName="Delete"
                            isDestructive
                            onClick={() => {
                              setDeleteTarget({ id: post.id, name: post.name });
                              setActionsOpened(null);
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

          {pipelineList?.length === 0 && (
            <p className="empty-state mt-2 font-bodycopy text-center text-emphasis">
              {debouncedKeyword
                ? `Looks like there are no results for "${debouncedKeyword}"`
                : "No leads yet. Click Add Leads to create the first one."}
            </p>
          )}

          {!isLoading && !isError && (
            <div className="pagination flex flex-col w-full items-center gap-3">
              <AppNumberPagination
                currentPage={currentPage}
                totalPages={data?.metapaging.total_page ?? 1}
              />
              <p className="text-sm text-emphasis text-center font-bodycopy font-medium">{`Showing all ${data?.metapaging.total_data ?? 0} leads`}</p>
            </div>
          )}
        </div>
      </PageContainerCMS>

      {isCreateOpen && (
        <CreateLeadsPipelineFormCMS
          sessionToken={props.sessionToken}
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}

      {editTargetId !== null && (
        <EditLeadsPipelineFormCMS
          sessionToken={props.sessionToken}
          pipelineId={editTargetId}
          isOpen={editTargetId !== null}
          onClose={() => setEditTargetId(null)}
        />
      )}

      {deleteTarget && (
        <AppAlertConfirmDialog
          alertDialogHeader="Delete this lead?"
          alertDialogMessage={`Are you sure you want to delete "${deleteTarget.name}"? All related actions will also be removed. This cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            handleDelete();
            setDeleteTarget(null);
          }}
        />
      )}
    </React.Fragment>
  );
}
