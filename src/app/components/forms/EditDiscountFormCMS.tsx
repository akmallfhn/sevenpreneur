"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import AppButton from "../buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SelectCMS from "../fields/SelectCMS";
import dayjs from "dayjs";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import { Switch } from "@/components/ui/switch";
import { ProductCategory, StatusType } from "@/lib/app-types";

interface EditDiscountFormCMSProps {
  sessionToken: string;
  discountId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditDiscountFormCMS({
  sessionToken,
  discountId,
  isOpen,
  onClose,
}: EditDiscountFormCMSProps) {
  const editDiscount = trpc.update.discount.useMutation();
  const utils = trpc.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemOptions, setItemOptions] = useState<
    { label: string; value: number }[]
  >([]);

  // Fetch tRPC for Initial Data
  const {
    data,
    isLoading: isLoadingInitialData,
    isError: isErrorInitialData,
  } = trpc.read.discount.useQuery(
    { id: discountId },
    { enabled: !!sessionToken && !!discountId }
  );
  const initialData = data?.discount;

  // Beginning State
  const [formData, setFormData] = useState<{
    discountName: string;
    discountCode: string;
    discountRate: string;
    discountStartDate: string;
    discountEndDate: string;
    discountStatus: StatusType | null;
    productCategory: ProductCategory | null;
    productItem: number | undefined;
  }>({
    discountName: initialData?.name.trim() ? initialData.name : "",
    discountCode: initialData?.code.trim() ? initialData.code : "",
    discountRate: initialData?.calc_percent.trim()
      ? initialData.calc_percent
      : "",
    discountStartDate: initialData?.start_date
      ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
      : "",
    discountEndDate: initialData?.end_date
      ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
      : "",
    discountStatus: initialData?.status ?? null,
    productCategory: initialData?.category ?? null,
    productItem: initialData?.item_id ? initialData.item_id : undefined,
  });

  // Iterate initial data (so it doesn't get lost)
  useEffect(() => {
    if (initialData) {
      setFormData({
        discountName: initialData?.name.trim() ? initialData.name : "",
        discountCode: initialData?.code.trim() ? initialData.code : "",
        discountRate: initialData?.calc_percent.trim()
          ? initialData.calc_percent
          : "",
        discountStartDate: initialData?.start_date
          ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
          : "",
        discountEndDate: initialData?.end_date
          ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
          : "",
        discountStatus: initialData?.status ?? null,
        productCategory: initialData?.category ?? null,
        productItem: initialData?.item_id ? initialData.item_id : undefined,
      });
    }
  }, [initialData]);

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

  // Fetch tRPC for Product Item
  const {
    data: playlistData,
    isLoading: isLoadingPlaylistData,
    isError: isErrorPlaylistData,
  } = trpc.list.playlists.useQuery(
    {},
    { enabled: formData.productCategory === "PLAYLIST" && !!sessionToken }
  );
  const {
    data: cohortData,
    isLoading: isLoadingCohortData,
    isError: isErrorCohortData,
  } = trpc.list.cohorts.useQuery(
    {},
    { enabled: formData.productCategory === "COHORT" && !!sessionToken }
  );
  const isLoading = isLoadingCohortData || isLoadingPlaylistData;
  const isError = isErrorCohortData || isErrorPlaylistData;

