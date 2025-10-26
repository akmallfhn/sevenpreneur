"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { useState } from "react";

dayjs.extend(relativeTime);

interface AppDiscussionReplyItemProps {
  sessionUserId: string;
  sessionUserRole: number;
  replyId: number;
  replyAuthorId?: string;
  replyAuthorName: string;
  replyAuthorAvatar: string;
  replyMessage: string;
  replyCreatedAt: string;
}

export default function AppDiscussionReplyItem({
  sessionUserId,
  sessionUserRole,
  replyId,
  replyAuthorId,
  replyAuthorName,
  replyAuthorAvatar,
  replyMessage,
  replyCreatedAt,
}: AppDiscussionReplyItemProps) {
  const isAdministrator = sessionUserRole === 0;
  const isOwner = sessionUserId;

  return (
    <section
      id={`reply-${replyId}`}
      className="discussion-reply-container flex gap-3"
    >
      <div className="reply-author-avatar flex size-8 aspect-square shrink-0 rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={replyAuthorAvatar}
          alt={replyAuthorName}
          width={300}
          height={300}
        />
      </div>
      <div className="reply flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="reply-attributes flex items-center gap-2 font-bodycopy text-sm">
            <p className="reply-author-name font-bold">{replyAuthorName}</p>
            <p className="reply-created-at text-alternative">
              {dayjs(replyCreatedAt).fromNow()}
            </p>
          </div>
          <p className="reply-message font-bodycopy text-sm whitespace-pre-line">
            {replyMessage}
          </p>
        </div>
        <div className="reply-action flex font-bodycopy text-sm items-center gap-3">
          <p className="font-semibold text-primary">Reply</p>
          {isAdministrator && (
            <p className="font-semibold text-destructive">Delete</p>
          )}
        </div>
      </div>
    </section>
  );
}
