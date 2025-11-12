"use client";
import { GenerateAIMarketSize } from "@/lib/actions";
import AppButton from "../buttons/AppButton";
import {
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
} from "@/trpc/routers/ai_tool/enum.ai_tool";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import InputLMS from "../fields/InputLMS";
import TextAreaLMS from "../fields/TextAreaLMS";
import SelectLMS from "../fields/SelectLMS";
import { Checkbox } from "@/components/ui/checkbox";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import Image from "next/image";
import AppTableofContents from "../elements/AppTableofContents";
import AppCalloutBox from "../elements/AppCalloutBox";
import HeaderGenerateAIToolLMS from "../navigations/HeaderGenerateAIToolLMS";

interface GenerateAIMarketSizeLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
}

export default function GenerateAIMarketSizeLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
}: GenerateAIMarketSizeLMSProps) {
  const router = useRouter();
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);

  // Beginning State
  const [formData, setFormData] = useState<{
    productName: string;
    productDescription: string;
    productType: AIMarketSize_ProductType | null;
    customerType: AIMarketSize_CustomerType | null;
    operatingArea: string;
    salesChannel: string[];
  }>({
    productName: "",
    productDescription: "",
    productType: null,
    customerType: null,
    operatingArea: "",
    salesChannel: [],
  });

  // List Sales Channel Options
  const salesChannelOptions = [
    "Offline Store (Kios, Gerai, Toko, etc)",
    "E-Commerce (Blibli, Shopee, Tiktok Shop, etc)",
    "Social Media",
    "Owned Platform (Aplikasi/Website)",
    "Reseller/Distributor",
    "Salesperson",
  ];

  // List Table of Contents
  const tableofContents = [
    {
      name: "Product Overview",
      url: "product-overview",
    },
    {
      name: "Customer Targeting",
      url: "customer-targeting",
    },
    { name: "Sales & Distribution", url: "sales-distribution" },
  ];

  // Handle Sales Channel Checkbox
  const handleSalesChannelChange = (option: string, checked: boolean) => {
    setFormData((prev) => {
      const current = [...prev.salesChannel];
      if (checked) {
        if (!current.includes(option)) current.push(option);
      } else {
        const index = current.indexOf(option);
        if (index !== -1) current.splice(index, 1);
      }
      return { ...prev, salesChannel: current };
    });
  };

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
        productType: formData.productType,
        customerType: formData.customerType,
        operatingArea: formData.operatingArea.trim(),
        salesChannel: formData.salesChannel.join(", "),
      });

      if (aiMarketSizeResult.code === "OK") {
        toast.success("Market size report successfully generated!");
        setFormData({
          productName: "",
          productDescription: "",
          productType: null,
          customerType: null,
          operatingArea: "",
          salesChannel: [],
        });
        router.push(`/ai/market-size/${aiMarketSizeResult.id}`);
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
    <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
      <HeaderGenerateAIToolLMS
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        pageName="Market Size"
        headerTitle="Market Size Intelligence"
      />
      <div className="body-contents relative max-w-[calc(100%-4rem)] w-full flex gap-4">
        <main className="main-contents flex-2 w-full">
          <form
            className="form-generate-ai w-full flex flex-col gap-4 items-end"
            onSubmit={handleAIGenerate}
          >
            <section
              id={tableofContents[0].url}
              className="product-overview bg-white w-full flex flex-col gap-4 p-5 border rounded-lg scroll-mt-28"
            >
              <h2 className="section-title font-bold font-bodycopy">
                {tableofContents[0].name}
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
                    value: AIMarketSize_ProductType.FISIK,
                  },
                  {
                    label:
                      "Digital — produk atau layanan non-fisik yang diakses secara online",
                    value: AIMarketSize_ProductType.DIGITAL,
                  },
                  {
                    label: "Gabungan — kombinasi fisik dan digital",
                    value: AIMarketSize_ProductType.HYBRID,
                  },
                ]}
              />
            </section>
            <section
              id={tableofContents[1].url}
              className="customer-targeting bg-white w-full flex flex-col gap-4 p-5 border rounded-lg"
            >
              <h2 className="section-title font-bold font-bodycopy">
                {tableofContents[1].name}
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
                    value: AIMarketSize_CustomerType.B2C,
                  },
                  {
                    label: "B2B",
                    value: AIMarketSize_CustomerType.B2B,
                  },
                  {
                    label: "Gabungan",
                    value: AIMarketSize_CustomerType.HYBRID,
                  },
                ]}
              />
            </section>
            <section
              id={tableofContents[2].url}
              className="sales-distribution bg-white w-full flex flex-col gap-4 p-5 border rounded-lg"
            >
              <h2 className="section-title font-bold font-bodycopy">
                {tableofContents[2].name}
              </h2>
              <div className="sales-channel-options grid grid-cols-3 gap-y-4">
                {salesChannelOptions.map((item, index) => (
                  <div
                    className="checkbox-item flex gap-2 items-center font-bodycopy font-medium text-sm"
                    key={index}
                  >
                    <Checkbox
                      checked={formData.salesChannel.includes(item)}
                      onCheckedChange={(checked) =>
                        handleSalesChannelChange(item, checked === true)
                      }
                      suppressHydrationWarning
                    />
                    {item}
                  </div>
                ))}
              </div>
            </section>
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
                  Generate Insight
                  <div className="flex w-7">
                    <Image
                      className="object-cover w-full h-full"
                      src={
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sparkles-icon.svg"
                      }
                      alt="AI Icon"
                      height={100}
                      width={100}
                    />
                  </div>
                </>
              )}
            </AppButton>
          </form>
        </main>
        <aside className="aside-contents flex flex-col flex-1 w-full gap-4">
          <div className="toc-wrapper sticky flex flex-col top-[104px] gap-4">
            <AppTableofContents
              tocName="Table of Contents"
              tocList={tableofContents}
            />
            <AppCalloutBox
              calloutTitle="Tips"
              calloutContent="Gunakan Market Size Intelligence untuk memahami potensi pasar lewat
          analisis TAM, SAM, dan SOM. Fitur ini membantu mengukur peluang
          bisnis, bukan menilai daya beli konsumen."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
