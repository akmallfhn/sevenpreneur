"use client";
import { SessionMethod } from "@/lib/app-types";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import AttendanceGatewayMobileLMS from "../gateways/AttendanceGatewayMobileLMS";
import { ChevronDown, MapPinned, Video } from "lucide-react";
import {
  DiscussionStarterList,
  MaterialList,
} from "../pages/LearningDetailsLMS";
import FileItemLMS from "../items/FileItemLMS";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import { extractEmbedPathFromYouTubeURL } from "@/lib/extract-youtube-id";
import EmptyRecordingLMS from "../state/EmptyRecordingLMS";
import AppDiscussionStarterItem from "../messages/AppDiscussionStarterItem";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import EmptyDiscussionLMS from "../state/EmptyDiscussionLMS";
import { toast } from "sonner";
import { CreateDiscussionStarter } from "@/lib/actions";

export interface LearningDetailsTabsMobileLMSProps extends AvatarBadgeLMSProps {
  sessionUserId: string;
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
  discussion: DiscussionStarterList[];
  onTabChange: (tab: string) => void;
  onDiscussionDeleted: (id: number) => void;
}

export default function LearningDetailsTabsMobileLMS(
  props: LearningDetailsTabsMobileLMSProps
) {
  const [activeTab, setActiveTab] = useState("details");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  const conferencePlatform = getConferenceVariantFromURL(
    props.learningSessionURL
  );
  const { conferenceIcon, conferenceName } =
    getConferenceAttributes(conferencePlatform);

  const tabOptions = [
    { id: "details", label: "Details" },
    { id: "discussions", label: "Discussions" },
    { id: "materials", label: "Materials" },
  ];

  const activeMaterials = props.materialList.filter(
    (material) => material.status === "ACTIVE"
  );

  // Set expired link for 4 hours
  const isExpired = dayjs().isAfter(
    dayjs(props.learningSessionDate).add(4, "hour")
  );

  let learningPlaceName;
  if (props.learningSessionMethod === "ONLINE") {
    learningPlaceName = conferenceName;
  } else if (props.learningSessionMethod === "ONSITE") {
    learningPlaceName = props.learningLocationName;
  } else if (props.learningSessionMethod === "HYBRID") {
    learningPlaceName = "Hybrid Meeting";
  }

  let learningPlaceIcon;
  if (props.learningSessionMethod === "ONLINE") {
    learningPlaceIcon = conferenceIcon;
  } else {
    learningPlaceIcon =
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/gmaps-icon.png";
  }

  // Checking overflow for show more button
  useEffect(() => {
    const checkOverflow = () => {
      if (divRef.current) {
        const el = divRef.current;
        const isOverflow = el.scrollHeight > el.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Get Video Key from URL
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

  return (
    <div className="learning-session-tabs flex flex-col w-full">
      <div className="tab-options flex border-b justify-around">
        {tabOptions.map((post) => (
          <div className="tab-item relative w-full" key={post.id}>
            <div
              className={`tab-item w-full p-3 text-center text-sm font-bodycopy transform transition hover:cursor-pointer ${
                activeTab === post.id
                  ? "bg-gradient-to-t from-0% from-primary-light/50 to-60% to-primary-light/0 text-primary font-bold"
                  : "bg-white font-medium"
              }`}
              onClick={() => {
                setActiveTab(post.id);
                props.onTabChange(post.id);
              }}
            >
              {post.label}
            </div>
            {activeTab === post.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />
            )}
          </div>
        ))}
      </div>

      {activeTab === "details" && (
        <div className="tab-content flex flex-col w-full gap-1">
          <div className="learning-place-date flex flex-col gap-3 bg-white p-5">
            <h2 className="section-title font-bodycopy font-bold">
              Class Information
            </h2>
            <div className="learning-place-date-box flex flex-col gap-3">
              <div className="learning-place-date-container flex w-full items-center gap-3">
                <div className="learning-place-icon size-11 aspect-square bg-white p-1 border border-outline shrink-0 rounded-lg overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={learningPlaceIcon}
                    alt={props.learningSessionMethod}
                    width={400}
                    height={400}
                  />
                </div>
                <div className="flex flex-col">
                  <h2 className="learning-place-name font-bodycopy font-bold text-[15px]">
                    {learningPlaceName}
                  </h2>
                  <p className="learning-session-date font-bodycopy font-medium text-sm text-[#333333]">
                    {dayjs(props.learningSessionDate).format(
                      "ddd[,] DD MMM YYYY [-] HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <div className="learning-join-class flex flex-col w-full items-center gap-3">
                {props.learningSessionMethod !== "ONSITE" &&
                  props.learningSessionURL && (
                    <a
                      href={props.learningSessionURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="join-meeting w-full"
                    >
                      <AppButton
                        className="w-full"
                        size="medium"
                        variant="primary"
                        disabled={isExpired}
                      >
                        <Video className="size-5" />
                        Join Meeting
                      </AppButton>
                    </a>
                  )}
                {props.learningSessionMethod === "ONSITE" &&
                  props.learningLocationURL && (
                    <a
                      href={props.learningLocationURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="check-maps w-full"
                    >
                      <AppButton
                        className="w-full"
                        size="medium"
                        variant="primary"
                        disabled={isExpired}
                      >
                        <MapPinned className="size-5" />
                        Check Maps
                      </AppButton>
                    </a>
                  )}
              </div>
            </div>
          </div>
          <div className="attendance flex flex-col bg-white p-5">
            <AttendanceGatewayMobileLMS
              learningSessionId={props.learningSessionId}
              hasCheckIn={props.hasCheckIn}
              hasCheckOut={props.hasCheckOut}
              learningSessionCheckIn={props.learningSessionCheckIn}
              learningSessionCheckOut={props.learningSessionCheckOut}
            />
          </div>
          <div className="learning-description relative flex flex-col gap-3 bg-white p-5">
            <h2 className="section-title font-bodycopy font-bold">
              What&apos;s on this sessions?
            </h2>
            <div
              ref={divRef}
              className={`flex flex-col gap-3 transition-all overflow-hidden ${
                isExpanded ? "max-h-[4000px]" : "max-h-32"
              }`}
            >
              <p className="font-bodycopy font-medium text-sm text-[#333333] whitespace-pre-line">
                {props.learningSessionDescription}
              </p>
            </div>
            {isOverflowing && (
              <div className="flex transition-all transform z-10">
                <AppButton
                  variant={"primaryLight"}
                  size="small"
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  <p>{isExpanded ? "Show less" : "Show more"}</p>
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </AppButton>
              </div>
            )}
            {!isExpanded && isOverflowing && (
              <div className="overlay absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-40% from-white to-100% to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      )}

      {activeTab === "discussions" && (
        <div className="tab-content flex flex-col w-full gap-1 pb-11">
          <div className="video-recording relative flex flex-col gap-3 bg-white p-5">
            <h2 className="section-title font-bodycopy font-bold">
              Discussions
            </h2>
            <div className="discussions-thread flex flex-col gap-6">
              {props.discussion.length > 0 ? (
                <div className="discussions-list flex flex-col gap-4">
                  {props.discussion.map((post) => (
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
                      onDiscussionDeleted={props.onDiscussionDeleted}
                    />
                  ))}
                </div>
              ) : (
                <EmptyDiscussionLMS />
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "materials" && (
        <div className="tab-content flex flex-col w-full gap-1">
          <div className="video-recording relative flex flex-col gap-3 bg-white p-5">
            <h2 className="section-title font-bodycopy font-bold">
              Video Recording
            </h2>
            {props.learningRecordingCloudflare && (
              <div className="learning-video-recording relative w-full h-auto overflow-hidden rounded-sm">
                <AppVideoPlayer videoId={props.learningRecordingCloudflare} />
              </div>
            )}
            {!props.learningRecordingCloudflare && learningVideoKey && (
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
          <div className="learning-materials relative flex flex-col gap-3 bg-white p-5">
            <h2 className="section-title font-bodycopy font-bold">Materials</h2>
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
              <p className="text-alternative text-sm font-bodycopy font-medium">
                The session materials are being prepared and will be available
                soon.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
