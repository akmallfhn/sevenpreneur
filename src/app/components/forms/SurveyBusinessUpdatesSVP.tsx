"use client";
import { FormEvent, useEffect, useState } from "react";
import InputSVP from "../fields/InputSVP";
import TextAreaSVP from "../fields/TextAreaSVP";
import SelectSVP from "../fields/SelectSVP";
import AppButton from "../buttons/AppButton";
import RadioBoxSVP from "../fields/RadioBoxBooleanSVP";
import {
  BusinessEmployeeNumber,
  BusinessLegalEntity,
  BusinessYearlyRevenue,
  OccupationUser,
} from "@/lib/app-types";
import InputNumberSVP from "../fields/InputNumberSVP";
import { toast } from "sonner";
import { UpdateUserBusiness } from "@/lib/actions";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface IndustryList {
  id: number;
  name: string;
}

interface SurveyBusinessUpdateSVPProps {
  sessionUserId: string;
  sessionUserName: string;
  sessionUserEmail: string;
  industriesData: IndustryList[];
}

export default function SurveyBusinessUpdateSVP({
  sessionUserId,
  sessionUserName,
  sessionUserEmail,
  industriesData,
}: SurveyBusinessUpdateSVPProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nickname = sessionUserName.split(" ")[0];

  const [formData, setFormData] = useState<{
    userOccupation: OccupationUser | null;
    userDateofBirth: string;
    hasBusiness: boolean | null;
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
    userOccupation: null,
    userDateofBirth: "",
    hasBusiness: null,
    businessName: "",
    businessDescription: "",
    businessAgeYears: "",
    businessIndustry: null,
    businessLegalEntity: null,
    businessEmployeeNum: null,
    businessYearlyRevenue: null,
    companyProfileUrl: "",
    averageSellingPrice: "",
  });

  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    if (formData.hasBusiness === false) {
      setFormData((prev) => ({
        ...prev,
        businessName: "",
        businessDescription: "",
        businessAgeYears: "",
        businessIndustry: null,
        businessLegalEntity: null,
        businessEmployeeNum: null,
        businessYearlyRevenue: null,
        companyProfileUrl: "",
        averageSellingPrice: "",
      }));
    }
  }, [formData.hasBusiness]);

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.userDateofBirth) {
      toast.error("Please enter your date of birth.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.userOccupation) {
      toast.error("Please select your current occupation.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessName.trim() && formData.hasBusiness) {
      toast.error("Please enter your business or brand name.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessDescription.trim() && formData.hasBusiness) {
      toast.error("Please provide a short description of your business.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessIndustry && formData.hasBusiness) {
      toast.error("Please select the industry of your business.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessAgeYears && formData.hasBusiness) {
      toast.error(
        "Please enter how many years your business has been running."
      );
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessLegalEntity && formData.hasBusiness) {
      toast.error("Please select the legal entity of your business.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessEmployeeNum && formData.hasBusiness) {
      toast.error("Please select the number of employees in your business.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.businessYearlyRevenue && formData.hasBusiness) {
      toast.error("Please select your business's yearly revenue range.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.averageSellingPrice && formData.hasBusiness) {
      toast.error("Please enter the average selling price of your products.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updateUserBusiness = await UpdateUserBusiness({
        // Mandatory field
        userDateofBirth: formData.userDateofBirth,
        userOccupation: formData.userOccupation,

        // Optional Field
        businessName: formData.businessName.trim() || undefined,
        businessDescription: formData.businessDescription.trim() || undefined,
        businessAgeYears: formData.businessAgeYears
          ? Number(formData.businessAgeYears)
          : undefined,
        businessIndustry: formData.businessIndustry ?? undefined,
        businessLegalEntity: formData.businessLegalEntity ?? undefined,
        businessEmployeeNum: formData.businessEmployeeNum ?? undefined,
        businessYearlyRevenue: formData.businessYearlyRevenue ?? undefined,
        companyProfileUrl: formData.companyProfileUrl.trim() || undefined,
        averageSellingPrice: formData.averageSellingPrice
          ? Number(formData.averageSellingPrice)
          : undefined,
      });

      if (updateUserBusiness.code === "OK") {
        toast.success("Your profile has been updated successfully");
        router.push("/");
      } else {
        toast.error(
          updateUserBusiness.message ||
            "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      toast.error("Something went wrong while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="root-page flex w-full h-full bg-section-background dark:bg-coal-black">
      <form
        className="form-container flex flex-col w-full max-w-[768px] mx-auto items-center p-5 pb-64 gap-5"
        onSubmit={handleSubmit}
      >
        <div className="welcoming-section flex flex-col bg-linear-to-br from-0% from-[#D2E5FC] to-40% to-white w-full gap-3 font-bodycopy p-5 border border-outline rounded-md dark:from-primary/20 dark:to-surface-black dark:border-outline-dark">
          <h1 className="page-title font-brand font-bold text-2xl">
            Business Information Update
          </h1>
          <p className="font-semibold text-[15px]">Halo, {nickname}!</p>
          <p className="font-medium text-[15px]">
            Sebelum memulai rangkaian pembelajaran, kami mengundangmu untuk
            mengisi formulir ini agar kami dapat memahami profil dan kebutuhan
            bisnis kamu lebih akurat. Informasi ini akan membantu kami
            menyiapkan pengalaman belajar yang lebih efektif.
          </p>
          <p className="font-medium text-[15px]">
            Semua data yang bersifat confidential akan disimpan aman di database
            Sevenpreneur, bersifat rahasia penuh, dan tidak akan dibagikan ke
            pihak mana pun.
          </p>
        </div>
        <div className="contact-section flex flex-col bg-white w-full gap-3 font-bodycopy p-5 border border-outline rounded-md dark:bg-surface-black dark:border-outline-dark">
          <h2 className="section-title font-brand font-bold text-lg">
            Personal Information
          </h2>
          <InputSVP
            inputId="user-email"
            inputName="Email"
            inputType="email"
            value={sessionUserEmail}
            disabled
          />
          <InputSVP
            inputId={"user-date-of-birth"}
            inputName={"Kapan tanggal lahir kamu?"}
            inputType={"date"}
            inputPlaceholder="Pilih tanggal lahir"
            value={formData.userDateofBirth}
            onInputChange={handleInputChange("userDateofBirth")}
            required
          />
          <SelectSVP
            selectId={"user-occupation"}
            selectName={"Apa kegiatan atau pekerjaan kamu saat ini?"}
            selectPlaceholder="Pilih profesi/aktivitas"
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
          <div className="has-business flex flex-col gap-2">
            <p className="font-bodycopy font-semibold text-sm pl-1">
              Apakah kamu sudah memiliki bisnis?
              <span className="label-required text-destructive">*</span>
            </p>
            <RadioBoxSVP
              radioName="Ya"
              radioDescription="Saya sudah atau pernah menjalankan bisnis"
              value={true}
              selectedValue={formData.hasBusiness}
              onChange={handleInputChange("hasBusiness")}
            />
            <RadioBoxSVP
              radioName="Tidak"
              radioDescription="Saya belum punya bisnis, tapi ingin mulai belajar"
              value={false}
              selectedValue={formData.hasBusiness}
              onChange={handleInputChange("hasBusiness")}
            />
          </div>
        </div>
        <div
          className={`relative flex w-full transition-all duration-300 ease-out z-10 ${
            formData.hasBusiness
              ? "opacity-100 translate-y-0"
              : "max-h-0 opacity-0 -translate-y-3 pointer-events-none"
          }`}
        >
          <div className="business-section flex flex-col bg-white w-full gap-3 font-bodycopy p-5 border border-outline rounded-md dark:bg-surface-black dark:border-outline-dark">
            <h2 className="section-title font-brand font-bold text-lg">
              Business Information
            </h2>
            <SelectSVP
              selectId={"business-industry"}
              selectName={"Saat ini, bisnis kamu bergerak di industri apa?"}
              selectPlaceholder="Pilih industri bisnis"
              value={formData.businessIndustry}
              onChange={handleInputChange("businessIndustry")}
              options={
                industriesData?.map((item) => ({
                  label: item.name,
                  value: item.id,
                })) || []
              }
              required
            />
            <InputSVP
              inputId={"business-name"}
              inputName={"Apa nama brand atau bisnismu?"}
              inputType={"text"}
              inputPlaceholder={"Masukkan nama brand/bisnismu…"}
              value={formData.businessName}
              onInputChange={handleInputChange("businessName")}
              required
            />
            <TextAreaSVP
              textAreaId={"business-description"}
              textAreaName={"Ceritakan sedikit tentang bisnismu"}
              textAreaPlaceholder={
                "Tulis deskripsi singkat bisnis kamu di sini…"
              }
              textAreaHeight={"h-[120px]"}
              value={formData.businessDescription}
              onTextAreaChange={handleInputChange("businessDescription")}
              required
            />
            <InputNumberSVP
              inputId={"business-age-years"}
              inputName={"Berapa tahun bisnis kamu berjalan?"}
              inputPlaceholder={"e.g. 2"}
              value={String(formData.businessAgeYears)}
              onInputChange={handleInputChange("businessAgeYears")}
              required
            />
            <SelectSVP
              selectId={"business-legal-entity"}
              selectName={"Apa bentuk badan hukum bisnismu?"}
              selectPlaceholder="Pilih bentuk badan hukum"
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
            <SelectSVP
              selectId={"total-employees"}
              selectName={"Berapa jumlah karyawan di bisnis kamu?"}
              selectPlaceholder="Pilih jumlah karyawan"
              value={formData.businessEmployeeNum}
              onChange={handleInputChange("businessEmployeeNum")}
              options={[
                {
                  label: "1-10 karyawan",
                  value: "SMALL",
                },
                {
                  label: "11-50 karyawan",
                  value: "MEDIUM",
                },
                {
                  label: "51-100 karyawan",
                  value: "LARGE",
                },
                {
                  label: "101-500 karyawan",
                  value: "XLARGE",
                },
                {
                  label: ">500 karyawan",
                  value: "XXLARGE",
                },
              ]}
              required
            />
            <InputNumberSVP
              inputId={"average-selling-price"}
              inputName={"Berapa rata-rata harga produk bisnismu?"}
              inputPlaceholder={"e.g. 35000"}
              value={String(formData.averageSellingPrice)}
              onInputChange={handleInputChange("averageSellingPrice")}
              required
            />
            <SelectSVP
              selectId={"business-yearly-revenue"}
              selectName={"Berapa rentang omset tahunan bisnismu?"}
              selectPlaceholder="Pilih rentang omset"
              value={formData.businessYearlyRevenue}
              onChange={handleInputChange("businessYearlyRevenue")}
              options={[
                {
                  label: "kurang dari 50 juta",
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
                  label: "Di atas 25 miliar",
                  value: "ABOVE_25B",
                },
              ]}
              required
            />
            <InputSVP
              inputId={"company-profile-url"}
              inputName={
                "Cantumkan profil bisnis kamu (Instagram, website, atau dokumen)"
              }
              inputType={"url"}
              inputPlaceholder={"e.g. https://instagram.com/brand"}
              value={formData.companyProfileUrl}
              onInputChange={handleInputChange("companyProfileUrl")}
            />
          </div>
        </div>
        <AppButton type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-5 animate-spin" />}
          Submit Data
        </AppButton>
      </form>
    </div>
  );
}
