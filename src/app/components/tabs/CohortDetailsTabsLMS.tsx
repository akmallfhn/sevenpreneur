"use client";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import LearningSessionItemLMS from "../items/LearningSessionItemLMS";
import { SessionMethod } from "@/lib/app-types";

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

interface CohortDetailsTabsLMSProps {
  learningList: LearningSessionList[];
}

export default function CohortDetailsTabsLMS({
  learningList,
}: CohortDetailsTabsLMSProps) {
  const [activeTab, setActiveTab] = useState("learnings");

  const tabOptions = [
    { id: "learnings", label: "Learning Sessions" },
    { id: "projects", label: "Task Assignments" },
    { id: "modules", label: "Modules" },
    { id: "members", label: "Members" },
  ];

  return (
    <div className="cohort-tabs w-full bg-white/70 backdrop-blur-md rounded-lg overflow-hidden">
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
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"></div>
            )}
          </div>
        ))}
      </div>

      {activeTab === "learnings" && (
        <div className="tab-content">
          <div className="flex flex-col p-4 gap-3">
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
          </div>
        </div>
      )}
      {activeTab === "projects" && <div className="w-full h-80"></div>}
      {activeTab === "modules" && <div className="w-full h-80"></div>}
      {activeTab === "members" && <div className="w-full h-80"></div>}
    </div>
  );
}
