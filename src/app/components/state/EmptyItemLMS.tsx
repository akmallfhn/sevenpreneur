"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

interface EmptyItemLMSProps {
  stateTitle: string;
  stateDescription: string;
}

export default function EmptyItemLMS({
  stateTitle,
  stateDescription,
}: EmptyItemLMSProps) {
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="empty-playlists-lms flex flex-col w-full h-1/2 p-6 items-center lg:px-0 lg:pt-0 lg:justify-center">
      <div className="flex flex-col gap-4 max-w-md text-center items-center">
        <div className="flex max-w-80 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//no-content.svg"
            }
            alt="empty-lms"
            width={500}
            height={400}
          />
        </div>
        <h2 className="flex font-bold font-brand text-center tracking-tight text-2xl text-neutral-black">
          {stateTitle}
        </h2>
        <p className="font-bodycopy text-center font-medium text-alternative">
          {stateDescription}
        </p>
        <Link href={`https://www.${domain}`}>
          <AppButton>Discover Playlists</AppButton>
        </Link>
      </div>
    </div>
  );
}
