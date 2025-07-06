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

interface CreateProjectFormCMSProps {
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectFormCMS({
  cohortId,
  isOpen,
  onClose,
}: CreateProjectFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUploadMethod, setSelectedUploadMethod] = useState("");
  const createProject = trpc.create.project.useMutation();
  const utils = trpc.useUtils();

  // --- Beginning State
  const [formData, setFormData] = useState<{
    projectName: string;
    projectDescription: string;
    projectDeadline: string;
    projectURL: string;
  }>({
    projectName: "",
    projectDescription: "",
    projectDeadline: "",
    projectURL: "",
  });

  // --- Reset projectURL every time upload method is changed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      projectURL: "",
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

    // -- POST to Database
    try {
      createProject.mutate(
        {
          // Mandatory fields:
          cohort_id: cohortId,
          status: "ACTIVE",
          name: formData.projectName.trim(),
          description: formData.projectDescription.trim(),
          deadline_at: new Date(formData.projectDeadline).toISOString(),

          // Optional fields:
          document_url: formData.projectURL.trim() ? formData.projectURL : null,
        },
        {
          onSuccess: () => {
            toast.success("Project successfully created");
            setIsSubmitting(false);
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
      sheetName="Create Project Assignment"
      sheetDescription="Assign a class project with clear goals and deliverables for participants."
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
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Create Project
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
