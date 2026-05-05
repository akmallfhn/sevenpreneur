"use client";
import AppButton from "@/components/buttons/AppButton";
import AppInput from "@/components/fields/AppInput";
import AppSelect from "@/components/fields/AppSelect";
import StatusLabelCMS from "@/components/labels/StatusLabelCMS";
import PageHeaderCMS from "@/components/titles/PageHeaderCMS";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/trpc/client";
import {
  AtSign,
  Building2,
  CalendarRange,
  Flag,
  KeyRound,
  Loader2,
  Save,
  User2,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppNumberInputSVP from "../fields/AppNumberInput";
import UploadAvatarUserCMS from "../fields/UploadAvatarUserCMS";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppLoadingComponents from "../states/AppLoadingComponents";

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

  // Beginning State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phoneCountryId: number | null;
    phoneNumber: string;
    avatar: string;
    roleId: string | number;
    status: "ACTIVE" | "INACTIVE";
    dateOfBirth: string;
    businessName: string;
    industry: string | number;
  }>({
    fullName: initialData?.user.full_name || "",
    email: initialData?.user.email || "",
    phoneCountryId: initialData?.user.phone_country_id ?? null,
    phoneNumber: initialData?.user.phone_number || "",
    avatar: initialData?.user.avatar || "",
    roleId: initialData?.user.role.id ?? "",
    status: initialData?.user.status || "ACTIVE",
    dateOfBirth: initialData?.user.date_of_birth
      ? new Date(initialData?.user.date_of_birth).toISOString().split("T")[0]
      : "",
    businessName: initialData?.user.business_name || "",
    industry: initialData?.user.industry_id || "",
  });

  // Iterate initial data (so it doesn't get lost)
  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.user.full_name || "",
        email: initialData.user.email || "",
        phoneCountryId: initialData.user.phone_country_id ?? null,
        phoneNumber: initialData.user.phone_number || "",
        avatar: initialData.user.avatar || "",
        roleId: initialData.user.role.id ?? "",
        status: initialData.user.status || "ACTIVE",
        dateOfBirth: initialData?.user.date_of_birth
          ? new Date(initialData?.user.date_of_birth)
              .toISOString()
              .split("T")[0]
          : "",
        businessName: initialData.user.business_name || "",
        industry: initialData.user.industry_id || "",
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
  const isLoading = isLoadingInitial || isLoadingRoles || isLoadingIndustries;
  const isError = isErrorInitial || isErrorRoles || isErrorIndustries;

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
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
          phone_country_id: formData.phoneNumber.trim() ? (formData.phoneCountryId ?? 1) : null,
          avatar: formData.avatar.trim() ? formData.avatar : null,
          date_of_birth: formData.dateOfBirth.trim()
            ? formData.dateOfBirth
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
    <PageContainerCMS>
      <form
        className="container w-full flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <PageHeaderCMS
          name="Edit User"
          desc="Update user details, adjust roles or permissions, and manage account status easily."
          icon={UserCog}
        >
          <div className="page-actions flex items-center gap-4">
            <Link href={"/users"}>
              <AppButton onClick={() => router.back()} variant="light" type="button">
                Cancel
              </AppButton>
            </Link>
            <AppButton variant="tertiary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <Save className="size-5" />
              )}
              Save Changes
            </AppButton>
          </div>
        </PageHeaderCMS>

        {isLoading && <AppLoadingComponents />}
        {isError && (
          <div className="flex w-full h-full py-10 items-center justify-center text-emphasis font-bodycopy font-medium">
            No Data
          </div>
        )}

        {!isLoading && !isError && (
          <div className="flex flex-col w-full gap-8 pb-20">
            {/* Personal Information */}
            <div className="personal-information-container flex flex-col w-full gap-5">
              <h2 className="label-name text-xl text-foreground font-brand font-bold">
                Personal Information
              </h2>
              <UploadAvatarUserCMS
                onUpload={handleImageForm}
                value={formData.avatar}
              />
              <div className="personal-information-data flex gap-5">
                <div className="data-1 flex flex-col w-full gap-4">
                  <AppInput variant="CMS"
                    inputId={"full-name"}
                    inputName={"Full Name"}
                    inputType={"text"}
                    inputPlaceholder={"Type user name..."}
                    inputIcon={<User2 className="size-5" />}
                    value={formData.fullName}
                    onInputChange={handleInputChange("fullName")}
                    required
                  />
                  <AppInput variant="CMS"
                    inputId={"email"}
                    inputName={"Email"}
                    inputType={"email"}
                    inputPlaceholder={"Drop valid email..."}
                    inputIcon={<AtSign className="size-5" />}
                    value={formData.email}
                    onInputChange={handleInputChange("email")}
                    required
                  />
                  <AppNumberInputSVP
                    inputId={"phone-number"}
                    inputName={"Phone Number"}
                    inputPlaceholder="Enter Mobile or WhatsApp number"
                    inputConfig="phone_number"
                    value={formData.phoneNumber}
                    defaultCountryId={formData.phoneCountryId}
                    onInputChange={handleInputChange("phoneNumber")}
                    onCountryChange={(id) =>
                      setFormData((prev) => ({ ...prev, phoneCountryId: id }))
                    }
                    variant="CMS"
                  />
                  <AppSelect variant="CMS"
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
                      className="flex pl-1 gap-0.5 text-sm text-foreground font-bodycopy font-semibold"
                    >
                      Status <span className="text-red-700">*</span>
                    </label>
                    <div className="switch-button flex pl-1 gap-2">
                      <Switch
                        className="data-[state=checked]:bg-tertiary"
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
                  <AppInput variant="CMS"
                    inputId={"date-of-birth"}
                    inputName={"Date of Birth"}
                    inputType={"date"}
                    inputIcon={<CalendarRange className="size-5" />}
                    value={formData.dateOfBirth}
                    onInputChange={handleInputChange("dateOfBirth")}
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="business-information-container flex flex-col w-full gap-5">
              <h2 className="label-name text-xl text-foreground font-brand font-bold">
                Business Information
              </h2>
              <div className="data flex flex-col w-full gap-4">
                {/* Business Name */}
                <AppInput variant="CMS"
                  inputId={"business-name"}
                  inputName={"Business Name"}
                  inputType={"text"}
                  inputPlaceholder={"Enter company name..."}
                  inputIcon={<Building2 className="size-5" />}
                  value={formData.businessName}
                  onInputChange={handleInputChange("businessName")}
                />
                {/* Industry */}
                <AppSelect variant="CMS"
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
              </div>
            </div>
          </div>
        )}
      </form>
    </PageContainerCMS>
  );
}
