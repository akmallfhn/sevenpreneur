"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TitleRevealCMS from "../elements/TitleRevealCMS";
import InputCMS from "../elements/InputCMS";
import SelectCMS from "../elements/SelectCMS";
import AppButton from "../elements/AppButton";
import TextAreaCMS from "../elements/TextAreaCMS";
import StatusLabelCMS, { Variant } from "../elements/StatusLabelCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import {
  User2,
  AtSign,
  KeyRound,
  Building2,
  Sprout,
  Flag,
  Loader2,
  Settings2,
} from "lucide-react";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

interface UserProfileDetailCMSProps {
  sessionToken: string;
  userId: string;
}

export default function UserProfileDetailCMS({
  sessionToken,
  userId,
}: UserProfileDetailCMSProps) {
  // --- Set Session Token to Header
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Return Data from TRPC
  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail,
    isError: isErrorUserDetail,
  } = trpc.read.user.useQuery(
    { id: userId },
    {
      enabled: !!sessionToken,
    }
  );
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

  // Extract variable
  const isLoading =
    isLoadingUserDetail ||
    isLoadingRoles ||
    isLoadingIndustries ||
    isLoadingStages;
  const isError =
    isErrorUserDetail || isErrorRoles || isErrorIndustries || isErrorStages;
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

  return (
    <div className="index-article w-[1040px] flex flex-col gap-4">
      {/* --- PAGE HEADER */}
      <div className="page-header flex flex-col gap-3">
        <div className="page-title-actions flex justify-between items-center">
          {/* --- Page Title */}
          <TitleRevealCMS
            titlePage={"Detail Profile"}
            descPage={
              "Everything you need to know about your users — all in one centralized, easy-to-manage screen."
            }
          />
          {/* --- Page Actions */}
          <Link href={`/users/${userId}/edit`} className="w-fit h-fit">
            <AppButton variant="cmsPrimary">
              <Settings2 className="size-5" />
              Edit Profile
            </AppButton>
          </Link>
        </div>
      </div>
      <div className="flex w-full gap-6">
        {/* --- LEFT SIDE */}
        <div className="left-side flex flex-col flex-1/2 gap-4">
          {/* --- Profile Container */}
          <div className="profile-container relative flex w-full bg-[#FAFAFA] p-5 rounded-xl overflow-hidden">
            <div className="background-image absolute flex top-0 left-0 w-full h-20 z-0">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://i.pinimg.com/736x/ef/9b/3c/ef9b3cd372960dcbd6cfa49a690430be.jpg"
                }
                alt="Foto Profile"
                width={500}
                height={500}
              />
            </div>
            <div className="user-group flex flex-col gap-2 z-20">
              <div className="user-avatar max-w-24 border-4 bg-[#0279D5] border-white aspect-square rounded-4xl overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={
                    userDetailData?.user.avatar ||
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                  }
                  alt="Foto Profile"
                  width={500}
                  height={500}
                />
              </div>
              <div className="user-name-login flex flex-col gap-1">
                <h2 className="user-name font-brand text-lg font-bold">
                  {userDetailData?.user.full_name}
                </h2>
                <p className="last-login font-bodycopy font-medium text-alternative text-sm">
                  Last login {dayjs(userDetailData?.user.last_login).fromNow()}
                </p>
              </div>
              <div className="user-id-container flex font-bodycopy font-medium items-center gap-2">
                <p className="user-id p-1 px-2 bg-white  border border-[#E3E3E3] rounded-full text-sm">
                  <span className="font-bold text-black">User ID:</span>{" "}
                  {userDetailData?.user.id}
                </p>
              </div>
            </div>
          </div>

          {/* --- Personal Information */}
          <div className="personal-information-container flex flex-col w-full h-fit bg-[#FAFAFA] gap-5 p-5 rounded-xl">
            <h2 className="label-name font-brand font-bold">
              Personal Information
            </h2>
            <div className="personal-information-data flex flex-col w-full gap-4">
              <InputCMS
                inputId={"full-name"}
                inputName={"Full Name"}
                inputType={"text"}
                inputIcon={<User2 className="size-5" />}
                value={userDetailData?.user.full_name || ""}
                disabled={true}
                required={true}
              />
              <InputCMS
                inputId={"email"}
                inputName={"Email"}
                inputType={"email"}
                inputIcon={<AtSign className="size-5" />}
                value={userDetailData?.user.email || ""}
                disabled={true}
                required={true}
              />
              <SelectCMS
                selectId={"role"}
                selectName={"Role"}
                selectIcon={<KeyRound className="size-5" />}
                selectPlaceholder="Select Role"
                value={userDetailData?.user.role_id}
                disabled={true}
                required={true}
                options={rolesData?.list?.map((post) => ({
                  label: post.name,
                  value: post.id,
                }))}
              />

              <div className="select-group-component flex flex-col gap-1">
                {/* --- Label */}
                <label
                  htmlFor={"status"}
                  className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
                >
                  Status <span className="text-red-700">*</span>{" "}
                </label>
                <StatusLabelCMS
                  labelName={userDetailData?.user.status ?? "INACTIVE"}
                  variants={
                    (userDetailData?.user.status ?? "INACTIVE") as Variant
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE */}
        <div className="right-side flex flex-col flex-1/2 gap-4">
          {/* --- Learning Goals */}
          <div className="learning-goals-container flex flex-col w-full h-fit bg-[#FAFAFA] gap-5 p-5 rounded-xl overflow-hidden">
            <h2 className="label-name font-brand font-bold">Learning Goals</h2>
            <TextAreaCMS
              textAreaId={"learning-goal"}
              textAreaName={"Learning Goal"}
              textAreaPlaceholder={"None"}
              textAreaHeight={"h-[120px]"}
              value={userDetailData?.user.learning_goal || ""}
              disabled={true}
            />
          </div>

          {/* --- Business Information */}
          <div className="business-information-container flex flex-col w-full h-fit bg-[#FAFAFA] gap-5 p-5 rounded-xl overflow-hidden">
            <h2 className="label-name font-brand font-bold">
              Business Information
            </h2>
            <div className="business-information-data flex flex-col w-full gap-4">
              <InputCMS
                inputId={"business-name"}
                inputName={"Business Name"}
                inputType={"text"}
                inputPlaceholder={"None"}
                inputIcon={<Building2 className="size-5" />}
                value={userDetailData?.user.business_name || ""}
                disabled={true}
              />
              <SelectCMS
                selectId={"entrepreneur-stage"}
                selectName={"Entrepreneur Stage"}
                selectIcon={<Sprout className="size-5" />}
                selectPlaceholder="None"
                value={userDetailData?.user.entrepreneur_stage_id}
                disabled={true}
                options={stagesData?.list?.map((post) => ({
                  label: post.name,
                  value: post.id,
                }))}
              />
              <SelectCMS
                selectId={"industry"}
                selectName={"Business Industry"}
                selectIcon={<Flag className="size-5" />}
                selectPlaceholder="None"
                value={userDetailData?.user.industry_id}
                disabled={true}
                options={
                  industriesData?.list?.map((post) => ({
                    label: post.name,
                    value: post.id,
                  })) || []
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
