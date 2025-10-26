"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderCohortEntityLMS from "../navigations/HeaderCohortEntityLMS";
import { SessionMethod, StatusType } from "@/lib/app-types";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import FileItemLMS from "../items/FileItemLMS";
import HeroLearningDetailsLMS from "../templates/HeroLearningDetailsLMS";
import EmptyRecordingLMS from "../state/EmptyRecordingLMS";
import AppDiscussionStarterItem from "../items/AppDiscussionStarterItem";

export interface MaterialList {
  name: string;
  document_url: string;
  status: StatusType;
}

export interface DiscussionStarterList {
  id: number;
  full_name: string;
  avatar: string | null;
  message: string;
  reply_count: number;
  created_at: string;
  updated_at: string;
}

interface LearningDetailsLMSProps extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserId: string;
  sessionUserRole: number;
  learningSessionName: string;
  learningSessionDescription: string;
  learningSessionDate: string;
  learningSessionMethod: SessionMethod;
  learningSessionURL: string;
  learningLocationURL: string;
  learningLocationName: string;
  learningEducatorName: string;
  learningEducatorAvatar: string;
  learningVideoRecording: string;
  materialList: MaterialList[];
  discussionStarterList: DiscussionStarterList[];
}

export default function LearningDetailsLMS({
  cohortId,
  cohortName,
  sessionUserId,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  learningSessionName,
  learningSessionDescription,
  learningSessionDate,
  learningSessionMethod,
  learningSessionURL,
  learningLocationURL,
  learningLocationName,
  learningEducatorName,
  learningEducatorAvatar,
  learningVideoRecording,
  materialList,
  discussionStarterList,
}: LearningDetailsLMSProps) {
  const activeMaterials = materialList.filter(
    (material) => material.status === "ACTIVE"
  );

  return (
    <div className="root-page hidden flex-col pl-64 w-full h-full gap-4 items-center pb-8 lg:flex">
      <HeaderCohortEntityLMS
        cohortId={cohortId}
        cohortName={cohortName}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
        headerTitle="Learning Session"
        headerDescription="Everything you need for your session. Learn, watch, and discuss in one place."
      />
      <div className="body-learning max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <HeroLearningDetailsLMS
          learningSessionName={learningSessionName}
          learningSessionDate={learningSessionDate}
          learningSessionMethod={learningSessionMethod}
          learningSessionURL={learningSessionURL}
          learningLocationURL={learningLocationURL}
          learningLocationName={learningLocationName}
        />
        <div className="learning-contents w-full flex gap-4">
          <main className="main-contents w-full flex flex-col flex-2 gap-4">
            <div className="learning-description flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="section-title font-bold font-bodycopy">
                What&apos;s on this sessions?
              </h3>
              <p className="text-[#333333] font-sm font-bodycopy whitespace-pre-line">
                {learningSessionDescription}
              </p>
            </div>
            <div className="learning-session-recording flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="section-title font-bold font-bodycopy">
                Live Class Recording
              </h3>
              {/* {!learningVideoRecording && <EmptyRecordingLMS />} */}
              <div className="video-recording relative w-full h-auto aspect-video overflow-hidden rounded-md">
                <AppVideoPlayer videoId={"d929af5a12b4d3fbe74215e9678b1b58"} />
              </div>
            </div>
            <div className="learning-discussions flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="section-title font-bold font-bodycopy">
                Discussions
              </h3>
              <div className="discussions-list flex flex-col gap-4">
                {discussionStarterList.map((post, index) => (
                  <AppDiscussionStarterItem
                    key={index}
                    sessionUserId={sessionUserId}
                    sessionUserRole={sessionUserRole}
                    discussionId={post.id}
                    // discussionAuthorId={post.user_id}
                    discussionAuthorName={post.full_name}
                    discussionAuthorAvatar={
                      post.avatar ||
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                    }
                    discussionMessage={post.message}
                    discussionReplies={post.reply_count}
                    discussionCreatedAt={post.created_at}
                  />
                ))}
              </div>
            </div>
          </main>
          <aside className="w-full flex flex-col flex-1 gap-4">
            <div className="learning-description flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="section-title font-bold font-bodycopy">
                Lectured by
              </h3>
              <div className="educator-container flex items-center p-3 gap-3 bg-section-background rounded-lg">
                <div className="educator-avatar size-9 shrink-0 rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={learningEducatorAvatar}
                    alt={learningEducatorName}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="educator-attributes flex flex-col font-bodycopy">
                  <p className="text-[15px] text-black font-semibold line-clamp-1">
                    {learningEducatorName}
                  </p>
                  <p className="educator-role text-[13px] text-[#333333]/50 font-medium">
                    BUSINESS COACH
                  </p>
                </div>
              </div>
            </div>
            <div className="learning-materials flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="section-title font-bold font-bodycopy">
                Materials
              </h3>
              {activeMaterials.length > 0 ? (
                <div className="material-list flex flex-col gap-2">
                  {activeMaterials.map((post, index) => (
                    <FileItemLMS
                      key={index}
                      fileName={post.name}
                      fileURL={post.document_url}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-alternative text-sm font-bodycopy">
                  The session materials are being prepared and will be available
                  soon.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
