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
import dayjs from "dayjs";

interface EditProjectFormCMSProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProjectFormCMS({
  projectId,
  isOpen,
  onClose,
}: EditProjectFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUploadMethod, setSelectedUploadMethod] = useState("");
  const prevUploadMethod = useRef("");
  const isFirstLoad = useRef(true);
  const editProject = trpc.update.project.useMutation();
  const utils = trpc.useUtils();

  const { data, isLoading, isError } = trpc.read.project.useQuery({
    id: projectId,
  });
  const initialData = data?.project;

  // Beginning State
  const [formData, setFormData] = useState<{
    projectName: string;
    projectDescription: string;
    projectDeadline: string;
    projectURL: string;
  }>({
    projectName: initialData?.name.trim() ? initialData.name : "",
    projectDescription: initialData?.description.trim()
      ? initialData.description
      : "",
    projectDeadline: initialData?.deadline_at.trim()
      ? dayjs(initialData.deadline_at).format("YYYY-MM-DDTHH:mm")
      : "",
    projectURL: initialData?.document_url?.trim()
      ? initialData?.document_url
      : "",
  });

  // Update formData if initialData changes
  useEffect(() => {
    if (!initialData) return;
    const url = initialData.document_url || "";
    const isSupabaseFile = url.includes("supabase.co");

    if (initialData) {
      setFormData({
        projectName: initialData?.name.trim() ? initialData.name : "",
        projectDescription: initialData?.description.trim()
          ? initialData.description
          : "",
        projectDeadline: initialData?.deadline_at.trim()
          ? dayjs(initialData.deadline_at).format("YYYY-MM-DDTHH:mm")
          : "",
        projectURL: initialData?.document_url?.trim()
          ? initialData?.document_url
          : "",
      });
    }

    if (url) {
      setSelectedUploadMethod(isSupabaseFile ? "upload" : "attach");
    } else {
      setSelectedUploadMethod("");
    }
    isFirstLoad.current = true;
  }, [initialData]);

  // Reset URL if upload method changed (except on first load)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else if (
      prevUploadMethod.current &&
      prevUploadMethod.current !== selectedUploadMethod
    ) {
      setFormData((prev) => ({
        ...prev,
        projectURL: "",
      }));
    }
    prevUploadMethod.current = selectedUploadMethod;
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

    // Required field checking
    if (!formData.projectName) {
      toast.error("Please provide a title for this project");
      setIsSubmitting(false);
      return;
    }
    if (!formData.projectDescription) {
      toast.error(
        "Add a brief to help participants understand the project’s objective"
      );
      setIsSubmitting(false);
      return;
    }
    if (!formData.projectDeadline) {
      toast.error(
        "Set a submission deadline so participants know when to deliver"
      );
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      editProject.mutate(
        {
          // Mandatory fields:
          id: projectId,
          status: "ACTIVE",
          name: formData.projectName.trim(),
          description: formData.projectDescription.trim(),
          deadline_at: new Date(formData.projectDeadline).toISOString(),

          // Optional fields:
          document_url: formData.projectURL.trim() ? formData.projectURL : null,
        },
        {
          onSuccess: () => {
            toast.success("Project successfully updated");
            setIsSubmitting(false);
            utils.read.project.invalidate();
            utils.list.projects.invalidate();
            onClose();
          },
          onError: (err) => {
            toast.error("Something went wrong while saving this project.", {
              description: err.message,
            });
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
      sheetName="Edit Project Assignment"
      sheetDescription="Refine or update the details of this assignment"
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}
      {initialData && !isLoading && !isError && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
            <div className="group-input flex flex-col gap-4">
              <InputCMS
                inputId="project-name"
                inputName="Project Title"
                inputType="text"
                inputPlaceholder="Give your project a concise name."
                value={formData.projectName}
                onInputChange={handleInputChange("projectName")}
                required
              />
              <TextAreaCMS
                textAreaId="project-description"
                textAreaName="Project Brief"
                textAreaPlaceholder="Outline the project objectives, deliverables, and any specific instructions."
                textAreaHeight="h-36"
                value={formData.projectDescription}
                onInputChange={handleInputChange("projectDescription")}
                required
              />
              <InputCMS
                inputId="project-deadline"
                inputName="Submission Deadline"
                inputType="datetime-local"
                inputPlaceholder="e.g. Curriculum Brief"
                value={formData.projectDeadline}
                onInputChange={handleInputChange("projectDeadline")}
                required
              />
              <div className="flex flex-col gap-5 pt-4">
                <div className="flex flex-col">
                  <h3 className="font-bold font-brand">
                    Upload Supporting Document
                  </h3>
                  <p className="font-bodycopy font-medium text-sm text-alternative">
                    Optional — attach any file that can guide participants, such
                    as a case study, brief, or template.
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
                    inputId="project-url"
                    inputName="Document Link"
                    inputType="url"
                    inputPlaceholder="Paste the document’s shareable link here"
                    value={formData.projectURL}
                    onInputChange={handleInputChange("projectURL")}
                    characterLength={1000}
                    required
                  />
                )}
                {selectedUploadMethod === "upload" && (
                  <UploadFilesCMS
                    value={formData.projectURL}
                    onUpload={handleInputChange("projectURL")}
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
