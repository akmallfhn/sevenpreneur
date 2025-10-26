"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import React, { useState } from "react";
import { DeleteDiscussionStarter, DiscussionReplyList } from "@/lib/actions";
import AppDiscussionReplyItem from "./AppDiscussionReplyItemL";
import { ChevronDown, Loader2 } from "lucide-react";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

export interface DiscussionReplyList {
  id: number;
  full_name: string;
  avatar: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

interface AppDiscussionStarterItemProps {
  sessionUserId: string;
  sessionUserRole: number;
  discussionId: number;
  discussionAuthorId?: string;
  discussionAuthorName: string;
  discussionAuthorAvatar: string;
  discussionMessage: string;
  discussionReplies: number;
  discussionCreatedAt: string;
  onDiscussionDeleted: (discussionId: number) => void;
}

export default function AppDiscussionStarterItem({
  sessionUserId,
  sessionUserRole,
  discussionId,
  discussionAuthorId,
  discussionAuthorName,
  discussionAuthorAvatar,
  discussionMessage,
  discussionReplies,
  discussionCreatedAt,
  onDiscussionDeleted,
}: AppDiscussionStarterItemProps) {
  const [isOpenReplies, setIsOpenReplies] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [replies, setReplies] = useState<DiscussionReplyList[]>([]);
  const [isOpenDeleteConfirmation, setIsOpenDeleteConfirmation] =
    useState(false);

  const isAdministrator = sessionUserRole === 0;
  const isOwner = sessionUserId;

  const handleViewReplies = async () => {
    if (!isOpenReplies) {
      // Open Replies without refetch
      setIsOpenReplies(true);

      // if never fetched, get data
      if (!isFetched) {
        try {
          setIsLoadingReplies(true);
          const discussionReplies = await DiscussionReplyList({
            discussionStarterId: discussionId,
          });

          if (discussionReplies.code === "OK") {
            setReplies(discussionReplies.list);
            setIsFetched(true);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingReplies(false);
        }
      }
    } else {
      // Close replies UI without delete state
      setIsOpenReplies(false);
    }
  };

  const handleDelete = async () => {
    if (!discussionId) return;
    try {
      const deleteDiscussion = await DeleteDiscussionStarter({
        discussionStarterId: discussionId,
      });
      if (deleteDiscussion.code === "NO_CONTENT") {
        toast.success("Discussion Deleted", {
          description: "Your discussion has been successfully removed.",
        });
        onDiscussionDeleted(discussionId);
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

  // Remove deleted reply on state replies
  const handleReplyDeleted = (replyId: number) => {
    setReplies((prevReplies) =>
      prevReplies.filter((reply) => reply.id !== replyId)
    );
  };

  return (
    <React.Fragment>
      <section
        id={`discussion-${discussionId}`}
        className="discussion-starter-container flex gap-3"
      >
        <div className="discussion-author-avatar flex size-8 aspect-square shrink-0 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={discussionAuthorAvatar}
            alt={discussionAuthorName}
            width={300}
            height={300}
          />
        </div>
        <div className="discussion flex flex-col gap-3">
          <div className="flex flex-col">
            <div className="discussion-attributes flex items-center gap-2 font-bodycopy text-sm">
              <p className="discussion-author-name font-bold">
                {discussionAuthorName}
              </p>
              <p className="discussion-created-at text-alternative">
                {dayjs(discussionCreatedAt).fromNow()}
              </p>
            </div>
            <p className="discussion-message font-bodycopy text-sm whitespace-pre-line">
              {discussionMessage}
            </p>
          </div>
          <div className="discussion-action flex font-bodycopy text-sm items-center gap-3">
            <p className="font-semibold text-primary hover:cursor-pointer">
              Reply
            </p>
            {isAdministrator && (
              <p
                className="font-semibold text-destructive hover:cursor-pointer"
                onClick={() => setIsOpenDeleteConfirmation(true)}
              >
                Delete
              </p>
            )}
          </div>
          {discussionReplies > 0 && (
            <AppButton
              className="w-fit"
              size="small"
              variant="outline"
              onClick={handleViewReplies}
            >
              <ChevronDown
                className={`size-4 transform transition-transform duration-300 ${
                  isOpenReplies ? "rotate-180" : "rotate-0"
                }`}
              />
              View {discussionReplies} replies
            </AppButton>
          )}

          {isOpenReplies && (
            <div className="replies-container w-full py-2">
              {isLoadingReplies ? (
                <Loader2 className="loading-replies size-4 animate-spin text-alternative" />
              ) : (
                <div className="reply-list flex flex-col gap-4">
                  {replies.map((post, index) => (
                    <AppDiscussionReplyItem
                      key={index}
                      sessionUserId={sessionUserId}
                      sessionUserRole={sessionUserRole}
                      replyId={post.id}
                      replyAuthorName={post.full_name}
                      replyAuthorAvatar={
                        post.avatar ||
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                      }
                      replyMessage={post.message}
                      replyCreatedAt={post.created_at}
                      onReplyDeleted={handleReplyDeleted}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation */}
      {isOpenDeleteConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Permanently delete this item?"
          alertDialogMessage={`Are you sure you want to delete discussion? This action cannot be undone.`}
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
