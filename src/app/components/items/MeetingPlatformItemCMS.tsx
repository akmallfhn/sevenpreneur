"use client";
import Image from "next/image";
import Link from "next/link";

export type MeetingPlatformVariant = "GMEET" | "ZOOM" | "TEAMS" | "UNKNOWN";

const variantStyles: Record<
  MeetingPlatformVariant,
  {
    platformIcon: string;
  }
> = {
  GMEET: {
    platformIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/gmeet-icon.webp",
  },
  ZOOM: {
    platformIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/zoom-icon.webp",
  },
  TEAMS: {
    platformIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/teams-icon.webp",
  },
  UNKNOWN: {
    platformIcon:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/unknown-call-icon.webp",
  },
};

interface MeetingPlatformItemCMSProps {
  meetingURL: string;
  variant: MeetingPlatformVariant;
}

export default function MeetingPlatformItemCMS({
  meetingURL,
  variant,
}: MeetingPlatformItemCMSProps) {
  const { platformIcon } = variantStyles[variant];
  return (
    <div className="meeting-platform-item flex items-center bg-white gap-2 p-3 rounded-md">
      <div className="icon flex aspect-square size-14 p-1 items-center">
        <Image
          className="object-cover w-full h-full"
          src={platformIcon}
          alt="File"
          width={200}
          height={200}
        />
      </div>
      <div className="attribute-data flex flex-col">
        <h3 className="font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
          Meeting Link
        </h3>
        <Link
          href={meetingURL}
          className="font-bodycopy font-medium line-clamp-1 text-cms-primary text-sm hover:underline hover:underline-offset-4"
        >
          {meetingURL}
        </Link>
      </div>
    </div>
  );
}
