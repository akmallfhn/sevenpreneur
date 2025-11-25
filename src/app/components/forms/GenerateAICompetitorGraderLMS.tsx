"use client";
import { useRouter } from "next/navigation";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { GenerateAICompetitorGrading } from "@/lib/actions";
import HeaderGenerateAIToolLMS from "../navigations/HeaderGenerateAIToolLMS";
import TextAreaLMS from "../fields/TextAreaLMS";
import AppButton from "../buttons/AppButton";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import AppCalloutBox from "../elements/AppCalloutBox";
import AppTableofContents from "../elements/AppTableofContents";
import InputLMS from "../fields/InputLMS";
import SelectLMS from "../fields/SelectLMS";

interface IndustryList {
  name: string;
}

interface GenerateAICompetitorGraderLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  indutryList: IndustryList[];
}

export default function GenerateAICompetitorGraderLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  indutryList,
}: GenerateAICompetitorGraderLMSProps) {
  const router = useRouter();
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);

  // Beginning State
  const [formData, setFormData] = useState<{
    productName: string;
    productDescription: string;
    productCountry: string;
    productIndustry: string;
  }>({
    productName: "",
    productDescription: "",
    productCountry: "",
    productIndustry: "",
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
    if (!formData.productIndustry) {
      toast.error("Please choose an industry before proceeding.");
      setIsGeneratingContents(false);
      return;
    }
    if (!formData.productIndustry.trim()) {
      toast.error("Tell us which region/country you're targeting.");
      setIsGeneratingContents(false);
      return;
    }

    try {
      const aiCompetitorGrading = await GenerateAICompetitorGrading({
        productName: formData.productName,
        productDescription: formData.productDescription,
        productCountry: formData.productCountry,
        productIndustry: formData.productIndustry,
      });

      if (aiCompetitorGrading.code === "CREATED") {
        toast.success("Grading process initiated...");
        router.push(`/ai/competitor-grader/${aiCompetitorGrading.id}`);
      } else {
        toast.error("We couldn’t complete the grading. Please try again!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An unexpected error occurred while grading the competitor. Please try again in a moment"
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
        pageName="Competitor Grader"
        headerTitle="Competitor Grader"
      />
      <div className="body-contents relative max-w-[calc(100%-4rem)] w-full flex gap-4">
        <main className="main-contents flex-2 w-full">
          <form
            className="form-generate-ai w-full flex flex-col gap-4 items-end"
            onSubmit={handleAIGenerate}
          >
            <section
              id="product-overview"
              className="product-overview bg-white w-full flex flex-col gap-4 p-5 border rounded-lg scroll-mt-28"
            >
              <h2 className="section-title font-bold font-bodycopy">Brand</h2>
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
              <SelectLMS
                selectId="product-industry"
                selectName="Apa kategori industri yang paling sesuai dengan bisnis Anda?"
                selectPlaceholder="Pilih kategori industri"
                value={formData.productIndustry}
                onChange={handleInputChange("productIndustry")}
                required
                options={indutryList.map((item) => ({
                  label: item.name,
                  value: item.name,
                }))}
              />
              <InputLMS
                inputId="product-country"
                inputName="Di pasar/wilayah mana kompetisi bisnis berlangsung?"
                inputType="text"
                inputPlaceholder="e.g. Greater Sumatera, Indonesia"
                value={formData.productCountry}
                onInputChange={handleInputChange("productCountry")}
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
              calloutContent="Competitor Grader membantu memahami siapa kompetitor terdekat, bagaimana posisi bisnis di pasar, dan strategi yang dapat memperkuat daya saing bisnis Anda."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
