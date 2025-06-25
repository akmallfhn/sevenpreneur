"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { EllipsisVertical } from "lucide-react";

interface UserItemSimpleCMSProps {
  userName: string;
  userAvatar: string;
}

export default function UserItemSimpleCMS({
  userName,
  userAvatar,
}: UserItemSimpleCMSProps) {
  return (
    <div className="user-item flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <div className="size-8 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={userAvatar}
            alt={userName}
            width={80}
            height={80}
          />
        </div>
        <p className="user-name text-black font-semibold text-sm font-bodycopy line-clamp-1">
          {userName}
        </p>
      </div>
      <AppButton variant="ghost" size="small">
        <EllipsisVertical className="size-4" />
      </AppButton>
    </div>
  );
}
