"use client";
import Image from "next/image";

interface AttendeeRoleCardItemRestart25Props {
  index: number;
  roleIcon: string;
  roleTitle: string;
  roleSubtitle: string;
}

export default function AttendeeRoleCardItemRestart25({
  index,
  roleIcon,
  roleTitle,
  roleSubtitle,
}: AttendeeRoleCardItemRestart25Props) {
  const bgColors = ["bg-primary", "bg-secondary", "bg-[#422CDE]"];
  const colorClass = bgColors[index % bgColors.length];

  return (
    <div className="border-attendee-role-item p-[1px] bg-linear-to-br from-0% from-white/80 to-100% to-[#999999]/0 rounded-md">
      <div className="attendee-role-item flex flex-col max-w-[352px] w-full h-[180px] p-5 gap-2 bg-linear-to-br from-0% from-[#4B4B4B] to-100% to-black rounded-md">
        <div
          className={`flex p-3 ${colorClass} aspect-square w-[50px] h-[50px] text-white rounded-md overflow-hidden`}
        >
          <Image
            className="w-full h-full"
            src={roleIcon}
            alt="Icon Attendee Role"
            width={100}
            height={100}
          />
        </div>
        <div className="flex flex-col text-white">
          <h3 className="font-brand font-bold text-xl">{roleTitle}</h3>
          <p className="font-bodycopy text-lg">{roleSubtitle}</p>
        </div>
      </div>
    </div>
  );
}
