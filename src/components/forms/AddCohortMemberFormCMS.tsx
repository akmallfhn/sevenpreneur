"use client";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppInput from "../fields/AppInput";
import AppSelect from "../fields/AppSelect";
import AppSheet from "../modals/AppSheet";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface AddCohortMemberFormCMSProps {
  sessionToken: string;
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCohortMemberFormCMS(
  props: AddCohortMemberFormCMSProps
) {
  const utils = trpc.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fillUserMethod, setFillUserMethod] = useState<"SELECT" | "INPUT">(
    "SELECT"
  );
  const addCohortMember = trpc.create.cohortMember.useMutation();

  // Fetch data from tRPC
  const {
    data: cohortDetailsData,
    isLoading: isLoadingCohortDetails,
    isError: isErrorCohortDetails,
  } = trpc.read.cohort.useQuery(
    { id: props.cohortId },
    { enabled: !!props.sessionToken }
  );
  const {
    data: userListData,
    isLoading: isLoadingUserList,
    isError: isErrorUserList,
  } = trpc.list.users.useQuery({}, { enabled: !!props.sessionToken });
  const userList = userListData?.list;

  const isLoading = isLoadingCohortDetails || isLoadingUserList;
  const isError = isErrorCohortDetails || isErrorUserList;

  // Beginning State
  const [formData, setFormData] = useState<{
    email: string;
    cohortPriceId: number | string;
  }>({
    email: "",
    cohortPriceId: "",
  });

  // Reset email every time fill method is changed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: "",
    }));
  }, [fillUserMethod]);

  // Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required field checking
    if (!formData.email) {
      toast.error("Don’t forget to select a user");
      setIsSubmitting(false);
      return;
    }
    if (!formData.cohortPriceId) {
      toast.error("Don’t forget to select a access tier");
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      addCohortMember.mutate(
        {
          // Mandatory fields:
          email: formData.email,
          cohort_id: props.cohortId,
          cohort_price_id: Number(formData.cohortPriceId),
        },
        {
          onSuccess: () => {
            toast.success("Member invited successfully.");
            setIsSubmitting(false);
            utils.list.cohortMembers.invalidate();
            props.onClose();
          },
          onError: (err) => {
            toast.error("Something went wrong while adding the member", {
              description: err.message,
            });
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Invite Members"
      sheetDescription="Invite members to your cohort and manage access"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        {isLoading && <AppLoadingComponents />}
        {isError && (
          <div className="flex w-full h-full py-10 items-center justify-center text-emphasis font-bodycopy font-medium">
            No Data
          </div>
        )}
        {!isLoading && !isError && (
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
            <div className="group-input flex flex-col gap-4">
              <AppSelect variant="CMS"
                selectId="cohort-price-id"
                selectName="Access Tier"
                selectPlaceholder="Choose access tier"
                value={Number(formData.cohortPriceId)}
                onChange={handleInputChange("cohortPriceId")}
                required
                options={cohortDetailsData?.cohort.cohort_prices.map(
                  (post) => ({
                    value: post.id,
                    label: post.name,
                  })
                )}
              />
              {fillUserMethod === "SELECT" && (
                <AppSelect variant="CMS"
                  selectId="user-email"
                  selectName="Select User"
                  selectPlaceholder="Select a user to invite"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  required
                  options={userList
                    ?.filter((user) => user.role_id !== 3)
                    .map((post) => ({
                      value: post.email,
                      label: post.full_name,
                      image:
                        post.avatar ||
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png",
                    }))}
                />
              )}
              {fillUserMethod === "INPUT" && (
                <AppInput variant="CMS"
                  inputId="user-email"
                  inputName="User Email"
                  inputType="text"
                  inputPlaceholder="Input Email User"
                  value={formData.email}
                  onInputChange={handleInputChange("email")}
                  required
                />
              )}
              <div className="fill-user-method flex flex-col gap-2">
                <label
                  htmlFor={"fill-user-method"}
                  className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                >
                  User not found?<span className="text-red-700">*</span>
                </label>
                <div className="switch-button flex items-center pl-1 gap-2">
                  <Switch
                    className="data-[state=checked]:bg-tertiary"
                    checked={fillUserMethod === "INPUT"}
                    onCheckedChange={(checked) =>
                      setFillUserMethod(checked ? "INPUT" : "SELECT")
                    }
                  />
                  <p className="font-bodycopy font-medium text-sm">
                    Manually enter User Email
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="tertiary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Invite as Member
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
