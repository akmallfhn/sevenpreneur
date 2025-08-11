"use client";
import { useEffect } from "react";
import Link from "next/link";
import { setSessionToken, trpc } from "@/trpc/client";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ChevronRight, PlusCircle, Loader2, Eye } from "lucide-react";
import TableHeadCMS from "../elements/TableHeadCMS";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import TableCellCMS from "../elements/TableCellCMS";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import TransactionStatusLabelCMS from "../labels/TransactionStatusLabelCMS";
import ProductCategoryLabelCMS from "../labels/ProductCategoryLabelCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";

dayjs.extend(localizedFormat);

interface TransactionListCMSProps {
  sessionToken: string;
}

export default function TransactionListCMS({
  sessionToken,
}: TransactionListCMSProps) {
  // Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Return data from tRPC
  const { data, isLoading, isError } = trpc.list.transactions.useQuery(
    {},
    { enabled: !!sessionToken }
  );
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

  const transactionList = data?.list;

  return (
    <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
      {/* --- PAGE HEADER */}
      <div className="page-header flex flex-col gap-3">
        <AppBreadcrumb>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href="/users" isCurrentPage>
            Transactions
          </AppBreadcrumbItem>
        </AppBreadcrumb>
        <div className="page-title-actions flex justify-between items-center">
          {/* -- Page Title */}
          <TitleRevealCMS
            titlePage={"Transaction List"}
            descPage={
              "View and manage all registered users in one place, with quick access to actions like edit or delete."
            }
          />
        </div>
      </div>

      {/* TABLE */}

      <div className="flex items-center gap-3">
        <ScorecardItemCMS
          scorecardName="Total Revenue"
          scorecardValue={rupiahCurrency(1000000000)}
          scorecardBackground="bg-[#400FDF]"
        />
        <ScorecardItemCMS
          scorecardName="Total Transactions"
          scorecardValue={300}
          scorecardBackground="bg-primary"
        />
        <ScorecardItemCMS
          scorecardName="Total Paid Transactions"
          scorecardValue={287}
          scorecardBackground="bg-success-foreground"
        />
        <ScorecardItemCMS
          scorecardName="Total Pending Transactions"
          scorecardValue={0}
          scorecardBackground="bg-warning-foreground"
        />
        <ScorecardItemCMS
          scorecardName="Total Failed Transactions"
          scorecardValue={2}
          scorecardBackground="bg-danger-foreground"
        />
      </div>

      <table className="relative w-full rounded-sm overflow-hidden">
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
        <tbody>
          {transactionList?.map((post, index) => (
            <tr
              className="border-b border-[#F3F3F3] hover:bg-muted/50 transition-colors"
              key={index}
            >
              <TableCellCMS>{index + 1}</TableCellCMS>
              <TableCellCMS>{post.id}</TableCellCMS>
              <TableCellCMS>
                {post.cohort_name ? post.cohort_name : post.playlist_name}
              </TableCellCMS>
              <TableCellCMS>
                <ProductCategoryLabelCMS variants={post.category} />
              </TableCellCMS>
              <TableCellCMS>
                {rupiahCurrency(Math.round(Number(post.total_amount)))}
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
                <AppButton variant="outline" size="small">
                  <Eye className="size-4" />
                  View
                </AppButton>
              </TableCellCMS>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
