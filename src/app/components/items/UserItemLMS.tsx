"use client";
import Image from "next/image";

interface UserItemLMSProps {
  sessionUserId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
}

export default function UserItemLMS({
  sessionUserId,
  userId,
  userName,
  userAvatar,
  userEmail,
}: UserItemLMSProps) {
  const currentUser = sessionUserId === userId;

  return (
    <div className="user-container flex items-center p-3 gap-3 bg-section-background rounded-lg">
      <div className="user-avatar size-9 shrink-0 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={userAvatar}
          alt={userName}
          width={80}
          height={80}
        />
      </div>
      <div className="user-attributes flex flex-col font-bodycopy leading-snug">
        <div className="user-name flex gap-2 items-center">
          <p className="text-[15px] text-black font-semibold line-clamp-1">
            {userName}
          </p>
          {currentUser && (
            <span className="text-xs text-success-foreground bg-success-background font-bodycopy font-semibold px-2 py-[1px] rounded-full">
              YOU
            </span>
          )}
        </div>
        <p className="user-email text-sm text-alternative font-medium">
          {userEmail}
        </p>
      </div>
    </div>
  );
}
