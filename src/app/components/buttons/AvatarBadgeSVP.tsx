"use client";
import Image from "next/image";

interface AvatarBadgeSVPProps {
  userAvatar: string | null;
}

export default function AvatarBadgeSVP({ userAvatar }: AvatarBadgeSVPProps) {
  return (
    <div>
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
    </div>
  );
}
