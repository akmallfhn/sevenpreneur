"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setSessionToken, trpc } from "@/trpc/client";
import AppButton from "@/app/components/buttons/AppButton";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import InputCMS from "@/app/components/fields/InputCMS";
import SelectCMS from "@/app/components/fields/SelectCMS";
import StatusLabelCMS from "@/app/components/labels/StatusLabelCMS";
import TextAreaCMS from "@/app/components/fields/TextAreaCMS";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  User2,
  AtSign,
  KeyRound,
  Building2,
  Sprout,
  Flag,
  CalendarRange,
  Loader2,
  Save,
  ChevronRight,
} from "lucide-react";
import UploadAvatarUserCMS from "../fields/UploadAvatarUserCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import PhoneNumberInputSVP from "../fields/PhoneNumberInputSVP";

interface EditUserFormProps {
  sessionToken: string;
  userId: string;
}

export default function EditUserForm({
  sessionToken,
  userId,
}: EditUserFormProps) {
  const utils = trpc.useUtils();
  const editUser = trpc.update.user.useMutation();
  const router = useRouter();

  // Set session token to client
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // Return initial data
  const {
    data: initialData,
    isLoading: isLoadingInitial,
    isError: isErrorInitial,
  } = trpc.read.user.useQuery({ id: userId }, { enabled: !!sessionToken });
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = trpc.list.roles.useQuery(undefined, { enabled: !!sessionToken });
  const {
    data: industriesData,
    isLoading: isLoadingIndustries,
    isError: isErrorIndustries,
  } = trpc.list.industries.useQuery(undefined, { enabled: !!sessionToken });
  const {
    data: stagesData,
    isLoading: isLoadingStages,
    isError: isErrorStages,
  } = trpc.list.entrepreneurStages.useQuery(undefined, {
    enabled: !!sessionToken,
  });

  // Beginning State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    roleId: string | number;
    status: "ACTIVE" | "INACTIVE";
    dateOfBirth: string;
    learningGoal: string;
    businessName: string;
    industry: string | number;
    entrepreneurStage: string | number;
  }>({
    fullName: initialData?.user.full_name || "",
    email: initialData?.user.email || "",
    phoneNumber: initialData?.user.phone_number || "",
    avatar: initialData?.user.avatar || "",
    roleId: initialData?.user.role.id ?? "",
    status: initialData?.user.status || "ACTIVE",
    dateOfBirth: initialData?.user.date_of_birth
      ? new Date(initialData?.user.date_of_birth).toISOString().split("T")[0]
      : "",
    learningGoal: initialData?.user.learning_goal || "",
    businessName: initialData?.user.business_name || "",
    industry: initialData?.user.industry_id || "",
    entrepreneurStage: initialData?.user.entrepreneur_stage_id || "",
  });

  // Iterate initial data (so it doesn't get lost)
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.user.full_name || "",
        email: initialData.user.email || "",
        phoneNumber: initialData.user.phone_number || "",
        avatar: initialData.user.avatar || "",
        roleId: initialData.user.role.id ?? "",
        status: initialData.user.status || "ACTIVE",
        dateOfBirth: initialData?.user.date_of_birth
          ? new Date(initialData?.user.date_of_birth)
              .toISOString()
              .split("T")[0]
          : "",
        learningGoal: initialData.user.learning_goal || "",
        businessName: initialData.user.business_name || "",
        industry: initialData.user.industry_id || "",
        entrepreneurStage: initialData.user.entrepreneur_stage_id || "",
      });
    }
  }, [initialData]);

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

  // Extract variable
  const isLoading =
    isLoadingInitial ||
    isLoadingRoles ||
    isLoadingIndustries ||
    isLoadingStages;
  const isError =
    isErrorInitial || isErrorRoles || isErrorIndustries || isErrorStages;

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleImageForm = (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      avatar: url ?? "",
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required field checking
    if (!formData.fullName) {
      toast.error("Oops! Something's missing.", {
        description: "Please complete user full name before submitting.",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.email) {
      toast.error("Oops! Something's missing.", {
        description: "Please complete user email before submitting.",
      });
      setIsSubmitting(false);
      return;
    }
    if (formData.roleId === "") {
      toast.error("Oops! Something's missing.", {
        description: "Please complete user role before submitting.",
      });
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      editUser.mutate(
        {
          // Mandatory fields:
          id: userId,
          full_name: formData.fullName,
          email: formData.email,
          role_id: Number(formData.roleId),
          status: formData.status,

          // Optional fields:
          phone_number: formData.phoneNumber.trim()
            ? formData.phoneNumber
            : null,
          phone_country_id: formData.phoneNumber.trim() ? 1 : null,
          avatar: formData.avatar.trim() ? formData.avatar : null,
          date_of_birth: formData.dateOfBirth.trim()
            ? formData.dateOfBirth
            : null,
          learning_goal: formData.learningGoal.trim()
            ? formData.learningGoal
            : null,
          entrepreneur_stage_id: formData.entrepreneurStage
            ? Number(formData.entrepreneurStage)
            : null,
          business_name: formData.businessName.trim()
            ? formData.businessName
            : null,
          industry_id: formData.industry ? Number(formData.industry) : null,
        },
        {
          onSuccess: () => {
            toast.success("User profile updated successfully.");
            utils.read.user.invalidate({ id: userId });
            utils.list.users.invalidate();
            router.push(`/users/${userId}`);
          },
          onError: (err) => {
            toast.error("Failed to update user", {
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
    <form
      className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      {/* PAGE HEADER */}
      <div className="page-header flex flex-col gap-3">
        <AppBreadcrumb>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href="/users">Users</AppBreadcrumbItem>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href={`/users/${userId}`}>
            Profile
          </AppBreadcrumbItem>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href={`/users/${userId}/edit`} isCurrentPage>
            Edit
          </AppBreadcrumbItem>
        </AppBreadcrumb>
        <div className="page-title-actions flex justify-between items-center">
          <TitleRevealCMS
            titlePage={"Edit User"}
            descPage={
              "Update user details, adjust roles or permissions, and manage account status easily."
            }
          />
          <div className="page-actions flex items-center gap-4">
            <Link href={"/users"}>
              <AppButton
                onClick={() => router.back()}
                variant="outline"
                type="button"
              >
                Cancel
              </AppButton>
            </Link>
            <AppButton
              variant="cmsPrimary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <Save className="size-5" />
              )}
              Save Changes
            </AppButton>
          </div>
        </div>
      </div>

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

      {!isLoading && !isError && (
        <div className="flex flex-col w-full gap-8 pb-20">
          {/* Personal Information */}
          <div className="personal-information-container flex flex-col w-full gap-5">
            <h2 className="label-name text-xl text-black font-brand font-bold">
              Personal Information
            </h2>

            {/* Upload Avatar */}
            <UploadAvatarUserCMS
              onUpload={handleImageForm}
              value={formData.avatar}
            />

            {/* Personal Information Data */}
            <div className="personal-information-data flex gap-5">
              {/* Data 1 */}
              <div className="data-1 flex flex-col w-full gap-4">
                {/* Full Name */}
                <InputCMS
                  inputId={"full-name"}
                  inputName={"Full Name"}
                  inputType={"text"}
                  inputPlaceholder={"Type user name..."}
                  inputIcon={<User2 className="size-5" />}
                  value={formData.fullName}
                  onInputChange={handleInputChange("fullName")}
                  required
                />
                {/* Email */}
                <InputCMS
                  inputId={"email"}
                  inputName={"Email"}
                  inputType={"email"}
                  inputPlaceholder={"Drop valid email..."}
                  inputIcon={<AtSign className="size-5" />}
                  value={formData.email}
                  onInputChange={handleInputChange("email")}
                  required
                />
                {/* Phone Number */}
                <PhoneNumberInputSVP
                  inputId={"phone-number"}
                  inputName={"Phone Number"}
                  inputIcon={"🇮🇩"}
                  inputPlaceholder="Enter Mobile or WhatsApp number"
                  inputCountryCode={"62"}
                  value={formData.phoneNumber}
                  onInputChange={handleInputChange("phoneNumber")}
                />
                {/* Role */}
                <SelectCMS
                  selectId={"role"}
                  selectName={"Role"}
                  selectPlaceholder="Pick a user role"
                  selectIcon={<KeyRound className="size-5" />}
                  value={formData.roleId}
                  onChange={handleInputChange("roleId")}
                  required
                  options={
                    rolesData?.list?.map((role) => ({
                      label: role.name,
                      value: role.id,
                    })) || []
                  }
                />
                {/* Status */}
                <div className="select-group-component flex flex-col gap-1">
                  <label
                    htmlFor={"status"}
                    className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                  >
                    Status <span className="text-red-700">*</span>
                  </label>
                  <div className="switch-button flex pl-1 gap-2">
                    <Switch
                      className="data-[state=checked]:bg-cms-primary"
                      checked={formData.status === "ACTIVE"}
                      onCheckedChange={(checked) =>
                        handleInputChange("status")(
                          checked ? "ACTIVE" : "INACTIVE"
                        )
                      }
                    />
                    <StatusLabelCMS
                      variants={formData.status as "ACTIVE" | "INACTIVE"}
                    />
                  </div>
                </div>
              </div>

              {/* Data 2 */}
              <div className="data-2 flex flex-col w-full gap-4">
                {/* Date of Birth */}
                <InputCMS
                  inputId={"date-of-birth"}
                  inputName={"Date of Birth"}
                  inputType={"date"}
                  inputIcon={<CalendarRange className="size-5" />}
                  value={formData.dateOfBirth}
                  onInputChange={handleInputChange("dateOfBirth")}
                />
                {/* Learning Goals */}
                <TextAreaCMS
                  textAreaId={"learning-goal"}
                  textAreaName={"Learning Goal"}
                  textAreaPlaceholder={"Summarize the learning focus"}
                  textAreaHeight={"h-[120px]"}
                  value={formData.learningGoal}
                  onTextAreaChange={handleInputChange("learningGoal")}
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="business-information-container flex flex-col w-full gap-5">
            <h2 className="label-name text-xl text-black font-brand font-bold">
              Business Information
            </h2>
            <div className="data flex flex-col w-full gap-4">
              {/* Business Name */}
              <InputCMS
                inputId={"business-name"}
                inputName={"Business Name"}
                inputType={"text"}
                inputPlaceholder={"Enter company name..."}
                inputIcon={<Building2 className="size-5" />}
                value={formData.businessName}
                onInputChange={handleInputChange("businessName")}
              />
              {/* Industry */}
              <SelectCMS
                selectId={"industry"}
                selectName={"Business Industry"}
                selectPlaceholder="Choose business industry"
                selectIcon={<Flag className="size-5" />}
                value={formData.industry}
                onChange={handleInputChange("industry")}
                options={
                  industriesData?.list?.map((role) => ({
                    label: role.name,
                    value: role.id,
                  })) || []
                }
              />
              {/* Entrepeneur Stage */}
              <SelectCMS
                selectId={"entrepeneur-stage"}
                selectName={"Entrepeneur Stage"}
                selectPlaceholder="Set entrepreneur level"
                selectIcon={<Sprout className="size-5" />}
                value={formData.entrepreneurStage}
                onChange={handleInputChange("entrepreneurStage")}
                options={
                  stagesData?.list?.map((role) => ({
                    label: role.name,
                    value: role.id,
                  })) || []
                }
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
