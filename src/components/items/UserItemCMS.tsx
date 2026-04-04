"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

interface UserItemCMSProps {
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  userPhoneNumber?: string;
}

export default function UserItemCMS(props: UserItemCMSProps) {
  return (
    <div className="user-container flex w-full items-center justify-between">
      <Link
        href={`/users/${props.userId}`}
        className="user-attributes flex gap-3 w-full max-w-[calc(80%)] items-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="user-avatar size-8 shrink-0 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={props.userAvatar}
            alt={props.userName}
            width={80}
            height={80}
          />
        </div>
        <div className="user-attributes flex flex-col text-sm font-bodycopy leading-snug min-w-0">
          <p className="user-name text-black font-semibold line-clamp-1 break-all">
            {props.userName}
          </p>
          <p className="user-email text-alternative font-medium line-clamp-1 break-all">
            {props.userEmail}
          </p>
        </div>
      </Link>
      {props.userPhoneNumber && (
        <a
          href={`https://wa.me/62${props.userPhoneNumber}`}
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
