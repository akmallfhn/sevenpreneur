"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

interface EmptyListLMSProps {
  stateTitle: string;
  stateDescription: string;
  stateAction: string;
}

export default function EmptyListLMS({
  stateTitle,
  stateDescription,
  stateAction,
}: EmptyListLMSProps) {
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="state-box flex flex-col w-full h-1/2 p-6 items-center lg:px-0 lg:pt-0 lg:justify-center">
      <div className="state-container flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-illustration flex max-w-80 overflow-hidden">
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
        <div className="state-captions flex flex-col gap-1 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center tracking-tight text-2xl text-neutral-black">
            {stateTitle}
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-alternative">
            {stateDescription}
          </p>
        </div>
        <Link href={`https://www.${domain}`}>
          <AppButton>{stateAction}</AppButton>
        </Link>
      </div>
    </div>
  );
}
