"use client";
import { Blocks, Compass, LogOut, User2, Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AppDropdown from "../elements/AppDropdown";
import Link from "next/link";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import { DeleteSession } from "@/lib/actions";
import { useRouter } from "next/navigation";

export interface AvatarBadgeLMSProps {
  sessionUserAvatar: string;
  sessionUserName: string;
  sessionUserRole: number;
}

export default function AvatarBadgeLMS(props: AvatarBadgeLMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    const signOut = await DeleteSession();

    if (signOut.code === "NO_CONTENT") {
      router.push(`https://www.${domain}/auth/login`);
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <div
      className="user-menu relative flex hover:cursor-pointer"
      ref={wrapperRef}
      onClick={handleActionsDropdown}
    >
      <div className="aspect-square size-8 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={props.sessionUserAvatar}
          alt="User Avatar"
          width={320}
          height={320}
        />
      </div>
      <AppDropdown
        isOpen={isActionsOpened}
        onClose={() => setIsActionsOpened(false)}
        alignDesktop="right"
      >
        <Link href={`https://agora.${domain}/account`}>
          <AppDropdownItemList
            menuIcon={<User2 className="size-4" />}
            menuName="Profile & Settings"
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
