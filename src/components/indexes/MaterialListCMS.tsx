"use client";
import { Loader2, Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import FileItemCMS from "../items/FileItemCMS";
import { trpc } from "@/trpc/client";
import React, { useState } from "react";
import CreateMaterialFormCMS from "../forms/CreateMaterialFormCMS";

interface MaterialListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  learningId: number;
}

export default function MaterialListCMS({
  sessionToken,
  sessionUserRole,
  learningId,
}: MaterialListCMSProps) {
  const utils = trpc.useUtils();
  const [createMaterial, setCreateMaterial] = useState(false);

  const allowedRolesCreateMaterial = [0, 2];
  const allowedRolesListMaterial = [0, 1, 2, 3];
  const isAllowedCreateMaterial =
    allowedRolesCreateMaterial.includes(sessionUserRole);
  const isAllowedListMaterial =
    allowedRolesListMaterial.includes(sessionUserRole);

  // Fetch tRPC data
  const {
    data: materialListData,
    isError,
    isLoading,
  } = trpc.list.materials.useQuery(
    { learning_id: learningId },
    { enabled: !!sessionToken }
  );

  if (!isAllowedListMaterial) return;

  return (
    <React.Fragment>
      <div className="materials flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">
            Learning Materials
          </h2>
          {isAllowedCreateMaterial && (
            <AppButton
              variant="outline"
              size="small"
              onClick={() => setCreateMaterial(true)}
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
          <div className="flex w-full h-full items-center py-5 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {(materialListData?.list ?? []).length > 0 ? (
              <div className="material-list flex flex-col gap-2">
                {materialListData?.list.map((post, index) => (
                  <FileItemCMS
                    key={index}
                    sessionToken={sessionToken}
                    sessionUserRole={sessionUserRole}
                    learningId={learningId}
                    fileId={post.id}
                    fileName={post.name}
                    fileURL={post.document_url}
                    onDeleteSuccess={() => utils.list.materials.invalidate()}
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

      {/* Create Material */}
      {createMaterial && (
        <CreateMaterialFormCMS
          learningId={learningId}
          isOpen={createMaterial}
          onClose={() => setCreateMaterial(false)}
        />
      )}
    </React.Fragment>
  );
}
