"use client";
import { UpdateUserData } from "@/lib/actions";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputNumberSVP from "../fields/InputNumberSVP";
import InputSVP from "../fields/InputSVP";
import UploadAvatarUserLMS from "../fields/UploadAvatarUserLMS";

export interface InitialDataUser {
  id: string;
  full_name: string;
  email: string;
  phone_country_id: number | null;
  phone_number: string | null;
  avatar: string | null;
  date_of_birth: string | null;
  business_name: string | null;
  industry_id: number | null;
}

interface EditUserFormLMSProps {
  sessionUserId: string;
  initialData: InitialDataUser;
}

export default function EditUserFormLMS(props: EditUserFormLMSProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Beginning Form State
  const [formData, setFormData] = useState<{
    userName: string;
    userPhoneNumber: string;
    userAvatar: string;
    userDateofBirth: string;
  }>({
    userName: props.initialData.full_name,
    userPhoneNumber: props.initialData.phone_number ?? "",
    userAvatar: props.initialData.avatar ?? "",
    userDateofBirth: props.initialData.date_of_birth
      ? props.initialData.date_of_birth.split("T")[0]
      : "",
  });

  // Keep updated to new data
  useEffect(() => {
    if (props.initialData) {
      setFormData({
        userName: props.initialData.full_name,
        userPhoneNumber: props.initialData.phone_number ?? "",
        userAvatar: props.initialData.avatar ?? "",
        userDateofBirth: props.initialData.date_of_birth
          ? props.initialData.date_of_birth.split("T")[0]
          : "",
      });
    }
  }, [props.initialData]);

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
      userAvatar: url ?? "",
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.userName) {
      toast.error("Please enter your name.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updateUserData = await UpdateUserData({
        // Mandatory field
        userId: props.sessionUserId,
        userName: formData.userName.trim(),

        // Optional Field
        userAvatar: formData.userAvatar ? formData.userAvatar : null,
        userPhoneNumber: formData.userPhoneNumber
          ? formData.userPhoneNumber.trim()
          : null,
        userDateofBirth: formData.userDateofBirth
          ? formData.userDateofBirth
          : null,
        // userOccupation: formData.userOccupation,
        // businessName: formData.businessName.trim() || undefined,
        // businessDescription: formData.businessDescription.trim() || undefined,
        // businessAgeYears: formData.businessAgeYears
        //   ? Number(formData.businessAgeYears)
        //   : undefined,
        // businessIndustry: formData.businessIndustry ?? undefined,
        // businessLegalEntity: formData.businessLegalEntity ?? undefined,
        // businessEmployeeNum: formData.businessEmployeeNum ?? undefined,
        // businessYearlyRevenue: formData.businessYearlyRevenue ?? undefined,
        // companyProfileUrl: formData.companyProfileUrl.trim() || undefined,
        // averageSellingPrice: formData.averageSellingPrice
        //   ? Number(formData.averageSellingPrice)
        //   : undefined,
      });

      if (updateUserData.code === "OK") {
        toast.success("Your profile has been updated successfully");
        router.refresh();
      } else {
        toast.error(
          updateUserData.message ||
            "Failed to update profile. Please try again.",
        );
      }
    } catch {
      toast.error("Something went wrong while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="form-container w-full flex flex-col gap-4 items-end"
      onSubmit={handleSubmit}
    >
      <div className="form-avatar relative w-full aspect-[1486/248] bg-[#E8EBF1] rounded-md overflow-hidden">
        <div className="flex absolute left-7 top-1/2 -translate-y-1/2 z-20">
          <UploadAvatarUserLMS
            fileValue={formData.userAvatar}
            fileBytes={1024 * 1024}
            fileSize="1 MB"
            folderPath="users"
            onUpload={handleImageForm}
          />
        </div>
        <div className="overlay absolute inset-0 bg-black/15 z-10" />
        <Image
          className="bg-image object-cover w-full h-full z-0"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-profile-acc.webp"
          }
          alt="Update Avatar"
          width={800}
          height={800}
        />
      </div>
      <div className="personal-form-input flex flex-col w-full bg-white p-6 gap-6 border border-outline rounded-lg">
        <div className="form-name flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Full Name</p>
            <p className="text-[13px] text-[#333333]/50 font-[450] font-bodycopy leading-snug">
              Your Display Name
            </p>
          </div>
          <div className="input w-full">
            <InputSVP
              inputId={"full-name"}
              inputType={"text"}
              inputPlaceholder={"Type your name..."}
              value={formData.userName}
              onInputChange={handleInputChange("userName")}
              required
            />
          </div>
        </div>
        <div className="form-email flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Email</p>
            <p className="text-[13px] text-[#333333]/50 font-[450] font-bodycopy leading-snug">
              Used for login and notifications
            </p>
          </div>
          <div className="input flex flex-col w-full gap-1">
            <InputSVP
              inputId={"email"}
              inputType={"text"}
              value={props.initialData.email}
              disabled
            />
            <p className="text-[13px] text-[#333333]/50 font-[450] font-bodycopy">
              Need to update your email? Contact{" "}
              <a
                href="https://wa.me/6285353533844"
                className="font-bold hover:underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                admin
              </a>
            </p>
          </div>
        </div>
        <div className="form-phone-number flex w-full items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Phone Number</p>
            <p className="text-[13px] text-[#333333]/50 font-[450] font-bodycopy leading-snug">
              Used to WhatsApp community
            </p>
          </div>
          <div className="input flex flex-col w-full">
            <InputNumberSVP
              inputId={"phone-number"}
              inputIcon={"🇮🇩 62"}
              inputPlaceholder="Enter Mobile or WhatsApp number"
              inputConfig="numeric"
              value={formData.userPhoneNumber}
              onInputChange={handleInputChange("userPhoneNumber")}
            />
          </div>
        </div>
        <div className="form-date-of-birth flex w-full items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Date of Birth</p>
            <p className="text-[13px] text-[#333333]/50 font-[450] font-bodycopy leading-snug">
              Used to verify your age
            </p>
          </div>
          <div className="input w-full">
            <InputSVP
              inputId={"full-name"}
              inputType={"date"}
              value={formData.userDateofBirth}
              onInputChange={handleInputChange("userDateofBirth")}
              required
            />
          </div>
        </div>
      </div>
      <AppButton className="w-fit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="animate-spin size-5" />
        ) : (
          <Save className="size-5" />
        )}
        Save Changes
      </AppButton>
    </form>
  );
}
