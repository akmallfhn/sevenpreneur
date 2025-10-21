"use client";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import FileResultUploadingCMS from "../items/FileResultUploadingCMS";
import AppButton from "../buttons/AppButton";
import Image from "next/image";
import { getFileVariantFromURL } from "@/lib/file-variants";
import { FileVariant } from "@/lib/app-types";

interface UploadFilesCMSProps {
  onUpload: (url: string | null) => void;
  value?: string;
}

export default function UploadSubmissionLMS({
  onUpload,
  value,
}: UploadFilesCMSProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Trigger input via button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Define format that allowed
  const allowedFormat = ["application/pdf"];

  // Upload File to Supabase
  const handleUploadFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // File validation
    if (!file) return;
    setSelectedFileName(file.name);
    if (file?.size < 1) return;
    if (file?.size > 1024 * 1024 * 50) {
      toast.error("File must be smaller than 5MB");
      return;
    }
    if (!allowedFormat.includes(file.type)) {
      toast.error("Only PDF File are allowed");
      return;
    }

    // Create unique name and extra validation on format
    const allowedExtensions = ["pdf"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      toast.error("Invalid file extension. Please use a valid file format.");
      return;
    }
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    // Upload Simulation
    let progressSteps = [0, 30, 60, 80];
    let currentStep = 0;

    setIsUploading(true);
    setUploadProgress(0);

    const fakeProgressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        setUploadProgress(progressSteps[currentStep]);
        currentStep++;
      } else {
        clearInterval(fakeProgressInterval);
      }
    }, 300);

    // Upload to Supabase
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("sevenpreneur")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) {
        console.error("Upload Error:", uploadError.message);
        toast.error("Failed to upload document. Please try again.");
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("sevenpreneur")
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        onUpload(publicUrlData.publicUrl);
      }
    } catch (error) {
      toast.error("Error", { description: `${error}` });
    } finally {
      setUploadProgress(100);
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // Remove image
  const handleRemoveFile = () => {
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <React.Fragment>
      <div className="upload-file-container flex flex-col w-full gap-1 transform transition">
        <div
          className="upload-helper flex relative aspect-thumbnail w-full h-full border-[1.9px] border-dashed border-outline cursor-pointer rounded-md overflow-hidden"
          onClick={handleUploadClick}
        >
          <div className=" flex flex-col w-full font-bodycopy items-center text-center justify-center text-black z-10">
            <div className="flex max-w-[86px] aspect-square">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//upload-file-icon.svg"
                }
                alt="Upload File"
                width={200}
                height={200}
              />
            </div>
            <div className="flex flex-col max-w-[300px] gap-2">
              <p className="text-sm font-bold">
                Upload File From Device{" "}
                <span className="text-destructive">*</span>
              </p>
              <AppButton variant="cmsPrimaryLight" size="small" type="button">
                Choose File
              </AppButton>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            key={value || "empty"}
            accept=".pdf"
            className="hidden"
            onChange={handleUploadFiles}
          />
        </div>
        <div className="flex items-center justify-between font-bodycopy font-medium text-sm text-alternative">
          <p>Supported Formats: PDF</p>
          <p>Maximum Size: 50MB</p>
        </div>
      </div>

      {/* Result File */}
      {(isUploading || value) && (
        <div className="relative text-xs text-green-700 mt-2 break-all">
          <FileResultUploadingCMS
            fileName={selectedFileName || "Project Submission"}
            fileURL={value || ""}
            variants={getFileVariantFromURL(value || "") as FileVariant}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          {/* Button Remove */}
          <div
            className="remove-file absolute -right-2 -top-2 p-1 bg-semi-destructive rounded-full cursor-pointer z-20"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
          >
            <X className="size-4 text-destructive" />
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
