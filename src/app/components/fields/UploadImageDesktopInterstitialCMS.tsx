"use client";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UploadImageDesktopInterstitialCMSProps {
  onUpload: (url: string | null) => void;
  value: string;
}

export default function UploadImageDesktopInterstitialCMS(
  props: UploadImageDesktopInterstitialCMSProps
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // State upload to Supabase
  const [loaded, setLoaded] = useState(false); // State rendering in browser

  // Iteration render
  useEffect(() => {
    setLoaded(false);
  }, [props.value]);

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
    if (file?.size > 1024 * 624) {
      toast.error("Image must be smaller than 500 KB");
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
    const filePath = `cohort/${fileName}`;

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
    props.onUpload(null);
  };

  return (
    <div className="upload-file-container flex flex-col gap-1">
      <div
        className="upload-photo-container flex relative aspect-web-popup bg-white w-full h-full border border-dashed border-outline cursor-pointer rounded-md overflow-hidden"
        onClick={handleUploadClick}
      >
        {/* Upload message */}
        {!props.value && (
          <div className="upload-helper flex flex-col w-full font-bodycopy items-center text-center justify-center text-black z-10">
            <div className="flex max-w-[86px] aspect-square">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//upload-image-icon.svg"
                }
                alt="Upload File"
                width={200}
                height={200}
              />
            </div>
            <div className="flex flex-col max-w-[300px]">
              <p className="text-sm font-bold">
                Upload Thumbnail Image{" "}
                <span className="text-destructive">*</span>
              </p>
              <p className="text-sm font-medium text-black/50">
                Upload a 1700x1000 px image and keep it under 500 KB
              </p>
            </div>
          </div>
        )}

        {/* Display image */}
        {props.value && (
          <div className="absolute inset-0 z-0">
            <Image
              className={`object-cover w-full h-full transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              src={props.value}
              alt="Avatar"
              width={400}
              height={400}
              onLoadingComplete={() => setLoaded(true)}
            />
          </div>
        )}

        {/* Remove photo button */}
        {props.value && !isUploading && (
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
      <div className="flex items-center justify-between font-bodycopy font-medium text-sm text-alternative">
        <p>Supported Formats: JPG, JPEG, PNG, WEBP, AVIF</p>
      </div>
    </div>
  );
}
