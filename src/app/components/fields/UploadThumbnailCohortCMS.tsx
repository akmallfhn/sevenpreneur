"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ImageUp, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";

interface UploadThumbnailCohortCMSProps {
  onUpload: (url: string | null) => void;
  value?: string;
}

export default function UploadThumbnailCohortCMS({
  onUpload,
  value,
}: UploadThumbnailCohortCMSProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // -- State upload to Supabase
  const [isImageLoaded, setIsImageLoaded] = useState(false); // -- State render image
  const defaultThumbnail =
    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//business-pattern.webp";
  const [imageUrl, setImageUrl] = useState(value || defaultThumbnail);

  // --- Image Iteration when changed
  useEffect(() => {
    if (value) {
      setImageUrl(value);
    } else {
      setImageUrl(defaultThumbnail);
    }
  }, [value]);

  // --- Iteration for render image
  useEffect(() => {
    setIsImageLoaded(false);
  }, [imageUrl]);

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
    const filePath = `cohort/${fileName}`;

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
    setImageUrl(defaultThumbnail);
    onUpload(null);
  };

  return (
    <div
      className="upload-photo-container flex relative aspect-thumbnail w-full h-full border border-outline cursor-pointer rounded-md overflow-hidden"
      onClick={handleUploadClick}
    >
      {/* --- Upload message */}
      {imageUrl === defaultThumbnail && (
        <div className="upload-helper flex flex-col w-full font-bodycopy items-center text-center justify-center text-black z-10">
          <FontAwesomeIcon
            icon={faImage}
            size="2x"
            className="text-alternative w-20"
          />
          <div className="flex flex-col max-w-[300px]">
            <p className="text-sm font-bold">
              Upload Thumbnail Image <span className="text-destructive">*</span>
            </p>
            <p className="text-sm font-medium text-black/50">
              Upload a 1200x800 px image and keep it under 2 MB
            </p>
          </div>
        </div>
      )}

      {/* --- Display image */}
      <div className="absolute inset-0 z-0">
        <Image
          className="object-cover w-full h-full"
          src={imageUrl}
          alt="Avatar"
          width={400}
          height={400}
          onLoadingComplete={() => setIsImageLoaded(true)}
        />
      </div>

      {/* --- Remove photo button */}
      {imageUrl !== defaultThumbnail && isImageLoaded && !isUploading && (
        <div
          className="remove-photo absolute right-2 top-2 p-1 bg-semi-destructive rounded-full cursor-pointer z-20"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImage();
          }}
        >
          <X className="size-4 text-destructive" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.avif"
        className="hidden"
        onChange={handleUploadFiles}
      />
    </div>
  );
}
