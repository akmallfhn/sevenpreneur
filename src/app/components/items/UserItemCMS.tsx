"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface UserItemSimpleCMSProps {
  userName: string;
  userAvatar: string;
  userEmail: string;
  userPhoneNumber?: string;
  isShowWhatsapp?: boolean;
}

export default function UserItemCMS({
  userName,
  userAvatar,
  userEmail,
  userPhoneNumber,
  isShowWhatsapp = false,
}: UserItemSimpleCMSProps) {
  return (
    <div className="user-item flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <div className="size-8 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={userAvatar}
            alt={userName}
            width={80}
            height={80}
          />
        </div>
        <div className="flex flex-col text-sm font-bodycopy leading-snug">
          <p className="user-name text-black font-semibold line-clamp-1">
            {userName}
          </p>
          <p className="user-email text-alternative font-medium">{userEmail}</p>
        </div>
      </div>
      {userPhoneNumber && isShowWhatsapp && (
        <a
          href={`https://wa.me/62${userPhoneNumber}`}
          target="_blank"
          rel="noopenner noreferrer"
        >
          <AppButton variant="cmsPrimary" size="iconRounded">
            <FontAwesomeIcon icon={faWhatsapp} className="size-4 text-white" />
          </AppButton>
        </a>
      )}
    </div>
  );
}
