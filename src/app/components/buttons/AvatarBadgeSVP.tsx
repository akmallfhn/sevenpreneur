"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface AvatarBadgeSVPProps {
  userAvatar: string;
  userName: string;
}

export default function AvatarBadgeSVP(props: AvatarBadgeSVPProps) {
  return (
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
  );
}
