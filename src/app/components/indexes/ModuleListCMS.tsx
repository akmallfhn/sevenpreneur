import { Loader2, Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import FileItemCMS from "../items/FileItemCMS";
import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import CreateModuleFormCMS from "../forms/CreateModuleFormCMS";

interface ModuleListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function ModuleListCMS({
  sessionToken,
  sessionUserRole,
  cohortId,
}: ModuleListCMSProps) {
  const utils = trpc.useUtils();
  const [createModule, setCreateModule] = useState(false);

  const allowedRolesCreateModule = [0, 2];
  const allowedRolesListModule = [0, 1, 2, 3];
  const isAllowedCreateModule =
    allowedRolesCreateModule.includes(sessionUserRole);
  const isAllowedListModule = allowedRolesListModule.includes(sessionUserRole);

  // Fetch tRPC Data
  const {
    data: moduleListData,
    isError,
    isLoading,
  } = trpc.list.modules.useQuery(
    { cohort_id: cohortId },
    { enabled: !!sessionToken }
  );

  if (!isAllowedListModule) return;

  return (
    <React.Fragment>
      <div className="modules flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">Module File</h2>
          {isAllowedCreateModule && (
            <AppButton
              variant="outline"
              size="small"
              onClick={() => setCreateModule(true)}
            >
              <Plus className="size-4" />
              Add file
            </AppButton>
          )}
        </div>

        {isLoading && (
          <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <p className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </p>
        )}

        {!isLoading && !isError && (
          <>
            {(moduleListData?.list ?? []).length > 0 ? (
              <div className="module-list flex flex-col gap-2">
                {moduleListData?.list.map((post) => (
                  <FileItemCMS
                    key={post.id}
                    sessionToken={sessionToken}
                    sessionUserRole={sessionUserRole}
                    cohortId={cohortId}
                    fileId={post.id}
                    fileName={post.name}
                    fileURL={post.document_url}
                    onDeleteSuccess={() => utils.list.modules.invalidate()}
                  />
                ))}
              </div>
            ) : (
              <p className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
                No Data
              </p>
            )}
          </>
        )}
      </div>

      {/* Form Create Module */}
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
