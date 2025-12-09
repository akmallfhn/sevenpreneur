"use client";
import HeaderMobileLMS from "../navigations/HeaderMobileLMS";
import Image from "next/image";
import LearningDetailsTabsMobileLMS from "../tabs/LearningDetailsTabsMobileLMS";
import { Star } from "lucide-react";
import AppButton from "../buttons/AppButton";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { useEffect, useState } from "react";
import { SessionMethod } from "@/lib/app-types";
import { DiscussionStarterList, MaterialList } from "./LearningDetailsLMS";
import AppDiscussionTextArea from "../messages/AppDiscussionTextArea";
import { CreateDiscussionStarter } from "@/lib/actions";
import { toast } from "sonner";

interface LearningDetailsMobileLMSProps extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserId: string;
  learningSessionName: string;
  learningEducatorName: string;
  learningEducatorAvatar: string;
  learningSessionFeedbackURL: string;
  learningSessionId: number;
  learningSessionDescription: string;
  learningSessionDate: string;
  learningSessionMethod: SessionMethod;
  learningSessionURL: string;
  learningLocationURL: string;
  learningLocationName: string;
  learningSessionCheckIn: boolean;
  learningSessionCheckOut: boolean;
  learningRecordingYoutube: string;
  learningRecordingCloudflare: string;
  hasCheckIn: boolean;
  hasCheckOut: boolean;
  materialList: MaterialList[];
  discussionStarterList: DiscussionStarterList[];
}

export default function LearningDetailsMobileLMS(
  props: LearningDetailsMobileLMSProps
) {
  const [currentTab, setCurrentTab] = useState("details");
  const [isSendingDiscussion, setIsSendingDiscussion] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [discussion, setDiscussion] = useState<DiscussionStarterList[]>(
    props.discussionStarterList
  );

  // Create discussion
  const handleSubmitDiscussion = async () => {
    if (!textValue.trim()) {
      return;
    }
    setIsSendingDiscussion(true);

    try {
      const createDiscussion = await CreateDiscussionStarter({
        learningSessionId: props.learningSessionId,
        discussionStarterMessage: textValue,
      });

      if (createDiscussion.code === "CREATED") {
        const newDiscussion = {
          id: createDiscussion.discussion.id,
          full_name: props.sessionUserName,
          avatar: props.sessionUserAvatar,
          message: createDiscussion.discussion.message,
          reply_count: 0,
          created_at: createDiscussion.discussion.created_at,
          updated_at: createDiscussion.discussion.updated_at,
          is_owner: true,
        };

        setTextValue("");
        toast.success("Discussion Sent!");
        setDiscussion((prev) => [newDiscussion, ...prev]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send discussion. Please try again.");
    } finally {
      setIsSendingDiscussion(false);
    }
  };

  // Remove deleted discussion on state
  const handleDiscussionDeleted = (discussionId: number) => {
    setDiscussion((prevDiscussions) =>
      prevDiscussions.filter((discussion) => discussion.id !== discussionId)
    );
  };

  return (
    <div className="root-page relative flex flex-col w-full items-center pb-20 lg:hidden">
      <HeaderMobileLMS
        headerTitle="Session Details"
        headerBackURL={`/cohorts/${props.cohortId}`}
      />
      <div className="hero-learning-session relative flex flex-col w-full aspect-[16/7] overflow-hidden">
        <Image
          className="hero-background-session object-cover w-full h-full scale-125"
          src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-learning-mob%20(1).webp"
          alt="Session Details"
          width={400}
          height={400}
        />
        <div className="learning-session-attributes absolute flex flex-col gap-2 top-1/2 -translate-y-1/2 left-5 pr-5">
          <div className="educator-avatar flex w-8 aspect-square outline-4 outline-white/50 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full scale-125"
              src={props.learningEducatorAvatar}
              alt="Session Details"
              width={400}
              height={400}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="learning-session-name font-bodycopy font-bold text-white text-lg leading-snug line-clamp-2">
              {props.learningSessionName}
            </h1>
            <p className="educator-name font-bodycopy font-medium text-sm text-white/80 leading-snug">
              {props.learningEducatorName}
            </p>
          </div>
        </div>
      </div>
      <LearningDetailsTabsMobileLMS
        sessionUserId={props.sessionUserId}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserName={props.sessionUserName}
        learningSessionId={props.learningSessionId}
        learningSessionDescription={props.learningSessionDescription}
        learningSessionDate={props.learningSessionDate}
        learningSessionMethod={props.learningSessionMethod}
        learningSessionURL={props.learningSessionURL}
        learningLocationName={props.learningLocationName}
        learningLocationURL={props.learningLocationURL}
        learningSessionCheckIn={props.learningSessionCheckIn}
        learningSessionCheckOut={props.learningSessionCheckOut}
        learningRecordingCloudflare={props.learningRecordingCloudflare}
        learningRecordingYoutube={props.learningRecordingYoutube}
        hasCheckIn={props.hasCheckIn}
        hasCheckOut={props.hasCheckOut}
        materialList={props.materialList}
        discussion={discussion}
        onTabChange={setCurrentTab}
        onDiscussionDeleted={handleDiscussionDeleted}
      />

      {/* Ratings & Feedback */}
      {currentTab === "details" &&
        props.learningSessionFeedbackURL &&
        props.learningSessionCheckOut && (
          <div className="ratings-feedback fixed flex w-full bottom-0 inset-x-0 items-center justify-between bg-white py-4 px-5 gap-6 border-t border-outline transition-all z-[90]">
            <p className="section-title font-bold font-bodycopy text-[15px]">
              How satisfied are you with this session?
            </p>
            <a
              href={props.learningSessionFeedbackURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppButton className="shrink-0" variant="tertiary">
                Rate us <Star className="size-6" fill="#FFB21D" stroke="0" />
              </AppButton>
            </a>
          </div>
        )}

      {/* Create Discussion */}
      {currentTab === "discussions" && (
        <div className="discussions fixed flex w-full bottom-0 inset-x-0 items-center justify-between bg-white py-4 px-5 gap-6 border-t border-outline transition-all z-[90]">
          <AppDiscussionTextArea
            sessionUserName={props.sessionUserName}
            sessionUserAvatar={props.sessionUserAvatar}
            textAreaId="reply"
            textAreaPlaceholder="Write discussion..."
            onTextAreaChange={(value) => setTextValue(value)}
            characterLength={4000}
            value={textValue}
            onSubmit={handleSubmitDiscussion}
            isLoadingSubmit={isSendingDiscussion}
          />
        </div>
      )}
    </div>
  );
}
