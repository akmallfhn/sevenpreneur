"use client";
import { UpdateUserData } from "@/lib/actions";
import {
  BusinessEmployeeNumber,
  BusinessLegalEntity,
  BusinessYearlyRevenue,
  OccupationUser,
} from "@/lib/app-types";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputNumberSVP from "../fields/InputNumberSVP";
import InputSVP from "../fields/InputSVP";
import UploadAvatarUserLMS from "../fields/UploadAvatarUserLMS";
import SelectSVP from "../fields/SelectSVP";
import TextAreaSVP from "../fields/TextAreaSVP";

export interface IndustryList {
  id: number;
  name: string;
}

export interface InitialDataUser {
  // Personal Information
  id: string;
  full_name: string;
  email: string;
  phone_country_id: number | null;
  phone_number: string | null;
  avatar: string | null;
  date_of_birth: string | null;
  occupation: OccupationUser | null;
  // Business Information
  business_name: string | null;
  business_description: string | null;
  business_age_years: number | null;
  industry_id: number | null;
  company_profile_url: string | null;
  legal_entity_type: BusinessLegalEntity | null;
  yearly_revenue: BusinessYearlyRevenue | null;
  average_selling_price: string | number | null;
  total_employees: BusinessEmployeeNumber | null;
}

interface EditUserFormLMSProps {
  sessionUserId: string;
  initialData: InitialDataUser;
  industriesData: IndustryList[];
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
    userOccupation: OccupationUser | null;
    businessName: string;
    businessDescription: string;
    businessAgeYears: number | string;
    businessIndustry: IndustryList["id"] | null;
    businessLegalEntity: BusinessLegalEntity | null;
    businessEmployeeNum: BusinessEmployeeNumber | null;
    businessYearlyRevenue: BusinessYearlyRevenue | null;
    companyProfileUrl: string;
    averageSellingPrice: number | string;
  }>({
    userName: props.initialData.full_name,
    userPhoneNumber: props.initialData.phone_number ?? "",
    userAvatar: props.initialData.avatar ?? "",
    userDateofBirth: props.initialData.date_of_birth
      ? props.initialData.date_of_birth.split("T")[0]
      : "",
    userOccupation: props.initialData.occupation ?? null,
    businessName: props.initialData.business_name ?? "",
    businessDescription: props.initialData.business_description ?? "",
    businessAgeYears: props.initialData.business_age_years ?? "",
    businessIndustry: props.initialData.industry_id ?? null,
    businessLegalEntity: props.initialData.legal_entity_type ?? null,
    businessEmployeeNum: props.initialData.total_employees ?? null,
    businessYearlyRevenue: props.initialData.yearly_revenue ?? null,
    companyProfileUrl: props.initialData.company_profile_url ?? "",
    averageSellingPrice: props.initialData.average_selling_price ?? "",
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
        userOccupation: props.initialData.occupation ?? null,
        businessName: props.initialData.business_name ?? "",
        businessDescription: props.initialData.business_description ?? "",
        businessAgeYears: props.initialData.business_age_years ?? "",
        businessIndustry: props.initialData.industry_id ?? null,
        businessLegalEntity: props.initialData.legal_entity_type ?? null,
        businessEmployeeNum: props.initialData.total_employees ?? null,
        businessYearlyRevenue: props.initialData.yearly_revenue ?? null,
        companyProfileUrl: props.initialData.company_profile_url ?? "",
        averageSellingPrice: props.initialData.average_selling_price ?? "",
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
        userOccupation: formData.userOccupation ?? null,
        businessName: formData.businessName.trim()
          ? formData.businessName.trim()
          : null,
        businessDescription: formData.businessDescription.trim()
          ? formData.businessDescription.trim()
          : null,
        businessAgeYears: formData.businessAgeYears
          ? Number(formData.businessAgeYears)
          : null,
        businessIndustry: formData.businessIndustry ?? null,
        businessLegalEntity: formData.businessLegalEntity ?? null,
        businessEmployeeNum: formData.businessEmployeeNum ?? null,
        businessYearlyRevenue: formData.businessYearlyRevenue ?? null,
        companyProfileUrl: formData.companyProfileUrl.trim()
          ? formData.companyProfileUrl.trim()
          : null,
        averageSellingPrice: formData.averageSellingPrice
          ? Number(formData.averageSellingPrice)
          : null,
      });

      if (updateUserData.code === "OK") {
        toast.success("Your profile has been updated successfully");
        router.refresh();
      } else {
        toast.error(
          updateUserData.message ||
            "Failed to update profile. Please try again."
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
      className="form-container w-full flex flex-col gap-4 items-end pb-32"
      onSubmit={handleSubmit}
    >
      <div className="form-avatar relative w-full aspect-[1486/248] bg-[#E8EBF1] dark:bg-[#1a1e2a] rounded-md overflow-hidden">
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
      <div className="personal-form-input flex flex-col w-full bg-card-bg p-6 gap-6 border border-dashboard-border rounded-lg">
        <div className="form-name flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Full Name</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Your display name
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
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
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
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy">
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
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
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
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
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
        <div className="form-occupation flex w-full items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Occupation</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Your current role or profession
            </p>
          </div>
          <div className="input flex flex-col w-full">
            <SelectSVP
              selectId={"user-occupation"}
              selectPlaceholder="Select your occupation"
              value={formData.userOccupation}
              onChange={handleInputChange("userOccupation")}
              options={[
                {
                  label: "Karyawan Swasta/Pegawai Negeri",
                  value: "EMPLOYEE",
                },
                {
                  label: "Entrepreneur",
                  value: "ENTREPRENEUR",
                },
                {
                  label: "Pelajar/Mahasiswa",
                  value: "STUDENT",
                },
                {
                  label: "Freelance",
                  value: "FREELANCE",
                },
                {
                  label: "Militer/Kepolisian",
                  value: "MILITARY",
                },
                {
                  label: "Sedang Tidak Bekerja",
                  value: "UNEMPLOYED",
                },
              ]}
              required
            />
          </div>
        </div>
      </div>
      <div className="business-form-input flex flex-col w-full bg-card-bg p-6 gap-6 border border-dashboard-border rounded-lg">
        <div className="form-business-name flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Business Name</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Your brand name
            </p>
          </div>
          <div className="input w-full">
            <InputSVP
              inputId={"full-name"}
              inputType={"text"}
              inputPlaceholder={"Enter your business name"}
              value={formData.businessName}
              onInputChange={handleInputChange("businessName")}
              required
            />
          </div>
        </div>
        <div className="form-business-desc flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Description</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Brief overview of your business
            </p>
          </div>
          <div className="input w-full">
            <TextAreaSVP
              textAreaId={"business-description"}
              textAreaPlaceholder={"Describe what your business does"}
              textAreaHeight={"h-[120px]"}
              value={formData.businessDescription}
              onTextAreaChange={handleInputChange("businessDescription")}
              required
            />
          </div>
        </div>
        <div className="form-business-industry flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Industry</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Category your business belongs to
            </p>
          </div>
          <div className="input w-full">
            <SelectSVP
              selectId={"business-industry"}
              selectPlaceholder="Choose an industry"
              value={formData.businessIndustry}
              onChange={handleInputChange("businessIndustry")}
              options={
                props.industriesData?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) || []
              }
              required
            />
          </div>
        </div>
        <div className="form-business-age-years flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Business Age</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              How long your business has been operating
            </p>
          </div>
          <div className="input w-full">
            <InputNumberSVP
              inputId={"business-age-years"}
              inputPlaceholder={"Enter number of years. e.g. 2"}
              inputConfig="numeric"
              value={String(formData.businessAgeYears)}
              onInputChange={handleInputChange("businessAgeYears")}
              required
            />
          </div>
        </div>
        <div className="form-legal-entity flex w-full items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Legal Status</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Business registration type
            </p>
          </div>
          <div className="input flex flex-col w-full">
            <SelectSVP
              selectId="business-legal-entity"
              selectPlaceholder="Select legal status"
              value={formData.businessLegalEntity}
              onChange={handleInputChange("businessLegalEntity")}
              options={[
                {
                  label: "CV",
                  value: "CV",
                },
                {
                  label: "Perseroan Terbatas (PT)",
                  value: "PT",
                },
                {
                  label: "Perseroan Terbatas Terbuka (PT Tbk)",
                  value: "PT_TBK",
                },
                {
                  label: "Firma",
                  value: "FIRMA",
                },
                {
                  label: "Koperasi",
                  value: "KOPERASI",
                },
                {
                  label: "Yayasan",
                  value: "YAYASAN",
                },
                {
                  label: "Usaha Dagang (UD)",
                  value: "UD",
                },
                {
                  label: "Belum Berbadan Hukum",
                  value: "NON_LEGAL_ENTITY",
                },
              ]}
              required
            />
          </div>
        </div>
        <div className="form-total-employee flex w-full items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Team Size</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Total number of people in your company
            </p>
          </div>
          <div className="input flex flex-col w-full">
            <SelectSVP
              selectId={"total-employees"}
              selectPlaceholder="Select number of employees"
              value={formData.businessEmployeeNum}
              onChange={handleInputChange("businessEmployeeNum")}
              options={[
                {
                  label: "1-10 employee",
                  value: "SMALL",
                },
                {
                  label: "11-50 employee",
                  value: "MEDIUM",
                },
                {
                  label: "51-100 employee",
                  value: "LARGE",
                },
                {
                  label: "101-500 employee",
                  value: "XLARGE",
                },
                {
                  label: ">500 employee",
                  value: "XXLARGE",
                },
              ]}
              required
            />
          </div>
        </div>
        <div className="form-business-yearly-revenue flex w-full items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Revenue</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Total yearly revenue
            </p>
          </div>
          <div className="input flex flex-col w-full">
            <SelectSVP
              selectId={"business-yearly-revenue"}
              selectPlaceholder="Choose your revenue range"
              value={formData.businessYearlyRevenue}
              onChange={handleInputChange("businessYearlyRevenue")}
              options={[
                {
                  label: "<50 juta",
                  value: "BELOW_50M",
                },
                {
                  label: "50 juta - 100 juta",
                  value: "BETWEEN_50M_100M",
                },
                {
                  label: "100 juta - 500 juta",
                  value: "BETWEEN_100M_500M",
                },
                {
                  label: "500 juta - 1 miliar",
                  value: "BETWEEN_500M_1B",
                },
                {
                  label: "1 miliar - 10 miliar",
                  value: "BETWEEN_1B_10B",
                },
                {
                  label: "10 miliar - 25 miliar",
                  value: "BETWEEN_10B_25B",
                },
                {
                  label: ">25 miliar",
                  value: "ABOVE_25B",
                },
              ]}
              required
            />
          </div>
        </div>
        <div className="form-average-selling-price flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">Avg. price</p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Average price per product or service
            </p>
          </div>
          <div className="input w-full">
            <InputNumberSVP
              inputId={"average-selling-price"}
              inputPlaceholder={"Enter average selling price. e.g. 35000"}
              inputConfig="numeric"
              value={String(formData.averageSellingPrice)}
              onInputChange={handleInputChange("averageSellingPrice")}
              required
            />
          </div>
        </div>
        <div className="form-company-profile-url flex items-center">
          <div className="label w-80">
            <p className="text-[15px] font-bodycopy font-bold">
              Company Profile
            </p>
            <p className="text-[13px] text-emphasis font-[450] font-bodycopy leading-snug">
              Upload your company profile
            </p>
          </div>
          <div className="input w-full">
            <InputSVP
              inputId={"company-profile-url"}
              inputType={"url"}
              inputPlaceholder={"e.g. https://instagram.com/brand"}
              value={formData.companyProfileUrl}
              onInputChange={handleInputChange("companyProfileUrl")}
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
