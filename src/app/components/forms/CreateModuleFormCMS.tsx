"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import UploadFilesCMS from "../fields/UploadFilesCMS";
import RadioBoxCMS from "../fields/RadioBoxCMS";

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

  // --- Beginning State
  const [formData, setFormData] = useState<{
    moduleName: string;
    moduleDescription: string;
    moduleURL: string;
  }>({
    moduleName: "",
    moduleDescription: "",
    moduleURL: "",
  });

  // --- Reset moduleURL every time upload method is changed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      moduleURL: "",
    }));
  }, [selectedUploadMethod]);

  // --- Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // --- Handle data changes
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // --- Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // -- Required field checking
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

    // -- POST to Database
    try {
      createModule.mutate(
        {
          // Mandatory fields:
          cohort_id: cohortId,
          name: formData.moduleName.trim(),
          status: "ACTIVE",
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
      sheetName="Add Learning Kit"
      sheetDescription="Upload essential learning documents to support this cohort"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-68 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <InputCMS
              inputId="module-name"
              inputName="Document Title"
              inputType="text"
              inputPlaceholder="e.g. Curriculum Brief"
              value={formData.moduleName}
              onInputChange={handleInputChange("moduleName")}
              required
            />
            <TextAreaCMS
              textAreaId="module-description"
              textAreaName="Description"
              textAreaPlaceholder="Briefly describe the content or purpose of this document (optional)"
              textAreaHeight="h-20"
              value={formData.moduleDescription}
              onInputChange={handleInputChange("moduleDescription")}
            />
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex flex-col">
                <h3 className="font-bold font-brand">Upload Document</h3>
                <p className="font-bodycopy font-medium text-sm text-alternative">
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
                <InputCMS
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
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
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
