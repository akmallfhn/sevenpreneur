"use client";
import { Switch } from "@/components/ui/switch";
import { StatusType } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppInput from "../fields/AppInput";
import RadioBoxCMS from "../fields/RadioBoxCMS";
import AppTextArea from "../fields/AppTextArea";
import UploadFilesCMS from "../fields/UploadFilesCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppSheet from "../modals/AppSheet";

interface CreateModuleFormCMSProps {
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModuleFormCMS({
  cohortId,
  isOpen,
  onClose,
}: CreateModuleFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUploadMethod, setSelectedUploadMethod] = useState("");
  const createModule = trpc.create.module.useMutation();
  const utils = trpc.useUtils();

  // Beginning State
  const [formData, setFormData] = useState<{
    moduleName: string;
    moduleDescription: string;
    moduleURL: string;
    moduleStatus: StatusType;
  }>({
    moduleName: "",
    moduleDescription: "",
    moduleURL: "",
    moduleStatus: "ACTIVE",
  });

  // Reset moduleURL every time upload method is changed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      moduleURL: "",
    }));
  }, [selectedUploadMethod]);

  // Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required field checking
    if (!formData.moduleName) {
      toast.error("Let’s give this document a proper title before saving.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.moduleURL) {
      toast.error("Please attach a file before submitting.");
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      createModule.mutate(
        {
          // Mandatory fields:
          cohort_id: cohortId,
          name: formData.moduleName.trim(),
          status: formData.moduleStatus,
          document_url: formData.moduleURL,

          // Optional fields:
          description: formData.moduleDescription.trim()
            ? formData.moduleDescription
            : null,
        },
        {
          onSuccess: () => {
            toast.success("File uploaded successfully");
            setIsSubmitting(false);
            utils.list.modules.invalidate();
            onClose();
          },
          onError: (err) => {
            toast.error(
              "Something went wrong during upload. Please try again.",
              {
                description: err.message,
              }
            );
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Add Module File"
      sheetDescription="Upload essential learning documents to support this cohort"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <AppInput variant="CMS"
              inputId="module-name"
              inputName="Document Title"
              inputType="text"
              inputPlaceholder="e.g. Curriculum Brief"
              value={formData.moduleName}
              onInputChange={handleInputChange("moduleName")}
              required
            />
            <AppTextArea variant="CMS"
              textAreaId="module-description"
              textAreaName="Description"
              textAreaPlaceholder="Briefly describe the content or purpose of this document (optional)"
              textAreaHeight="h-20"
              value={formData.moduleDescription}
              onTextAreaChange={handleInputChange("moduleDescription")}
            />
            <div className="module-status flex flex-col gap-1">
              <label
                htmlFor={"module-status"}
                className="flex pl-1 gap-0.5 text-sm text-foreground font-bodycopy font-semibold"
              >
                Status <span className="text-red-700">*</span>
              </label>
              <div className="switch-button flex pl-1 gap-2">
                <Switch
                  className="data-[state=checked]:bg-tertiary"
                  checked={formData.moduleStatus === "ACTIVE"}
                  onCheckedChange={(checked) =>
                    handleInputChange("moduleStatus")(
                      checked ? "ACTIVE" : "INACTIVE"
                    )
                  }
                />
                {formData.moduleStatus && (
                  <StatusLabelCMS variants={formData.moduleStatus} />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col">
                <h3 className="font-bold font-brand">Upload Document</h3>
                <p className="font-bodycopy font-medium text-sm text-emphasis">
                  Choose how you’d like to add the document
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <RadioBoxCMS
                  radioName="Document Link (Recommended)"
                  radioDescription="Provide a public URL to the document"
                  value="attach"
                  selectedValue={selectedUploadMethod}
                  onChange={setSelectedUploadMethod}
                />
                <RadioBoxCMS
                  radioName="Upload File From Device"
                  radioDescription="Upload a single PDF file, no larger than 5MB."
                  value="upload"
                  selectedValue={selectedUploadMethod}
                  onChange={setSelectedUploadMethod}
                />
              </div>
              {selectedUploadMethod === "attach" && (
                <AppInput variant="CMS"
                  inputId="learning-name"
                  inputName="Document Link"
                  inputType="url"
                  inputPlaceholder="Paste the document’s shareable link here"
                  value={formData.moduleURL}
                  onInputChange={handleInputChange("moduleURL")}
                  characterLength={1000}
                  required
                />
              )}
              {selectedUploadMethod === "upload" && (
                <UploadFilesCMS
                  value={formData.moduleURL}
                  onUpload={handleInputChange("moduleURL")}
                />
              )}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-sb-bg z-40">
          <AppButton
            className="w-full"
            variant="tertiary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Add File
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
