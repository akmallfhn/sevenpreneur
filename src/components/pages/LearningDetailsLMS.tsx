"use client";
import { CreateDiscussionStarter } from "@/lib/actions";
import { SessionMethod, StatusType } from "@/lib/app-types";
import { extractEmbedPathFromYouTubeURL } from "@/lib/extract-youtube-id";
import { faTowerObservation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import CheckInAttendanceLMS from "../gateways/CheckInAttendanceLMS";
import CheckOutAttendanceLMS from "../gateways/CheckOutAttendanceLMS";
import HeroLearningDetailsLMS from "../heroes/HeroLearningDetailsLMS";
import FileItemLMS from "../items/FileItemLMS";
import AppDiscussionStarterItem from "../messages/AppDiscussionStarterItem";
import AppDiscussionStarterSubmitter from "../messages/AppDiscussionStarterSubmitter";
import PageHeaderCohortLMS from "../navigations/PageHeaderCohortLMS";
import PageContainerDashboard from "./PageContainerDashboard";
import EmptyComponentsLMS from "../states/EmptyComponentsLMS";
import LearningDetailsMobileLMS from "./LearningDetailsMobileLMS";
import SectionContainerLMS from "../cards/SectionContainerLMS";

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
  sessionToken: string;
}

export default function LearningDetailsLMS(props: LearningDetailsLMSProps) {
  const [discussion, setDiscussion] = useState<DiscussionStarterList[]>(
    props.discussionStarterList
  );
  const [isSendingDiscussion, setIsSendingDiscussion] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Dynamic mobile rendering
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  const activeMaterials = props.materialList.filter(
    (material) => material.status === "ACTIVE"
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

  const learningVideoKey = (() => {
    if (props.learningRecordingCloudflare)
      return props.learningRecordingCloudflare;

    if (props.learningRecordingYoutube) {
      const extracted = extractEmbedPathFromYouTubeURL(
        props.learningRecordingYoutube
      );
      return extracted || null;
    }

    return null;
  })();

  // Render Mobile
  if (isMobile) {
    return (
      <LearningDetailsMobileLMS
        cohortId={props.cohortId}
        cohortName={props.cohortName}
        sessionUserId={props.sessionUserId}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserRole={props.sessionUserRole}
        learningSessionId={props.learningSessionId}
        learningSessionName={props.learningSessionName}
        learningSessionDescription={props.learningSessionDescription}
        learningSessionDate={props.learningSessionDate}
        learningSessionMethod={props.learningSessionMethod}
        learningSessionURL={props.learningSessionURL}
        learningSessionCheckIn={props.learningSessionCheckIn}
        learningSessionCheckOut={props.learningSessionCheckOut}
        sessionToken={props.sessionToken}
        learningLocationURL={props.learningLocationURL}
        learningLocationName={props.learningLocationName}
        learningEducatorName={props.learningEducatorName}
        learningEducatorAvatar={props.learningEducatorAvatar}
        learningRecordingYoutube={props.learningRecordingYoutube}
        learningRecordingCloudflare={props.learningRecordingCloudflare}
        materialList={props.materialList}
        discussionStarterList={props.discussionStarterList}
        hasCheckIn={props.hasCheckIn}
        hasCheckOut={props.hasCheckOut}
      />
    );
  }

  return (
    <PageContainerDashboard className="h-full gap-4 items-center pb-8">
      <PageHeaderCohortLMS
        cohortId={props.cohortId}
        cohortName={props.cohortName}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserRole={props.sessionUserRole}
        headerTitle="Learning Session"
        headerIcon={<FontAwesomeIcon icon={faTowerObservation} size="lg" />}
        headerIconColor="bg-[#E3FEFC] dark:bg-[#0d2f2a] text-[#2BC49C]"
      />
      <div className="body-learning max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <HeroLearningDetailsLMS
          learningSessionName={props.learningSessionName}
          learningSessionDate={props.learningSessionDate}
          learningSessionMethod={props.learningSessionMethod}
          learningSessionURL={props.learningSessionURL}
          learningLocationURL={props.learningLocationURL}
          learningLocationName={props.learningLocationName}
        />
        <div className="learning-contents w-full flex gap-4">
          <main className="main-contents w-full flex flex-col flex-2 gap-4">
            <SectionContainerLMS title="What's on this sessions?">
              <p className="text-[#333333] font-sm font-bodycopy text-[15px] whitespace-pre-line dark:text-foreground">
                {props.learningSessionDescription}
              </p>
            </SectionContainerLMS>
            <SectionContainerLMS title="Live Class Recording">
              {props.learningRecordingCloudflare && (
                <div className="relative w-full h-auto overflow-hidden rounded-md">
                  <AppVideoPlayer videoId={props.learningRecordingCloudflare} />
                </div>
              )}
              {!props.learningRecordingCloudflare && learningVideoKey && (
                <div className="relative w-full aspect-video overflow-hidden rounded-md">
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
              {!learningVideoKey && <EmptyComponentsLMS variant="RECORDING" />}
            </SectionContainerLMS>
            <SectionContainerLMS title="Discussions">
              <div className="flex flex-col gap-6">
                <AppDiscussionStarterSubmitter
                  sessionUserName={props.sessionUserName}
                  sessionUserAvatar={props.sessionUserAvatar}
                  textAreaId="discussion"
                  textAreaPlaceholder="Let's discuss about this learning"
                  characterLength={4000}
                  onTextAreaChange={(value) => setTextValue(value)}
                  value={textValue}
                  onSubmit={handleSubmitDiscussion}
                  isLoadingSubmit={isSendingDiscussion}
                />
                {discussion.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {discussion.map((post) => (
                      <AppDiscussionStarterItem
                        key={post.id}
                        sessionUserId={props.sessionUserId}
                        sessionUserName={props.sessionUserName}
                        sessionUserAvatar={
                          props.sessionUserAvatar ||
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
                  <EmptyComponentsLMS variant="DISCUSSIONS" />
                )}
              </div>
            </SectionContainerLMS>
          </main>
          <aside className="w-full flex flex-col flex-1 gap-4">
            <SectionContainerLMS title="Lectured by">
              <div className="flex items-center p-3 gap-3 bg-card-inside-bg rounded-lg">
                <div className="size-9 shrink-0 rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={props.learningEducatorAvatar}
                    alt={props.learningEducatorName}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex flex-col font-bodycopy">
                  <p className="text-[15px] font-semibold line-clamp-1 dark:text-sevenpreneur-white">
                    {props.learningEducatorName}
                  </p>
                  <p className="text-[13px] text-emphasis font-medium">
                    BUSINESS COACH
                  </p>
                </div>
              </div>
            </SectionContainerLMS>
            <SectionContainerLMS title="Materials">
              {activeMaterials.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {activeMaterials.map((post, index) => (
                    <FileItemLMS
                      key={index}
                      fileName={post.name}
                      fileURL={post.document_url}
                    />
                  ))}
                </div>
              ) : (
                <EmptyComponentsLMS variant="MATERIALS" />
              )}
            </SectionContainerLMS>
            <CheckInAttendanceLMS
              learningSessionId={props.learningSessionId}
              hasCheckIn={props.hasCheckIn}
              learningSessionCheckIn={props.learningSessionCheckIn}
            />
            <CheckOutAttendanceLMS
              learningSessionId={props.learningSessionId}
              hasCheckOut={props.hasCheckOut}
              learningSessionCheckOut={props.learningSessionCheckOut}
              sessionToken={props.sessionToken}
            />
          </aside>
        </div>
      </div>
    </PageContainerDashboard>
  );
}
