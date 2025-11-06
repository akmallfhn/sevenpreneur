"use client";
import { GenerateAIMarketSize } from "@/lib/actions";
import AppButton from "../buttons/AppButton";
import {
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
} from "@/trpc/routers/ai_tool/prompt.ai_tool";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import InputLMS from "../fields/InputLMS";
import TextAreaLMS from "../fields/TextAreaLMS";
import SelectLMS from "../fields/SelectLMS";

export default function GenerateAIMarketSizeLMS() {
  const router = useRouter();
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);

  // Beginning State
  const [formData, setFormData] = useState<{
    productName: string;
    productDescription: string;
    productType: AIMarketSize_ProductType | null;
    customerType: AIMarketSize_CustomerType | null;
    operatingArea: string;
    salesChannel: string;
  }>({
    productName: "",
    productDescription: "",
    productType: null,
    customerType: null,
    operatingArea: "",
    salesChannel: "",
  });

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleAIGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setIsGeneratingContents(true);

    if (!formData.productName.trim()) {
      toast.error("Please enter a product name before generating.");
      setIsGeneratingContents(false);
      return;
    }
    if (!formData.productDescription.trim()) {
      toast.error("Give me a short description about product");
      setIsGeneratingContents(false);
      return;
    }
    if (!formData.productType) {
      toast.error("Choose a product type");
      setIsGeneratingContents(false);
      return;
    }
    if (!formData.customerType) {
      toast.error("Please select your target customer type");
      setIsGeneratingContents(false);
      return;
    }
    if (!formData.operatingArea.trim()) {
      toast.error("Where does your business operate?");
      setIsGeneratingContents(false);
      return;
    }

    try {
      const aiMarketSizeResult = await GenerateAIMarketSize({
        productName: formData.productName.trim(),
        productDescription: formData.productDescription.trim(),
        productType: formData.productType as AIMarketSize_ProductType,
        customerType: formData.customerType as AIMarketSize_CustomerType,
        operatingArea: formData.operatingArea.trim(),
        salesChannel: "pasar, ecommerce (Shopee, Tiktok, Tokopedia, Astro)",
      });

      if (aiMarketSizeResult.code === "OK") {
        toast.success("Market size report successfully generated!");
        setFormData({
          productName: "",
          productDescription: "",
          productType: null,
          customerType: null,
          operatingArea: "",
          salesChannel: "",
        });
        router.push(`/ai`);
      } else {
        toast.error(
          "AI couldn’t complete the market analysis. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to generate market size report. Please try again later."
      );
    } finally {
      setIsGeneratingContents(false);
    }
  };

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full gap-7 items-center justify-center lg:flex">
      <form
        className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col gap-4"
        onSubmit={handleAIGenerate}
      >
        <div className="product-overview bg-white w-full flex flex-col gap-4 p-5 border rounded-lg">
          <h2 className="section-title font-bold font-bodycopy">
            Product Overview
          </h2>
          <InputLMS
            inputId="product-name"
            inputName="Apa nama produk atau layanan Anda?"
            inputType="text"
            inputPlaceholder="e.g. NutriBlend Smoothie"
            value={formData.productName}
            onInputChange={handleInputChange("productName")}
            required
          />
          <TextAreaLMS
            textAreaId="product-description"
            textAreaName="Deskripsikan produk/layanan Anda"
            textAreaPlaceholder="e.g. Smoothie sehat dengan kandungan nutrisi seimbang untuk diet"
            characterLength={4000}
            value={formData.productDescription}
            onTextAreaChange={handleInputChange("productDescription")}
            required
          />
          <SelectLMS
            selectId="product-type"
            selectName="Apa jenis produk atau layanan Anda?"
            selectPlaceholder="Pilih jenis produk"
            value={formData.productType}
            onChange={handleInputChange("productType")}
            required
            options={[
              {
                label:
                  "Fisik — produk atau layanan nyata yang bisa disentuh, dinikmati, atau dikonsumsi",
                value: "fisik",
              },
              {
                label:
                  "Digital — produk atau layanan non-fisik yang diakses secara online",
                value: "digital",
              },
              {
                label: "Gabungan — kombinasi fisik dan digital",
                value: "hybrid",
              },
            ]}
          />
        </div>
        <div className="bg-white w-full flex flex-col gap-4 p-5 border rounded-lg">
          <h2 className="section-title font-bold font-bodycopy">
            Customer Targeting
          </h2>
          <InputLMS
            inputId="operating-area"
            inputName="Dimana area produk/layanan dijual atau beroperasi?"
            inputType="text"
            inputPlaceholder="e.g. Bali, Vietnam, Southeast Asia"
            value={formData.operatingArea}
            onInputChange={handleInputChange("operatingArea")}
            required
          />
          <SelectLMS
            selectId="customer-type"
            selectName="Siapa target pelanggan utama Anda?"
            selectPlaceholder="Pilih type customer"
            value={formData.customerType}
            onChange={handleInputChange("customerType")}
            required
            options={[
              {
                label: "B2C",
                value: "B2C",
              },
              {
                label: "B2B",
                value: "B2B",
              },
              {
                label: "Gabungan",
                value: "hybrid",
              },
            ]}
          />
        </div>
        <AppButton
          className="w-fit"
          type="submit"
          disabled={isGeneratingContents}
        >
          {isGeneratingContents ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Please wait...
            </>
          ) : (
            <>
              <Sparkles fill="#FFFFFF" stroke="0" />
              Generate Insight
            </>
          )}
        </AppButton>
      </form>
    </div>
  );
}
