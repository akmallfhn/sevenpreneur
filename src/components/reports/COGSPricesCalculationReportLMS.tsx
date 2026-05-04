"use client";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { useEffect, useMemo, useState } from "react";
import { setSessionToken, trpc } from "@/trpc/client";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";
import PageContainerDashboard from "../pages/PageContainerDashboard";
import LoadingAIGeneratingResult from "../states/LoadingAIGeneratingResultLMS";
import { getRupiahCurrency } from "@/lib/currency";
import AIPriceItemLMS from "../items/AIPriceItemLMS";
import { AIPriceType } from "@/lib/app-types";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import AppNumberInputSVP from "../fields/AppNumberInput";
import { formatWithComma } from "@/lib/convert-number";

interface CompetitorList {
  name: string;
  company_url: string;
}

interface COGSPricesCalculationReportLMSProps extends AvatarBadgeLMSProps {
  sessionToken: string;
  sessionUserRole: number;
  resultId: string;
  resultName: string;
  resultStatus: boolean;
  estimatedPriceByValue: number;
  estimatedPriceByCost: number;
  estimatedPriceByCompetition: number;
  valueCommunication: string;
  variableCostPerUnit: number;
  fixedCostPerPeriod: number;
  productionPerPeriod: number;
  competitorList: CompetitorList[];
}

