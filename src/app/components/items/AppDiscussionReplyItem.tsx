"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteDiscussionReply } from "@/lib/actions";
import { toast } from "sonner";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";

dayjs.extend(relativeTime);

interface AppDiscussionReplyItemProps {
  sessionUserId: string;
  replyId: number;
  replyAuthorId?: string;
  replyAuthorName: string;
  replyAuthorAvatar: string;
  replyMessage: string;
  replyCreatedAt: string;
  replyOwner: boolean;
  onReplyDeleted: (replyId: number) => void;
}

export default function AppDiscussionReplyItem({
  sessionUserId,
  replyId,
  replyAuthorId,
  replyAuthorName,
  replyAuthorAvatar,
  replyMessage,
  replyCreatedAt,
  replyOwner,
  onReplyDeleted,
}: AppDiscussionReplyItemProps) {
  const router = useRouter();
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);

  const handleDelete = async () => {
    if (!replyId) return;
    try {
      const deleteReply = await DeleteDiscussionReply({
        discussionReplyId: replyId,
      });
      if (deleteReply.code === "NO_CONTENT") {
        toast.success("Discussion Deleted", {
          description: "Your discussion has been successfully removed.",
        });
        onReplyDeleted?.(replyId);
        router.refresh();
      } else {
        toast.error("Failed to Delete", {
          description: "We couldn’t delete your discussion. Please try again.",
        });
      }
    } catch (error) {
      console.error("Discussion Submission Error:", error);
      toast.error("Something Went Wrong", {
        description:
          "An unexpected error occurred while deleting your discussion.",
      });
    }
  };

  return (
    <React.Fragment>
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
            <p className="font-semibold text-primary hover:cursor-pointer ">
              Reply
            </p>
            {replyOwner && (
              <p
                className="font-semibold text-destructive hover:cursor-pointer"
                onClick={() => setIsOpenDeleteConfirmation(true)}
              >
                Delete
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete reply? This action cannot be undone.`}
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={isOpenDeleteConfirmation}
          onClose={() => setIsOpenDeleteConfirmation(false)}
          onConfirm={() => {
            handleDelete();
            setIsOpenDeleteConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
