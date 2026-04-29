"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import TemplateItemCardLMS from "../items/TemplateItemCardLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";
import EmptyComponentsLMS from "../states/EmptyComponentsLMS";
import { TemplateList } from "../tabs/LibraryTabsLMS";

interface LibraryMobileLMSProps extends AvatarBadgeLMSProps {
  templateList: TemplateList[];
  hasTemplateAccess: boolean;
}

export default function LibraryMobileLMS({
  templateList,
  hasTemplateAccess,
  sessionUserName,
  sessionUserAvatar,
}: LibraryMobileLMSProps) {
  const activeTemplates = templateList
    .filter((item) => item.status === "ACTIVE")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
      <div className="header flex items-center justify-between w-full px-5 pt-12 pb-8 bg-tertiary text-white">
        <div className="greeting flex flex-col gap-0.5">
          <p className="font-bodycopy font-bold text-xl">Library</p>
          <p className="font-bodycopy font-medium text-sm text-white/70">
            Business Templates &amp; Resources
          </p>
        </div>
        <div className="avatar aspect-square size-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
          <Image
            src={sessionUserAvatar}
            alt={sessionUserName}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="content flex flex-col gap-4 p-5">
        <h2 className="text-base font-bodycopy font-bold">
          Business Templates
        </h2>
        {hasTemplateAccess ? (
          <div className="template-grid grid grid-cols-2 gap-3">
            {activeTemplates.map((post) => (
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
          <EmptyComponentsLMS variant="TEMPLATES" />
        )}
      </div>

      <BottomNavLMS />
    </div>
  );
}