  // Conditional Fetch Data Product Item
  useEffect(() => {
    if (formData.productCategory === "PLAYLIST") {
      setItemOptions(
        playlistData?.list.map((post: any) => ({
          label: post.name,
          value: post.id,
        })) || []
      );
    } else if (formData.productCategory === "COHORT") {
      setItemOptions(
        cohortData?.list.flatMap((post: any) =>
          post.prices.map((price: any) => ({
            label: `${price.name} - ${post.name}`,
            value: price.id,
          }))
        ) || []
      );
    }
  }, [formData.productCategory, playlistData, cohortData]);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // -- Required field checking
    if (!formData.discountName) {
      toast.error("Oops! Don’t forget to give your discount a name.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.discountCode) {
      toast.error("Promo code cannot be empty");
      setIsSubmitting(false);
      return;
    }
    if (/\s/.test(formData.discountCode)) {
      toast.error("Promo code cannot be contain spaces");
      setIsSubmitting(false);
      return;
    }
    if (!formData.discountRate) {
      toast.error("Add a discount rate to make it work.");
      setIsSubmitting(false);
      return;
    }
    if (isNaN(Number(formData.discountRate))) {
      toast.error("Hmm… that doesn’t look like a valid number for the rate");
      setIsSubmitting(false);
      return;
    }
    if (!formData.discountStartDate) {
      toast.error("Pick a start date to kick things off");
      setIsSubmitting(false);
      return;
    }
    if (!formData.discountStartDate) {
      toast.error("Pick a start date to kick things off");
      setIsSubmitting(false);
      return;
    }
    if (!formData.discountEndDate) {
      toast.error("Define the expiry date.");
      setIsSubmitting(false);
      return;
    }
    if (
      dayjs(formData.discountEndDate).isBefore(
        dayjs(formData.discountStartDate)
      )
    ) {
      toast.error("Oops! End date must come after the start date");
      setIsSubmitting(false);
      return;
    }
    if (!formData.productCategory) {
      toast.error("Choose a category so we know where this discount belongs");
      setIsSubmitting(false);
      return;
    }
    if (!formData.productItem) {
      toast.error("Pick a product item to apply this discount magic");
      setIsSubmitting(false);
      return;
    }

    // -- POST to Database
    try {
      editDiscount.mutate(
        {
          // Mandatory fields:
          id: discountId,
          name: formData.discountName.trim(),
          status: formData.discountStatus as StatusType,
          code: formData.discountCode.trim().toUpperCase(),
          calc_percent: Number(formData.discountRate),
          start_date: new Date(formData.discountStartDate).toISOString(),
          end_date: new Date(formData.discountEndDate).toISOString(),
          category: formData.productCategory as ProductCategory,
          item_id: formData.productItem
            ? Number(formData.productItem)
            : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Discount successfully updated");
            setIsSubmitting(false);
            utils.list.discounts.invalidate();
            utils.read.discount.invalidate();
            onClose();
          },
          onError: (error) => {
            toast.error("Something went wrong while updating the discount", {
              description: error.message,
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
      sheetName="Edit Discount"
      sheetDescription="Update the details of an existing discount with ease"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-68 gap-5 overflow-y-auto">
          {isLoadingInitialData && (
            <div className="flex w-full h-full py-4 items-center justify-center text-alternative">
              <Loader2 className="animate-spin size-5 " />
            </div>
          )}
          {isErrorInitialData && (
            <div className="flex w-full h-full py-4 items-center justify-center text-alternative font-bodycopy font-medium">
              No Data
            </div>
          )}
          {initialData && !isLoadingInitialData && !isErrorInitialData && (
            <div className="group-input flex flex-col gap-4">
              <InputCMS
                inputId="discount-name"
                inputName="Discount Name"
                inputType="text"
                inputPlaceholder="e.g. Summer Sale 2025"
                value={formData.discountName}
                onInputChange={handleInputChange("discountName")}
                required
              />
              <div className="flex gap-4 justify-between">
                <div className="w-full flex-1">
                  <InputCMS
                    inputId="discount-code"
                    inputName="Promo Code"
                    inputType="text"
                    inputPlaceholder="e.g. SUMMER25"
                    value={formData.discountCode}
                    onInputChange={handleInputChange("discountCode")}
                    required
                  />
                </div>
                <div className="w-full flex-1">
                  <InputCMS
                    inputId="discount-rate"
                    inputName="Discount Percentage (%)"
                    inputType="text"
                    inputMode="numeric"
                    pattern="\d*"
                    inputPlaceholder="e.g. 20"
                    value={formData.discountRate}
                    onInputChange={handleInputChange("discountRate")}
                    characterLength={2}
                    required
                  />
                </div>
              </div>
              <InputCMS
                inputId="discount-start-date"
                inputName="Available from"
                inputType="datetime-local"
                value={formData.discountStartDate}
                onInputChange={handleInputChange("discountStartDate")}
                required
              />
              <InputCMS
                inputId="discount-end-date"
                inputName="Valid until"
                inputType="datetime-local"
                value={formData.discountEndDate}
                onInputChange={handleInputChange("discountEndDate")}
                required
              />
              <div className="status flex flex-col gap-1">
                <label
                  htmlFor={"discount-status"}
                  className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
                >
                  Status <span className="text-red-700">*</span>
                </label>
                <div className="switch-button flex pl-1 gap-2">
                  <Switch
                    className="data-[state=checked]:bg-cms-primary"
                    checked={formData.discountStatus === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      handleInputChange("discountStatus")(
                        checked ? "ACTIVE" : "INACTIVE"
                      )
                    }
                  />
                  {formData.discountStatus && (
                    <StatusLabelCMS variants={formData.discountStatus} />
                  )}
                </div>
              </div>
              <div className="flex flex-col bg-section-background/50 border border-outline gap-4 p-4 rounded-md">
                <h5 className="font-bodycopy font-bold text-sm">
                  Applies Discount to Product
                </h5>
                <SelectCMS
                  selectId="product-category"
                  selectName="Product Category"
                  selectPlaceholder="Choose a product category"
                  value={formData.productCategory}
                  onChange={handleInputChange("productCategory")}
                  required
                  options={[
                    {
                      label: "Cohort",
                      value: "COHORT",
                    },
                    {
                      label: "Playlist",
                      value: "PLAYLIST",
                    },
                  ]}
                />
                {isLoading && (
                  <div className="flex w-full h-full py-4 items-center justify-center text-alternative">
                    <Loader2 className="animate-spin size-5 " />
                  </div>
                )}
                {isError && (
                  <div className="flex w-full h-full py-4 items-center justify-center text-alternative font-bodycopy font-medium">
                    No Data
                  </div>
                )}
                {formData.productCategory && !isLoading && !isError && (
                  <SelectCMS
                    selectId="product-item"
                    selectName="Product Item"
                    selectPlaceholder="Select specific products"
                    value={formData.productItem}
                    onChange={handleInputChange("productItem")}
                    options={itemOptions}
                    required
                  />
                )}
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Update Discount
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
