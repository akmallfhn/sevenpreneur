"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { supabase } from "@/lib/supabase";
import { ImagePlusIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface UploadAvatarUserLMSProps {
  fileValue: string | null;
  fileBytes: number;
  fileSize: string;
  folderPath: string;
  onUpload: (url: string | null) => void;
}

export default function UploadAvatarUserLMS(props: UploadAvatarUserLMSProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // State upload to Supabase
  const defaultAvatar =
    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";
  const [imageUrl, setImageUrl] = useState(props.fileValue || defaultAvatar); // State rendering in browser

  // Avatar Iteration when changed
  useEffect(() => {
    if (props.fileValue) {
      setImageUrl(props.fileValue);
    } else {
      setImageUrl(defaultAvatar);
    }
  }, [props.fileValue]);

  // Trigger input via button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Define format that allowed
  const allowedFormat = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  // Upload File to Supabase
  const handleUploadFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // File validation
    if (!file) return;
    if (file?.size < 1) return;
    if (file?.size > props.fileBytes) {
      toast.error(`Image must be smaller than ${props.fileBytes}`);
      return;
    }
    if (!allowedFormat.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, or AVIF images are allowed");
      return;
    }

    // Create unique name and extra validation on format
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      toast.error("Invalid file extension. Please use a valid image format.");
      return;
    }
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${props.folderPath}/${fileName}`;

    // Upload to Supabase
    try {
      setIsUploading(true);
      const { error: uploadError } = await supabase.storage
        .from("sevenpreneur")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (uploadError) {
        console.error("Upload Error:", uploadError.message);
        toast.error("Failed to upload image. Please try again.");
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("sevenpreneur")
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        setImageUrl(publicUrlData.publicUrl);
        props.onUpload(publicUrlData.publicUrl);
      }
    } catch (error) {
      toast.error("Error", { description: `${error}` });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageUrl(defaultAvatar);
    props.onUpload(null);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="display-avatar size-32 bg-[#0079D5] outline-4 outline-white aspect-square rounded-lg overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={imageUrl}
          alt="Avatar"
          width={400}
          height={400}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-fit flex flex-col gap-2">
          <AppButton
            onClick={handleUploadClick}
            variant="outline"
            size="small"
            type="button"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin size-4" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlusIcon className="size-4" />
                {imageUrl !== defaultAvatar
                  ? "Change image"
                  : "Upload new image"}
              </>
            )}
          </AppButton>

          {/* Remove Photo */}
          {!isUploading && imageUrl !== defaultAvatar && (
            <AppButton
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              variant="destructiveSoft"
              size="small"
              type="button"
            >
              <Trash2 className="size-4" />
              Delete current image
            </AppButton>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.avif"
          className="hidden"
          onChange={handleUploadFiles}
        />
      </div>
    </div>
  );
}
