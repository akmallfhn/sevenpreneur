"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export interface AvatarBadgeLMSProps {
  userAvatar: string;
  userName: string;
}

export default function AvatarBadgeLMS({
  userAvatar,
  userName,
}: AvatarBadgeLMSProps) {
  // Get Nickname
  const nickName = userName?.split(" ")[0];

  return (
    <div className="avatar-container flex items-center gap-3 bg-white py-2 px-3.5 rounded-full shadow-xs">
      <div className="avatar aspect-square size-7 rounded-full overflow-hidden ">
        <Image
          className="object-cover w-full h-full"
          src={userAvatar}
          alt="User Avatar"
          width={320}
          height={320}
        />
      </div>
      <div className="nickname items-center gap-1 lg:flex">
        <p className="max-w-28 font-ui font-semibold text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {nickName}
        </p>
        <ChevronDown className="size-3" />
      </div>
    </div>
  );
}
