"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { setSessionToken, trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";

interface UserBadgeCMSProps {
  userAvatar: string;
  userName: string;
  userRole: string;
}

export default function UserBadgeCMS({
  userAvatar,
  userName,
  userRole,
}: UserBadgeCMSProps) {
  return (
    <div className="user-roles-container flex w-full p-2 px-3 items-center gap-3 bg-white border border-[#E3E3E3] rounded-lg">
      <div className="avatar aspect-square w-9 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={userAvatar}
          alt="avatar-user"
          width={200}
          height={200}
        />
      </div>
      <div className="user-roles flex flex-col gap-0 font-bodycopy">
        <p className="user text-sm font-semibold text-black line-clamp-1">
          {userName}
        </p>
        <p className="roles text-xs font-semibold text-alternative">
          {userRole.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
