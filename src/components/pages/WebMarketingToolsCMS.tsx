"use client";
import AppButton from "@/components/buttons/AppButton";
import PageHeaderCMS from "@/components/titles/PageHeaderCMS";
import { StatusType } from "@/lib/app-types";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Megaphone, Pen } from "lucide-react";
import React, { useEffect, useState } from "react";
import EditInterstitialAdsFormCMS from "../forms/EditInterstitialAdsFormCMS";
import EditTickerMarketingFormCMS from "../forms/EditTickerMarketingFormCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import PageContainerCMS from "./PageContainerCMS";

interface WebMarketingToolsCMSProps {
  sessionToken: string;
}

export default function WebMarketingToolsCMS(props: WebMarketingToolsCMSProps) {
  const [editTicker, setEditTicker] = useState(false);
  const [editInterstitial, setEditInterstitial] = useState(false);

  // Set Session Token to Header
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const {
    data: tickerData,
    isLoading: isLoadingTickerData,
    isError: isErrorTickerData,
  } = trpc.read.ticker.useQuery({ id: 1 });
  const tickerDetailsData = tickerData?.ticker;

  const {
    data: interstitialData,
    isLoading: isLoadingInterstitialData,
    isError: isErrorInterstitialData,
  } = trpc.read.ad.interstitial.useQuery({
    id: 1,
  });
  const interstitialDetailsData = interstitialData?.interstitial;

  const isLoading = isLoadingTickerData || isLoadingInterstitialData;
  const isError = isErrorTickerData || isErrorInterstitialData;

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="web-marketing-tools max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
          <PageHeaderCMS
            name="Web Marketing"
            desc="Centralized tools to manage internal marketing channels"
            icon={Megaphone}
          />

          {/* Loading & Error State */}
          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {!isLoadingTickerData && !isErrorTickerData && (
            <div className="flex flex-col w-full gap-4">
              {tickerDetailsData && (
                <div className="tools flex items-center justify-between p-5 bg-section-background/50 border rounded-md">
                  <div className="flex flex-col gap-2">
                    <div className="tools-name flex flex-col">
                      <div className="tool-name flex items-center gap-3">
                        <h2 className="font-bodycopy font-bold text-lg">
                          Ticker Running Text
                        </h2>
                        <StatusLabelCMS
                          variants={tickerDetailsData.status as StatusType}
                        />
                      </div>
                      <h3 className="text-black/40 font-bodycopy font-medium">
                        a short running text at the top of the screen for quick
                        updates.
                      </h3>
                    </div>
                    <div className="tools-data flex flex-col font-bodycopy text-[15px] gap-1.5">
                      <div className="flex items-center">
                        <div className="flex w-36 items-center gap-2 text-black/40">
                          <p className="font-medium">Headline:</p>
                        </div>
                        <p className="font-medium ">
                          {tickerDetailsData.title}
                        </p>
                      </div>
                      <div className="call-to-action flex items-center">
                        <div className="flex w-36 items-center gap-2 text-black/40">
                          <p className="font-medium">Call To Action:</p>
                        </div>
                        <p className="font-medium ">
                          {tickerDetailsData.callout}
                        </p>
                      </div>
                      <div className="date-periods flex items-center">
                        <div className="flex w-36 items-center gap-2 text-black/40">
                          <p className="font-medium">Periods:</p>
                        </div>
                        <p className="font-medium">
                          {dayjs(tickerDetailsData.start_date).format(
                            "D MMMM YYYY [at] HH:mm"
                          )}{" "}
                          -{" "}
                          {dayjs(tickerDetailsData.end_date).format(
                            "D MMMM YYYY [at] HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <AppButton
                    variant="tertiary"
                    size="medium"
                    onClick={() => setEditTicker(true)}
                  >
                    <Pen className="size-4" />
                    Update
                  </AppButton>
                </div>
              )}

              {interstitialDetailsData && (
                <div className="tool-item flex items-center justify-between p-5 bg-section-background/50 border rounded-md">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="tool-name flex items-center gap-3">
                        <h2 className="font-bodycopy font-bold text-lg">
                          Interstitial Ads
                        </h2>
                        <StatusLabelCMS
                          variants={
                            interstitialDetailsData.status as StatusType
                          }
                        />
                      </div>
                      <h3 className="tool-desc text-black/40 font-bodycopy font-medium">
                        a full-screen ad shown between content transitions for
                        maximum visibility.
                      </h3>
                    </div>
                    <div className="tools-data flex flex-col font-bodycopy text-[15px] gap-1.5">
                      <div className="flex items-center">
                        <div className="flex w-36 items-center gap-2 text-black/40">
                          <p className="font-medium">Title:</p>
                        </div>
                        <p className="font-medium">
                          {interstitialDetailsData.title}
                        </p>
                      </div>
                      <div className="call-to-action flex items-center">
                        <div className="flex w-36 items-center gap-2 text-black/40">
                          <p className="font-medium">Call To Action:</p>
                        </div>
                        <p className="font-medium ">
                          {interstitialDetailsData.call_to_action}
                        </p>
                      </div>
                      <div className="date-periods flex items-center">
                        <div className="flex w-36 items-center gap-2 text-black/40">
                          <p className="font-medium">Periods:</p>
                        </div>
                        <p className="font-medium">
                          {dayjs(interstitialDetailsData.start_date).format(
                            "D MMMM YYYY [at] HH:mm"
                          )}{" "}
                          -{" "}
                          {dayjs(interstitialDetailsData.end_date).format(
                            "D MMMM YYYY [at] HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <AppButton
                    variant="tertiary"
                    size="medium"
                    onClick={() => setEditInterstitial(true)}
                  >
                    <Pen className="size-4" />
                    Update
                  </AppButton>
                </div>
              )}
            </div>
          )}
        </div>
      </PageContainerCMS>

      {/* Open Edit Ticker */}
      {editTicker && (
        <EditTickerMarketingFormCMS
          sessionToken={props.sessionToken}
          tickerId={1}
          isOpen={editTicker}
          onClose={() => setEditTicker(false)}
        />
      )}

      {/* Edit Interstitial */}
      {editInterstitial && (
        <EditInterstitialAdsFormCMS
          sessionToken={props.sessionToken}
          interstitialId={1}
          isOpen={editInterstitial}
          onClose={() => setEditInterstitial(false)}
        />
      )}
    </React.Fragment>
  );
}
