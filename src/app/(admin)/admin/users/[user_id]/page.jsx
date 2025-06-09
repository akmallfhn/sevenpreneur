import Link from "next/link";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import AppButton from "@/app/components/elements/AppButton";
import Image from "next/image";
import {
  AtSign,
  Building2,
  Flag,
  KeyRound,
  Settings2,
  Sprout,
  User2,
} from "lucide-react";
import InputCMS from "@/app/components/elements/InputCMS";
import SelectCMS from "@/app/components/elements/SelectCMS";
import StatusLabelCMS from "@/app/components/elements/StatusLabelCMS";

export default function UserDetailPage() {
  return (
    <div className="root flex w-full h-full justify-center bg-main-root py-8 overflow-y-auto lg:pl-64">
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
            <Link href={"/users/create"} className="w-fit h-fit">
              <AppButton variant="cmsPrimary">
                <Settings2 className="size-5" />
                Edit Profile
              </AppButton>
            </Link>
          </div>
        </div>

        {/* --- PROFILE USER */}
        <div className="flex w-full gap-6">
          {/* --- LEFT SIDE */}
          <div className="left-side flex flex-col flex-1/2 gap-4">
            {/* --- Profile Container */}
            <div className="profile-container relative flex w-full bg-[#F7F7F7] p-5 rounded-xl overflow-hidden">
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
                    src={"https://i.pravatar.cc/150?img=3"}
                    alt="Foto Profile"
                    width={500}
                    height={500}
                  />
                </div>
                <div className="user-name-login flex flex-col gap-1">
                  <h2 className="user-name font-brand text-lg font-bold">
                    Akmal Luthfiansyah
                  </h2>
                  <p className="last-login font-bodycopy font-medium text-alternative text-sm">
                    Last login 4 minutes ago
                  </p>
                </div>
                <div className="user-id-container flex font-bodycopy font-medium items-center gap-2">
                  <p className="user-id p-1 px-2 bg-white  border border-[#E3E3E3] rounded-full text-sm">
                    <span className="font-bold text-black">User ID:</span>{" "}
                    f1d27a50-00f1-48c0-9265-c516ae1f532a
                  </p>
                  <AppButton variant="outline" size="small">
                    Copy
                  </AppButton>
                </div>
              </div>
            </div>

            {/* --- Personal Information */}
            <div className="personal-information-container flex flex-col w-full h-fit bg-[#F7F7F7] gap-2 p-5 rounded-xl overflow-hidden">
              <h2 className="label-name font-brand font-bold">
                Personal Information
              </h2>
              <InputCMS
                inputId={"full-name"}
                inputName={"Full Name"}
                inputType={"text"}
                inputIcon={<User2 className="size-5" />}
                value={"Akmal Luthfiansyah"}
                disabled={true}
              />
              <InputCMS
                inputId={"email"}
                inputName={"Email"}
                inputType={"email"}
                inputIcon={<AtSign className="size-5" />}
                value={"akmalluthfiansyah@gmail.com"}
                disabled={true}
              />
              <SelectCMS
                selectId={"role"}
                selectName={"Role"}
                selectIcon={<KeyRound className="size-5" />}
                disabled={true}
              >
                <option value={"test"}>Administrator</option>
                <option value={"test"}>Class Manager</option>
              </SelectCMS>
              <div className="select-group-component flex flex-col gap-1">
                {/* --- Label */}
                <label
                  htmlFor={"test"}
                  className="flex pl-1 text-sm font-bodycopy font-semibold"
                >
                  Status
                </label>
                <StatusLabelCMS labelName={"active"} />
              </div>
            </div>

            {/* --- Cohort History */}
            <div className="business-information-container flex flex-col w-full h-[520px] bg-[#F7F7F7] gap-2 p-5 rounded-xl overflow-hidden">
              <h2 className="label-name font-brand font-bold">
                Cohort History
              </h2>
            </div>
          </div>

          {/* --- RIGHT SIDE */}
          <div className="right-side flex flex-col flex-1/2 gap-4">
            {/* --- Learning Goals */}
            <div className="learning-goals-container flex flex-col w-full h-fit bg-[#F7F7F7] gap-2 p-5 rounded-xl overflow-hidden">
              <h2 className="label-name font-brand font-bold">
                Learning Goals
              </h2>
              <textarea
                type="text"
                placeholder="Test"
                disabled
                className="bg-white font-bodycopy text-sm p-2 h-24 rounded-lg border border-[#E3E3E3] resize-none"
                value={
                  "Saya ingin menjadi 9 naga pertama yang lahir di Pontianak bahkan di dunia. Saya ingin menaklukan orang-orang Amerika dan seluruh dunia"
                }
              />
            </div>

            {/* --- Business Information */}
            <div className="business-information-container flex flex-col w-full h-fit bg-[#F7F7F7] gap-2 p-5 rounded-xl overflow-hidden">
              <h2 className="label-name font-brand font-bold">
                Business Information
              </h2>
              <InputCMS
                inputId={"business-name"}
                inputName={"Business Name"}
                inputType={"text"}
                inputIcon={<Building2 className="size-5" />}
                value={"Elang Mahkota Teknologi"}
                disabled={true}
              />
              <SelectCMS
                selectId={"entrepreneur-stage"}
                selectName={"Stage"}
                selectIcon={<Sprout className="size-5" />}
                disabled={true}
              >
                <option value={"test"}>Growth Stage</option>
                <option value={"test"}>Aspiring</option>
              </SelectCMS>
              <SelectCMS
                selectId={"Industry"}
                selectName={"Business Industry"}
                selectIcon={<Flag className="size-5" />}
                disabled={true}
              >
                <option value={"test"}>Media & News</option>
                <option value={"test"}>Agrotechno</option>
              </SelectCMS>
            </div>

            {/* --- Transaction History */}
            <div className="business-information-container flex flex-col w-full h-[520px] bg-[#F7F7F7] gap-2 p-5 rounded-xl overflow-hidden">
              <h2 className="label-name font-brand font-bold">
                Transaction History
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
