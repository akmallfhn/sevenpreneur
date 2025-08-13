"use client";
import { useState, useEffect, FormEvent } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import AppButton from "../buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SelectCMS from "../fields/SelectCMS";
import { ProductCategory } from "../labels/ProductCategoryLabelCMS";

interface CreateDiscountFormCMSProps {
  sessionToken: string;
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateDiscountFormCMS({
  sessionToken,
  cohortId,
  isOpen,
  onClose,
}: CreateDiscountFormCMSProps) {
  const createDiscount = trpc.create.discount.useMutation();
  const utils = trpc.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemOptions, setItemOptions] = useState<
    { label: string; value: number }[]
  >([]);

  // --- Beginning State
  const [formData, setFormData] = useState<{
    discountName: string;
    discountCode: string;
    discountRate: number;
    discountStartDate: string;
    discountEndDate: string;
    productCategory: ProductCategory | "";
    productItem: number;
  }>({
    discountName: "",
    discountCode: "",
    discountRate: 0,
    discountStartDate: "",
    discountEndDate: "",
    productCategory: "",
    productItem: 0,
  });

  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

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
  const { data: playlistData } = trpc.list.playlists.useQuery(
    {},
    { enabled: formData.productCategory === "PLAYLIST" && !!sessionToken }
  );
  const { data: cohortData } = trpc.list.cohorts.useQuery(
    {},
    { enabled: formData.productCategory === "COHORT" && !!sessionToken }
  );

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
        cohortData?.list.map((post: any) => ({
          label: `${post.name}`,
          value: post.id,
        })) || []
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
      toast.error("Don’t leave the session untitled");
      setIsSubmitting(false);
      return;
    }

    // -- POST to Database
    try {
      createDiscount.mutate(
        {
          // Mandatory fields:
          name: formData.discountName.trim(),
          status: "ACTIVE",
          code: formData.discountCode.trim(),
          calc_percent: 20,
          start_date: new Date(formData.discountStartDate).toISOString(),
          end_date: new Date(formData.discountEndDate).toISOString(),
          category: formData.productCategory as ProductCategory,
          item_id: formData.productItem,
        },
        {
          onSuccess: () => {
            toast.success("Discount successfully created");
            setIsSubmitting(false);
            utils.list.discounts.invalidate();
            onClose();
          },
          onError: (err) => {
            toast.error("Something went wrong while creating the discount", {
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
      sheetName="New Discount"
      sheetDescription="Set up discounts to boost sales and engage customers"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-68 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <InputCMS
              inputId="discount-name"
              inputName="Name"
              inputType="text"
              inputPlaceholder="What’s the topic of this meeting?"
              value={formData.discountName}
              onInputChange={handleInputChange("discountName")}
              required
            />
            <InputCMS
              inputId="discount-code"
              inputName="Code"
              inputType="text"
              inputPlaceholder="What’s the topic of this meeting?"
              value={formData.discountCode}
              onInputChange={handleInputChange("discountCode")}
              required
            />
            <div className="flex gap-4 justify-between">
              <InputCMS
                inputId="discount-start-date"
                inputName="Start"
                inputType="datetime-local"
                value={formData.discountStartDate}
                onInputChange={handleInputChange("discountStartDate")}
                required
              />
              <InputCMS
                inputId="discount-end-date"
                inputName="End"
                inputType="datetime-local"
                value={formData.discountEndDate}
                onInputChange={handleInputChange("discountEndDate")}
                required
              />
            </div>
            <SelectCMS
              selectId="product-category"
              selectName="Category"
              selectPlaceholder="Choose how this session will be delivered"
              value={formData.productCategory}
              onChange={handleInputChange("productCategory")}
              required
              options={[
                // {
                //   label: "Cohort",
                //   value: "COHORT",
                // },
                {
                  label: "Playlist",
                  value: "PLAYLIST",
                },
              ]}
            />
            {formData.productCategory && (
              <SelectCMS
                selectId="product-item"
                selectName="Product Item"
                selectPlaceholder="Select person to leading this session"
                value={formData.productItem}
                onChange={handleInputChange("productItem")}
                options={itemOptions}
                required
              />
            )}
          </div>
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Add New Discount
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