export default function COGSPricesCalculationReportLMS(
  props: COGSPricesCalculationReportLMSProps
) {
  const router = useRouter();
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);
  const [selectedPrice, setSelectedPrice] = useState<AIPriceType | null>(null);
  const [profitTarget, setProfitTarget] = useState(10000000);
  const [volumeProduction, setVolumeProduction] = useState(
    props.productionPerPeriod
  );

  const handleProfitTargetChange = (value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ""));
    setProfitTarget(num || 0);
  };

  const handleVolumeProductionChange = (value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ""));
    setVolumeProduction(num || 0);
  };

  const fixedCostPerUnit = props.fixedCostPerPeriod / volumeProduction;
  const totalCostPerUnit = fixedCostPerUnit + props.variableCostPerUnit;

  // Margin Profit
  const marginProfitByValue = Math.round(
    ((props.estimatedPriceByValue - totalCostPerUnit) / totalCostPerUnit) * 100
  );
  const marginProfitByCost = Math.round(
    ((props.estimatedPriceByCost - totalCostPerUnit) / totalCostPerUnit) * 100
  );
  const marginProfitByCompetition = Math.round(
    ((props.estimatedPriceByCompetition - totalCostPerUnit) /
      totalCostPerUnit) *
      100
  );

  // Profit
  const profitByValue = Math.round(
    props.estimatedPriceByValue - totalCostPerUnit
  );
  const profitByCost = Math.round(
    props.estimatedPriceByCost - totalCostPerUnit
  );
  const profitByCompetition = Math.round(
    props.estimatedPriceByCompetition - totalCostPerUnit
  );

  // Calculation
  const estimatedPrice = useMemo(() => {
    if (!selectedPrice) return null;

    const map: Record<AIPriceType, number> = {
      value: props.estimatedPriceByValue,
      cost: props.estimatedPriceByCost,
      competition: props.estimatedPriceByCompetition,
    };

    return map[selectedPrice];
  }, [
    selectedPrice,
    props.estimatedPriceByValue,
    props.estimatedPriceByCost,
    props.estimatedPriceByCompetition,
  ]);

  const monthlySalesTarget = useMemo(() => {
    if (!estimatedPrice) return 0;

    return Math.ceil(
      (props.fixedCostPerPeriod + profitTarget) /
        (estimatedPrice - props.variableCostPerUnit)
    );
  }, [
    estimatedPrice,
    props.fixedCostPerPeriod,
    props.variableCostPerUnit,
    profitTarget,
  ]);

  const monthlyRevenue = useMemo(() => {
    if (!estimatedPrice) return 0;

    return getRupiahCurrency(monthlySalesTarget * estimatedPrice);
  }, [estimatedPrice, monthlySalesTarget]);

  const monthlyExpense = useMemo(() => {
    if (!estimatedPrice) return 0;

    return getRupiahCurrency(
      Math.round(monthlySalesTarget * props.variableCostPerUnit) +
        props.fixedCostPerPeriod
    );
  }, [
    estimatedPrice,
    monthlySalesTarget,
    props.variableCostPerUnit,
    props.fixedCostPerPeriod,
  ]);

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data } = trpc.read.ai.pricingStrategy.useQuery(
    { id: props.resultId },
    {
      refetchInterval: intervalMs,
      enabled: !!props.sessionToken,
    }
  );
  const isDoneResult = data?.result.is_done;

  useEffect(() => {
    if (isDoneResult) {
      router.refresh();
      queueMicrotask(() => setIntervalMs(false));
    }
  }, [isDoneResult, router]);

  const mobileHeader = (
    <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 bg-dashboard-bg border-b border-dashboard-border">
      <Link href="/ai" className="flex items-center justify-center size-8 rounded-full hover:bg-card-inside-bg transition-colors">
        <ChevronLeft className="size-5" />
      </Link>
      <h1 className="font-brand font-bold text-lg truncate">
        COGS &amp; Prices Calculator
      </h1>
    </div>
  );

  if (!props.resultStatus) {
    return (
      <>
        <PageContainerDashboard className="pb-8 items-center justify-center">
          <HeaderAIResultDetailsLMS
            sessionUserName={props.sessionUserName}
            sessionUserAvatar={props.sessionUserAvatar}
            sessionUserRole={props.sessionUserRole}
            headerTitle="COGS & Prices Calculator"
            headerResultName={props.resultName}
          />
          <div className="flex flex-col w-full items-center">
            <LoadingAIGeneratingResult />
          </div>
        </PageContainerDashboard>
        <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
          {mobileHeader}
          <div className="flex flex-col items-center justify-center flex-1 gap-3 p-8 text-center">
            <Loader2 className="size-8 animate-spin text-tertiary" />
            <p className="font-bodycopy font-medium text-emphasis text-sm">
              Generating your report...
            </p>
          </div>
          <BottomNavLMS />
        </div>
      </>
    );
  }

  return (
    <>
    <PageContainerDashboard className="pb-8 items-center justify-center">
      <HeaderAIResultDetailsLMS
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserRole={props.sessionUserRole}
        headerTitle="COGS & Prices Calculator"
        headerResultName={props.resultName}
      />
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4">
        <div className="flex w-full gap-4">
          <main className="flex flex-col flex-2 gap-4 w-full">
            <div className="target-profit flex flex-col w-full gap-2 p-5 bg-linear-to-bl from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Simulasi Target
              </h3>
              <AppNumberInputSVP
                inputId="target-profit"
                inputName="Masukkan target keuntungan per bulan (dalam rupiah)"
                inputIcon="Rp"
                value={String(profitTarget)}
                inputConfig="numeric"
                variant="SVP"
                onInputChange={handleProfitTargetChange}
              />
              <AppNumberInputSVP
                inputId="production-per-periods"
                inputName="Atur volume produksi/persediaan per bulan"
                value={String(volumeProduction)}
                inputConfig="numeric"
                variant="SVP"
                onInputChange={handleVolumeProductionChange}
              />
            </div>
            <div className="price-strategy flex flex-col gap-3 p-5 bg-card-bg border border-dashboard-border rounded-lg">
              <div className="flex flex-col">
                <h3 className="section-title font-bodycopy font-bold text-lg">
                  Harga yang Disarankan
                </h3>
                <p className="text-[15px] text-emphasis font-bodycopy font-medium">
                  Pilih salah satu
                </p>
              </div>
              <AIPriceItemLMS
                estimatedPrice={props.estimatedPriceByValue}
                marginProfit={marginProfitByValue}
                profit={profitByValue}
                isSelected={selectedPrice === "value"}
                onSelect={() => setSelectedPrice("value")}
                variant="value"
              />
              <AIPriceItemLMS
                estimatedPrice={props.estimatedPriceByCost}
                marginProfit={marginProfitByCost}
                profit={profitByCost}
                isSelected={selectedPrice === "cost"}
                onSelect={() => setSelectedPrice("cost")}
                variant="cost"
              />
              <AIPriceItemLMS
                estimatedPrice={props.estimatedPriceByCompetition}
                marginProfit={marginProfitByCompetition}
                profit={profitByCompetition}
                isSelected={selectedPrice === "competition"}
                onSelect={() => setSelectedPrice("competition")}
                variant="competition"
              />
            </div>
            <div className="price-strategy flex flex-col gap-3 p-5 bg-card-bg border border-dashboard-border rounded-lg">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Kalkulasi & Proyeksi Penjualan
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <ScorecardItemCMS
                  scorecardName="Target Penjualan per Bulan (unit)"
                  scorecardValue={formatWithComma(monthlySalesTarget)}
                  scorecardBackground="bg-tertiary"
                />
                <ScorecardItemCMS
                  scorecardName="Target Penjualan per Hari (unit)"
                  scorecardValue={formatWithComma(
                    Math.ceil(monthlySalesTarget / 30)
                  )}
                  scorecardBackground="bg-primary"
                />
                <ScorecardItemCMS
                  scorecardName="Total Pendapatan per Bulan"
                  scorecardValue={monthlyRevenue}
                  scorecardBackground="bg-success-foreground"
                />
                <ScorecardItemCMS
                  scorecardName="Total Biaya per Bulan"
                  scorecardValue={monthlyExpense}
                  scorecardBackground="bg-danger-foreground"
                />
              </div>
            </div>
          </main>
          <aside className="aside-industry-analisis flex flex-col flex-[1.2] gap-4 w-full">
            <div className="cost-analysis flex flex-col gap-2 p-5 bg-linear-to-bl from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Rincian Biaya
              </h3>
              <div className="fixed-cost-per-period flex items-center justify-between text-foreground">
                <p className="font-bodycopy font-medium text-[15px]">
                  Fixed Cost per Bulan
                </p>
                <p className="font-bodycopy font-semibold text-[15px]">
                  {getRupiahCurrency(props.fixedCostPerPeriod)}
                </p>
              </div>
              <div className="production-per-period flex items-center justify-between text-foreground">
                <p className="font-bodycopy font-medium text-[15px]">
                  Volume Produksi
                </p>
                <p className="font-bodycopy font-semibold text-[15px]">
                  {volumeProduction} unit
                </p>
              </div>
              <hr className="divider border-b" />
              <div className="fixed-cost-per-unit flex items-center justify-between text-foreground">
                <p className="font-bodycopy font-medium text-[15px]">
                  Fixed Cost per Unit
                </p>
                <p className="font-bodycopy font-semibold text-[15px]">
                  {getRupiahCurrency(fixedCostPerUnit)}
                </p>
              </div>
              <div className="variable-cost-per-unit flex items-center justify-between text-foreground">
                <p className="font-bodycopy font-medium text-[15px]">
                  Variable Cost per Unit
                </p>
                <p className="font-bodycopy font-semibold text-[15px]">
                  {getRupiahCurrency(props.variableCostPerUnit)}
                </p>
              </div>
              <hr className="divider border-b" />
              <div className="total-cost-per-unit flex items-center justify-between text-foreground">
                <p className="font-bodycopy font-bold text-[15px]">
                  Total Cost per Unit
                </p>
                <p className="font-bodycopy font-bold text-[15px]">
                  {getRupiahCurrency(totalCostPerUnit)}
                </p>
              </div>
            </div>
            <div className="value-communication flex flex-col gap-2 p-5 bg-linear-to-bl from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Value Communication
              </h3>
              <p className="font-bodycopy font-medium text-[15px] text-foreground">
                {props.valueCommunication}
              </p>
            </div>
            <div className="value-communication flex flex-col gap-2 p-5 bg-card-bg border border-dashboard-border rounded-lg">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Benchmark Kompetitor
              </h3>
              <div className="flex flex-col gap-2">
                {props.competitorList.map((post, index) => (
                  <div
                    className="flex flex-col p-3 bg-section-background rounded-md dark:bg-card-inside-bg"
                    key={index}
                  >
                    <p className="font-bodycopy font-medium text-[15px] text-foreground">
                      {post.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageContainerDashboard>

    {/* Mobile */}
    <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
      {mobileHeader}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 p-4 bg-linear-to-bl from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Simulasi Target</h3>
          <AppNumberInputSVP
            inputId="target-profit-m"
            inputName="Masukkan target keuntungan per bulan (dalam rupiah)"
            inputIcon="Rp"
            value={String(profitTarget)}
            inputConfig="numeric"
            variant="SVP"
            onInputChange={handleProfitTargetChange}
          />
          <AppNumberInputSVP
            inputId="production-per-periods-m"
            inputName="Atur volume produksi/persediaan per bulan"
            variant="SVP"
            value={String(volumeProduction)}
            inputConfig="numeric"
            onInputChange={handleVolumeProductionChange}
          />
        </div>
        <div className="flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg">
          <div className="flex flex-col">
            <h3 className="font-bodycopy font-bold text-base">Harga yang Disarankan</h3>
            <p className="text-sm text-emphasis font-bodycopy font-medium">Pilih salah satu</p>
          </div>
          <AIPriceItemLMS
            estimatedPrice={props.estimatedPriceByValue}
            marginProfit={marginProfitByValue}
            profit={profitByValue}
            isSelected={selectedPrice === "value"}
            onSelect={() => setSelectedPrice("value")}
            variant="value"
          />
          <AIPriceItemLMS
            estimatedPrice={props.estimatedPriceByCost}
            marginProfit={marginProfitByCost}
            profit={profitByCost}
            isSelected={selectedPrice === "cost"}
            onSelect={() => setSelectedPrice("cost")}
            variant="cost"
          />
          <AIPriceItemLMS
            estimatedPrice={props.estimatedPriceByCompetition}
            marginProfit={marginProfitByCompetition}
            profit={profitByCompetition}
            isSelected={selectedPrice === "competition"}
            onSelect={() => setSelectedPrice("competition")}
            variant="competition"
          />
        </div>
        <div className="flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Kalkulasi &amp; Proyeksi Penjualan</h3>
          <div className="grid grid-cols-2 gap-3">
            <ScorecardItemCMS scorecardName="Target Penjualan per Bulan (unit)" scorecardValue={formatWithComma(monthlySalesTarget)} scorecardBackground="bg-tertiary" />
            <ScorecardItemCMS scorecardName="Target Penjualan per Hari (unit)" scorecardValue={formatWithComma(Math.ceil(monthlySalesTarget / 30))} scorecardBackground="bg-primary" />
            <ScorecardItemCMS scorecardName="Total Pendapatan per Bulan" scorecardValue={monthlyRevenue} scorecardBackground="bg-success-foreground" />
            <ScorecardItemCMS scorecardName="Total Biaya per Bulan" scorecardValue={monthlyExpense} scorecardBackground="bg-danger-foreground" />
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-linear-to-bl from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Rincian Biaya</h3>
          <div className="flex items-center justify-between">
            <p className="font-bodycopy font-medium text-[15px]">Fixed Cost per Bulan</p>
            <p className="font-bodycopy font-semibold text-[15px]">{getRupiahCurrency(props.fixedCostPerPeriod)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bodycopy font-medium text-[15px]">Volume Produksi</p>
            <p className="font-bodycopy font-semibold text-[15px]">{volumeProduction} unit</p>
          </div>
          <hr className="border-b" />
          <div className="flex items-center justify-between">
            <p className="font-bodycopy font-medium text-[15px]">Fixed Cost per Unit</p>
            <p className="font-bodycopy font-semibold text-[15px]">{getRupiahCurrency(fixedCostPerUnit)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bodycopy font-medium text-[15px]">Variable Cost per Unit</p>
            <p className="font-bodycopy font-semibold text-[15px]">{getRupiahCurrency(props.variableCostPerUnit)}</p>
          </div>
          <hr className="border-b" />
          <div className="flex items-center justify-between">
            <p className="font-bodycopy font-bold text-[15px]">Total Cost per Unit</p>
            <p className="font-bodycopy font-bold text-[15px]">{getRupiahCurrency(totalCostPerUnit)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-linear-to-bl from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Value Communication</h3>
          <p className="font-bodycopy font-medium text-[15px]">{props.valueCommunication}</p>
        </div>
        {props.competitorList.length > 0 && (
          <div className="flex flex-col gap-2 p-4 bg-card-bg border border-dashboard-border rounded-lg">
            <h3 className="font-bodycopy font-bold text-base">Benchmark Kompetitor</h3>
            <div className="flex flex-col gap-2">
              {props.competitorList.map((post, index) => (
                <div key={index} className="p-3 bg-section-background rounded-md dark:bg-card-inside-bg">
                  <p className="font-bodycopy font-medium text-[15px]">{post.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomNavLMS />
    </div>
    </>
  );
}
