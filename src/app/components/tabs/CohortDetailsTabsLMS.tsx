"use client";
import { useState } from "react";
import LearningSessionItemLMS from "../items/LearningSessionItemLMS";
import { SessionMethod } from "@/lib/app-types";
import EmptyItemLMS from "../state/EmptyItemLMS";
import FileItemLMS from "../items/FileItemLMS";
import { getFileVariantFromURL } from "@/lib/file-variants";

export interface LearningSessionEducator {
  full_name: string;
  avatar: string | null;
}

export interface LearningSessionList {
  id: number;
  name: string;
  method: SessionMethod;
  meeting_date: string;
  location_name: string | null;
  speaker: LearningSessionEducator | null;
}

export interface ModuleList {
  name: string;
  document_url: string;
}

interface CohortDetailsTabsLMSProps {
  learningList: LearningSessionList[];
  moduleList: ModuleList[];
}

export default function CohortDetailsTabsLMS({
  learningList,
  moduleList,
}: CohortDetailsTabsLMSProps) {
  const [activeTab, setActiveTab] = useState("learnings");

  const tabOptions = [
    { id: "learnings", label: "Sessions" },
    { id: "projects", label: "Assignments" },
    { id: "modules", label: "Modules" },
    { id: "members", label: "Members" },
  ];

  return (
    <div className="cohort-tabs w-full min-h-80 bg-white/70 backdrop-blur-md rounded-lg overflow-hidden">
      <div className="tab-options flex border-b border-outline justify-around">
        {tabOptions.map((post) => (
          <div className="tab-item relative w-full" key={post.id}>
            <div
              className={`tab-item w-full p-3 text-center text-sm font-bodycopy transform transition hover:cursor-pointer ${
                activeTab === post.id
                  ? "bg-primary-light/40 text-primary font-bold"
                  : "bg-white font-medium"
              }`}
              onClick={() => setActiveTab(post.id)}
            >
              {post.label}
            </div>
            {activeTab === post.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" />
            )}
          </div>
        ))}
      </div>

      {activeTab === "learnings" && (
        <div className="tab-content flex flex-col p-4 gap-3 w-full min-h-96">
          {learningList
            .sort(
              (a, b) =>
                new Date(a.meeting_date).getTime() -
                new Date(b.meeting_date).getTime()
            )
            .map((post, index) => (
              <LearningSessionItemLMS
                key={index}
                learningSessionId={post.id}
                learningSessionName={post.name}
                learningSessionMethod={post.method}
                learningSessionEducatorName={
                  post.speaker?.full_name || "Sevenpreneur Educator"
                }
                learningSessionEducatorAvatar={
                  post.speaker?.avatar ||
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                }
                learningSessionDate={post.meeting_date}
                learningSessionPlace={post.location_name || "To Be Announced"}
              />
            ))}
          {learningList.length === 0 && (
            <div className="flex w-full h-full items-center justify-center">
              <EmptyItemLMS
                stateTitle="No Sessions Available"
                stateDescription="There are no learning sessions scheduled right now. Please check back later or contact your program coordinator for updates."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "projects" && <div className="w-full min-h-96"></div>}

      {activeTab === "modules" && (
        <div className="tab-area w-full min-h-96">
          <div className="tab-content flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:content-start p-4 gap-3">
            {moduleList.map((post, index) => (
              <FileItemLMS
                key={index}
                fileName={post.name}
                fileURL={post.document_url}
                variants={getFileVariantFromURL(post.document_url)}
              />
            ))}
          </div>
          {learningList.length === 0 && (
            <div className="flex w-full h-full items-center justify-center">
              <EmptyItemLMS
                stateTitle="No Modules Available"
                stateDescription="There are no learning sessions scheduled right now. Please check back later or contact your program coordinator for updates."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "members" && <div className="w-full h-80"></div>}
    </div>
  );
}
