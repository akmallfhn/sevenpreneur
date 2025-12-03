"use client";
import { useRouter } from "next/navigation";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import HeaderGenerateAIToolLMS from "../navigations/HeaderGenerateAIToolLMS";
import TextAreaLMS from "../fields/TextAreaLMS";
import AppButton from "../buttons/AppButton";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AppCalloutBox from "../elements/AppCalloutBox";
import InputLMS from "../fields/InputLMS";
import SelectLMS from "../fields/SelectLMS";
import { AICOGSStructure_ProductCategory } from "@/trpc/routers/ai_tool/enum.ai_tool";

interface GenerateAICOGSPricesLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
}

export default function GenerateAICOGSPricesLMS(
  props: GenerateAICOGSPricesLMSProps
) {
  const router = useRouter();
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);

  // Beginning State
  const [formData, setFormData] = useState<{
    productName: string;
    productDescription: string;
    productCategory: AICOGSStructure_ProductCategory | null;
  }>({
    productName: "",
    productDescription: "",
    productCategory: null,
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
      toast.error("Give me a description about product");
      setIsGeneratingContents(false);
      return;
    }

    // try {
    //   const aiCompetitorGrading = await GenerateAICompetitorGrading({
    //     productName: formData.productName,
    //     productDescription: formData.productDescription,
    //     productCountry: formData.productCountry,
    //     productIndustry: formData.productIndustry,
    //   });

    //   if (aiCompetitorGrading.code === "CREATED") {
    //     toast.success("Grading process initiated...");
    //     router.push(`/ai/competitor-grader/${aiCompetitorGrading.id}`);
    //   } else {
    //     toast.error("We couldn’t complete the grading. Please try again!");
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error(
    //     "An unexpected error occurred while grading the competitor. Please try again in a moment"
    //   );
    // } finally {
    //   setIsGeneratingContents(false);
    // }
  };

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
      <HeaderGenerateAIToolLMS
        sessionUserRole={props.sessionUserRole}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        pageName="COGS & Prices Calculator"
        headerTitle="COGS & Prices Calculator"
      />
      <div className="body-contents relative max-w-[calc(100%-4rem)] w-full flex gap-4">
        <main className="main-contents flex-2 w-full">
          <form
            className="form-generate-ai w-full flex flex-col gap-4 items-end"
            onSubmit={handleAIGenerate}
          >
            <section
              id="product-information"
              className="product-information bg-white w-full flex flex-col gap-4 p-5 border rounded-lg scroll-mt-28"
            >
              <h2 className="section-title font-bold font-bodycopy">
                Product Information
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
                textAreaName="Deskripsikan produk/layanan Anda dan jelaskan model bisnisnya"
                textAreaPlaceholder="e.g. Smoothie untuk membantu diet dengan sistem subscription."
                characterLength={4000}
                value={formData.productDescription}
                onTextAreaChange={handleInputChange("productDescription")}
                required
              />
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
            <AppCalloutBox
              calloutTitle="Tips"
              calloutContent="What is COGS & Prices Calculator?"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
