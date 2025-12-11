"use client";
import {
  CostList,
  GenerateAIPriceStrategy,
  GenerateCOGSStructure,
} from "@/lib/actions";
import { findIncompleteCosts } from "@/lib/array";
import { setSessionToken, trpc } from "@/trpc/client";
import { AICOGSStructure_ProductCategory } from "@/trpc/routers/ai_tool/enum.ai_tool";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AppCalloutBox from "../elements/AppCalloutBox";
import InputLMS from "../fields/InputLMS";
import InputNumberSVP from "../fields/InputNumberSVP";
import RadioBoxLMS from "../fields/RadioBoxLMS";
import TextAreaLMS from "../fields/TextAreaLMS";
import HeaderGenerateAIToolLMS from "../navigations/HeaderGenerateAIToolLMS";
import AICostListStepperLMS, {
  CostListForm,
} from "../steppers/AICostListStepperLMS";

interface GenerateAICOGSPricesLMSProps extends AvatarBadgeLMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function GenerateAICOGSPricesLMS(
  props: GenerateAICOGSPricesLMSProps
) {
  const router = useRouter();
  const [isGeneratingCosts, setIsGeneratingCosts] = useState(false);
  const [isGeneratingContents, setIsGeneratingContents] = useState(false);
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);
  const [COGSId, setCOGSId] = useState("");

  // Beginning State
  const [formData, setFormData] = useState<{
    productName: string;
    productDescription: string;
    productCategory: AICOGSStructure_ProductCategory | null;
    productionPerMonth: number | string;
  }>({
    productName: "",
    productDescription: "",
    productCategory: null,
    productionPerMonth: "",
  });
  const [variableCost, setVariableCost] = useState<CostListForm[]>([]);
  const [fixedCost, setFixedCost] = useState<CostListForm[]>([]);

  const productionQuestions: Record<AICOGSStructure_ProductCategory, string> = {
    [AICOGSStructure_ProductCategory.MANUFAKTUR]:
      "Berapa total produksi yang Anda targetkan dalam 1 bulan (dalam unit)?",
    [AICOGSStructure_ProductCategory.RETAIL]:
      "Berapa total item penjualan yang Anda targetkan dalam 1 bulan (dalam order)?",
    [AICOGSStructure_ProductCategory.FNB]:
      "Berapa total item penjualan yang Anda targetkan dalam 1 bulan (dalam order)?",
    [AICOGSStructure_ProductCategory.JASA_LAYANAN]:
      "Berapa total item penjualan yang Anda targetkan dalam 1 bulan (dalam order)?",
    [AICOGSStructure_ProductCategory.JASA_KONSULTAN]:
      "Berapa total project atau client yang Anda targetkan dalam 1 bulan?",
    [AICOGSStructure_ProductCategory.SOFTWARE]:
      "Berapa total active users atau subscriber yang Anda targetkan dalam 1 bulan?",
  };

  const productionQuestion = formData.productCategory
    ? productionQuestions[formData.productCategory]
    : "Berapa total produksi yang Anda targetkan dalam 1 bulan (dalam unit)?";

  // Get Details COGS
  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data } = trpc.read.ai.COGSStructure.useQuery(
    { id: COGSId },
    {
      refetchInterval: intervalMs,
      enabled: !!props.sessionToken && !!COGSId,
    }
  ) as unknown as {
    data: {
      code: string;
      message: string;
      result: {
        name: string;
        is_done: boolean;
        result?: { variable_cost: CostList[]; fixed_cost: CostList[] };
        created_at: string;
      };
    };
  };
  const isDoneResult = data?.result.is_done;

  // Update State Costs
  useEffect(() => {
    if (isDoneResult) {
      setIntervalMs(false);
      setIsGeneratingCosts(false);

      const newVariableCosts = data.result.result?.variable_cost ?? [];
      const newFixedCosts = data.result.result?.fixed_cost ?? [];

      setVariableCost((prev) => {
        const merged = [...prev];

        newVariableCosts.forEach((cost) => {
          if (!merged.some((c) => c.name === cost.name)) {
            merged.push({
              ...cost,
              quantity: String(cost.quantity ?? ""),
              total_cost: String(cost.total_cost ?? ""),
            });
          }
        });

        const cleaned = merged.filter((c) => {
          const isEmpty =
            (!c.name || c.name.trim() === "") &&
            (!c.quantity || c.quantity.trim() === "") &&
            (!c.unit || c.unit.trim() === "") &&
            (!c.total_cost || c.total_cost.trim() === "");

          return !isEmpty;
        });

        return cleaned;
      });
      setFixedCost((prev) => {
        const merged = [...prev];

        newFixedCosts.forEach((cost) => {
          if (!merged.some((c) => c.name === cost.name)) {
            merged.push({
              ...cost,
              quantity: String(cost.quantity ?? ""),
              total_cost: String(cost.total_cost ?? ""),
            });
          }
        });

        const cleaned = merged.filter((c) => {
          const isEmpty =
            (!c.name || c.name.trim() === "") &&
            (!c.quantity || c.quantity.trim() === "") &&
            (!c.unit || c.unit.trim() === "") &&
            (!c.total_cost || c.total_cost.trim() === "");

          return !isEmpty;
        });

        return cleaned;
      });

      toast.success("All set! COGS breakdown generated.");
    }
  }, [
    isDoneResult,
    data?.result?.result?.variable_cost,
    data?.result?.result?.fixed_cost,
  ]);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Generate COGS Structure
  const handleAICOGSStructure = async (e: FormEvent) => {
    e.preventDefault();
    setIsGeneratingCosts(true);

    if (!formData.productName.trim()) {
      toast.error("Please enter a product name before generating.");
      setIsGeneratingCosts(false);
      return;
    }
    if (!formData.productDescription.trim()) {
      toast.error("Give me a description about product");
      setIsGeneratingCosts(false);
      return;
    }
    if (!formData.productCategory) {
      toast.error("Choose one of the product categories");
      setIsGeneratingCosts(false);
      return;
    }

    try {
      const aiCOGSStructure = await GenerateCOGSStructure({
        productName: formData.productName,
        productDescription: formData.productDescription,
        productCategory: formData.productCategory,
      });

      if (aiCOGSStructure.code === "CREATED") {
        setCOGSId(aiCOGSStructure.id);
      } else {
        toast.error(
          "Failed to generate COGS structure. Please review your inputs!"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An unexpected error occurred while generating COGS. Please try again in a moment"
      );
      setIsGeneratingCosts(false);
    }
  };

  // Generate Price
  const handleAIGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setIsGeneratingContents(true);

    const incompleteVariable = findIncompleteCosts(variableCost);
    const incompleteFixed = findIncompleteCosts(fixedCost);

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
    if (!formData.productCategory) {
      toast.error("Choose one of the product categories");
      setIsGeneratingContents(false);
      return;
    }
    if (!formData.productionPerMonth) {
      toast.error("Please input volume production per month.");
      setIsGeneratingContents(false);
      return;
    }
    if (incompleteVariable.length > 0 || incompleteFixed.length > 0) {
      toast.error(
        "There are cost items that are partially filled. Please complete all required fields."
      );
      setIsGeneratingContents(false);
      return;
    }

    try {
      const aiPriceStrategy = await GenerateAIPriceStrategy({
        productName: formData.productName,
        productDescription: formData.productDescription,
        productCategory: formData.productCategory,
        productionPerMonth: Number(formData.productionPerMonth),
        variableCostList: variableCost.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 0,
          total_cost: Number(item.total_cost) || 0,
        })),
        fixedCostList: fixedCost.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 0,
          total_cost: Number(item.total_cost) || 0,
        })),
      });

      if (aiPriceStrategy.code === "CREATED") {
        toast.success("Optimizing your pricing strategy...");
        router.push(`/ai/cogs-prices-calculator/${aiPriceStrategy.id}`);
      } else {
        toast.error("We couldn’t complete the process. Please try again!");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "An unexpected error occurred while preparing your strategy. Please try again in a moment"
      );
    } finally {
      setIsGeneratingContents(false);
    }
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
                inputName="Apa nama produk Anda?"
                inputType="text"
                inputPlaceholder="e.g. NutriBlend Smoothie"
                value={formData.productName}
                onInputChange={handleInputChange("productName")}
                required
              />
              <TextAreaLMS
                textAreaId="product-description"
                textAreaName="Deskripsikan produk Anda (fitur/ukuran/kapasitas)"
                textAreaPlaceholder="e.g. Smoothie ukuran 500ml rasa mangga."
                characterLength={4000}
                value={formData.productDescription}
                onTextAreaChange={handleInputChange("productDescription")}
                required
              />
              <div className="product-category flex flex-col gap-2">
                <h3 className="text-[15px] text-[#333333] font-bodycopy font-semibold">
                  Pilih Kategori Produk
                  <span className="label-required text-destructive">*</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <RadioBoxLMS
                    radioName="Manufaktur"
                    radioDescription="Produk yang dihasilkan melalui tahapan produksi"
                    value={AICOGSStructure_ProductCategory.MANUFAKTUR}
                    selectedValue={formData.productCategory ?? ""}
                    onChange={handleInputChange("productCategory")}
                  />
                  <RadioBoxLMS
                    radioName="Retail"
                    radioDescription="Produk yang dijual sebagai barang siap konsumsi atau penggunaan."
                    value={AICOGSStructure_ProductCategory.RETAIL}
                    selectedValue={formData.productCategory ?? ""}
                    onChange={handleInputChange("productCategory")}
                  />
                  <RadioBoxLMS
                    radioName="F&B"
                    radioDescription="Produk makanan atau minuman yang diolah dan disajikan untuk konsumsi"
                    value={AICOGSStructure_ProductCategory.FNB}
                    selectedValue={formData.productCategory ?? ""}
                    onChange={handleInputChange("productCategory")}
                  />
                  <RadioBoxLMS
                    radioName="Jasa Konsultan"
                    radioDescription="Layanan yang memberikan analisis atau rekomendasi berbasis keahlian khusus"
                    value={AICOGSStructure_ProductCategory.JASA_KONSULTAN}
                    selectedValue={formData.productCategory ?? ""}
                    onChange={handleInputChange("productCategory")}
                  />
                  <RadioBoxLMS
                    radioName="Jasa Layanan"
                    radioDescription="Layanan untuk memenuhi kebutuhan personal, rumah tangga, atau bisnis."
                    value={AICOGSStructure_ProductCategory.JASA_LAYANAN}
                    selectedValue={formData.productCategory ?? ""}
                    onChange={handleInputChange("productCategory")}
                  />
                  <RadioBoxLMS
                    radioName="Software / SaaS"
                    radioDescription="Aplikasi, platform, atau sistem berbasis teknologi."
                    value={AICOGSStructure_ProductCategory.SOFTWARE}
                    selectedValue={formData.productCategory ?? ""}
                    onChange={handleInputChange("productCategory")}
                  />
                </div>
              </div>
              <AppButton
                variant="primary"
                type="button"
                size="small"
                onClick={handleAICOGSStructure}
                disabled={isGeneratingCosts}
              >
                {isGeneratingCosts ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>Analisis COGS dengan AI</>
                )}
              </AppButton>
            </section>
            <section
              id="variable-cost"
              className="variable-cost bg-white w-full flex flex-col gap-4 p-5 border rounded-lg scroll-mt-28"
            >
              <div className="section-attributes flex flex-col">
                <h2 className="section-title font-bold font-bodycopy">
                  Variable Cost
                </h2>
                <p className="section-description text-[15px] text-[#333333]/70 font-medium font-bodycopy">
                  Variable cost adalah biaya yang melekat pada setiap unit
                  produk seperti bahan baku atau komponen produk.
                </p>
              </div>
              <AICostListStepperLMS
                costs={variableCost}
                setCosts={setVariableCost}
              />
            </section>
            <section
              id="fixed-cost"
              className="fixed-cost bg-white w-full flex flex-col gap-4 p-5 border rounded-lg scroll-mt-28"
            >
              <div className="section-attributes flex flex-col">
                <h2 className="section-title font-bold font-bodycopy">
                  Fixed Cost
                </h2>
                <p className="section-description text-[15px] text-[#333333]/70 font-medium font-bodycopy">
                  Fixed cost adalah biaya tetap yang tidak terikat pada jumlah
                  produk.
                </p>
              </div>
              <AICostListStepperLMS costs={fixedCost} setCosts={setFixedCost} />
            </section>
            <section
              id="target-volume-per-month"
              className="target-volume-per-month bg-white w-full flex flex-col gap-4 p-5 border rounded-lg scroll-mt-28"
            >
              <h2 className="section-title font-bold font-bodycopy">
                Volume Production per Month
              </h2>
              <InputNumberSVP
                inputId="production-per-month"
                inputName={productionQuestion}
                inputPlaceholder="e.g. 1000"
                inputConfig="numeric"
                value={String(formData.productionPerMonth)}
                onInputChange={handleInputChange("productionPerMonth")}
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
              calloutContent="COGS membantu identifikasi susunan biaya dalam setiap unit produk. Sementara Prices Calculator memberikan rekomendasi harga menggunakan pendekatan cost-based, competition-based, dan value-based."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
