"use client";
import AppButton from "../buttons/AppButton";
import {
  CalendarDays,
  ChevronRight,
  EllipsisVertical,
  Video,
} from "lucide-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import LearningMethodLabelCMS, {
  learningMethodVariant,
} from "../labels/LearningMethodLabelCMS";
import Image from "next/image";

dayjs.extend(localizedFormat);

interface LearningSessionItemCMSProps {
  sessionName: string;
  sessionMentor: string;
  mentorAvatar: string;
}

export default function LearningSessionItemCMS({
  sessionName,
  sessionMentor,
  mentorAvatar,
}: LearningSessionItemCMSProps) {
  return (
    <div className="session-item flex items-center justify-between bg-white gap-2 p-3 rounded-md">
      <div className="flex w-[calc(87%)] gap-3 items-center">
        <div className="icon aspect-square flex size-14 p-3 items-center justify-center bg-cms-primary-light text-cms-primary rounded-md">
          <Video className="size-7" />
        </div>
        <div className="attribute-data flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5">
            <h3 className="session-name font-bodycopy font-bold line-clamp-1 ">
              {sessionName}
            </h3>
            <div className="flex gap-3 items-center">
              <div className="session-educator flex gap-2 items-center">
                <div className="size-[29px] rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={
                      mentorAvatar ||
                      "https://cdn1-production-images-kly.akamaized.net/VMOMJZI5ThAIIVjSIk7B3CxYkYQ=/500x500/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3918744/original/035101900_1643478653-WhatsApp_Image_2022-01-27_at_16.46.27__1_.jpeg"
                    }
                    alt="Avatar User"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="name-date flex flex-col text-[13px] leading-snug font-bodycopy font-medium text-alternative">
                  <p className="mentor-name">
                    by{" "}
                    <span className="text-black font-semibold">
                      {sessionMentor}
                    </span>
                  </p>
                  <p className="session-date-time">
                    {dayjs("2025-06-02 02:00:00+00").format("llll")}
                  </p>
                </div>
              </div>
              <AppButton variant="outline" size="small">
                <Video className="size-4" />
                Launch meeting
              </AppButton>
            </div>
          </div>
        </div>
      </div>
      <ChevronRight className="size-6 text-alternative" />
    </div>
  );
}
