"use client";
import Image from "next/image";

interface AvatarBadgeCMSProps {
  userAvatar: string;
  userName: string;
  userRole: string;
}

export default function AvatarBadgeCMS(props: AvatarBadgeCMSProps) {
  return (
    <div className="avatar-container flex w-full p-2 px-3 items-center gap-3 bg-white border border-[#E3E3E3] rounded-lg">
      <div className="avatar aspect-square w-9 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={props.userAvatar}
          alt="avatar-user"
          width={200}
          height={200}
        />
      </div>
      <div className="user-attributes flex flex-col gap-0 font-bodycopy">
        <p className="user-name text-sm font-semibold text-black line-clamp-1">
          {props.userName}
        </p>
        <p className="user-roles text-xs font-semibold text-alternative">
          {props.userRole.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
