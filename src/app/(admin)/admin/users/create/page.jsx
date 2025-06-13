"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import { CalendarRange, Save } from "lucide-react";
import InputCMS from "@/app/components/elements/InputCMS";
import SelectCMS from "@/app/components/elements/SelectCMS";
import StatusLabelCMS from "@/app/components/elements/StatusLabelCMS";
import { User2, AtSign, KeyRound, Building2, Sprout, Flag } from "lucide-react";
import TextAreaCMS from "@/app/components/elements/TextAreaCMS";

export default function CreateUserPage() {
  // --- State to save data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roleId: "",
    status: "",
    dateOfBirth: "",
    learningGoal: "",
    businessName: "",
    entrepreneurStage: "",
    industry: "",
  });

  const handleInputChange = (fieldName) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
  };

  return (
    <div className="root flex w-full h-full justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
      <div className="index-article w-[1040px] flex flex-col gap-4">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <div className="page-title-actions flex justify-between items-center">
            {/* --- Page Title */}
            <TitleRevealCMS
              titlePage={"Add New User"}
              descPage={
                "Manage your published content easily. Click on an article to view or edit its details."
              }
            />

            {/* --- Page Actions */}
            <div className="page-actions flex items-center gap-4">
              <Link href={"/users"}>
                <AppButton variant="outline">Cancel</AppButton>
              </Link>
              <AppButton variant="cmsPrimary" onClick={handleSubmit}>
                <Save className="size-5" />
                Add New User
              </AppButton>
            </div>
          </div>
        </div>

        {/* --- PAGE FORM */}
        <div className="flex flex-col w-full gap-8 pb-10">
          {/* --- Personal Information */}
          <div className="personal-information-container flex flex-col w-full gap-5">
            <h2 className="label-name text-xl font-brand font-bold">
              Personal Information
            </h2>

            {/* --- Upload Avatar */}
            <div className="flex items-center gap-5">
              <div className="size-32 border border-outline aspect-square rounded-full overflow-hidden">
                <Image
                  className="object-cover"
                  src={
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                  }
                  alt="Avatar"
                  width={400}
                  height={400}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={"status"}
                  className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
                >
                  Avatar
                </label>
                <AppButton variant="outline" size="small">
                  Add Photo
                </AppButton>
              </div>
            </div>

            {/* Personal Information Data */}
            <div className="personal-information-data flex gap-5">
              {/* --- Data 1 */}
              <div className="data-1 flex flex-col w-full gap-4">
                <InputCMS
                  inputId={"full-name"}
                  inputName={"Full Name"}
                  inputType={"text"}
                  inputPlaceholder={"Enter your name..."}
                  inputIcon={<User2 className="size-5" />}
                  value={formData.fullName}
                  onInputChange={handleInputChange("fullName")}
                  characterLength={128}
                  errorMessage={"Oops, you’ve reached the character limit."}
                  required={true}
                />
                <InputCMS
                  inputId={"email"}
                  inputName={"Email"}
                  inputType={"email"}
                  inputPlaceholder={"Drop your email..."}
                  inputIcon={<AtSign className="size-5" />}
                  value={formData.email}
                  onInputChange={handleInputChange("email")}
                  characterLength={128}
                  errorMessage={"Oops, you’ve reached the character limit."}
                  required={true}
                />
                {/* -- Role */}
                <SelectCMS
                  selectId={"role"}
                  selectName={"Role"}
                  selectIcon={<KeyRound className="size-5" />}
                  required={true}
                  options={[
                    { label: "Admin", value: "admin" },
                    { label: "Editor", value: "editor" },
                    { label: "Viewer", value: "viewer" },
                  ]}
                />
                <div className="select-group-component flex flex-col gap-1">
                  <label
                    htmlFor={"status"}
                    className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
                  >
                    Status <span className="text-red-700">*</span>
                  </label>
                  <StatusLabelCMS labelName={"active"} />
                </div>
              </div>

              {/* --- Data 2 */}
              <div className="data-2 flex flex-col w-full gap-4">
                <InputCMS
                  inputId={"date-of-birth"}
                  inputName={"Date of Birth"}
                  inputType={"date"}
                  inputIcon={<CalendarRange className="size-5" />}
                  value={formData.dateOfBirth}
                  onInputChange={handleInputChange("dateOfBirth")}
                />
                <TextAreaCMS
                  textAreaId={"learning-goal"}
                  textAreaName={"Learning Goal"}
                  textAreaPlaceholder={"What do you wanna learn?"}
                  textAreaHeight={"h-[120px]"}
                  value={formData.learningGoal}
                  onInputChange={handleInputChange("learningGoal")}
                />
              </div>
            </div>
          </div>

          {/* --- Business Information */}
          <div className="business-information-container flex flex-col w-full gap-5">
            <h2 className="label-name text-xl font-brand font-bold">
              Business Information
            </h2>
            <div className="data flex flex-col w-full gap-4">
              <InputCMS
                inputId={"business-name"}
                inputName={"Business Name"}
                inputType={"text"}
                inputPlaceholder={"What's your business name?"}
                inputIcon={<Building2 className="size-5" />}
                value={formData.businessName}
                onInputChange={handleInputChange("businessName")}
                characterLength={128}
                errorMessage={"Oops, you’ve reached the character limit."}
              />
              <SelectCMS
                selectId={"Industry"}
                selectName={"Business Industry"}
                selectIcon={<Flag className="size-5" />}
                disabled={true}
              >
                <option value={"test"}>Media & News</option>
                <option value={"test"}>Agrotechno</option>
              </SelectCMS>
              <SelectCMS
                selectId={"entrepreneur-stage"}
                selectName={"Stage"}
                selectIcon={<Sprout className="size-5" />}
                disabled={true}
              >
                <option value={"test"}>Growth Stage</option>
                <option value={"test"}>Aspiring</option>
              </SelectCMS>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
