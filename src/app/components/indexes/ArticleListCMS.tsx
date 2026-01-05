"use client";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import { ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import ArticleItemCMS from "../items/ArticleItemCMS";

interface ArticleListCMSProps {
  sessionToken: string;
}

export default function ArticleListCMS(props: ArticleListCMSProps) {
  // Set Session Token to Header
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  // Fetch tRPC List Article
  // const {
  //   data: tickerData,
  //   isLoading: isLoadingTickerData,
  //   isError: isErrorTickerData,
  // } = trpc.read.ticker.useQuery({ id: 1 });
  // const tickerDetailsData = tickerData?.ticker;

  // const isLoading = isLoadingTickerData;
  // const isError = isErrorTickerData;

  return (
    <React.Fragment>
      <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
        <div className="web-marketing-tools max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>SEO Articles</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title-actions flex justify-between items-center">
              <TitleRevealCMS
                titlePage="SEO Articles"
                descPage=" SEO content management hub to create, optimize, and drive organic traffic."
              />
            </div>
          </div>

          {/* Loading & Error State */}
          {/* {isLoading && (
            <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
              <Loader2 className="animate-spin size-5 " />
            </div>
          )}
          {isError && (
            <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
              No Data
            </div>
          )} */}

          <div className="flex flex-col w-full">
            <ArticleItemCMS
              articleId={777777777}
              articleTitle={
                "Jenis-Jenis Supply Chain Management Berdasarkan Model Bisnis"
              }
              articleImage={
                "https://mekari.com/wp-content/uploads/2025/01/efisiensi-produksi-54.webp"
              }
              articleDescription={
                "Hampir setiap produk—mulai dari pakaian hingga perangkat elektronik—melalui ratusan bahkan ribuan langkah untuk sampai ke tangan Anda. Supply chain menghubungkan proses mulai dari bahan mentah, produksi, pemasaran, hingga pengiriman."
              }
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
