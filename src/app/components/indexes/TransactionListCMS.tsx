"use client";
import AppButton from "@/app/components/buttons/AppButton";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ProductCategory } from "@/lib/app-types";
import { getRupiahCurrency } from "@/lib/currency";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Funnel,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import AppDropdown from "../elements/AppDropdown";
import TableCellCMS from "../elements/TableCellCMS";
import TableHeadCMS from "../elements/TableHeadCMS";
import SelectCMS from "../fields/SelectCMS";
import CreateInvoiceFormCMS from "../forms/CreateInvoiceFormCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import FilterLabelCMS from "../labels/FilterLabelCMS";
import ProductCategoryLabelCMS from "../labels/ProductCategoryLabelCMS";
import TransactionStatusLabelCMS from "../labels/TransactionStatusLabelCMS";
import TransactionDetailsCMS from "../modals/TransactionDetailsCMS";
import AppNumberPagination from "../navigations/AppNumberPagination";

dayjs.extend(localizedFormat);

interface TransactionListCMSProps {
  sessionToken: string;
}

export default function TransactionListCMS({
  sessionToken,
}: TransactionListCMSProps) {
  const router = useRouter();
  const searchParam = useSearchParams();
  const params = new URLSearchParams(searchParam.toString());
  const selectedId = searchParam.get("id");
  const pageParam = searchParam.get("page");
  const [isOpenDetails, setIsOpenDetails] = useState<string | null>(selectedId);
  const [isOpenCreateInvoice, setIsOpenCreateInvoice] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const pageSize = 20;
  const currentPage = Number(pageParam) || 1;

  // Beginning State
  const [filterData, setFilterData] = useState<{
    productId: number | string;
    productType: ProductCategory | "";
  }>({
    productId: "",
    productType: "",
  });

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFilterData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Fetch tRPC Product List
  const { data: playlistsData } = trpc.list.playlists.useQuery(
    {},
    { enabled: !!sessionToken },
  );
  const playlists = playlistsData?.list;
  const { data: cohortsData } = trpc.list.cohorts.useQuery(
    {},
    { enabled: !!sessionToken },
  );
  const cohortList = cohortsData?.list;
  const { data: eventsData } = trpc.list.events.useQuery(
    {},
    { enabled: !!sessionToken },
  );
  const eventList = eventsData?.list;

  // Join Product Options
  const productOptions = useMemo(() => {
    return [
      ...(cohortList?.flatMap((post) =>
        post.prices.map((price) => ({
          value: `COHORT-${price.id}`,
          label: `Cohort - ${post.name} ${price.name}`,
          type: "COHORT",
          raw_id: price.id,
        })),
      ) || []),
      ...(eventList?.flatMap((post) =>
        post.prices.map((price) => ({
          value: `EVENT-${price.id}`,
          label: `Event - ${post.name} ${price.name}`,
          type: "EVENT",
          raw_id: price.id,
        })),
      ) || []),
      ...(playlists?.map((post) => ({
        value: `PLAYLIST-${post.id}`,
        label: `Playlist - ${post.name}`,
        type: "PLAYLIST",
        raw_id: post.id,
      })) || []),
    ];
  }, [playlists, cohortList, eventList]);

  // Handle Product Type
  useEffect(() => {
    const selectedOption = productOptions.find(
      (opt) => String(opt.value) === String(filterData.productId),
    );
    if (selectedOption) {
      queueMicrotask(() => {
        setFilterData((prev) => ({
          ...prev,
          productType: selectedOption.type as ProductCategory,
        }));
      });
    }
  }, [filterData.productId, productOptions]);

  // Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpenFilter((prev) => !prev);
  };

  // Close dropdown outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | (MouseEvent & { target: Node }),
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpenFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Push Parameter to URL
  const viewTransactionDetails = (transactionId: string) => {
    setIsOpenDetails(transactionId);
    params.set("id", transactionId);
    router.push(`/transactions?${params.toString()}`, { scroll: false });
  };

  // Close modal when close
  const handleClose = () => {
    setIsOpenDetails(null);
    params.delete("id");
    router.push(`/transactions?${params.toString()}`, { scroll: false });
  };

  // Fetch tRPC Transaction List
  const {
    data: transactionsData,
    isLoading: isLoadingTransactionsData,
    isError: isErrorTransactionsData,
  } = trpc.list.transactions.useQuery(
    {
      page: currentPage,
      page_size: pageSize,
      playlist_id:
        filterData.productType === "PLAYLIST"
          ? Number(
              productOptions.find((opt) => opt.value === filterData.productId)
                ?.raw_id,
            )
          : undefined,
      cohort_id:
        filterData.productType === "COHORT"
          ? Number(
              productOptions.find((opt) => opt.value === filterData.productId)
                ?.raw_id,
            )
          : undefined,
      event_id:
        filterData.productType === "EVENT"
          ? Number(
              productOptions.find((opt) => opt.value === filterData.productId)
                ?.raw_id,
            )
          : undefined,
    },
    { enabled: !!sessionToken },
  );
  const transactionList = transactionsData?.list;

  return (
    <React.Fragment>
      <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
        <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem href="/transactions" isCurrentPage>
                Transactions
              </AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <TitleRevealCMS
                titlePage={"Transaction List"}
                descPage={"View and monitor all payment records in one place."}
              />
              <AppButton
                variant="cmsPrimary"
                onClick={() => setIsOpenCreateInvoice(true)}
              >
                <FileSpreadsheet className="size-5" />
                Create Invoice
              </AppButton>
            </div>
          </div>
          <div className="stats-list grid grid-cols-5 gap-3">
            <ScorecardItemCMS
              scorecardName="Total Revenue"
              scorecardValue={
                transactionsData?.metapaging.total_revenue
                  ? getRupiahCurrency(
                      Number(transactionsData?.metapaging.total_revenue),
                    )
                  : 0
              }
              scorecardBackground="bg-[#400FDF]"
            />
            <ScorecardItemCMS
              scorecardName="Transactions Attempt"
              scorecardValue={transactionsData?.metapaging.total_data || 0}
              scorecardBackground="bg-primary"
            />
            <ScorecardItemCMS
              scorecardName="Paid Transactions"
              scorecardValue={transactionsData?.metapaging.total_paid || 0}
              scorecardBackground="bg-success-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Pending Transactions"
              scorecardValue={transactionsData?.metapaging.total_pending || 0}
              scorecardBackground="bg-warning-foreground"
            />
            <ScorecardItemCMS
              scorecardName="Failed Transactions"
              scorecardValue={transactionsData?.metapaging.total_failed || 0}
              scorecardBackground="bg-danger-foreground"
            />
          </div>
          <div className="filter-button relative flex w-fit" ref={wrapperRef}>
            <AppButton
              variant="outline"
              size="medium"
              onClick={handleActionsDropdown}
            >
              <Funnel className="size-4" />
              Filter
            </AppButton>
            {filterData.productId && (
              <div className="filter-indikator absolute size-2.5 bg-primary outline-3 outline-primary-light top-0 right-0 rounded-full" />
            )}
            <AppDropdown
              isOpen={isOpenFilter}
              onClose={() => setIsOpenFilter(false)}
              alignDesktop="left"
            >
              <div
                className={`flex flex-col w-96 gap-3 ${
                  isSelectOpen ? "h-[321px]" : ""
                }`}
              >
                <p className="font-bold font-bodycopy text-sm pl-1">
                  Filter by Product
                </p>
                <SelectCMS
                  selectId="select-product"
                  selectIcon={<Funnel className="size-4" />}
                  selectPlaceholder="Filter by Product"
                  value={filterData.productId}
                  onChange={(value) => {
                    handleInputChange("productId")(value);
                    setIsOpenFilter(false);
                    params.set("page", "1");
                    router.push(`?${params.toString()}`);
                  }}
                  options={productOptions}
                  onOpenChange={(open) => setIsSelectOpen(open)}
                />
              </div>
            </AppDropdown>
          </div>
          <div className="table-transactions flex flex-col">
            {filterData.productId && (
              <div className="applied-filter flex w-full bg-[#FAFAFA] items-center gap-2 p-2 border-b border-outline/25">
                <p className="text-sm text-alternative font-medium font-bodycopy">
                  Active filter:
                </p>
                <FilterLabelCMS
                  filterName={
                    productOptions.find(
                      (post) => post.value === filterData.productId,
                    )?.label || ""
                  }
                  removeFilter={() =>
                    setFilterData({
                      productId: "",
                      productType: "",
                    })
                  }
                />
              </div>
            )}
            <table className="table-component relative w-full overflow-hidden">
              <thead className="bg-[#FAFAFA] text-alternative/70">
                <tr>
                  <TableHeadCMS>{`No.`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Transaction Id`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Product Name`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Category`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Amount`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Status`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Created At`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Paid At`.toUpperCase()}</TableHeadCMS>
                  <TableHeadCMS>{`Actions`.toUpperCase()}</TableHeadCMS>
                </tr>
              </thead>
              {/* Table Body */}
              {!isLoadingTransactionsData && !isErrorTransactionsData && (
                <tbody>
                  {transactionList?.map((post, index) => (
                    <tr
                      className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
                      key={index}
                    >
                      <TableCellCMS>
                        {(currentPage - 1) * pageSize + (index + 1)}
                      </TableCellCMS>
                      <TableCellCMS>{post.id}</TableCellCMS>
                      <TableCellCMS>
                        {post.cohort_name ||
                          post.playlist_name ||
                          post.event_name}
                      </TableCellCMS>
                      <TableCellCMS>
                        <ProductCategoryLabelCMS variants={post.category} />
                      </TableCellCMS>
                      <TableCellCMS>
                        {getRupiahCurrency(Math.round(Number(post.net_amount)))}
                      </TableCellCMS>
                      <TableCellCMS>
                        <TransactionStatusLabelCMS variants={post.status} />
                      </TableCellCMS>
                      <TableCellCMS>
                        {dayjs(post.created_at).format("D MMM YYYY HH:mm")}
                      </TableCellCMS>
                      <TableCellCMS>
                        {post.paid_at
                          ? dayjs(post.paid_at).format("D MMM YYYY HH:mm")
                          : "-"}
                      </TableCellCMS>
                      <TableCellCMS>
                        <AppButton
                          variant="outline"
                          size="small"
                          onClick={() => viewTransactionDetails(post.id)}
                        >
                          <Eye className="size-4" />
                          View
                        </AppButton>
                      </TableCellCMS>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>

          {/* Conditional Rendering */}
          {isLoadingTransactionsData && (
            <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
              <Loader2 className="animate-spin size-5 " />
            </div>
          )}
          {isErrorTransactionsData && (
            <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
              No Data
            </div>
          )}

          {!isLoadingTransactionsData && !isErrorTransactionsData && (
            <div className="pagination flex flex-col w-full items-center gap-3">
              <AppNumberPagination
                currentPage={currentPage}
                totalPages={transactionsData?.metapaging.total_page ?? 1}
              />
              <p className="text-sm text-alternative text-center font-bodycopy font-medium">{`Showing all ${transactionsData?.metapaging.total_data} transactions`}</p>
            </div>
          )}
        </div>
      </div>

      {/* Open Create Invoice */}
      {isOpenCreateInvoice && (
        <CreateInvoiceFormCMS
          sessionToken={sessionToken}
          isOpen={isOpenCreateInvoice}
          onClose={() => setIsOpenCreateInvoice(false)}
        />
      )}

      {/* Open Transaction Details */}
      {isOpenDetails && (
        <TransactionDetailsCMS
          transactionId={selectedId || ""}
          isOpen={!!isOpenDetails}
          onClose={handleClose}
        />
      )}
    </React.Fragment>
  );
}
