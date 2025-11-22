"use client";
import { useState } from "react";
import LearningSessionItemLMS from "../items/LearningSessionItemLMS";
import { SessionMethod, StatusType } from "@/lib/app-types";
import EmptyItemLMS from "../state/EmptyItemLMS";
import FileItemLMS from "../items/FileItemLMS";
import UserItemLMS from "../items/UserItemLMS";
import ProjectItemLMS from "../items/ProjectItemLMS";

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
  status: StatusType;
  meeting_url: string | null;
  location_url: string | null;
}

export interface ModuleList {
  name: string;
  document_url: string;
  status: StatusType;
}

export interface ProjectList {
  id: number;
  name: string;
  deadline_at: string;
  status: StatusType;
}

export interface UserList {
  id: string;
  full_name: string;
  avatar: string | null;
  email: string;
  role_id: number;
}

interface CohortDetailsTabsLMSProps {
  sessionUserId: string;
  cohortId: number;
  learningList: LearningSessionList[];
  moduleList: ModuleList[];
  projectList: ProjectList[];
  userList: UserList[];
}

export default function CohortDetailsTabsLMS({
  sessionUserId,
  cohortId,
  learningList,
  moduleList,
  projectList,
  userList,
}: CohortDetailsTabsLMSProps) {
  const [activeTab, setActiveTab] = useState("learnings");

  const tabOptions = [
    { id: "learnings", label: "Sessions" },
    { id: "modules", label: "Modules" },
    { id: "projects", label: "Assignments" },
    { id: "members", label: "Network" },
  ];

  const activeLearnings = learningList.filter(
    (learning) => learning.status === "ACTIVE"
  );
  const activeModules = moduleList.filter(
    (module) => module.status === "ACTIVE"
  );
  const activeProject = projectList.filter(
    (project) => project.status === "ACTIVE"
  );
  const generalUser = userList.filter((user) => user.role_id === 3);

  return (
    <div className="cohort-tabs w-full min-h-80 bg-white/70 backdrop-blur-md rounded-lg border overflow-hidden">
      <div className="tab-options flex border-b justify-around">
        {tabOptions.map((post) => (
          <div className="tab-item relative w-full" key={post.id}>
            <div
              className={`tab-item w-full p-3 text-center text-sm font-bodycopy transform transition hover:cursor-pointer ${
                activeTab === post.id
                  ? "bg-gradient-to-t from-0% from-primary-light/50 to-60% to-primary-light/0 text-primary font-bold"
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
          {activeLearnings.length > 0 ? (
            <>
              {activeLearnings
                .sort(
                  (a, b) =>
                    new Date(a.meeting_date).getTime() -
                    new Date(b.meeting_date).getTime()
                )
                .map((post, index) => (
                  <LearningSessionItemLMS
                    key={index}
                    cohortId={cohortId}
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
                    learningSessionPlace={
                      post.location_name || "To Be Announced"
                    }
                  />
                ))}
            </>
          ) : (
            <div className="flex w-full h-full items-center p-4">
              <EmptyItemLMS
                stateTitle="No Sessions Available"
                stateDescription="There are no learning sessions scheduled right now. Please check back later or contact your program coordinator for updates."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "modules" && (
        <div className="tab-area w-full min-h-96">
          {activeModules.length > 0 ? (
            <div className="tab-content flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:content-start p-4 gap-3">
              {activeModules.map((post, index) => (
                <FileItemLMS
                  key={index}
                  fileName={post.name}
                  fileURL={post.document_url}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full h-full items-center justify-center p-4">
              <EmptyItemLMS
                stateTitle="Modules Coming Soon"
                stateDescription="We’re working on something great! New modules will be ready soon"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="tab-area w-full min-h-96">
          {activeProject.length > 0 ? (
            <div className="tab-content flex flex-col p-4 gap-3">
              {activeProject.map((post, index) => (
                <ProjectItemLMS
                  key={index}
                  cohortId={cohortId}
                  projectId={post.id}
                  projectName={post.name}
                  projectDeadline={post.deadline_at}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full h-full items-center p-4">
              <EmptyItemLMS
                stateTitle="No Assignments Yet"
                stateDescription="You don’t have any tasks or assignments right now. New tasks will appear here once they’re ready!"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "members" && (
        <div className="tab-area w-full min-h-96">
          {generalUser.length > 0 ? (
            <div className="tab-content flex flex-col 2xl:grid 2xl:grid-cols-2 2xl:content-start p-4 gap-3">
              {generalUser.map((post) => (
                <UserItemLMS
                  key={post.id}
                  sessionUserId={sessionUserId}
                  userId={post.id}
                  userName={post.full_name}
                  userAvatar={
                    post.avatar ||
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                  }
                  userEmail={post.email}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full h-full items-center">
              <EmptyItemLMS
                stateTitle="No Members Have Joined So Far."
                stateDescription="Looks like no one’s joined this cohort just yet. Once members enroll, you’ll see them listed right here!"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
