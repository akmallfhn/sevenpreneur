"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderCohortEntityLMS from "../navigations/HeaderCohortEntityLMS";
import { SessionMethod, StatusType } from "@/lib/app-types";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import FileItemLMS from "../items/FileItemLMS";
import HeroLearningDetailsLMS from "../heroes/HeroLearningDetailsLMS";
import EmptyRecordingLMS from "../state/EmptyRecordingLMS";
import AppDiscussionStarterItem from "../messages/AppDiscussionStarterItem";
import React, { useEffect, useState } from "react";
import EmptyDiscussionLMS from "../state/EmptyDiscussionLMS";
import AppDiscussionTextArea from "../messages/AppDiscussionTextArea";
import { CheckInSession, CreateDiscussionStarter } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { extractEmbedPathFromYouTubeURL } from "@/lib/extract-youtube-id";
import AppButton from "../buttons/AppButton";
import { Loader2, Star } from "lucide-react";
import ApplyCheckOutSessionLMS from "../modals/ApplyCheckOutSessionLMS";

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
  is_owner: boolean;
}

interface LearningDetailsLMSProps extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserId: string;
  sessionUserRole: number;
  learningSessionId: number;
  learningSessionName: string;
  learningSessionDescription: string;
  learningSessionDate: string;
  learningSessionMethod: SessionMethod;
  learningSessionURL: string;
  learningSessionCheckIn: boolean;
  learningSessionCheckOut: boolean;
  learningLocationURL: string;
  learningLocationName: string;
  learningEducatorName: string;
  learningEducatorAvatar: string;
  learningRecordingYoutube: string;
  learningRecordingCloudflare: string;
  materialList: MaterialList[];
  discussionStarterList: DiscussionStarterList[];
  hasCheckIn: boolean;
  hasCheckOut: boolean;
}

