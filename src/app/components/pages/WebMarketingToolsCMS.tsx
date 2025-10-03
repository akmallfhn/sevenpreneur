"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { setSessionToken, trpc } from "@/trpc/client";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { ChevronRight } from "lucide-react";
import EditTickerMarketingFormCMS from "../forms/EditTickerMarketingFormCMS";

interface WebMarketingToolsCMSProps {
  sessionToken: string;
}

export default function WebMarketingToolsCMS({
  sessionToken,
}: WebMarketingToolsCMSProps) {
  const [editTicker, setEditTicker] = useState(false);

  // Fetch tRPC Detail Ticker
  const { data, isLoading, isError } = trpc.read.ticker.useQuery({ id: 1 });
  const tickerData = data?.ticker;

  return (
    <React.Fragment>
      <div className="web-marketing-tools max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        {/* PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/marketing" isCurrentPage>
              Web Marketing
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage={"Web Marketing"}
              descPage={
                "View and manage all registered users in one place, with quick access to actions like edit or delete."
              }
            />
          </div>
        </div>

        {/* TICKER TOOLS */}
        <div className="flex items-center justify-between p-5 bg-section-background">
          <div>
            <p>{tickerData?.title}</p>
            <p>{tickerData?.callout}</p>
            <p>{tickerData?.start_date}</p>
            <p>{tickerData?.end_date}</p>
          </div>
          <AppButton
            variant="cmsPrimary"
            size="medium"
            onClick={() => setEditTicker(true)}
          >
            Edit
          </AppButton>
        </div>
      </div>

      {editTicker && (
        <EditTickerMarketingFormCMS
          initialData={tickerData}
          isOpen={editTicker}
          onClose={() => setEditTicker(false)}
        />
      )}
    </React.Fragment>
  );
}
