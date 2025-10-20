"use client";
import { useEffect, useState } from "react";
import { getFileVariantFromURL } from "@/lib/file-variants";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import FileItemLMS from "../items/FileItemLMS";
import HeaderProjectDetailsLMS from "../navigations/HeaderProjectDetailsLMS";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface ProjectDetailsLMS extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  projectName: string;
  projectDescription: string;
  projectDocumentURL: string | null;
  projectDeadline: string;
  sessionUserRole: number;
}

export default function ProjectDetailsLMS({
  cohortId,
  cohortName,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  projectName,
  projectDescription,
  projectDocumentURL,
  projectDeadline,
}: ProjectDetailsLMS) {
  const [deadlineStatus, setDeadlineStatus] = useState("");

  useEffect(() => {
    const updateDeadlineStatus = () => {
      const now = dayjs();
      const deadline = dayjs(projectDeadline);
      const differentMilisecond = deadline.diff(now);
      const absoluteDiff = Math.abs(differentMilisecond);
      const d = dayjs.duration(absoluteDiff);

      // Time Calculations
      const years = Math.floor(d.asYears());
      const months = Math.floor(d.asMonths() % 12);
      const days = Math.floor(d.asDays() % 30);
      const hours = d.hours();

      const parts = [];
      if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
      if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
      if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
      if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);

      const formatted = parts.join(" ");

      if (differentMilisecond > 0) {
        setDeadlineStatus(`Time remaining ${formatted || "less than an hour"}`);
      } else {
        setDeadlineStatus(`Overdue ${formatted || "less than an hour"}`);
      }
    };

    updateDeadlineStatus();
    const interval = setInterval(updateDeadlineStatus, 60_000);
    return () => clearInterval(interval);
  }, [projectDeadline]);

  return (
    <div className="root-page hidden flex-col pl-64 w-full h-full gap-4 items-center pb-8 lg:flex">
      <HeaderProjectDetailsLMS
        cohortId={cohortId}
        cohortName={cohortName}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
        headerTitle="Assignment Overview"
        headerDescription="Test your knowledge and skills by completing the assignment below."
      />
      <div className="body-project max-w-[calc(100%-4rem)] w-full flex gap-4 rounded-xl">
        <main className="w-full flex flex-col flex-2">
          <div className="flex flex-col w-full gap-3 p-4 bg-white border rounded-lg">
            <h2 className="project-name font-bodycopy font-bold text-2xl">
              {projectName}
            </h2>
            <div className="project-description flex flex-col gap-1">
              <p className="font-bold font-bodycopy text-[15px]">
                Assignment Brief
              </p>
              <p className="font-bodycopy text-[15px]">{projectDescription}</p>
            </div>
            {projectDocumentURL && (
              <div className="project-document flex flex-col gap-2">
                <p className="font-bold font-bodycopy text-[15px]">
                  Project Document
                </p>
                <FileItemLMS
                  fileName="Project Document"
                  fileURL={projectDocumentURL}
                  variants={getFileVariantFromURL(projectDocumentURL)}
                />
              </div>
            )}
          </div>
        </main>
        <aside className="w-full flex flex-col flex-1">
          <div className="submission-attributes flex flex-col w-full p-4 bg-white border gap-3 rounded-lg">
            <div className="submission-status flex gap-1">
              <div
                className={`flex size-2.5 m-1.5 justify-center items-center rounded-full bg-[#D99E00]`}
              />
              <div className="flex flex-col">
                <p className="font-bold font-bodycopy text-[15px]">Status</p>
                <p className="font-medium font-bodycopy text-sm">
                  Not Submitted
                </p>
              </div>
            </div>
            <div className="submission-deadline-at flex gap-1">
              <div
                className={`flex size-2.5 m-1.5 justify-center items-center rounded-full bg-secondary`}
              />
              <div className="flex flex-col">
                <p className="font-bold font-bodycopy text-[15px]">Due Date</p>
                <p className="font-medium font-bodycopy text-sm">
                  {dayjs(projectDeadline).format("DD MMM YYYY [at] HH:mm")}
                </p>
              </div>
            </div>
            <div className="submission-created-at flex gap-1">
              <div
                className={`flex size-2.5 m-1.5 justify-center items-center rounded-full bg-[#499E95]`}
              />
              <div className="flex flex-col">
                <p className="font-bold font-bodycopy text-[15px]">
                  Submitted at
                </p>
                <p className="font-medium font-bodycopy text-sm">-</p>
                <p className="font-medium font-bodycopy text-sm">
                  {deadlineStatus}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
