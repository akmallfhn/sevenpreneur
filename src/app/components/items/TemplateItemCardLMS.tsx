"use client";
import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);
dayjs.extend(isBetween);

interface TemplateItemCardLMSProps {
  templateName: string;
  templateImage: string;
  templateURL: string;
}

export default function TemplateItemCardLMS({
  templateName,
  templateImage,
  templateURL,
}: TemplateItemCardLMSProps) {
  const templateTags = "Finance, Accounting";
  const templateTagList = templateTags.split(", ");

  return (
    <a
      href={templateURL}
      className="template-container flex flex-col w-full gap-2 bg-white border rounded-lg overflow-hidden transition transform active:scale-95"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="template-image flex w-full aspect-thumbnail overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={templateImage}
          alt="template-image"
          width={500}
          height={500}
        />
      </div>
      <div className="template-attributes relative flex flex-col gap-1.5 h-[108px] py-1 px-3">
        <div className="template-tags flex items-center gap-2">
          {templateTagList.map((tag, index) => (
            <p
              key={index}
              className="template-tag flex w-fit px-2 py-1 bg-primary-light/50 text-primary text-xs font-bodycopy font-semibold rounded-full"
            >
              {tag}
            </p>
          ))}
        </div>
        <h3 className="template-title text-base font-bodycopy font-bold line-clamp-2 xl:text-base 2xl:text-lg">
          {templateName}
        </h3>
      </div>
    </a>
  );
}
