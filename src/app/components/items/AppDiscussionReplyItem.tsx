"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateDiscussionReply, DeleteDiscussionReply } from "@/lib/actions";
import { toast } from "sonner";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppDiscussionTextArea from "../fields/AppDiscussionTextArea";
import { DiscussionReplyList } from "./AppDiscussionStarterItem";
import { id } from "zod/v4/locales";

dayjs.extend(relativeTime);

interface AppDiscussionReplyItemProps {
  sessionUserName: string;
  sessionUserAvatar: string;
  discussionStarterId: number;
  discussionReplyId: number;
  discussionReplyAuthorName: string;
  discussionReplyAuthorAvatar: string;
  discussionReplyMessage: string;
  discussionReplyCreatedAt: string;
  discussionReplyOwner: boolean;
  onReplyCreated?: (newReply: DiscussionReplyList) => void;
  onReplyDeleted: (replyId: number) => void;
}

export default function AppDiscussionReplyItem({
  sessionUserName,
  sessionUserAvatar,
  discussionStarterId,
  discussionReplyId,
  discussionReplyAuthorName,
  discussionReplyAuthorAvatar,
  discussionReplyMessage,
  discussionReplyCreatedAt,
  discussionReplyOwner,
  onReplyCreated,
  onReplyDeleted,
}: AppDiscussionReplyItemProps) {
  const router = useRouter();
  const [writeReply, setWriteReply] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);

  const handleWriteReply = () => {
    setWriteReply((prev) => !prev);
  };

  // Create discussion reply
  const handleSubmitReply = async () => {
    if (!textValue.trim()) {
      return;
    }
    setIsSendingReply(true);

    try {
      const createReply = await CreateDiscussionReply({
        discussionStarterId,
        discussionReplyMessage: textValue,
      });

      if (createReply.code === "CREATED") {
        setTextValue("");
        setWriteReply(false);
        toast.success("Reply Sent!");

        onReplyCreated?.({
          id: createReply.discussion.id,
          full_name: sessionUserName,
          avatar: sessionUserAvatar,
          message: createReply.discussion.message,
          created_at: createReply.discussion.created_at,
          updated_at: createReply.discussion.updated_at,
          is_owner: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Delete reply item
  const handleDelete = async () => {
    if (!discussionReplyId) return;
    try {
      const deleteReply = await DeleteDiscussionReply({
        discussionReplyId,
      });
      if (deleteReply.code === "NO_CONTENT") {
        toast.success("Discussion Deleted", {
          description: "Your discussion has been successfully removed.",
        });
        onReplyDeleted?.(discussionReplyId);
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
        id={`reply-${discussionReplyId}`}
        className="discussion-reply-container flex gap-3"
      >
        <div className="discussion-reply-author-avatar flex size-8 aspect-square shrink-0 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={discussionReplyAuthorAvatar}
            alt={discussionReplyAuthorName}
            width={300}
            height={300}
          />
        </div>
        <div className="discussion-reply-item flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <div className="discussion-reply-attributes flex items-center gap-2 font-bodycopy text-sm">
              <p className="discussion-reply-author-name font-bold">
                {discussionReplyAuthorName}
              </p>
              <p className="discussion-reply-created-at text-alternative">
                {dayjs(discussionReplyCreatedAt).fromNow()}
              </p>
            </div>
            <p className="discussion-reply-message font-bodycopy text-sm whitespace-pre-line">
              {discussionReplyMessage}
            </p>
          </div>
          <div className="discussion-reply-action flex font-bodycopy text-sm items-center gap-3">
            <p
              className="discussion-reply font-semibold text-primary hover:cursor-pointer"
              onClick={handleWriteReply}
            >
              Reply
            </p>
            {discussionReplyOwner && (
              <p
                className="discussion-reply-delete font-semibold text-destructive hover:cursor-pointer"
                onClick={() => setIsOpenDeleteConfirmation(true)}
              >
                Delete
              </p>
            )}
          </div>
          <div
            className={`discussion-write-reply flex w-full transition-all duration-300 ease-in-out overflow-hidden ${
              writeReply ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <AppDiscussionTextArea
              sessionUserName={sessionUserName}
              sessionUserAvatar={sessionUserAvatar}
              textAreaId="reply"
              textAreaPlaceholder="Let's discuss about this learning"
              onTextAreaChange={(value) => setTextValue(value)}
              value={textValue}
              onSubmit={handleSubmitReply}
              isLoadingSubmit={isSendingReply}
            />
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
