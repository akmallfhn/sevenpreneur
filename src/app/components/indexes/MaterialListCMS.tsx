"use client";
import { Loader2, Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import FileItemCMS from "../items/FileItemCMS";
import { trpc } from "@/trpc/client";
import { getFileVariantFromURL } from "@/lib/file-variants";
import React, { useState } from "react";
import CreateMaterialFormCMS from "../forms/CreateMaterialFormCMS";

interface MaterialListCMSProps {
  sessionToken: string;
  learningId: number;
}

export default function MaterialListCMS({
  sessionToken,
  learningId,
}: MaterialListCMSProps) {
  const [createMaterial, setCreateMaterial] = useState(false);
  const utils = trpc.useUtils();

  // --- Call data from tRPC
  const {
    data: materialListData,
    isError: isErrorMaterialList,
    isLoading: isLoadingMaterialList,
  } = trpc.list.materials.useQuery(
    { learning_id: learningId },
    { enabled: !!sessionToken }
  );

  // --- Extract variable
  const isLoading = isLoadingMaterialList;
  const isError = isErrorMaterialList;
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
      <div className="materials flex flex-col gap-3 p-3 bg-section-background rounded-md">
        <div className="section-name flex justify-between items-center">
          <h2 className="label-name font-brand font-bold">
            Learning Materials
          </h2>
          <AppButton
            variant="outline"
            size="small"
            onClick={() => setCreateMaterial(true)}
          >
            <Plus className="size-4" />
            Add file
          </AppButton>
        </div>
        {(!materialListData?.list || materialListData.list.length === 0) && (
          <div className="flex w-full h-full items-center justify-center p-5 text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {materialListData?.list.some((post) => post.id) && (
          <div className="material-list flex flex-col gap-2">
            {materialListData?.list.map((post, index) => (
              <FileItemCMS
                key={index}
                sessionToken={sessionToken}
                learningId={learningId}
                fileId={post.id}
                fileName={post.name}
                fileURL={post.document_url}
                variants={getFileVariantFromURL(post.document_url)}
                onDeleteSuccess={() => utils.list.materials.invalidate()}
              />
            ))}
          </div>
        )}
        {/* <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
        Load more
      </p> */}
      </div>

      {/* --- Form Create Material */}
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
