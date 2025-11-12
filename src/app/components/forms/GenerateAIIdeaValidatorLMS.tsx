"use client";
import AppButton from "../buttons/AppButton";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import TextAreaLMS from "../fields/TextAreaLMS";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import Image from "next/image";
import AppTableofContents from "../elements/AppTableofContents";
import AppCalloutBox from "../elements/AppCalloutBox";
import HeaderGenerateAIToolLMS from "../navigations/HeaderGenerateAIToolLMS";

interface GenerateAIIdeaValidatorLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
}

export default function GenerateAIIdeaValidatorLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
}: GenerateAIIdeaValidatorLMSProps) {
  const router = useRouter();
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);

  // Beginning State
  const [formData, setFormData] = useState<{
    problemStatement: string;
    problemContext: string;
    proposedSolution: string;
    availableResource: string;
  }>({
    problemStatement: "",
    problemContext: "",
    proposedSolution: "",
    availableResource: "",
  });

  // List Table of Contents
  const tableofContents = [
    {
      name: "Problem Discovery",
      url: "problem-discovery",
    },
    {
      name: "Solution Design",
      url: "solution-design",
    },
  ];

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

    // if (!formData.productName.trim()) {
    //   toast.error("Please enter a product name before generating.");
    //   setIsGeneratingContents(false);
    //   return;
    // }
    // if (!formData.productDescription.trim()) {
    //   toast.error("Give me a short description about product");
    //   setIsGeneratingContents(false);
    //   return;
    // }
    // if (!formData.productType) {
    //   toast.error("Choose a product type");
    //   setIsGeneratingContents(false);
    //   return;
    // }
    // if (!formData.customerType) {
    //   toast.error("Please select your target customer type");
    //   setIsGeneratingContents(false);
    //   return;
    // }
    // if (!formData.operatingArea.trim()) {
    //   toast.error("Where does your business operate?");
    //   setIsGeneratingContents(false);
    //   return;
    // }

    // try {
    //   const aiMarketSizeResult = await GenerateAIMarketSize({
    //     productName: formData.productName.trim(),
    //     productDescription: formData.productDescription.trim(),
    //     productType: formData.productType,
    //     customerType: formData.customerType,
    //     operatingArea: formData.operatingArea.trim(),
    //     salesChannel: formData.salesChannel.join(", "),
    //   });

    //   if (aiMarketSizeResult.code === "OK") {
    //     toast.success("Market size report successfully generated!");
    //     setFormData({
    //       productName: "",
    //       productDescription: "",
    //       productType: null,
    //       customerType: null,
    //       operatingArea: "",
    //       salesChannel: [],
    //     });
    //     router.push(`/ai/market-size/${aiMarketSizeResult.id}`);
    //   } else {
    //     toast.error(
    //       "AI couldn’t complete the market analysis. Please try again."
    //     );
    //   }
    // } catch (error) {
    //   console.error(error);
    //   toast.error(
    //     "Failed to generate market size report. Please try again later."
    //   );
    // } finally {
    //   setIsGeneratingContents(false);
    // }
  };

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
      <HeaderGenerateAIToolLMS
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        pageName="Idea Validator"
        headerTitle="Idea Validator"
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
              <TextAreaLMS
                textAreaId="problem-statement"
                textAreaName="Masalah apa yang kamu temui?"
                textAreaPlaceholder="e.g. Produk sering rusak saat diterima karena packaging tidak cukup aman"
                characterLength={4000}
                value={formData.problemStatement}
                onTextAreaChange={handleInputChange("problemStatement")}
                required
              />
              <TextAreaLMS
                textAreaId="problem-context"
                textAreaName="Dimana atau kapan masalah ini muncul?"
                textAreaPlaceholder="e.g. Saat mengirim produk lewat jasa ekspedisi"
                characterLength={4000}
                value={formData.problemContext}
                onTextAreaChange={handleInputChange("problemContext")}
                required
              />
            </section>
            <section
              id={tableofContents[1].url}
              className="customer-targeting bg-white w-full flex flex-col gap-4 p-5 border rounded-lg"
            >
              <h2 className="section-title font-bold font-bodycopy">
                {tableofContents[1].name}
              </h2>
              <TextAreaLMS
                textAreaId="proposed-solution"
                textAreaName="Solusi seperti apa yang kamu bayangkan?"
                textAreaPlaceholder="e.g. Menyediakan layanan packaging aman berbasis kebutuhan produk"
                characterLength={4000}
                value={formData.proposedSolution}
                onTextAreaChange={handleInputChange("proposedSolution")}
                required
              />
              <TextAreaLMS
                textAreaId="available-resource"
                textAreaName="Sumber daya apa yang sudah kamu punya?"
                textAreaPlaceholder="e.g. Akses ke supplier bahan kemasan dan koneksi dengan komunitas UMKM lokal"
                characterLength={4000}
                value={formData.availableResource}
                onTextAreaChange={handleInputChange("availableResource")}
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
            <AppTableofContents
              tocName="Table of Contents"
              tocList={tableofContents}
            />
            <AppCalloutBox
              calloutTitle="Tips"
              calloutContent="Idea Validator membantu memvalidasi ide bisnismu sebelum dieksekusi dengan menganalisis relevansi masalah, potensi bisnis, dan arah industrinya agar kamu bisa mengambil keputusan berbasis data."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
