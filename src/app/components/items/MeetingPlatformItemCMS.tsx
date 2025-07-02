"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export type MeetingPlatformVariant = "GMEET" | "ZOOM" | "TEAMS" | "UNKNOWN";

const variantStyles: Record<
  MeetingPlatformVariant,
  {
    platformIcon: string;
  }
> = {
  GMEET: {
    platformIcon:
      "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png",
  },
  ZOOM: {
    platformIcon:
      "https://media.zoom.com/images/assets/Zoom+Logo/Zz01ZGU4MDMzZWJmNDcxMWVkOTI4NGEyNDU1OWRiZTc5Zg==?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOlsiNWRlODAzM2ViZjQ3MTFlZDkyODRhMjQ1NTlkYmU3OWYiXSwiZXhwIjoxNjgxMzM0MTEwfQ.3_IFoXtmS8ExOGbL0F1oGPu8z6lgijgDWFf82zrDFzk",
  },
  TEAMS: {
    platformIcon:
      "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/Icon-Teams-28x281?resMode=sharp2&op_usm=1.5,0.65,15,0&qlt=85",
  },
  UNKNOWN: {
    platformIcon:
      "https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/Icon-Teams-28x281?resMode=sharp2&op_usm=1.5,0.65,15,0&qlt=85",
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
    <React.Fragment>
      <div className="meeting-platform-item flex items-center justify-between bg-white gap-2 p-1 border border-outline rounded-md">
        <div className="flex items-center">
          <div className="icon aspect-square flex size-14 p-3 items-center">
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
      </div>
    </React.Fragment>
  );
}
