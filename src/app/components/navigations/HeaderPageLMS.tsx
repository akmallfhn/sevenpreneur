"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Blocks, Compass, Wallet } from "lucide-react";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import AvatarBadgeLMS, { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

export interface HeaderNavbarLMSProps extends AvatarBadgeLMSProps {
  headerTitle: string;
  headerDescription: string;
  userRole: number;
}

export default function HeaderNavbarLMS({
  headerTitle,
  headerDescription,
  userAvatar,
  userName,
  userRole,
}: HeaderNavbarLMSProps) {
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
      <div className="header-root flex sticky w-full top-0 left-0 items-center justify-center bg-[#F0E5F2] z-40">
        <div className="header-container flex w-full max-w-[calc(100%-4rem)] items-center justify-between py-3 px-5 lg:px-0 lg:py-4">
          <div className="header-page-data flex items-center gap-4">
            <h1 className="header-title font-brand font-bold text-2xl">
              {headerTitle}
            </h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  className="text-alternative hover:cursor-pointer"
                  size="sm"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="header-desc max-w-[120px] text-center font-bodycopy">
                  {headerDescription}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div
            className="user-menu relative flex hover:cursor-pointer"
            ref={wrapperRef}
            onClick={handleActionsDropdown}
          >
            <AvatarBadgeLMS
              userAvatar={userAvatar}
              userName={userName || "Unknown"}
            />
            <AppDropdown
              isOpen={isActionsOpened}
              onClose={() => setIsActionsOpened(false)}
              alignMobile="right"
            >
              {userRole !== 3 && (
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
