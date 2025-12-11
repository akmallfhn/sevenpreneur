"use client";
import { ProductCategory } from "@/lib/app-types";
import { getRupiahCurrency } from "@/lib/currency";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import PhoneNumberInputSVP from "../fields/PhoneNumberInputSVP";
import SelectCMS from "../fields/SelectCMS";
import ReceiptLineItemCMS from "../items/ReceiptLineItemCMS";
import AppSheet from "../modals/AppSheet";

interface DiscountType {
  name: string | undefined;
  code: string | undefined;
  calc_percent: number | undefined;
  category: ProductCategory;
  item_id: number | undefined;
}

interface CreateInvoiceFormCMSProps {
  sessionToken: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvoiceFormCMS({
  sessionToken,
  isOpen,
  onClose,
}: CreateInvoiceFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createInvoicePlaylist = trpc.purchase.playlist.useMutation();
  const createInvoiceCohort = trpc.purchase.cohort.useMutation();
  const createInvoiceEvent = trpc.purchase.event.useMutation();
  const [itemOptions, setItemOptions] = useState<
    { label: string; value: number; price: number }[]
  >([]);
  const [isLoadingApplyDiscount, setIsLoadingApplyDiscount] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [discount, setDiscount] = useState<DiscountType | null>(null);
  const utils = trpc.useUtils();

  // Beginning State
  const [formData, setFormData] = useState<{
    invoiceUserId: string;
    invoiceUserPhone: string;
    invoiceProductCategory: ProductCategory | null;
    invoiceProductItem: number | string;
    paymentChannelId: number | string;
    paymentDiscount: string;
  }>({
    invoiceUserId: "",
    invoiceUserPhone: "",
    invoiceProductCategory: null,
    invoiceProductItem: "",
    paymentChannelId: "",
    paymentDiscount: "",
  });

  // Fetch tRPC for Payment Channel
  const {
    data: paymentChannelData,
    isLoading: isLoadingPaymentChannelData,
    isError: isErrorPaymentChannelData,
  } = trpc.list.paymentChannels.useQuery({}, { enabled: !!sessionToken });
  const paymentChannelList = paymentChannelData?.list;

  const isLoading = isLoadingPaymentChannelData;
  const isError = isErrorPaymentChannelData;

  // Fetch tRPC for Product Item
  const {
    data: playlistsData,
    isLoading: isLoadingPlaylistsData,
    isError: isErrorPlaylistsData,
  } = trpc.list.playlists.useQuery(
    {},
    {
      enabled: formData.invoiceProductCategory === "PLAYLIST" && !!sessionToken,
    }
  );
  const {
    data: cohortsData,
    isLoading: isLoadingCohortsData,
    isError: isErrorCohortsData,
  } = trpc.list.cohorts.useQuery(
    {},
    { enabled: formData.invoiceProductCategory === "COHORT" && !!sessionToken }
  );
  const { data: eventsData, isLoading: isLoadingEventsData } =
    trpc.list.events.useQuery(
      {},
      { enabled: formData.invoiceProductCategory === "EVENT" && !!sessionToken }
    );
  const isLoadingProduct =
    isLoadingCohortsData || isLoadingPlaylistsData || isLoadingEventsData;
  const isErrorProduct =
    isErrorCohortsData || isErrorPlaylistsData || isLoadingEventsData;

  // Fetch tRPC for Checking Discount
  const checkDiscountQuery = trpc.purchase.checkDiscount.useQuery(
    {
      code: formData.paymentDiscount.trim(),
      cohort_id:
        formData.invoiceProductCategory === "COHORT"
          ? Number(formData.invoiceProductItem)
          : undefined,
      playlist_id:
        formData.invoiceProductCategory === "PLAYLIST"
          ? Number(formData.invoiceProductItem)
          : undefined,
      event_id:
        formData.invoiceProductCategory === "EVENT"
          ? Number(formData.invoiceProductItem)
          : undefined,
    },
    {
      enabled: false,
      retry: false,
    }
  );

  // Conditional Fetch Data Product Item
  useEffect(() => {
    if (formData.invoiceProductCategory === "PLAYLIST") {
      setItemOptions(
        playlistsData?.list.map((post) => ({
          label: post.name,
          value: post.id,
          price: Number(post.price),
        })) || []
      );
    } else if (formData.invoiceProductCategory === "COHORT") {
      setItemOptions(
        cohortsData?.list.flatMap((post) =>
          post.prices.map((price) => ({
            label: `${price.name} - ${post.name}`,
            value: price.id,
            price: Number(price.amount),
          }))
        ) || []
      );
    } else if (formData.invoiceProductCategory === "EVENT") {
      setItemOptions(
        eventsData?.list.flatMap((post) =>
          post.prices.map((price) => ({
            label: `${price.name} - ${post.name}`,
            value: price.id,
            price: Number(price.amount),
          }))
        ) || []
      );
    }
  }, [formData.invoiceProductCategory, playlistsData, cohortsData, eventsData]);

  // Get product data based on selected product id / ticket id
  const chosenProduct = useMemo(() => {
    if (!formData.invoiceProductItem) return null;
    return (
      itemOptions.find(
        (post) => post.value === Number(formData.invoiceProductItem)
      ) || null
    );
  }, [formData.invoiceProductItem, itemOptions]);

  // Get payment data based on selected payment channel id
  const chosenPaymentChannelData = useMemo(() => {
    if (!formData.paymentChannelId || !paymentChannelList) return null;
    return paymentChannelList.find(
      (post) => post.id === formData.paymentChannelId
    );
  }, [formData.paymentChannelId, paymentChannelList]);

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
    setErrorMessage("");
  };

