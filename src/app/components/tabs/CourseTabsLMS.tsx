"use client";
import { StatusType } from "@/lib/app-types";
import { CirclePlay, Presentation } from "lucide-react";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import CourseItemLMS from "../items/CourseItemLMS";
import EmptyListLMS from "../states/EmptyListLMS";

export interface CourseList {
  id: number;
  name: string;
  image_url: string;
  total_item: number;
  status: StatusType;
  category: "COHORT" | "PLAYLIST";
  slug_category: "cohorts" | "playlists";
  cohort_start_date: string;
  cohort_end_date: string;
  playlist_duration: number | null;
}

interface CourseTabsLMSProps {
  courseList: CourseList[];
}

export default function CourseTabsLMS(props: CourseTabsLMSProps) {
  const [activeTab, setActiveTab] = useState("all");

  const tabOptions = [
    { id: "all", label: "All Courses", icon: <></> },
    {
      id: "cohorts",
      label: "Bootcamps",
      icon: <Presentation className="size-5" />,
    },
    {
      id: "playlists",
      label: "Video Series",
      icon: <CirclePlay className="size-5" />,
    },
  ];

  const activeCourses = props.courseList.filter(
    (course) => course.status === "ACTIVE",
  );
  const activeCohorts = props.courseList.filter(
    (course) => course.status === "ACTIVE" && course.category === "COHORT",
  );
  const activePlaylists = props.courseList.filter(
    (course) => course.status === "ACTIVE" && course.category === "PLAYLIST",
  );

  return (
    <div className="cohort-tabs flex flex-col w-full gap-6 overflow-hidden">
      <div className="tab-options flex gap-4">
        {tabOptions.map((post) => (
          <AppButton
            key={post.id}
            className="tab-item"
            size="mediumRounded"
            variant={activeTab === post.id ? "primary" : "primaryLight"}
            onClick={() => setActiveTab(post.id)}
          >
            {post.icon}
            {post.label}
          </AppButton>
        ))}
      </div>

      {activeTab === "all" && (
        <div className="tab-area w-full p-5 bg-white rounded-lg border">
          {activeCourses.length > 0 ? (
            <div className="course-list grid gap-4 items-center lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
              {activeCourses.map((post) => (
                <CourseItemLMS
                  key={post.id}
                  courseId={post.id}
                  courseName={post.name}
                  courseImage={post.image_url}
                  courseCategory={post.category}
                  courseSlugCategory={post.slug_category}
                  courseItems={post.total_item}
                  cohortStartDate={post.cohort_start_date}
                  cohortEndDate={post.cohort_end_date}
                  playlistDuration={post.playlist_duration}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full min-h-96 items-center p-4">
              <EmptyListLMS
                stateTitle="No Courses Purchased"
                stateDescription="Looks like you haven’t bought any courses. Explore our collections
                               and start learning something new today!"
                stateAction="Discover"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "cohorts" && (
        <div className="tab-area w-full p-5 bg-white rounded-lg border">
          {activeCohorts.length > 0 ? (
            <div className="cohort-list grid gap-4 items-center lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
              {activeCohorts.map((post) => (
                <CourseItemLMS
                  key={post.id}
                  courseId={post.id}
                  courseName={post.name}
                  courseImage={post.image_url}
                  courseCategory={post.category}
                  courseSlugCategory={post.slug_category}
                  courseItems={post.total_item}
                  cohortStartDate={post.cohort_start_date}
                  cohortEndDate={post.cohort_end_date}
                  playlistDuration={post.playlist_duration}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full min-h-96 items-center justify-center p-5">
              <EmptyListLMS
                stateTitle="No Program Purchased"
                stateDescription="Looks like you haven’t bought any programs. Explore our collections
                               and start learning something new today!"
                stateAction="Explore our Program"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "playlists" && (
        <div className="tab-area w-full p-5 bg-white rounded-lg border">
          {activePlaylists.length > 0 ? (
            <div className="playlist grid gap-4 items-center lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
              {activePlaylists.map((post) => (
                <CourseItemLMS
                  key={post.id}
                  courseId={post.id}
                  courseName={post.name}
                  courseImage={post.image_url}
                  courseCategory={post.category}
                  courseSlugCategory={post.slug_category}
                  courseItems={post.total_item}
                  cohortStartDate={post.cohort_start_date}
                  cohortEndDate={post.cohort_end_date}
                  playlistDuration={post.playlist_duration}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full min-h-96 items-center p-5">
              <EmptyListLMS
                stateTitle="No Video Series Purchased"
                stateDescription="Looks like you haven’t bought any learning series. Explore our collections
                      and start learning something new today!"
                stateAction="Explore Series"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
