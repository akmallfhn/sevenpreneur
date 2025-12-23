"use client";
import { StatusType } from "@/lib/app-types";
import { useClipboard } from "@/lib/use-clipboard";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleStar,
  Copy,
  Flag,
  KeyRound,
  Loader2,
  Scale,
  Settings2,
  User2,
  UserStar,
  Vegan,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import InputNumberCMS from "../fields/InputNumberCMS";
import SelectCMS from "../fields/SelectCMS";
import UserTransactionItemCMS from "../items/UserTransactionItemCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import TitleRevealCMS from "../titles/TitleRevealCMS";
import TextAreaCMS from "../fields/TextAreaCMS";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

interface UserDetailsCMSProps {
  sessionToken: string;
  userId: string;
}

export default function UserDetailsCMS(props: UserDetailsCMSProps) {
  const { copy } = useClipboard();

  // Fetch tRPC data
  const {
    data: userDetailData,
    isLoading: isLoadingUserDetail,
    isError: isErrorUserDetail,
  } = trpc.read.user.useQuery(
    { id: props.userId },
    {
      enabled: !!props.sessionToken,
    }
  );
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = trpc.list.roles.useQuery(undefined, { enabled: !!props.sessionToken });
  const {
    data: industriesData,
    isLoading: isLoadingIndustries,
    isError: isErrorIndustries,
  } = trpc.list.industries.useQuery(undefined, {
    enabled: !!props.sessionToken,
  });
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
  } = trpc.list.transactions.useQuery(
    { user_id: props.userId },
    { enabled: !!props.sessionToken }
  );

  // Extract variable
  const isLoading =
    isLoadingUserDetail ||
    isLoadingRoles ||
    isLoadingIndustries ||
    isLoadingTransactions;
  const isError =
    isErrorUserDetail ||
    isErrorRoles ||
    isErrorIndustries ||
    isErrorTransactions;

  return (
    <div className="root hidden w-full h-full justify-center bg-white py-8 lg:flex lg:pl-64">
      <div className="page-container max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/users">Users</AppBreadcrumbItem>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem isCurrentPage>Profile</AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage={"Details Profile"}
              descPage={
                "View detailed user information, activity logs, and account status in a read-only profile view."
              }
            />
            <Link href={`/users/${props.userId}/edit`} className="w-fit h-fit">
              <AppButton variant="cmsPrimary">
                <Settings2 className="size-5" />
                Edit Profile
              </AppButton>
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}

        {!isLoading && !isError && userDetailData && (
          <div className="flex w-full gap-4">
            <div className="left-side flex flex-col flex-1 gap-4">
              <div className="profile-container relative flex w-full bg-section-background p-5 rounded-xl overflow-hidden">
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
                        userDetailData.user.avatar ||
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                      }
                      alt="Foto Profile"
                      width={500}
                      height={500}
                    />
                  </div>
                  <div className="user-name-login flex flex-col">
                    <h2 className="user-name font-brand text-lg font-bold">
                      {userDetailData.user.full_name}
                    </h2>
                    <p className="last-login font-bodycopy font-medium text-alternative text-sm">
                      Last login{" "}
                      {dayjs(userDetailData.user.last_login).fromNow()}
                    </p>
                    <div className="user-id flex font-bodycopy items-center gap-1 rounded-full text-sm">
                      <p className="font-medium text-alternative">
                        User ID: {userDetailData.user.id}
                      </p>
                      <AppButton
                        onClick={() => {
                          copy(userDetailData.user.id);
                          toast.success("Copied to clipboard");
                        }}
                        variant="ghost"
                        size="small"
                      >
                        <Copy className="text-[#333333] size-4" />
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="personal-information-container flex flex-col w-full h-fit bg-section-background gap-5 p-5 rounded-xl">
                <h2 className="label-name font-brand font-bold">
                  Personal Information
                </h2>
                <div className="personal-information-data flex flex-col w-full gap-4">
                  <InputCMS
                    inputId={"full-name"}
                    inputName={"Full Name"}
                    inputType={"text"}
                    inputIcon={<User2 className="size-5" />}
                    value={userDetailData.user.full_name || ""}
                    disabled
                  />
                  <InputCMS
                    inputId={"email"}
                    inputName={"Email"}
                    inputType={"email"}
                    inputIcon={<AtSign className="size-5" />}
                    value={userDetailData.user.email || ""}
                    disabled
                  />
                  <InputNumberCMS
                    inputId={"phone-number"}
                    inputName={"Phone Number"}
                    inputIcon={"🇮🇩 62"}
                    inputPlaceholder="None"
                    inputConfig="numeric"
                    value={userDetailData.user.phone_number || ""}
                    disabled
                  />
                  <SelectCMS
                    selectId={"occupation"}
                    selectName={"Occupation"}
                    selectIcon={<BriefcaseBusiness className="size-5" />}
                    selectPlaceholder="None"
                    value={userDetailData.user.occupation}
                    disabled
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
                        label: "Student",
                        value: "STUDENT",
                      },
                      {
                        label: "Freelance",
                        value: "FREELANCE",
                      },
                      {
                        label: "Military",
                        value: "MILITARY",
                      },
                    ]}
                  />
                  <SelectCMS
                    selectId={"role"}
                    selectName={"Role"}
                    selectIcon={<KeyRound className="size-5" />}
                    selectPlaceholder="None"
                    value={userDetailData.user.role_id}
                    disabled
                    options={rolesData?.list?.map((post) => ({
                      label: post.name,
                      value: post.id,
                    }))}
                  />
                  <div className="select-group-component flex flex-col gap-1">
                    <label
                      htmlFor={"status"}
                      className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
                    >
                      Status <span className="text-red-700">*</span>{" "}
                    </label>
                    <StatusLabelCMS
                      variants={userDetailData.user.status as StatusType}
                    />
                  </div>
                </div>
              </div>
              <div className="transactions-container flex flex-col w-full h-fit bg-section-background gap-5 p-5 rounded-xl overflow-hidden">
                <h2 className="label-name font-brand font-bold">
                  Transaction History
                </h2>
                {(transactionsData?.list ?? []).length > 0 ? (
                  <div className="transaction-list flex flex-col w-full max-h-[230px] p-1 gap-1 bg-white rounded-lg border border-outline overflow-y-auto">
                    {transactionsData?.list.map((post) => (
                      <UserTransactionItemCMS
                        key={post.id}
                        transactionId={post.id}
                        transactionStatus={post.status}
                        netTransactionAmount={post.net_amount}
                        productCategory={post.category}
                        playlistName={post.playlist_name}
                        cohortName={post.cohort_name}
                        cohortPriceName={post.cohort_price_name}
                        eventName={post.event_name}
                        eventPriceName={post.event_price_name}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
                    No Transactions
                  </div>
                )}
              </div>
            </div>
            <div className="right-side flex flex-col flex-1 gap-4">
              <div className="business-information-container flex flex-col w-full h-fit bg-section-background gap-5 p-5 rounded-xl overflow-hidden">
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
                    value={userDetailData.user.business_name || ""}
                    disabled
                  />
                  <TextAreaCMS
                    textAreaId="business-description"
                    textAreaName="Business Description"
                    textAreaHeight="h-44"
                    textAreaPlaceholder="None"
                    value={userDetailData.user.business_description || ""}
                    disabled
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <SelectCMS
                      selectId={"industry"}
                      selectName={"Industry"}
                      selectIcon={<Flag className="size-5" />}
                      selectPlaceholder="None"
                      value={userDetailData.user.industry_id}
                      disabled
                      options={
                        industriesData?.list?.map((post) => ({
                          label: post.name,
                          value: post.id,
                        })) || []
                      }
                    />
                    <InputCMS
                      inputId="business-age-years"
                      inputName="Business Age (years)"
                      inputIcon={<Vegan className="size-5" />}
                      inputType={"text"}
                      inputPlaceholder="None"
                      value={
                        userDetailData.user.business_age_years
                          ? String(userDetailData.user.business_age_years)
                          : ""
                      }
                      disabled
                    />
                  </div>
                  <SelectCMS
                    selectId={"business-yearly-revenue"}
                    selectName={"Yearly Revenue"}
                    selectIcon={<WalletCards className="size-5" />}
                    selectPlaceholder="None"
                    value={userDetailData.user.yearly_revenue}
                    disabled
                    options={[
                      {
                        label: "< 50 juta",
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
                        label: "> 25 miliar",
                        value: "ABOVE_25B",
                      },
                    ]}
                  />
                  <SelectCMS
                    selectId={"total-employees"}
                    selectName={"Total Employees"}
                    selectIcon={<UserStar className="size-5" />}
                    selectPlaceholder="None"
                    value={userDetailData.user.total_employees}
                    disabled
                    options={[
                      {
                        label: "1-10 employees",
                        value: "SMALL",
                      },
                      {
                        label: "11-50 employees",
                        value: "MEDIUM",
                      },
                      {
                        label: "51-100 employees",
                        value: "LARGE",
                      },
                      {
                        label: "101-500 employees",
                        value: "XLARGE",
                      },
                      {
                        label: ">500 employees",
                        value: "XXLARGE",
                      },
                    ]}
                  />
                  <SelectCMS
                    selectId={"business-legal-entity"}
                    selectName={"Legal Entity"}
                    selectIcon={<Scale className="size-5" />}
                    selectPlaceholder="None"
                    value={userDetailData.user.legal_entity_type}
                    disabled
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
                  />
                  <InputCMS
                    inputId="average-selling-price"
                    inputName="Average Selling Price"
                    inputIcon={
                      <p className="font-bodycopy text-sm font-medium">Rp</p>
                    }
                    inputPlaceholder="None"
                    inputType={"text"}
                    value={
                      userDetailData.user.average_selling_price
                        ? String(userDetailData.user.average_selling_price)
                        : ""
                    }
                    disabled
                  />
                  <InputCMS
                    inputId="company-profile"
                    inputName="Company Profile"
                    inputIcon={<CircleStar className="size-5" />}
                    inputPlaceholder="None"
                    inputType={"text"}
                    value={userDetailData.user.company_profile_url || ""}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
