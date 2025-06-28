"use client";
import { Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import ProjectItemCMS from "../items/ProjectItemCMS";

export default function ProjectListCMS() {
  return (
    <div className="projects flex flex-col gap-3 p-3 bg-section-background rounded-md">
      <div className="section-name flex justify-between items-center">
        <h2 className="label-name font-brand font-bold">Projects</h2>
        <AppButton variant="outline" size="small">
          <Plus className="size-4" />
          Add projects
        </AppButton>
      </div>
      <div className="project-list flex flex-col gap-2">
        <ProjectItemCMS
          projectName="Business Model Canvas 3.0"
          lastSubmission="2025-06-02 02:00:00+00"
        />
        <ProjectItemCMS
          projectName="Business Model Canvas 3.0"
          lastSubmission="2025-06-02 02:00:00+00"
        />
      </div>
    </div>
  );
}
