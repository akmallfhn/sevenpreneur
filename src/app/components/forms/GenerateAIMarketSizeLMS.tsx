"use client";
import { GenerateAIMarketSize } from "@/lib/actions";
import AppButton from "../buttons/AppButton";
import {
  AIMarketSize_CustomerType,
  AIMarketSize_ProductType,
} from "@/trpc/routers/ai_tool/prompt.ai_tool";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function GenerateAIMarketSizeLMS() {
  const router = useRouter();
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);

  const handleAIGenerate = async () => {
    setIsGeneratingContents(true);
    try {
      const aiMarketSizeResult = await GenerateAIMarketSize({
        productName: "Tempe Mendoan Pak Luthfi Khas Purwokerto",
        productDescription:
          "Merupakan produksi tempe mendoan yang sudah branded. Saat ini masih jual B2C konsumen di ecommerce. Di masa depan ingin menyuplai ke ecommerce seperti Astro dan Allofresh",
        productType: "fisik" as AIMarketSize_ProductType,
        customerType: "hybrid" as AIMarketSize_CustomerType,
        salesChannel: "pasar, ecommerce (Shopee, Tiktok, Tokopedia, Astro)",
        companyArea: "Purwokerto dan Kabupaten di sekitarnya",
      });

      if (aiMarketSizeResult.code === "OK") {
        toast.success("Success generate Market size report");
        router.push(`/ai`);
      }
    } catch (error) {
      toast.error("Failed to generate market size report");
    } finally {
      setIsGeneratingContents(false);
    }
  };

  return (
    <div className="container pl-64 max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
      <AppButton onClick={handleAIGenerate} disabled={isGeneratingContents}>
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
    </div>
  );
}
