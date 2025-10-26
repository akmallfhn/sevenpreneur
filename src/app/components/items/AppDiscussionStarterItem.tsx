"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { useState } from "react";
import { DiscussionReplyList } from "@/lib/actions";
import AppDiscussionReplyItem from "./AppDiscussionReplyItemL";
import { ChevronDown, Loader2 } from "lucide-react";

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
}: AppDiscussionStarterItemProps) {
  const [isOpenReplies, setIsOpenReplies] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [replies, setReplies] = useState<DiscussionReplyList[]>([]);

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

  const isAdministrator = sessionUserRole === 0;
  const isOwner = sessionUserId;

  return (
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
      <div className="discussion flex flex-col gap-2">
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
          <p className="font-semibold text-primary">Reply</p>
          {isAdministrator && (
            <p className="font-semibold text-destructive">Delete</p>
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
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