export default function LearningDetailsLMS({
  cohortId,
  cohortName,
  sessionUserId,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  learningSessionId,
  learningSessionName,
  learningSessionDescription,
  learningSessionDate,
  learningSessionMethod,
  learningSessionURL,
  learningSessionCheckIn,
  learningSessionCheckOut,
  learningLocationURL,
  learningLocationName,
  learningEducatorName,
  learningEducatorAvatar,
  learningRecordingYoutube,
  learningRecordingCloudflare,
  materialList,
  discussionStarterList,
  hasCheckIn,
  hasCheckOut,
}: LearningDetailsLMSProps) {
  const router = useRouter();
  const [discussion, setDiscussion] = useState<DiscussionStarterList[]>([]);
  const [isSendingDiscussion, setIsSendingDiscussion] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);

  const getCheckInState = (
    hasCheckIn: boolean,
    learningSessionCheckIn: boolean
  ) => {
    if (hasCheckIn) return { label: "Checked In", disabled: true };
    if (!learningSessionCheckIn) return { label: "Closed", disabled: true };
    return { label: "Check In", disabled: false };
  };

  const getCheckOutState = (
    hasCheckOut: boolean,
    learningSessionCheckOut: boolean
  ) => {
    if (hasCheckOut) return { label: "Checked Out", disabled: true };
    if (!learningSessionCheckOut) return { label: "Closed", disabled: true };
    return { label: "Check Out", disabled: false };
  };

  const { label: checkInAction, disabled: checkInDisabled } = getCheckInState(
    hasCheckIn,
    learningSessionCheckIn
  );

  const { label: checkOutAction, disabled: checkOutDisabled } =
    getCheckOutState(hasCheckOut, learningSessionCheckOut);

  const activeMaterials = materialList.filter(
    (material) => material.status === "ACTIVE"
  );

  // Update list discussion to state
  useEffect(() => {
    setDiscussion(discussionStarterList);
  }, [discussionStarterList]);

  // Create discussion
  const handleSubmitDiscussion = async () => {
    if (!textValue.trim()) {
      return;
    }
    setIsSendingDiscussion(true);

    try {
      const createDiscussion = await CreateDiscussionStarter({
        learningSessionId,
        discussionStarterMessage: textValue,
      });

      if (createDiscussion.code === "CREATED") {
        const newDiscussion = {
          id: createDiscussion.discussion.id,
          full_name: sessionUserName,
          avatar: sessionUserAvatar,
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

  const learningVideoKey = (() => {
    if (learningRecordingCloudflare) return learningRecordingCloudflare;

    if (learningRecordingYoutube) {
      const extracted = extractEmbedPathFromYouTubeURL(
        learningRecordingYoutube
      );
      return extracted || null;
    }

    return null;
  })();

  // Check In Attendance
  const handleCheckIn = async () => {
    setCheckingIn(true);

    try {
      const checkInSession = await CheckInSession({
        learningId: learningSessionId,
      });
      if (checkInSession.code === "CREATED") {
        toast.success("You’ve successfully checked in!");
        router.refresh();
      } else {
        toast.error("Unable to complete check-in. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <React.Fragment>
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
                <p className="text-[#333333] font-sm font-bodycopy text-[15px] whitespace-pre-line">
                  {learningSessionDescription}
                </p>
              </div>
              <div className="learning-session-recording flex flex-col gap-3 bg-white p-4 border rounded-lg">
                <h3 className="section-title font-bold font-bodycopy">
                  Live Class Recording
                </h3>
                {learningRecordingCloudflare && (
                  <div className="learning-video-recording relative w-full h-auto aspect-video overflow-hidden rounded-md">
                    <AppVideoPlayer videoId={learningRecordingCloudflare} />
                  </div>
                )}
                {!learningRecordingCloudflare && learningVideoKey && (
                  <div className="learning-video-recording relative w-full aspect-video overflow-hidden rounded-md">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${learningVideoKey}&amp;controls=1`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                )}
                {!learningVideoKey && <EmptyRecordingLMS />}
              </div>
              <div className="learning-discussions flex flex-col gap-3 bg-white p-4 border rounded-lg">
                <h3 className="section-title font-bold font-bodycopy">
                  Discussions
                </h3>
                <div className="discussions-box flex flex-col gap-6">
                  <AppDiscussionTextArea
                    sessionUserName={sessionUserName}
                    sessionUserAvatar={sessionUserAvatar}
                    textAreaId="discussion"
                    textAreaPlaceholder="Let's discuss about this learning"
                    onTextAreaChange={(value) => setTextValue(value)}
                    value={textValue}
                    onSubmit={handleSubmitDiscussion}
                    isLoadingSubmit={isSendingDiscussion}
                  />
                  {discussion.length > 0 ? (
                    <div className="discussions-list flex flex-col gap-4">
                      {discussion.map((post) => (
                        <AppDiscussionStarterItem
                          key={post.id}
                          sessionUserId={sessionUserId}
                          sessionUserName={sessionUserName}
                          sessionUserAvatar={
                            sessionUserAvatar ||
                            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                          }
                          discussionStarterId={post.id}
                          discussionStarterAuthorName={post.full_name}
                          discussionStarterAuthorAvatar={
                            post.avatar ||
                            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                          }
                          discussionStarterMessage={post.message}
                          discussionStarterTotalReplies={post.reply_count}
                          discussionStarterCreatedAt={post.created_at}
                          discussionStarterOwner={post.is_owner}
                          onDiscussionDeleted={handleDiscussionDeleted}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyDiscussionLMS />
                  )}
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
              <div className="check-in-attendance flex flex-col gap-3 bg-white p-4 border rounded-lg">
                <h3 className="section-title font-bold font-bodycopy">
                  Check In Attendance
                </h3>
                <AppButton
                  size="medium"
                  onClick={handleCheckIn}
                  disabled={checkInDisabled}
                >
                  {checkingIn && <Loader2 className="size-5 animate-spin" />}
                  {checkInAction}
                </AppButton>
              </div>
              <div className="check-out-attendance flex flex-col gap-3 bg-white p-4 border rounded-lg">
                <h3 className="section-title font-bold font-bodycopy">
                  Check Out Attendance
                </h3>
                <a
                  href="https://forms.gle/XtGCMjh3GbwQ65Ss6"
                  className="w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AppButton className="w-full" size="medium" variant="outline">
                    Rating & Evaluation
                    <Star className="size-4" fill="#FFB21D" stroke="#FFF3DB" />
                  </AppButton>
                </a>
                <AppButton
                  size="medium"
                  disabled={checkOutDisabled}
                  onClick={() => setOpenCheckOut(true)}
                >
                  {checkOutAction}
                </AppButton>
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
                  <p className="text-alternative text-[15px] font-bodycopy font-medium">
                    The session materials are being prepared and will be
                    available soon.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Modal Checkout */}
      <ApplyCheckOutSessionLMS
        learningId={learningSessionId}
        isOpen={openCheckOut}
        onClose={() => setOpenCheckOut(false)}
        onSuccessCheckOut={() => {
          router.refresh();
        }}
      />
    </React.Fragment>
  );
}
