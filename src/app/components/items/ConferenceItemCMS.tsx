"use client";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import Image from "next/image";

interface ConferenceItemCMSProps {
  conferenceURL: string;
}

export default function ConferenceItemCMS(props: ConferenceItemCMSProps) {
  const conferenceVariant = getConferenceVariantFromURL(props.conferenceURL);
  const { conferenceIcon } = getConferenceAttributes(conferenceVariant);

  return (
    <div className="conference-container flex items-center bg-white gap-2 p-3 rounded-md overflow-hidden">
      <div className="conference-icon flex aspect-square size-14 p-1 items-center">
        <Image
          className="object-cover w-full h-full"
          src={conferenceIcon}
          alt="File"
          width={200}
          height={200}
        />
      </div>
      <div className="conference-attributes flex flex-col">
        <h3 className="font-bodycopy font-semibold text-black text-[15px] line-clamp-1">
          Meeting Link
        </h3>
        <a
          href={props.conferenceURL}
          className="conference-url font-bodycopy font-medium line-clamp-1 text-cms-primary text-sm hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopenner noreferrer"
        >
          {props.conferenceURL}
        </a>
      </div>
    </div>
  );
}
