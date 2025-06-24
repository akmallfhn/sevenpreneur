"use client";
import { useEffect } from "react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppButton from "../buttons/AppButton";
import {
  ChevronRight,
  EllipsisVertical,
  Loader2,
  Plus,
  PlusCircle,
} from "lucide-react";
import { setSessionToken, trpc } from "@/trpc/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import {
  faBookBookmark,
  faCalendar,
  faChalkboard,
  faChalkboardTeacher,
  faChalkboardUser,
  faLaptop,
  faLinesLeaning,
  faMoneyBill1Wave,
} from "@fortawesome/free-solid-svg-icons";
import FileItemCMS from "../items/FileItemCMS";

dayjs.extend(localizedFormat);

interface CohortDetailsCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function CohortDetailsCMS({
  cohortId,
  sessionToken,
}: CohortDetailsCMSProps) {
  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Call data from tRPC
  const {
    data: cohortDetailsData,
    isLoading: isLoadingDetailsData,
    isError: isErrorDetailsData,
  } = trpc.read.cohort.useQuery({ id: cohortId }, { enabled: !!sessionToken });

  // --- Extract variable
  const isLoading = isLoadingDetailsData;
  const isError = isErrorDetailsData;
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

  return (
    <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
      {/* --- PAGE HEADER */}
      <div className="page-header flex flex-col gap-3">
        <AppBreadcrumb>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href={`/cohorts/${cohortId}`} isCurrentPage>
            Profile
          </AppBreadcrumbItem>
        </AppBreadcrumb>
      </div>

      {/* --- PAGE BODY */}
      <div className="body-container flex gap-5">
        {/* -- Main */}
        <main className="flex flex-col flex-[2] w-full gap-2">
          <div className="flex flex-col gap-3">
            {/* - Metadata */}
            <div className="image-thumbnail relative flex aspect-thumbnail rounded-md overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://cdn1-production-images-kly.akamaized.net/524y4XzzpNF0uNXuIvIQe65vv_0=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/5135681/original/030234100_1739782560-rundown-kapanlagi-buka-bareng-bri-festi-263294.jpg"
                }
                alt={cohortDetailsData?.cohort.name || "Cohort Sevenpreneur"}
                width={1200}
                height={1200}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="cohort-title font-brand font-bold text-xl">
                {cohortDetailsData?.cohort.name}
              </h1>
              <div className="cohort-timeline flex gap-2 items-center text-alternative">
                <FontAwesomeIcon icon={faCalendar} className="size-3" />
                <div className="flex font-bodycopy font-medium text-sm items-center gap-1">
                  <span>
                    {dayjs(cohortDetailsData?.cohort.start_date).format("ll")}
                  </span>{" "}
                  -{" "}
                  <span>
                    {dayjs(cohortDetailsData?.cohort.end_date).format("ll")}
                  </span>
                </div>
              </div>
              <p className="font-bodycopy font-medium">
                {cohortDetailsData?.cohort.description}
              </p>
            </div>
          </div>
        </main>

        {/* -- Aside */}
        <aside className="flex flex-col flex-[1] w-full gap-5">
          {/* Stats */}
          <div className="stats flex flex-col gap-3">
            <div className="stat-item flex items-center bg-cms-primary-light gap-3 p-3 rounded-md">
              <div className="icon aspect-square flex size-12 p-3 justify-center items-center bg-cms-primary text-white rounded-full">
                <FontAwesomeIcon icon={faChalkboardUser} className="size-7" />
              </div>
              <div className="attribute-data flex flex-col">
                <h3 className="font-bodycopy font-semibold">
                  Total Enrolled User
                </h3>
                <p className="font-brand font-bold text-xl">345</p>
              </div>
            </div>
            <div className="stat-item flex items-center bg-[#FDEDDC] gap-3 p-3 rounded-md">
              <div className="icon aspect-square flex size-12 p-3 justify-center items-center bg-[#FFA524] text-white rounded-full">
                <FontAwesomeIcon icon={faLaptop} className="size-7" />
              </div>
              <div className="attribute-data flex flex-col">
                <h3 className="font-bodycopy font-semibold">
                  Total Learning Sessions
                </h3>
                <p className="font-brand font-bold text-xl">8</p>
              </div>
            </div>
            <div className="stat-item flex items-center bg-[#DBF2F0] gap-3 p-3 rounded-md">
              <div className="icon aspect-square flex size-12 p-3 justify-center items-center bg-cms-secondary text-white rounded-full">
                <FontAwesomeIcon icon={faLinesLeaning} className="size-7" />
              </div>
              <div className="attribute-data flex flex-col">
                <h3 className="font-bodycopy font-semibold">Total Materials</h3>
                <p className="font-brand font-bold text-xl">45</p>
              </div>
            </div>
            <div className="stat-item flex items-center bg-[#F6D7E0] gap-3 p-3 rounded-md">
              <div className="icon aspect-square flex size-12 p-3 justify-center items-center bg-secondary text-white rounded-full">
                <FontAwesomeIcon icon={faMoneyBill1Wave} className="size-7" />
              </div>
              <div className="attribute-data flex flex-col">
                <h3 className="font-bodycopy font-semibold">Total Revenue</h3>
                <p className="font-brand font-bold text-xl">Rp 3,453,000,000</p>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="modules flex flex-col gap-3 p-3 bg-section-background rounded-md">
            <div className="section-name flex justify-between items-center">
              <h2 className="label-name font-brand font-bold">Modules</h2>
              <AppButton variant="outline" size="small">
                <Plus className="size-4" />
                Add file
              </AppButton>
            </div>
            <div className="module-list flex flex-col gap-2">
              <FileItemCMS
                fileType="PPTX"
                fileIcon="https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png"
              />
              <FileItemCMS
                fileType="DOCX"
                fileIcon="https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png"
              />
              <FileItemCMS
                fileType="XLSX"
                fileIcon="https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png"
              />
              <FileItemCMS
                fileType="PDF"
                fileIcon="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//pdf-icon.webp"
              />
            </div>
            <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
              Load more
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
