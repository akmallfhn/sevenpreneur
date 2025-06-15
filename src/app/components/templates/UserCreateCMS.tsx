"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AppButton from "@/app/components/elements/AppButton";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import { CalendarRange, Loader2, PlusCircle, Save } from "lucide-react";
import InputCMS from "@/app/components/elements/InputCMS";
import SelectCMS from "@/app/components/elements/SelectCMS";
import StatusLabelCMS from "@/app/components/elements/StatusLabelCMS";
import TextAreaCMS from "@/app/components/elements/TextAreaCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import { User2, AtSign, KeyRound, Building2, Sprout, Flag } from "lucide-react";

interface CreateUserFormProps {
  sessionToken: string;
}

export default function CreateUserForm({ sessionToken }: CreateUserFormProps) {
  // --- Beginning State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    roleId: "",
    status: "",
    dateOfBirth: "",
    learningGoal: "",
    businessName: "",
    industry: "",
    entrepreneurStage: "",
  });

  // --- Set session token to client
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

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

  // --- Return data from tRPC
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

  // --- Extract variable
  const isLoading = isLoadingRoles || isLoadingIndustries || isLoadingStages;
  const isError = isErrorRoles || isErrorIndustries || isErrorStages;
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

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
    if (!formData.fullName) {
      setStatus("Need fill fullname field");
      setIsSubmitting(false);
      return;
    }
    if (!formData.email) {
      setStatus("Need email field");
      setIsSubmitting(false);
      return;
    }
    if (formData.roleId === "") {
      setStatus("Need role field");
      setIsSubmitting(false);
      return;
    }

    // -- POST to Database
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "f8d001c0-baaa-4215-9a6d-3555466f16cc",
          fullName: formData.fullName,
          email: formData.email,
          roleId: formData.roleId,
          status: formData.status,
          dateOfBirth: formData.dateOfBirth,
          learningGoal: formData.learningGoal,
          businessName: formData.businessName,
          industry: formData.industry,
          entrepreneurStage: formData.entrepreneurStage,
        }),
      });
      if (response.ok) {
        setStatus("Your message has been sent successfully!");
        setFormData({
          fullName: "",
          email: "",
          roleId: "",
          status: "",
          dateOfBirth: "",
          learningGoal: "",
          businessName: "",
          industry: "",
          entrepreneurStage: "",
        });
      } else {
        setStatus("Failed to send your message. Please try again later.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="index-article w-[1040px] flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
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
            <AppButton
              variant="cmsPrimary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <PlusCircle className="size-5" />
              )}
              Add New User
            </AppButton>
          </div>
        </div>
      </div>
      {status && <p className="text-black mt-4">{status}</p>}
      <div className="flex flex-col w-full gap-8 pb-20">
        {/* --- Personal Information */}
        <div className="personal-information-container flex flex-col w-full gap-5">
          <h2 className="label-name text-xl text-black font-brand font-bold">
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
                className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
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
              {/* -- Full Name */}
              <InputCMS
                inputId={"full-name"}
                inputName={"Full Name"}
                inputType={"text"}
                inputPlaceholder={"Type user name..."}
                inputIcon={<User2 className="size-5" />}
                value={formData.fullName}
                onInputChange={handleInputChange("fullName")}
                required={true}
              />
              {/* -- Email */}
              <InputCMS
                inputId={"email"}
                inputName={"Email"}
                inputType={"email"}
                inputPlaceholder={"Drop valid email..."}
                inputIcon={<AtSign className="size-5" />}
                value={formData.email}
                onInputChange={handleInputChange("email")}
                required={true}
              />
              {/* -- Role */}
              <SelectCMS
                selectId={"role"}
                selectName={"Role"}
                selectPlaceholder="Pick a user role"
                selectIcon={<KeyRound className="size-5" />}
                value={formData.roleId}
                onChange={handleInputChange("roleId")}
                required={true}
                options={
                  rolesData?.list?.map((role) => ({
                    label: role.name,
                    value: role.id,
                  })) || []
                }
              />
              {/* -- Status */}
              <div className="select-group-component flex flex-col gap-1">
                <label
                  htmlFor={"status"}
                  className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                >
                  Status <span className="text-red-700">*</span>
                </label>
                <StatusLabelCMS labelName={"active"} />
              </div>
            </div>

            {/* --- Data 2 */}
            <div className="data-2 flex flex-col w-full gap-4">
              {/* -- Date of Birth */}
              <InputCMS
                inputId={"date-of-birth"}
                inputName={"Date of Birth"}
                inputType={"date"}
                inputIcon={<CalendarRange className="size-5" />}
                value={formData.dateOfBirth}
                onInputChange={handleInputChange("dateOfBirth")}
              />
              {/* -- Learning Goals */}
              <TextAreaCMS
                textAreaId={"learning-goal"}
                textAreaName={"Learning Goal"}
                textAreaPlaceholder={"Summarize the learning focus"}
                textAreaHeight={"h-[120px]"}
                value={formData.learningGoal}
                onInputChange={handleInputChange("learningGoal")}
              />
            </div>
          </div>
        </div>

        {/* --- Business Information */}
        <div className="business-information-container flex flex-col w-full gap-5">
          <h2 className="label-name text-xl text-black font-brand font-bold">
            Business Information
          </h2>
          <div className="data flex flex-col w-full gap-4">
            {/* -- Business Name */}
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
              required={true}
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
              required={true}
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
    </form>
  );
}
