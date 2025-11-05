"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Blocks, Compass, Wallet } from "lucide-react";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AvatarBadgeLMS, { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AppBreadcrumb from "./AppBreadcrumb";
import AppBreadcrumbItem from "./AppBreadcrumbItem";

export interface HeaderAIResultLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  headerResultName: string;
  headerTitle: string;
  // headerDescription: string;
}

export default function HeaderAIResultLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  headerResultName,
  headerTitle,
}: // headerDescription,
HeaderAIResultLMSProps) {
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
    <React.Fragment>
      <div className="header-root flex sticky w-full top-0 left-0 px-0 py-5 items-center justify-center bg-section-background z-40">
        <div className="header-container flex w-full max-w-[calc(100%-4rem)] items-center justify-between">
          <div className="header-page-data flex flex-col gap-1">
            <div className="header-breadcrumb flex items-center gap-4">
              <AppBreadcrumb className="text-[#333333]/90">
                <p className="slash font-bodycopy">/</p>
                <AppBreadcrumbItem href="/ai">AI</AppBreadcrumbItem>
                <p className="slash font-bodycopy">/</p>
                <AppBreadcrumbItem isCurrentPage>
                  {headerResultName}
                </AppBreadcrumbItem>
              </AppBreadcrumb>
            </div>
            <div className="header-information flex flex-col gap-2">
              <h1 className="header-title font-brand font-bold text-2xl">
                {headerTitle}
              </h1>
              {/* <p className="font-bodycopy text-[#333333]">
                {headerDescription}
              </p> */}
            </div>
          </div>
          <div
            className="user-menu relative flex hover:cursor-pointer"
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
              alignMobile="right"
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
    </React.Fragment>
  );
}
