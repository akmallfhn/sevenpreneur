"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface UserItemCMSProps {
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
}: UserItemCMSProps) {
  return (
    <div className="user-container flex w-full items-center justify-between">
      <div className="user-attributes flex gap-3 w-full max-w-[calc(80%)] items-center">
        <div className="user-avatar size-8 shrink-0 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              userAvatar ||
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
            }
            alt={userName}
            width={80}
            height={80}
          />
        </div>
        <div className="user-attributes flex flex-col text-sm font-bodycopy leading-snug min-w-0">
          <p className="user-name text-black font-semibold line-clamp-1 break-all">
            {userName}
          </p>
          <p className="user-email text-alternative font-medium line-clamp-1 break-all">
            {userEmail}
          </p>
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
