"use client";
import { useState } from "react";
import InputSVP from "../fields/InputSVP";
import TextAreaSVP from "../fields/TextAreaSVP";
import SelectSVP from "../fields/SelectSVP";
import { faIndustry } from "@fortawesome/free-solid-svg-icons";
import AppButton from "../buttons/AppButton";
import RadioBoxCMS from "../fields/RadioBoxCMS";
import RadioBoxSVP from "../fields/RadioBoxBooleanSVP";

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
  const nickname = sessionUserName.split(" ")[0];

  const [formData, setFormData] = useState<{
    occupation: string;
    dateOfBirth: string;
    hasBusiness: boolean | null;
    businessName: string;
    businessDescription: string;
    industry: IndustryList["id"] | null;
    totalEmployees: string;
    yearlyRevenue: string;
  }>({
    occupation: "",
    dateOfBirth: "",
    hasBusiness: null,
    businessName: "",
    businessDescription: "",
    industry: null,
    totalEmployees: "",
    yearlyRevenue: "",
  });

  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="root-page flex w-full h-full bg-section-background dark:bg-coal-black">
      <form className="form-container flex flex-col w-full max-w-2xl mx-auto items-center p-5 pb-64 gap-5">
        <div className="welcoming-section flex flex-col bg-linear-to-br from-0% from-[#D2E5FC] to-40% w-full gap-3 font-bodycopy p-5 border border-outline rounded-md">
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
        <div className="contact-section flex flex-col bg-white w-full gap-3 font-bodycopy p-5 border border-outline rounded-md">
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
            inputId={"date-of-birth"}
            inputName={"Tanggal lahir"}
            inputType={"date"}
            inputPlaceholder={"Enter company name..."}
            value={formData.dateOfBirth}
            onInputChange={handleInputChange("dateOfBirth")}
            required
          />
          <SelectSVP
            selectId={"occupation"}
            selectName={"Apa kesibukan anda saat ini?"}
            selectPlaceholder="Select"
            value={formData.occupation}
            onChange={handleInputChange("occupation")}
            options={[
              {
                label: "Employee",
                value: "EMPLOYEE",
              },
              {
                label: "Entrepreneur",
                value: "ENTREPRENEUR",
              },
              {
                label: "Mahasiswa",
                value: "STUDENT",
              },
            ]}
            required
          />
          <div className="flex flex-col gap-2">
            <p className="font-bodycopy font-semibold text-sm pl-1">
              Apakah sudah memiliki business?
            </p>
            <RadioBoxSVP
              radioName="Ya"
              radioDescription="Ya sudah punya"
              value={true}
              selectedValue={formData.hasBusiness}
              onChange={handleInputChange("hasBusiness")}
            />
            <RadioBoxSVP
              radioName="No"
              radioDescription="Tidak, tapi ingin memulai belajar bisnis"
              value={false}
              selectedValue={formData.hasBusiness}
              onChange={handleInputChange("hasBusiness")}
            />
          </div>
        </div>
        {formData.hasBusiness && (
          <div className="contact-section flex flex-col bg-white w-full gap-3 font-bodycopy p-5 border border-outline rounded-md">
            <h2 className="section-title font-brand font-bold text-lg">
              Business Information
            </h2>
            <SelectSVP
              selectId={"industry"}
              selectName={"Business Industry"}
              selectPlaceholder="Choose business industry"
              value={formData.industry}
              onChange={handleInputChange("industry")}
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
              inputName={"Apa nama brand/business kamu?"}
              inputType={"text"}
              inputPlaceholder={"Enter company name..."}
              value={formData.businessName}
              onInputChange={handleInputChange("businessName")}
              required
            />
            <TextAreaSVP
              textAreaId={"business-description"}
              textAreaName={"Deskripsikan bisnis kamu"}
              textAreaPlaceholder={"Summarize the company"}
              textAreaHeight={"h-[120px]"}
              value={formData.businessDescription}
              onTextAreaChange={handleInputChange("businessDescription")}
              required
            />
            <SelectSVP
              selectId={"total-employees"}
              selectName={"Total Karyawan yang bekerja?"}
              selectPlaceholder="Select"
              value={formData.totalEmployees}
              onChange={handleInputChange("totalEmployees")}
              options={[
                {
                  label: "0-10 karyawan",
                  value: "BETWEEN_0_10",
                },
                {
                  label: "30-40 karyawan",
                  value: "BETWEEN_30_40",
                },
              ]}
              required
            />
            <SelectSVP
              selectId={"yearly-revenue"}
              selectName={"Berapa Omset tahunan?"}
              selectPlaceholder="Select"
              value={formData.yearlyRevenue}
              onChange={handleInputChange("yearlyRevenue")}
              options={[
                {
                  label: "< 100 juta",
                  value: "BETWEEN_0_10",
                },
                {
                  label: "> 1 milliar",
                  value: "BETWEEN_30_40",
                },
              ]}
              required
            />
          </div>
        )}
        <AppButton>Submit Data</AppButton>
      </form>
    </div>
  );
}
