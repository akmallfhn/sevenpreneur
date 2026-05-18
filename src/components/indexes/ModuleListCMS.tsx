"use client";
import { trpc } from "@/trpc/client";
import { Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import FileItemCMS from "../items/FileItemCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface ModuleListCMSProps {
  sessionToken: string;
  sessionUserRoleName: string;
  cohortId: number;
  onClickAdd?: () => void;
}

export default function ModuleListCMS({
  sessionToken,
  sessionUserRoleName,
  cohortId,
  onClickAdd,
}: ModuleListCMSProps) {
  const utils = trpc.useUtils();

  const isAllowedCreate = [
    "Administrator",
    "Super Admin",
    "Class Manager",
  ].includes(sessionUserRoleName);

  const { data, isLoading } = trpc.list.modules.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  return (
    <SectionContainerCMS
      title="Modules"
      headerAction={
        isAllowedCreate && onClickAdd ? (
          <AppButton
            variant="neutral"
            size="small"
            onClick={onClickAdd}
          >
            <Plus className="size-3.5" />
            Add
          </AppButton>
        ) : undefined
      }
    >
      {isLoading ? (
        <AppLoadingComponents />
      ) : (data?.list ?? []).length > 0 ? (
        <div className="flex flex-col gap-2">
          {data?.list.map((post) => (
            <FileItemCMS
              key={post.id}
              sessionToken={sessionToken}
              sessionUserRoleName={sessionUserRoleName}
              cohortId={cohortId}
              fileId={post.id}
              fileName={post.name}
              fileURL={post.document_url}
              onDeleteSuccess={() => utils.list.modules.invalidate()}
            />
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-center text-emphasis font-bodycopy py-2">
          No modules yet
        </p>
      )}
    </SectionContainerCMS>
  );
}
