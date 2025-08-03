"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface AvatarBadgeSVPProps {
  userAvatar: string | null;
  userName: string | undefined;
}

export default function AvatarBadgeSVP({
  userAvatar,
  userName,
}: AvatarBadgeSVPProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="aspect-square size-8 rounded-full overflow-hidden hover:cursor-pointer">
        <Image
          className="object-cover w-full h-full"
          src={
            userAvatar ||
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-akmal.webp"
          }
          alt="Homepage"
          width={320}
          height={320}
        />
      </div>
      <div className="hidden items-center gap-1 lg:flex">
        <p className="max-w-28 font-ui font-semibold text-sm text-black overflow-hidden text-ellipsis whitespace-nowrap">
          {userName}
        </p>
        <ChevronDown className="size-3" />
      </div>
    </div>
  );
}
