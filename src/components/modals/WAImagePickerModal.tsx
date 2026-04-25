"use client";
import { supabase } from "@/lib/supabase";
import { trpc } from "@/trpc/client";
import { ArrowLeft, ArrowUp, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface WAImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (image_url: string, caption: string) => void;
  isLoading: boolean;
}

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];
const MAX_BYTES = 5 * 1024 * 1024;

export default function WAImagePickerModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: WAImagePickerModalProps) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const createAsset = trpc.create.wa.asset.useMutation();

  const { data, isLoading: isFetchingAssets } = trpc.list.wa.assets.useQuery(
    { type: "IMAGE" },
    { enabled: isOpen }
  );

  // Block scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedUrl(null);
    setCaption("");
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedUrl || isLoading) return;
    onSubmit(selectedUrl, caption.trim());
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    if (!ALLOWED_FORMATS.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP, or AVIF images are allowed");
      return;
    }
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      toast.error("Invalid file extension");
      return;
    }

    const filePath = `whatsapp/images/${Date.now()}.${fileExt}`;

    try {
      setIsUploading(true);
      const { error: uploadError } = await supabase.storage
        .from("sevenpreneur")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        toast.error("Failed to upload image");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("sevenpreneur")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      if (!publicUrl) {
        toast.error("Failed to get image URL");
        return;
      }

      createAsset.mutate(
        { url: publicUrl, type: "IMAGE" },
        {
          onSuccess: () => {
            utils.list.wa.assets.invalidate({ type: "IMAGE" });
            setSelectedUrl(publicUrl);
          },
          onError: () => toast.error("Failed to save image to assets"),
        }
      );
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div
      className="modal-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]"
      onClick={handleClose}
    >
      <div
        className="modal-container fixed flex flex-col bg-white w-full max-w-lg max-h-[80vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bodycopy font-bold text-sm">
            {selectedUrl ? "Add Caption" : "Choose Image"}
          </h2>
          <AppButton
            size="icon"
            variant="ghost"
            type="button"
            onClick={handleClose}
          >
            <X className="size-5" />
          </AppButton>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {!selectedUrl ? (
            <div className="p-4">
              {isFetchingAssets && <AppLoadingComponents />}
              {!isFetchingAssets && !data?.list.length && (
                <p className="font-bodycopy text-center text-sm text-emphasis py-10">
                  No images available
                </p>
              )}
              {!isFetchingAssets && !!data?.list.length && (
                <div className="grid grid-cols-3 gap-2">
                  {data.list.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      className="relative aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                      onClick={() => setSelectedUrl(asset.url)}
                    >
                      <Image
                        src={asset.url}
                        alt={asset.file_name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 p-5">
              <div className="relative w-full aspect-video rounded-md overflow-hidden bg-surface-black">
                <Image
                  src={selectedUrl}
                  alt="Selected image"
                  fill
                  className="object-contain"
                />
              </div>
              <TextAreaCMS
                textAreaId="wa-image-caption"
                textAreaPlaceholder="Add a caption (optional)"
                textAreaHeight="min-h-20"
                value={caption}
                onTextAreaChange={(val) => setCaption(val)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t">
          <div>
            {!selectedUrl ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.avif"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <AppButton
                  type="button"
                  variant="light"
                  size="small"
                  disabled={isUploading}
                  onClick={handleUploadClick}
                >
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Upload className="size-4" /> Upload
                    </>
                  )}
                </AppButton>
              </>
            ) : (
              <AppButton
                className="w-fit"
                type="button"
                size="small"
                variant="light"
                onClick={() => setSelectedUrl(null)}
              >
                <ArrowLeft className="size-4" /> Choose another image
              </AppButton>
            )}
          </div>
          {selectedUrl && (
            <AppButton
              type="button"
              size="iconRounded"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
}
