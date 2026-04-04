"use client";
import Image from "next/image";
import AvatarBadgeLMS, {
  AvatarBadgeLMSProps,
} from "../../../components/buttons/AvatarBadgeLMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";

interface HeroCohortDetailsLMSProps extends AvatarBadgeLMSProps {
  cohortName: string;
  cohortBanner: string;
}

export default function HeroCohortDetailsLMS(props: HeroCohortDetailsLMSProps) {
  return (
    <div className="hero-cohort relative flex w-full aspect-[1626/494] overflow-hidden">
      <Image
        className="object-cover w-full h-full"
        src={props.cohortBanner}
        alt="Hero Banner Cohort"
        fill
        loading="eager"
      />
      <div className="overlay-top absolute inset-0 bg-linear-to-b from-0% from-black to-40% to-transparent z-10" />
      <div className="overlay-bottom absolute inset-0 bg-linear-to-t from-0% from-black to-30% to-transparent z-10" />

      <div className="hero-container absolute flex w-full max-w-[calc(100%-4rem)] top-4 left-1/2 -translate-x-1/2 items-center justify-between px-0 py-4 z-20">
        <div className="hero-breadcrumb flex items-center gap-4">
          <AppBreadcrumb className="text-white">
            <p className="slash font-bodycopy">/</p>
            <AppBreadcrumbItem isCurrentPage>
              {props.cohortName}
            </AppBreadcrumbItem>
          </AppBreadcrumb>
        </div>

        <AvatarBadgeLMS
          sessionUserAvatar={props.sessionUserAvatar}
          sessionUserName={props.sessionUserName || "Unknown"}
          sessionUserRole={props.sessionUserRole}
        />
      </div>
    </div>
  );
}
