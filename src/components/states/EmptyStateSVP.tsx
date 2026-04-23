"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";
import { HTMLAttributes } from "react";

export type EmptyStateSVPType = "TRANSACTIONS" | "COHORT" | "EVENT";

export const variantStyles: Record<
  EmptyStateSVPType,
  { title: string; message: string; image: string }
> = {
  TRANSACTIONS: {
    title: "No Transactions Yet",
    message:
      "You haven't made any transactions yet. Once you do, they'll show up right here—neat and organized.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//no-transactions.svg",
  },
  COHORT: {
    title: "This Class Is Sold Out",
    message:
      "All available slots for this class have been filled. New sessions will be available soon.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/unavailable-product.svg",
  },
  EVENT: {
    title: "Tickets Are Sold Out",
    message:
      "All tickets for this event have been sold. Please check back for future events.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/unavailable-product.svg",
  },
};

interface EmptyStateSVPProps extends HTMLAttributes<HTMLDivElement> {
  variant: EmptyStateSVPType;
}

export default function EmptyStateSVP(props: EmptyStateSVPProps) {
  const { title, message, image } = variantStyles[props.variant];

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div
      className={`state-root flex flex-col w-full min-h-screen pt-24 px-6 items-center sm:pt-32 lg:px-0 lg:pt-0 lg:justify-center ${props.className}`}
    >
      <div className="state-attributes flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-image flex w-full max-w-64 overflow-hidden lg:max-w-80">
          <Image
            className="object-cover w-full h-full"
            src={image}
            alt="state-image"
            width={500}
            height={400}
          />
        </div>
        <div className="state-text flex flex-col gap-2 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center tracking-tight text-2xl dark:text-sevenpreneur-white">
            {title}
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-emphasis dark:text-foreground">
            {message}
          </p>
        </div>
        <Link href={`https://www.${domain}`}>
          <AppButton>Back to Home</AppButton>
        </Link>
      </div>
    </div>
  );
}
