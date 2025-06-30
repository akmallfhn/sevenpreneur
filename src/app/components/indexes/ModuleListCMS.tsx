import { Loader2, Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import FileItemCMS from "../items/FileItemCMS";
import { trpc } from "@/trpc/client";
import { getFileVariantFromURL } from "@/lib/file-variants";
import React, { useState } from "react";
import CreateModuleFormCMS from "../forms/CreateModuleFormCMS";

interface ModuleListCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function ModuleListCMS({
  sessionToken,
  cohortId,
}: ModuleListCMSProps) {
  const [createModule, setCreateModule] = useState(false);
  const utils = trpc.useUtils();

  // --- Call data from tRPC
  const {
    data: moduleListData,
    isError: isErrorModuleList,
    isLoading: isLoadingModuleList,
  } = trpc.list.modules.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  // --- Extract variable
  const isLoading = isLoadingModuleList;
  const isError = isErrorModuleList;
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="modules flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">Learning Kit</h2>
          <AppButton
            variant="outline"
            size="small"
            onClick={() => setCreateModule(true)}
          >
            <Plus className="size-4" />
            Add file
          </AppButton>
        </div>
        {(!moduleListData?.list || moduleListData.list.length === 0) && (
          <div className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {moduleListData?.list.some((post) => post.id) && (
          <div className="module-list flex flex-col gap-2">
            {moduleListData?.list.map((post, index) => (
              <FileItemCMS
                key={index}
                sessionToken={sessionToken}
                cohortId={cohortId}
                fileId={post.id}
                fileName={post.name}
                fileURL={post.document_url}
                variants={getFileVariantFromURL(post.document_url)}
                onDeleteSuccess={() => utils.list.modules.invalidate()}
              />
            ))}
          </div>
        )}
        {/* <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
        Load more
      </p> */}
      </div>

      {/* --- Form Create Module */}
      {createModule && (
        <CreateModuleFormCMS
          cohortId={cohortId}
          isOpen={createModule}
          onClose={() => setCreateModule(false)}
        />
      )}
    </React.Fragment>
  );
}
