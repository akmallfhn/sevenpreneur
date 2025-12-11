"use client";
import {
  CreateDiscussionReply,
  DeleteDiscussionStarter,
  DiscussionReplyList,
} from "@/lib/actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppDiscussionReplyItem from "./AppDiscussionReplyItem";
import AppDiscussionTextArea from "./AppDiscussionTextArea";

dayjs.extend(relativeTime);

export interface DiscussionReplyList {
  id: number;
  full_name: string;
  avatar: string | null;
  message: string;
  created_at: string;
  updated_at: string;
  is_owner: boolean;
}

interface AppDiscussionStarterItemProps {
  sessionUserId: string;
  sessionUserName: string;
  sessionUserAvatar: string;
  discussionStarterId: number;
  discussionStarterAuthorName: string;
  discussionStarterAuthorAvatar: string;
  discussionStarterMessage: string;
  discussionStarterTotalReplies: number;
  discussionStarterCreatedAt: string;
  discussionStarterOwner: boolean;
  onDiscussionDeleted: (discussionId: number) => void;
}

export default function AppDiscussionStarterItem(
  props: AppDiscussionStarterItemProps
) {
  const [isOpenReplies, setIsOpenReplies] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [replies, setReplies] = useState<DiscussionReplyList[]>([]);
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
        discussionStarterId: props.discussionStarterId,
        discussionReplyMessage: textValue,
      });

      if (createReply.code === "CREATED") {
        setTextValue("");
        setWriteReply(false);
        toast.success("Reply Sent!");

        // Make sure open replies
        if (!isOpenReplies) {
          setIsOpenReplies(true);
        }

        // Re-fetch replies
        try {
          setIsLoadingReplies(true);
          const discussionReplies = await DiscussionReplyList({
            discussionStarterId: props.discussionStarterId,
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
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Added new reply from thread reply item
  const handleReplyCreated = (newReply: DiscussionReplyList) => {
    setReplies((prev) => [newReply, ...prev]);
  };

  // View replies
  const handleViewReplies = async () => {
    if (!isOpenReplies) {
      // Open Replies without refetch
      setIsOpenReplies(true);

      // if never fetched, get data
      if (!isFetched) {
        try {
          setIsLoadingReplies(true);
          const discussionReplies = await DiscussionReplyList({
            discussionStarterId: props.discussionStarterId,
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

  // Delete discussion starter
  const handleDelete = async () => {
    if (!props.discussionStarterId) return;
    try {
      const deleteDiscussion = await DeleteDiscussionStarter({
        discussionStarterId: props.discussionStarterId,
      });
      if (deleteDiscussion.code === "NO_CONTENT") {
        toast.success("Discussion Deleted");
        props.onDiscussionDeleted(props.discussionStarterId);
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
        id={`discussion-${props.discussionStarterId}`}
        className="discussion-starter-container flex gap-3"
      >
        <div className="discussion-starter-author-avatar flex size-8 aspect-square shrink-0 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={props.discussionStarterAuthorAvatar}
            alt={props.discussionStarterAuthorName}
            width={300}
            height={300}
          />
        </div>
        <div className="discussion-starter-item flex flex-col gap-3 w-full">
          <div className="flex flex-col">
            <div className="discussion-starter-attributes flex items-center gap-2 font-bodycopy text-sm">
              <p className="discussion-starter-author-name font-bold">
                {props.discussionStarterAuthorName}
              </p>
              <p className="discussion-starter-created-at text-alternative">
                {dayjs(props.discussionStarterCreatedAt).fromNow()}
              </p>
            </div>
            <p className="discussion-starter-message font-bodycopy text-sm whitespace-pre-line">
              {props.discussionStarterMessage}
            </p>
          </div>
          <div className="discussion-starter-action flex font-bodycopy text-sm items-center gap-3">
            <p
              className="discussion-starter-reply font-semibold text-primary hover:cursor-pointer"
              onClick={() => handleWriteReply()}
            >
              {writeReply ? "Cancel" : "Reply"}
            </p>
            {props.discussionStarterOwner && (
              <p
                className="discussion-starter-delete font-semibold text-destructive hover:cursor-pointer"
                onClick={() => setIsOpenDeleteConfirmation(true)}
              >
                Delete
              </p>
            )}
          </div>
          <div
            className={`discussion-write-reply flex w-full transition-all duration-300 ease-in-out overflow-hidden ${
              writeReply ? "opacity-100 mt-2" : "max-h-0 opacity-0"
            }`}
          >
            <AppDiscussionTextArea
              sessionUserName={props.sessionUserName}
              sessionUserAvatar={props.sessionUserAvatar}
              textAreaId="reply"
              textAreaPlaceholder="Write reply..."
              characterLength={4000}
              onTextAreaChange={(value) => setTextValue(value)}
              value={textValue}
              onSubmit={handleSubmitReply}
              isLoadingSubmit={isSendingReply}
            />
          </div>
          {props.discussionStarterTotalReplies > 0 && (
            <AppButton
              className="discussion-starter-view-replies w-fit"
              size="small"
              variant="outline"
              onClick={handleViewReplies}
            >
              <ChevronDown
                className={`size-4 transform transition-transform duration-300 ${
                  isOpenReplies ? "rotate-180" : "rotate-0"
                }`}
              />
              View {props.discussionStarterTotalReplies} replies
            </AppButton>
          )}

          {isOpenReplies && (
            <div className="discussion-replies-container w-full py-2">
              {isLoadingReplies ? (
                <Loader2 className="discussion-loading-replies size-4 animate-spin text-alternative" />
              ) : (
                <div className="discsussion-replies flex flex-col gap-4">
                  {replies
                    .sort(
                      (a, b) =>
                        dayjs(a.created_at).valueOf() -
                        dayjs(b.created_at).valueOf()
                    )
                    .map((post) => (
                      <AppDiscussionReplyItem
                        key={post.id}
                        sessionUserName={props.sessionUserName}
                        sessionUserAvatar={props.sessionUserAvatar}
                        discussionStarterId={props.discussionStarterId}
                        discussionReplyId={post.id}
                        discussionReplyAuthorName={post.full_name}
                        discussionReplyAuthorAvatar={
                          post.avatar ||
                          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                        }
                        discussionReplyMessage={post.message}
                        discussionReplyCreatedAt={post.created_at}
                        discussionReplyOwner={post.is_owner}
                        onReplyCreated={handleReplyCreated}
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
