"use client";
import { Blocks, ChevronDown, Compass, User2, Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AppDropdown from "../elements/AppDropdown";
import Link from "next/link";
import AppDropdownItemList from "../elements/AppDropdownItemList";

export interface AvatarBadgeLMSProps {
  sessionUserAvatar: string;
  sessionUserName: string;
  sessionUserRole: number;
}

export default function AvatarBadgeLMS(props: AvatarBadgeLMSProps) {
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
      event: MouseEvent | (MouseEvent & { target: Node }),
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
    <div
      className="user-menu relative flex hover:cursor-pointer"
      ref={wrapperRef}
      onClick={handleActionsDropdown}
    >
      <div className="avatar-container flex items-center gap-3 bg-white p-2 rounded-lg border border-outline">
        <div className="avatar aspect-square size-6 rounded-md overflow-hidden ">
          <Image
            className="object-cover w-full h-full"
            src={props.sessionUserAvatar}
            alt="User Avatar"
            width={320}
            height={320}
          />
        </div>
        <div className="nickname items-center gap-1 lg:flex">
          <p className="max-w-36 font-bodycopy font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
            {props.sessionUserName}
          </p>
          <ChevronDown className="size-3" />
        </div>
      </div>
      <AppDropdown
        isOpen={isActionsOpened}
        onClose={() => setIsActionsOpened(false)}
        alignDesktop="right"
      >
        <Link href={`https://agora.${domain}/account`}>
          <AppDropdownItemList
            menuIcon={<User2 className="size-4" />}
            menuName="Profile"
          />
        </Link>
        {props.sessionUserRole !== 3 && (
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
  );
}
