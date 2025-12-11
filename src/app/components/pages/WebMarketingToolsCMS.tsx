"use client";
import AppButton from "@/app/components/buttons/AppButton";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { StatusType } from "@/lib/app-types";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faBell,
  faCalendarDay,
  faPowerOff,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { ChevronRight, Loader2, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditTickerMarketingFormCMS from "../forms/EditTickerMarketingFormCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";

interface WebMarketingToolsCMSProps {
  sessionToken: string;
}

export default function WebMarketingToolsCMS(props: WebMarketingToolsCMSProps) {
  const [editTicker, setEditTicker] = useState(false);

  // Set Session Token to Header
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  // Fetch tRPC Detail Ticker
  const {
    data: tickerData,
    isLoading: isLoadingTickerData,
    isError: isErrorTickerData,
  } = trpc.read.ticker.useQuery({ id: 1 });
  const tickerDetailsData = tickerData?.ticker;

  const isLoading = isLoadingTickerData;
  const isError = isErrorTickerData;

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
              titlePage="Web Marketing"
              descPage="View and manage all registered users in one place, with quick access to actions like edit or delete."
            />
          </div>
        </div>

        {/* Loading & Error State */}
        {isLoading && (
          <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}

        {/* TICKER TOOLS */}
        {tickerDetailsData && !isLoadingTickerData && !isErrorTickerData && (
          <div className="tools flex items-center justify-between p-5 bg-section-background/50 border border-outline rounded-md">
            <div className="flex flex-col gap-2">
              <div className="tools-name flex flex-col">
                <h2 className="font-brand font-bold text-lg">
                  Ticker Announcement
                </h2>
                <h3 className="text-black/40 font-bodycopy font-medium">
                  a short running text at the top of the screen for quick
                  updates.
                </h3>
              </div>
              <div className="tools-data flex flex-col font-bodycopy text-[15px] gap-1.5">
                <div className="ticker-title flex items-center">
                  <div className="flex w-36 items-center gap-2 text-black/40">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="size-4 shrink-0"
                    />
                    <p className="font-medium">Headline:</p>
                  </div>
                  <p className="font-medium ">{tickerDetailsData?.title}</p>
                </div>
                <div className="ticker-callout flex items-center">
                  <div className="flex w-36 items-center gap-2 text-black/40">
                    <FontAwesomeIcon
                      icon={faBell}
                      className="size-4 shrink-0"
                    />
                    <p className="font-medium">Callout (CTA):</p>
                  </div>
                  <p className="font-medium ">{tickerDetailsData?.callout}</p>
                </div>
                <div className="ticker-status flex items-center">
                  <div className="flex w-36 items-center gap-2 text-black/40">
                    <FontAwesomeIcon
                      icon={faPowerOff}
                      className="size-4 shrink-0"
                    />
                    <p className="font-medium">Status:</p>
                  </div>
                  <StatusLabelCMS
                    variants={tickerDetailsData?.status as StatusType}
                  />
                </div>
                <div className="ticker-start-date flex items-center">
                  <div className="flex w-36 items-center gap-2 text-black/40">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="size-4 shrink-0"
                    />
                    <p className="font-medium">Available from:</p>
                  </div>
                  <p className="font-medium">
                    {dayjs(tickerDetailsData?.start_date).format(
                      "DD MMMM YYYY [at] HH:mm"
                    )}
                  </p>
                </div>
                <div className="ticker-end-date flex items-center">
                  <div className="flex w-36 items-center gap-2 text-black/40">
                    <FontAwesomeIcon
                      icon={faCalendarDay}
                      className="size-4 shrink-0"
                    />
                    <p className="font-medium">Valid until:</p>
                  </div>
                  <p className="font-medium">
                    {dayjs(tickerDetailsData?.end_date).format(
                      "DD MMMM YYYY [at] HH:mm"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <AppButton
              variant="cmsPrimary"
              size="medium"
              onClick={() => setEditTicker(true)}
            >
              <Settings className="size-4" />
              Update Ticker
            </AppButton>
          </div>
        )}
      </div>

      {/* Open Edit Ticker */}
      {editTicker && (
        <EditTickerMarketingFormCMS
          sessionToken={props.sessionToken}
          tickerId={1}
          isOpen={editTicker}
          onClose={() => setEditTicker(false)}
        />
      )}
    </React.Fragment>
  );
}