  // Reset product item when category has changed
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceProductItem: "",
    }));
  }, [formData.invoiceProductCategory]);

  // Handle discount checking
  const handleDiscountChecking = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoadingApplyDiscount(true);

    if (!formData.paymentDiscount.trim()) {
      setErrorMessage("Please enter a promo code before redeeming");
      setIsLoadingApplyDiscount(false);
      return;
    }

    try {
      const { data: responseDiscount } = await checkDiscountQuery.refetch();
      if (!responseDiscount) {
        setDiscount(null);
        setErrorMessage("Invalid discount code");
      } else {
        setDiscount({
          name: responseDiscount.discount.name,
          code: responseDiscount.discount.code,
          calc_percent: Number(responseDiscount.discount.calc_percent),
          category: responseDiscount.discount.category,
          item_id: responseDiscount.discount.item_id,
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Invalid discount code");
    } finally {
      setIsLoadingApplyDiscount(false);
    }
  };

  // Calculating price
  const totalItem = 1;
  const programPrice = chosenProduct ? Number(chosenProduct.price) : 0;
  let subtotal = totalItem * programPrice;
  if (discount?.calc_percent) {
    const discountRate = discount.calc_percent / 100;
    subtotal = totalItem * programPrice * (1 - discountRate);
  }
  const vatRate = 0.11;

  const paymentCalculation = useMemo(() => {
    if (!chosenPaymentChannelData) {
      return { adminFee: 0, valueAddedTax: 0, totalAmount: 0 };
    }

    const calcFlat = Number(chosenPaymentChannelData.calc_flat);
    const calcPercent = Number(chosenPaymentChannelData.calc_percent);
    const calcVat = chosenPaymentChannelData.calc_vat;

    if (calcFlat === 0 && calcPercent > 0) {
      const percentRate = calcPercent / 100;
      if (calcVat) {
        const total = Math.round(subtotal / (1 - percentRate * (1 + vatRate)));
        const fee = Math.round(percentRate * total);
        const tax = Math.round(vatRate * fee);
        return { adminFee: fee, valueAddedTax: tax, totalAmount: total };
      } else {
        const total = Math.round(subtotal / (1 - percentRate));
        const fee = Math.round(percentRate * total);
        return { adminFee: fee, valueAddedTax: 0, totalAmount: total };
      }
    } else if (calcFlat > 0 && calcPercent === 0) {
      const tax = calcFlat * vatRate;
      const total = subtotal + calcFlat + tax;
      return { adminFee: calcFlat, valueAddedTax: tax, totalAmount: total };
    } else if (calcFlat > 0 && calcPercent > 0) {
      const percentRate = calcPercent / 100;
      const total = Math.round(
        (subtotal + calcFlat * (1 + vatRate)) /
          (1 - percentRate * (1 + vatRate))
      );
      const percentFee = percentRate * total;
      const allFee = Math.round(calcFlat + percentFee);
      const tax = Math.round(allFee * vatRate);
      return { adminFee: allFee, valueAddedTax: tax, totalAmount: total };
    }
    return { adminFee: 0, valueAddedTax: 0, totalAmount: subtotal };
  }, [chosenPaymentChannelData, subtotal]);

  // Handle form submit
  const handleCreateInvoice = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // -- Required field checking
    if (!formData.invoiceUserId) {
      toast.error("User still empty");
      setIsSubmitting(false);
      return;
    }
    if (!formData.invoiceUserPhone) {
      toast.error("Phone number’s still empty");
      setIsSubmitting(false);
      return;
    }
    if (!formData.invoiceProductCategory) {
      toast.error("Oops, pick a category first");
      setIsSubmitting(false);
      return;
    }
    if (!formData.invoiceProductItem) {
      toast.error("Which product do you wanna invoice?");
      setIsSubmitting(false);
      return;
    }
    if (!formData.paymentChannelId) {
      toast.error("Payment method is still blank");
      setIsSubmitting(false);
      return;
    }

    const onMutationResult = {
      onSuccess: () => {
        toast.success("Invoice created successfully");
        setIsSubmitting(false);
        utils.list.transactions.invalidate();
        onClose();
      },
      onError: () => {
        toast.error("Something went wrong while creating the invoice");
      },
    };

    // POST to Database
    try {
      if (formData.invoiceProductCategory === "PLAYLIST") {
        createInvoicePlaylist.mutate(
          {
            // Mandatory fields:
            user_id: formData.invoiceUserId.trim(),
            payment_channel_id: Number(formData.paymentChannelId),
            playlist_id: Number(formData.invoiceProductItem),

            // Optional fields:
            phone_country_id: 1,
            phone_number: formData.invoiceUserPhone.trim()
              ? formData.invoiceUserPhone
              : null,
            discount_code: formData.paymentDiscount?.trim()
              ? formData.paymentDiscount
              : undefined,
          },
          onMutationResult
        );
      } else if (formData.invoiceProductCategory === "COHORT") {
        createInvoiceCohort.mutate(
          {
            // Mandatory fields:
            user_id: formData.invoiceUserId,
            payment_channel_id: Number(formData.paymentChannelId),
            cohort_price_id: Number(formData.invoiceProductItem),

            // Optional fields:
            phone_country_id: 1,
            phone_number: formData.invoiceUserPhone.trim()
              ? formData.invoiceUserPhone
              : null,
            discount_code: formData.paymentDiscount?.trim()
              ? formData.paymentDiscount
              : undefined,
          },
          onMutationResult
        );
      } else if (formData.invoiceProductCategory === "EVENT") {
        createInvoiceEvent.mutate(
          {
            // Mandatory fields:
            user_id: formData.invoiceUserId,
            payment_channel_id: Number(formData.paymentChannelId),
            event_price_id: Number(formData.invoiceProductItem),

            // Optional fields:
            phone_country_id: 1,
            phone_number: formData.invoiceUserPhone.trim()
              ? formData.invoiceUserPhone
              : null,
            discount_code: formData.paymentDiscount?.trim()
              ? formData.paymentDiscount
              : undefined,
          },
          onMutationResult
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Create Invoice"
      sheetDescription="Generate and share invoices instantly via a unique link."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleCreateInvoice}
      >
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
        {!isLoading && !isError && (
          <div className="form-container flex flex-col h-full px-6 pb-96 gap-5 overflow-y-auto">
            <div className="group-input flex flex-col gap-4">
              {/* User */}
              <InputCMS
                inputId="invoice-user-id"
                inputName="Billed to"
                inputType="text"
                inputPlaceholder="Input ID User"
                value={formData.invoiceUserId}
                onInputChange={handleInputChange("invoiceUserId")}
                required
              />

              {/* Phone Number */}
              <PhoneNumberInputSVP
                inputId="invoice-user-phone"
                inputName="Phone Number"
                inputIcon="🇮🇩"
                inputCountryCode="62"
                inputPlaceholder="Enter Mobile or WhatsApp number"
                value={formData.invoiceUserPhone}
                onInputChange={handleInputChange("invoiceUserPhone")}
                required
              />

              {/* Order Item */}
              <div className="bg-section-background/50 border border-outline flex flex-col gap-2 p-4 rounded-md">
                <h5 className="font-bodycopy font-bold text-sm">Order Item</h5>
                <SelectCMS
                  selectId="invoice-product-category"
                  selectName="Product Category"
                  selectPlaceholder="Choose a product category"
                  value={formData.invoiceProductCategory}
                  onChange={handleInputChange("invoiceProductCategory")}
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
                    {
                      label: "Event",
                      value: "EVENT",
                    },
                  ]}
                />
                {isLoadingProduct && (
                  <div className="flex w-full h-full py-4 items-center justify-center text-alternative">
                    <Loader2 className="animate-spin size-5 " />
                  </div>
                )}
                {isErrorProduct && (
                  <div className="flex w-full h-full py-4 items-center justify-center text-alternative">
                    No Data
                  </div>
                )}
                {formData.invoiceProductCategory &&
                  !isLoadingProduct &&
                  !isErrorProduct && (
                    <SelectCMS
                      selectId="product-item"
                      selectName="Product Item"
                      selectPlaceholder="Select specific products"
                      value={formData.invoiceProductItem}
                      onChange={handleInputChange("invoiceProductItem")}
                      options={itemOptions}
                      required
                    />
                  )}
              </div>

              {/* Payment Channel */}
              <SelectCMS
                selectId="payment-channel-id"
                selectName="Payment Method"
                selectPlaceholder="Select a payment method"
                value={formData.paymentChannelId}
                onChange={handleInputChange("paymentChannelId")}
                required
                options={paymentChannelList?.map((post) => ({
                  value: post.id,
                  label: post.label,
                  image: post.image,
                }))}
              />

              {/* Promo Discount */}
              <div className="discount-box flex flex-col">
                <div className="apply-discount-form flex justify-between items-end gap-4">
                  <div className="flex-3">
                    <InputCMS
                      inputId="payment-discount"
                      inputName="Promo Code"
                      inputType="text"
                      inputPlaceholder="Enter your promo code"
                      characterLength={32}
                      value={formData.paymentDiscount}
                      onInputChange={handleInputChange("paymentDiscount")}
                      disabled={!!discount}
                    />
                  </div>
                  {!discount && (
                    <AppButton
                      className="flex-1"
                      variant="cmsPrimary"
                      size="medium"
                      onClick={handleDiscountChecking}
                      disabled={isLoadingApplyDiscount}
                    >
                      Insert Promo
                    </AppButton>
                  )}
                  {discount && (
                    <AppButton
                      variant="semiDestructive"
                      size="medium"
                      onClick={() => {
                        setDiscount(null);
                        setFormData((prev) => ({
                          ...prev,
                          paymentDiscount: "",
                        }));
                      }}
                    >
                      Remove
                    </AppButton>
                  )}
                </div>
                {errorMessage && (
                  <p className="text-xs text-destructive font-bodycopy">
                    {errorMessage}
                  </p>
                )}
              </div>

              {/* Payment Details */}
              {formData.paymentChannelId && formData.invoiceProductItem && (
                <div className="flex flex-col bg-section-background/50 gap-2 p-3 border border-outline rounded-md">
                  <h5 className="font-bodycopy font-bold text-sm">
                    Payment Details
                  </h5>
                  <ReceiptLineItemCMS
                    receiptName="Price"
                    receiptValue={getRupiahCurrency(Math.round(programPrice))}
                  />
                  {discount && (
                    <ReceiptLineItemCMS
                      receiptName="Discount"
                      receiptValue={`-${getRupiahCurrency(
                        Math.round(Number(programPrice - subtotal))
                      )}`}
                      isDiscount
                    />
                  )}
                  <ReceiptLineItemCMS
                    receiptName="Admin Fee"
                    receiptValue={getRupiahCurrency(
                      Math.round(paymentCalculation.adminFee)
                    )}
                  />
                  <ReceiptLineItemCMS
                    receiptName="Value Added Tax"
                    receiptValue={getRupiahCurrency(
                      Math.round(paymentCalculation.valueAddedTax)
                    )}
                  />
                  <hr className="border-t border-outline" />
                  <ReceiptLineItemCMS
                    receiptName="Total Amount"
                    receiptValue={getRupiahCurrency(
                      Math.round(paymentCalculation.totalAmount)
                    )}
                    isGrandTotal
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Create Invoice
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
