"use client";
import { useState, useEffect, FormEvent, useRef } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import UploadFilesCMS from "../fields/UploadFilesCMS";
import RadioBoxCMS from "../fields/RadioBoxCMS";
import { StatusType } from "@/lib/app-types";
import { Switch } from "@/components/ui/switch";
import StatusLabelCMS from "../labels/StatusLabelCMS";

interface EditModuleFormCMSProps {
  sessionToken: string;
  cohortId: number;
  moduleId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditModuleFormCMS({
  sessionToken,
  cohortId,
  moduleId,
  isOpen,
  onClose,
}: EditModuleFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUploadMethod, setSelectedUploadMethod] = useState("");
  const [hasInitializedUploadMethod, setHasInitializedUploadMethod] =
    useState(false);
  const prevUploadMethod = useRef("");
  const editModule = trpc.update.module.useMutation();
  const utils = trpc.useUtils();

  // Return initial data
  const {
    data: initialDataModule,
    isLoading,
    isError,
  } = trpc.read.module.useQuery({ id: moduleId }, { enabled: !!sessionToken });

  // Beginning State
  const [formData, setFormData] = useState<{
    moduleName: string;
    moduleDescription: string;
    moduleURL: string;
    moduleStatus: StatusType;
  }>({
    moduleName: initialDataModule?.module.name || "",
    moduleDescription: initialDataModule?.module.description || "",
    moduleURL: initialDataModule?.module.document_url || "",
    moduleStatus: initialDataModule?.module.status as StatusType,
  });

  // Iterate initial data (so it doesn't get lost)
  useEffect(() => {
    if (!initialDataModule) return;
    const url = initialDataModule.module.document_url || "";
    const isSupabaseFile = url.includes("supabase.co");

    // Set form data (including URL, which was getting cleared before)
    setFormData({
      moduleName: initialDataModule.module.name || "",
      moduleDescription: initialDataModule.module.description || "",
      moduleURL: url,
      moduleStatus: initialDataModule.module.status,
    });

    // Set upload method (auto-select radio)
    setSelectedUploadMethod(isSupabaseFile ? "upload" : "attach");
    setHasInitializedUploadMethod(true);
  }, [initialDataModule]);

  // Reset only if user switched method manually (not first load)
  useEffect(() => {
    if (!hasInitializedUploadMethod) return;
    // Checking previously have method?
    // Checking the method has change now?
    if (
      prevUploadMethod.current &&
      prevUploadMethod.current !== selectedUploadMethod
    ) {
      setFormData((prev) => ({
        ...prev,
        moduleURL: "",
      }));
    }
    prevUploadMethod.current = selectedUploadMethod;
  }, [selectedUploadMethod, hasInitializedUploadMethod]);

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
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    try {
      editModule.mutate(
        {
          // Mandatory fields:
          cohort_id: cohortId,
          id: moduleId,
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
            toast.success("File updated successfully");
            setIsSubmitting(false);
            utils.list.modules.invalidate();
            utils.read.module.invalidate();
            onClose();
          },
          onError: (err) => {
            toast.error(
              "Something went wrong during upload. Please try again!",
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
      sheetName="Edit Module File"
      sheetDescription="Update the document's title, description, or access link to keep your cohort resources up to date."
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading && (
        <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy font-medium">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy font-medium">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {!isLoading && !isError && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
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
              <div className="module-status flex flex-col gap-1">
                <label
                  htmlFor={"module-status"}
                  className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                >
                  Status <span className="text-red-700">*</span>
                </label>
                <div className="switch-button flex pl-1 gap-2">
                  <Switch
                    className="data-[state=checked]:bg-cms-primary"
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
          <div className="sticky bottom-0 w-full p-4 bg-white z-40">
            <AppButton
              className="w-full"
              variant="cmsPrimary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin size-4" />}
              Save Changes
            </AppButton>
          </div>
        </form>
      )}
    </AppSheet>
  );
}
