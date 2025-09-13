"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

export default function UnderDevelopment() {
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="under-construction flex flex-col w-screen h-screen pt-24 px-6 items-center sm:pt-32 lg:px-0 lg:pt-0 lg:justify-center">
      <div className="flex flex-col gap-4 max-w-md text-center items-center">
        <div className="flex max-w-80 overflow-hidden lg:max-w-[600px]">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/under-construction.webp"
            }
            alt="Page is Under Construction"
            width={500}
            height={400}
          />
        </div>
        <h2 className="flex font-bold font-brand text-center tracking-tight text-2xl text-neutral-black">
          This Page is Under Construction
        </h2>
        <p className="font-bodycopy text-center font-medium text-alternative">
          We’re working on something exciting! This page is currently under
          development and will be available soon. Stay tuned for updates.
        </p>
        <Link href={`https://www.${domain}`}>
          <AppButton>Back to Home</AppButton>
        </Link>
      </div>
    </div>
  );
}
