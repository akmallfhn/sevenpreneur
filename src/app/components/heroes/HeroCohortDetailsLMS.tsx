"use client";
import { Blocks, Compass, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AvatarBadgeLMS, { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";

interface HeroCohortDetailsLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  cohortName: string;
}

export default function HeroCohortDetailsLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  cohortName,
}: HeroCohortDetailsLMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | (MouseEvent & { target: Node })
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Domain Logic
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="hero-cohort relative flex w-full aspect-[1626/494] overflow-hidden">
      <Image
        className="object-cover w-full h-full"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/banner-sbbp-batch7.webp"
        }
        alt="Hero Banner Cohort"
        fill
      />
      <div className="overlay-top absolute inset-0 bg-linear-to-b from-0% from-black to-40% to-transparent z-10" />
      <div className="overlay-bottom absolute inset-0 bg-linear-to-t from-0% from-black to-30% to-transparent z-10" />

      <div className="hero-container absolute flex w-full max-w-[calc(100%-4rem)] top-4 left-1/2 -translate-x-1/2 items-center justify-between px-0 py-4 z-20">
        <div className="hero-breadcrumb flex items-center gap-4">
          <AppBreadcrumb className="text-white">
            <p className="slash font-bodycopy">/</p>
            <AppBreadcrumbItem href="/cohorts">
              Bootcamp Programs
            </AppBreadcrumbItem>
            <p className="slash font-bodycopy">/</p>
            <AppBreadcrumbItem isCurrentPage>{cohortName}</AppBreadcrumbItem>
          </AppBreadcrumb>
        </div>
        <div
          className="hero-user-menu relative flex hover:cursor-pointer"
          ref={wrapperRef}
          onClick={handleActionsDropdown}
        >
          <AvatarBadgeLMS
            sessionUserAvatar={sessionUserAvatar}
            sessionUserName={sessionUserName || "Unknown"}
          />
          <AppDropdown
            isOpen={isActionsOpened}
            onClose={() => setIsActionsOpened(false)}
            alignDesktop="right"
          >
            {sessionUserRole !== 3 && (
              <Link href={`https://admin.${domain}`}>
                <AppDropdownItemList
                  menuIcon={<Blocks className="size-4" />}
                  menuName="Dashboard Admin"
                />
              </Link>
            )}
            <Link href={`https://www.${domain}`}>
              <AppDropdownItemList
                menuIcon={<Compass className="size-4" />}
                menuName="Discovery"
              />
            </Link>
            <Link href={`https://www.${domain}/transactions`}>
              <AppDropdownItemList
                menuIcon={<Wallet className="size-4" />}
                menuName="Transaction"
              />
            </Link>
          </AppDropdown>
        </div>
      </div>
    </div>
  );
}
