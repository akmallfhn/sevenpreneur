"use client";
import { useEffect } from "react";
import Image from "next/image";
import InputCMS from "../elements/InputCMS";
import SelectCMS from "../elements/SelectCMS";
import AppButton from "../elements/AppButton";
import TextAreaCMS from "../elements/TextAreaCMS";
import StatusLabelCMS from "../elements/StatusLabelCMS";
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
  const { data, isLoading } = trpc.read.user.useQuery(
    { id: userId },
    { enabled: !!userId }
  );
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

  return (
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
            <div className="user-avatar max-w-24 border-4 border-white aspect-square rounded-4xl overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={data.user.avatar || "https://i.pravatar.cc/150?img=3"}
                alt="Foto Profile"
                width={500}
                height={500}
              />
            </div>
            <div className="user-name-login flex flex-col gap-1">
              <h2 className="user-name font-brand text-lg font-bold">
                {data.user.full_name}
              </h2>
              <p className="last-login font-bodycopy font-medium text-alternative text-sm">
                Last login {dayjs(data.user.last_login).fromNow()}
              </p>
            </div>
            <div className="user-id-container flex font-bodycopy font-medium items-center gap-2">
              <p className="user-id p-1 px-2 bg-white  border border-[#E3E3E3] rounded-full text-sm">
                <span className="font-bold text-black">User ID:</span>{" "}
                {data.user.id}
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
              value={data.user.full_name || ""}
              disabled={true}
              required={true}
            />
            <InputCMS
              inputId={"email"}
              inputName={"Email"}
              inputType={"email"}
              inputIcon={<AtSign className="size-5" />}
              value={data.user.email || ""}
              disabled={true}
              required={true}
            />
            <SelectCMS
              selectId={"role"}
              selectName={"Role"}
              selectIcon={<KeyRound className="size-5" />}
              selectPlaceholder="Select Role"
              value={"admin"}
              disabled={true}
              required={true}
              options={[
                { value: "admin", label: "Administrator" },
                { value: "class manager", label: "Class Manager" },
              ]}
            />

            <div className="select-group-component flex flex-col gap-1">
              {/* --- Label */}
              <label
                htmlFor={"status"}
                className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
              >
                Status <span className="text-red-700">*</span>
              </label>
              <StatusLabelCMS
                labelName={data.user.status.toLowerCase()}
                variants={data.user.status.toLowerCase()}
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
            value={data.user.learning_goal || ""}
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
              value={data.user.business_name || ""}
              disabled={true}
            />
            <SelectCMS
              selectId={"entrepreneur-stage"}
              selectName={"Entrepreneur Stage"}
              selectIcon={<Sprout className="size-5" />}
              selectPlaceholder="None"
              value={data.user.entrepreneur_stage_id}
              disabled={true}
              options={[
                { value: 1, label: "Aspiring Entrepreneur" },
                { value: 2, label: "Growth" },
              ]}
            />
            <SelectCMS
              selectId={"industry"}
              selectName={"Business Industry"}
              selectIcon={<Flag className="size-5" />}
              selectPlaceholder="None"
              value={data.user.industry_id}
              disabled={true}
              options={[
                { value: 36, label: "Technology" },
                { value: 2, label: "Education" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
