"use client";
import Image from "next/image";
import Link from "next/link";

interface LocationItemCMSProps {
  locationName: string;
  locationURL: string;
}

export default function LocationItemCMS({
  locationName,
  locationURL,
}: LocationItemCMSProps) {
  return (
    <div className="meeting-platform-item flex items-center bg-white gap-2 p-3 rounded-md">
      <div className="icon aspect-square flex w-14 items-center rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/gmaps-icon.png"
          }
          alt="File"
          width={200}
          height={200}
        />
      </div>
      <div className="attribute-data flex flex-col">
        <h3 className="font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
          {locationName}
        </h3>
        <Link
          href={locationURL}
          className="font-bodycopy font-medium line-clamp-1 text-cms-primary text-sm hover:underline hover:underline-offset-4"
        >
          {locationURL}
        </Link>
      </div>
    </div>
  );
}
