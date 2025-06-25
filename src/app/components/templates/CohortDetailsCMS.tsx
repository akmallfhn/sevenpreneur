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
import LearningSessionItemCMS from "../items/LearningSessionItemCMS";
import UserItemSimpleCMS from "../items/UserItemSimpleCMS";
import ProjectItemCMS from "../items/ProjectItemCMS";

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
            Details
          </AppBreadcrumbItem>
        </AppBreadcrumb>
      </div>

      {/* --- PAGE BODY */}
      <div className="body-container flex gap-5">
        {/* -- Main */}
        <main className="flex flex-col flex-[2] w-full gap-5">
          {/* Cohort Detail */}
          <div className="flex flex-col bg-white border border-outline rounded-md overflow-hidden">
            <div className="image-thumbnail relative flex aspect-thumbnail">
              <Image
                className="object-cover w-full h-full"
                src={cohortDetailsData?.cohort.image || ""}
                alt={cohortDetailsData?.cohort.name || "Cohort Sevenpreneur"}
                width={1200}
                height={1200}
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
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

          {/* Learnings */}
          <div className="flex flex-col gap-3 p-3 bg-section-background rounded-md">
            <div className="section-name flex justify-between items-center">
              <h2 className="label-name font-brand font-bold">Learnings</h2>
              <AppButton variant="outline" size="small">
                <Plus className="size-4" />
                Add sessions
              </AppButton>
            </div>
            <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
              LIVE NOW
            </h3>
            <div className="learning-list flex flex-col gap-2">
              <LearningSessionItemCMS
                cohortId={cohortId}
                sessionName="Day 4 - Finance, Tax, Standard Accounting Procedure"
                sessionEducatorName="Felicia Putri Tjiasaka"
                sessionEducatorAvatar="https://cdn1-production-images-kly.akamaized.net/VMOMJZI5ThAIIVjSIk7B3CxYkYQ=/500x500/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3918744/original/035101900_1643478653-WhatsApp_Image_2022-01-27_at_16.46.27__1_.jpeg"
                sessionMethod="online"
              />
            </div>
            <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
              UPCOMING
            </h3>
            <div className="learning-list flex flex-col gap-2">
              <LearningSessionItemCMS
                cohortId={cohortId}
                sessionName="Day 7 - Idealisme Bernegara Pada Kaki Manusia"
                sessionEducatorName="Alm Tan Malaka"
                sessionEducatorAvatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU007Bi7Smlx3rX422NJsG5NKxQhLVEwyvmg&s"
                sessionMethod="online"
              />
              <LearningSessionItemCMS
                cohortId={cohortId}
                sessionName="Day 6 - Menata Kota Jakarta"
                sessionEducatorName="Bang Doel"
                sessionEducatorAvatar="https://img2.beritasatu.com/cache/investor/480x310-3/2024/09/1727592754-1190x669.webp"
                sessionMethod="hybrid"
              />
            </div>
            <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
              COMPLETED
            </h3>
            <div className="learning-list flex flex-col gap-2">
              <LearningSessionItemCMS
                cohortId={cohortId}
                sessionName="Day 1 - Menemukan Tim Terbaik seperti One Piece"
                sessionEducatorName="Rafi Ahmad"
                sessionEducatorAvatar="https://foto.kontan.co.id/StXCKE_cdjxl3ync1Wq9iTMX4zg=/smart/2023/03/09/1036754397p.jpg"
                sessionMethod="online"
              />
              <LearningSessionItemCMS
                cohortId={cohortId}
                sessionName="Day 2 - Membentuk Ide dan Mindset Logika"
                sessionEducatorName="Tijjani Reinders"
                sessionEducatorAvatar="https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/80/2025/04/04/Screenshot_20250404_212706_Gallery-3123441984.jpg"
                sessionMethod="on site"
              />
              <LearningSessionItemCMS
                cohortId={cohortId}
                sessionName="Day 3 - Research by Yourself"
                sessionEducatorName="Lamine Yamal"
                sessionEducatorAvatar="https://akcdn.detik.net.id/community/media/visual/2025/06/06/2218118646-1749193061423_169.jpeg?w=600&q=90"
                sessionMethod="online"
              />
            </div>
            <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
              Load more
            </p>
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
            <div className="stat-item flex items-center bg-[#FFE6EE] gap-3 p-3 rounded-md">
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
                fileName="Metriks OKR dalam Pemecahan Masalah"
                fileType="PPTX"
                fileIcon="https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png"
              />
              <FileItemCMS
                fileName="Modul Framework Terlengkap SBBP"
                fileType="DOCX"
                fileIcon="https://www.gstatic.com/images/branding/product/2x/docs_2020q4_48dp.png"
              />
              <FileItemCMS
                fileName="Financial Template"
                fileType="XLSX"
                fileIcon="https://www.gstatic.com/images/branding/product/2x/sheets_2020q4_48dp.png"
              />
              <FileItemCMS
                fileName="Silabus Pembelajaran"
                fileType="PDF"
                fileIcon="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//pdf-icon.webp"
              />
            </div>
            <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
              Load more
            </p>
          </div>

          {/* Enrolled user */}
          <div className="enrolled-user flex flex-col gap-3 p-3 bg-section-background rounded-md">
            <h2 className="label-name font-brand font-bold">Enrolled Users</h2>
            <div className="user-list flex flex-col gap-4 bg-white rounded-md p-4">
              <UserItemSimpleCMS
                userName="Iqtironia Khamlia"
                userAvatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3iAhb7CJ27cQ11hydy_2L-BJsRb4x0uKGrA&s"
              />
              <UserItemSimpleCMS
                userName="Nailal Hana"
                userAvatar="https://media.licdn.com/dms/image/v2/D5603AQEJ-7Q-sU8nLQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1702721727717?e=2147483647&v=beta&t=I87OG4TaALe5F_z5NInHsbWI7u6ZNHUEX0Z1lEFnFFc"
              />
              <UserItemSimpleCMS
                userName="Rima Amaliana"
                userAvatar="https://media.licdn.com/dms/image/v2/D5603AQEVVMDvyQpyfQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1697969357081?e=2147483647&v=beta&t=2JxjAOsv03JaAWmwkxUh3FBGD0MjbKFDQihFr1jraVo"
              />
              <UserItemSimpleCMS
                userName="Cica Susilo"
                userAvatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaOwYZfpEVR8WVzJ7SGXOXYISRhtIBp9EY2w&s"
              />
              <UserItemSimpleCMS
                userName="Ridha Hitalala"
                userAvatar="https://media.licdn.com/dms/image/v2/D5603AQHOSKgX8TsdvQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1715315136213?e=2147483647&v=beta&t=LqS7XLqwrYSoxQvArIPBLl01NNVysbGlfdsdqaZ_qkM"
              />
              <UserItemSimpleCMS
                userName="Hesti Giri Pertiwi Suci"
                userAvatar="https://media.licdn.com/dms/image/v2/C4E03AQHL-XEm2q_oCw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1646964896995?e=2147483647&v=beta&t=_UmA6XbAdnvuw6KWBYEKQiEmmNREwChb_FElX14MjTk"
              />
            </div>
            <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
              Load more
            </p>
          </div>

          {/* Projects */}
          <div className="projects flex flex-col gap-3 p-3 bg-section-background rounded-md">
            <div className="section-name flex justify-between items-center">
              <h2 className="label-name font-brand font-bold">Projects</h2>
              <AppButton variant="outline" size="small">
                <Plus className="size-4" />
                Add projects
              </AppButton>
            </div>
            <div className="project-list flex flex-col gap-2">
              <ProjectItemCMS
                projectName="Business Model Canvas 3.0"
                lastSubmission="2025-06-02 02:00:00+00"
              />
              <ProjectItemCMS
                projectName="Business Model Canvas 3.0"
                lastSubmission="2025-06-02 02:00:00+00"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
