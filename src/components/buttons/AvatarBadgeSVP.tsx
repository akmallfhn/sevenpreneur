"use client";
import { DeleteSession } from "@/lib/actions";
import { Blocks, ChevronDown, LogOut, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";

interface AvatarBadgeSVPProps {
  userAvatar: string;
  userName: string;
  userRole: number | null;
}

export default function AvatarBadgeSVP(props: AvatarBadgeSVPProps) {
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

  // Sign out function
  const handleSignOut = async () => {
    await DeleteSession();
  };

  return (
    <div
      className="user-menu relative flex hover:cursor-pointer"
      ref={wrapperRef}
      onClick={handleActionsDropdown}
    >
      <div className="user-attributes hidden items-center gap-3 lg:flex">
        <div className="user-avatar aspect-square size-7 rounded-full overflow-hidden hover:cursor-pointer">
          <Image
            className="user-avatar object-cover w-full h-full"
            src={props.userAvatar}
            alt="User Avatar"
            width={320}
            height={320}
          />
        </div>
        <div className="flex items-center gap-1">
          <p className="user-name max-w-28 font-bodycopy font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
            {props.userName}
          </p>
          <ChevronDown className="dropdown-icon size-3" />
        </div>
      </div>
      <AppDropdown
        isOpen={isActionsOpened}
        onClose={() => setIsActionsOpened(false)}
        alignMobile="right"
      >
        {props.userRole !== 3 && (
          <Link href={`https://admin.${domain}`}>
            <AppDropdownItemList
              menuIcon={<Blocks className="size-4" />}
              menuName="Dashboard Admin"
            />
          </Link>
        )}
        <Link href={`/transactions`}>
          <AppDropdownItemList
            menuIcon={<Wallet className="size-4" />}
            menuName="Transaction"
          />
        </Link>
        <hr className="my-1" />
        <AppDropdownItemList
          menuIcon={<LogOut className="size-4" />}
          menuName="Sign out"
          isDestructive
          onClick={handleSignOut}
        />
      </AppDropdown>
    </div>
  );
}
