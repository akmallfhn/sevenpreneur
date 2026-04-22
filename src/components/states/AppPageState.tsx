"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";

export type PageStateType =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "ONLY_MOBILE"
  | "DEVELOPMENT";

export const variantStyles: Record<
  PageStateType,
  { title: string; message: string; image: string }
> = {
  NOT_FOUND: {
    title: "404 - Nothing to see here",
    message:
      "Sorry, the page you’re looking for doesn’t exist or may have been moved.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/404-not-found-illustration.svg",
  },
  FORBIDDEN: {
    title: "403 - Restricted Area",
    message:
      "This page is restricted. You might not have the right permissions to view it.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/403-forbidden-illustration.svg",
  },
  ONLY_MOBILE: {
    title: "Optimized for Larger Screens",
    message:
      "For the best experience, access the platform using a device with a larger display like a desktop or tablet.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/disallowed-mobile.svg",
  },
  DEVELOPMENT: {
    title: "This Page is Under Construction",
    message:
      "We’re working on something exciting! This page is currently under development and will be available soon. Stay tuned for updates.",
    image:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/under-construction.webp",
  },
};

interface AppPageStateProps {
  variant: PageStateType;
}

export default function AppPageState(props: AppPageStateProps) {
  const { title, message, image } = variantStyles[props.variant];

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="state-root flex flex-col w-full min-h-screen pt-24 px-6 items-center sm:pt-32 lg:px-0 lg:pt-0 lg:justify-center">
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
          <h2 className="state-title flex font-bold font-bodycopy text-center tracking-tight text-2xl">
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
