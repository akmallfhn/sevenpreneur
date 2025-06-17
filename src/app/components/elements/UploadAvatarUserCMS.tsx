"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AppButton from "./AppButton";
import { supabase } from "@/lib/supabase";
import { ImagePlusIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UploadAvatarUserCMS {
  onUpload: (url: string | null) => void;
  value?: string;
}

export default function UploadAvatarUserCMS({
  onUpload,
  value,
}: UploadAvatarUserCMS) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const defaultAvatar =
    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";
  const [imageUrl, setImageUrl] = useState(value || defaultAvatar);

  // --- Avatar Iteration when changed
  useEffect(() => {
    if (value) {
      setImageUrl(value);
    } else {
      setImageUrl(defaultAvatar);
    }
  }, [value]);

  // --- Trigger input via button
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // --- Define format that allowed
  const allowedFormat = ["image/jpeg", "image/png", "image/webp", "image/avif"];

  // --- Upload File to Supabase
  const handleUploadFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // -- File validation
    if (!file) return;
    if (file?.size < 1) return;
    if (file?.size > 1024 * 1024) {
      toast.error("Image must be smaller than 1MB");
      return;
    }
    if (!allowedFormat.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, or AVIF images are allowed");
      return;
    }

    // -- Create unique name and extra validation on format
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      toast.error("Invalid file extension. Please use a valid image format.");
      return;
    }
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // -- Upload to Supabase
    try {
      setIsUploading(true);
      const { data: uploadData, error: uploadError } = await supabase.storage
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
        onUpload(publicUrlData.publicUrl);
      }
    } catch (error) {
      toast.error("Error", { description: `${error}` });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Remove image
  const handleRemoveImage = () => {
    setImageUrl(defaultAvatar);
    onUpload(null);
  };

  return (
    <div className="flex items-center gap-5">
      <div className="size-32 border border-outline aspect-square rounded-full overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={imageUrl}
          alt="Avatar"
          width={400}
          height={400}
        />
      </div>
      <div className="flex flex-col gap-2">
        {/* --- Label */}
        <label
          htmlFor={"status"}
          className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
        >
          Avatar
        </label>
        <div className="w-fit flex items-center gap-2">
          {/* --- Upload/change button */}
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
                Uploading
              </>
            ) : (
              <>
                <ImagePlusIcon className="size-4" />
                {imageUrl !== defaultAvatar
                  ? "Change image"
                  : "Upload an image"}
              </>
            )}
          </AppButton>
          {/* --- Remove Button */}
          {imageUrl !== defaultAvatar && (
            <AppButton
              onClick={handleRemoveImage}
              variant="semiDestructive"
              size="small"
              type="button"
            >
              Remove
            </AppButton>
          )}
        </div>
        <p className="text-alternative text-[13px] font-medium font-bodycopy">
          Avatar must be square (1:1) and no larger than 1MB.
        </p>

        {/* --- Hidden input placeholder */}
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
