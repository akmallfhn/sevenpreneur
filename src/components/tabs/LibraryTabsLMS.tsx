"use client";
import { StatusType } from "@/lib/app-types";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import TemplateItemCardLMS from "../items/TemplateItemCardLMS";
import EmptyComponentsLMS from "../states/EmptyComponentsLMS";

export interface TemplateList {
  id: number;
  name: string;
  image: string;
  document_url: string;
  tags: string;
  status: StatusType;
}

interface LibraryTabsLMSProps {
  templateList: TemplateList[];
  hasTemplateAccess: boolean;
}

export default function LibraryTabsLMS(props: LibraryTabsLMSProps) {
  const [activeTab, setActiveTab] = useState("templates");

  const tabOptions = [
    {
      id: "templates",
      label: "Business Templates",
      icon: <></>,
    },
  ];

  const activeTemplates = props.templateList.filter(
    (item) => item.status === "ACTIVE"
  );

  return (
    <div className="cohort-tabs flex flex-col w-full gap-3 overflow-hidden">
      <div className="tab-options flex gap-4">
        {tabOptions.map((post) => (
          <AppButton
            key={post.id}
            className="tab-item"
            size="mediumRounded"
            variant={activeTab === post.id ? "primary" : "primarySoft"}
            onClick={() => setActiveTab(post.id)}
          >
            {post.icon}
            {post.label}
          </AppButton>
        ))}
      </div>

      {activeTab === "templates" && (
        <div className="tab-area w-full p-5 bg-white rounded-lg border">
          {props.hasTemplateAccess ? (
            <div className="template-list grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
              {activeTemplates
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((post) => (
                  <TemplateItemCardLMS
                    key={post.id}
                    templateName={post.name}
                    templateTags={post.tags ?? ""}
                    templateImage={post.image}
                    templateURL={post.document_url}
                  />
                ))}
            </div>
          ) : (
            <div className="flex w-full min-h-96 items-center p-4">
              <EmptyComponentsLMS variant="TEMPLATES" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
