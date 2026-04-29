"use client";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { setSessionToken, trpc } from "@/trpc/client";
import { AICompetitorGrader_MarketMaturity } from "@/trpc/routers/ai_tool/enum.ai_tool";
import { BarChart } from "@mui/x-charts";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import XYMapLMS, { CompetitorList } from "../charts/XYMapLMS";
import AICitationLMS, { SourcesArticle } from "../items/AICitationLMS";
import AICompetitorItemLMS from "../items/AICompetitorItemLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import PageContainerDashboard from "../pages/PageContainerDashboard";
import LoadingAIGeneratingResult from "../states/LoadingAIGeneratingResultLMS";
import styles from "./Report.module.css";

const maturityAttributes: Record<
  AICompetitorGrader_MarketMaturity,
  {
    label: string;
    icon: string;
    description: string;
    color: string;
  }
> = {
  emerging: {
    label: "Emerging",
    icon: "🚀",
    description:
      "pasar masih kecil dan baru mulai tumbuh, serta jumlah perusahaan yang aktif masih sedikit.",
    color: "text-[#FB8C00]",
  },
  growing: {
    label: "Growing",
    icon: "🌱",
    description:
      "pasar berkembang pesat, permintaan meningkat, dan semakin banyak perusahaan mulai masuk dan bersaing.",
    color: "text-[#43A047]",
  },
  mature: {
    label: "Mature",
    icon: "🌊",
    description:
      "pasar mulai stabil, persaingan antara perusahaan sudah ketat, dan pasar relatif mapan.",
    color: "text-primary",
  },
  declining: {
    label: "Declining",
    icon: "❌",
    description:
      "pasar mulai menyusut, permintaan menurun, dan jumlah perusahaan berkurang karena berhenti beroperasi.",
    color: "text-destructive",
  },
};

interface CompetitorGradingReportLMSProps extends AvatarBadgeLMSProps {
  sessionToken: string;
  sessionUserRole: number;
  resultId: string;
  resultName: string;
  resultStatus: boolean;
  productName: string;
  productXPosition: number;
  productYPosition: number;
  industryCurrentCondition: string;
  industryCAGRValue: number[];
  industryCAGRReason: string;
  industryMarketMaturity: AICompetitorGrader_MarketMaturity;
  industryMarketMaturityReason: string;
  competitorList: CompetitorList[];
  xLeftAttribute: string;
  xRightAttribute: string;
  yTopAttribute: string;
  yBottomAttribute: string;
  growthOpportunity: string;
  sources: SourcesArticle[];
  confidenceLevel: number;
}

export default function CompetitorGradingReportLMS(
  props: CompetitorGradingReportLMSProps
) {
  const router = useRouter();
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data } = trpc.read.ai.competitorGrading.useQuery(
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

  const industryCAGRReason = markdownToHtml(props.industryCAGRReason);
  const industryMarketMaturityReason = markdownToHtml(
    props.industryMarketMaturityReason
  );
  const industryCurrentCondition = markdownToHtml(
    props.industryCurrentCondition
  );
  const growthOpportunity = markdownToHtml(props.growthOpportunity);
  const maturity = maturityAttributes[props.industryMarketMaturity];

  const mobileHeader = (
    <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 bg-dashboard-bg border-b border-dashboard-border">
      <Link href="/ai" className="flex items-center justify-center size-8 rounded-full hover:bg-card-inside-bg transition-colors">
        <ChevronLeft className="size-5" />
      </Link>
      <h1 className="font-brand font-bold text-lg truncate">Competitor Grading</h1>
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
            headerTitle="Competitor Grading Result"
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
        headerTitle="Competitor Grading Result"
        headerResultName={props.resultName}
        headerDescription={`For ${props.productName}`}
      />
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4">
        <div className="industry-analysis flex w-full gap-4">
          <main className="main-industry-analysis flex flex-col flex-2 gap-4 w-full">
            <div className="cagr-projection flex flex-col gap-2 w-full bg-card-bg p-5 rounded-lg border border-dashboard-border">
              <div className="section-title flex flex-col">
                <h3 className="title font-bodycopy font-bold text-lg">
                  Proyeksi Pertumbuhan Tahunan Industri (CAGR)
                </h3>
                <p className="remarks font-bodycopy font-medium text-[15px] text-emphasis">
                  dalam persen (%)
                </p>
              </div>
              <div className="flex w-full">
                <BarChart
                  xAxis={[{ data: ["2024", "2025", "2026", "2027", "2028"] }]}
                  series={[{ data: props.industryCAGRValue }]}
                  height={280}
                />
              </div>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: industryCAGRReason,
                }}
              />
            </div>
            <div className="market-maturity flex flex-col gap-4 w-full bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white dark:to-[#11141b] p-5 rounded-lg border border-dashboard-border font-bodycopy dark:from-sevenpreneur-blue-midnight/50">
              <h3 className="text-lg font-bold">Fase Perkembangan Industri</h3>
              <h4 className={`font-brand font-bold text-3xl ${maturity.color}`}>
                {maturity.label} {maturity.icon}
              </h4>
              <div className="market-maturity-reason flex flex-col gap-2">
                <p className="text-foreground text-[15px]">
                  Fase industri {maturity.label} menunjukkan kondisi di mana
                  pertumbuhan {maturity.description}
                </p>
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: industryMarketMaturityReason,
                  }}
                />
              </div>
            </div>
            <div className="competitor-analysis flex flex-col gap-4 w-full bg-card-bg p-5 rounded-lg border border-dashboard-border font-bodycopy">
              <h3 className="text-lg font-bold">Kompetitor Utama</h3>
              <div className="flex flex-col gap-2">
                {props.competitorList
                  .sort((a, b) => b.market_score - a.market_score)
                  .map((item, index) => (
                    <AICompetitorItemLMS
                      key={item.name}
                      leaderboardIndex={index + 1}
                      competitorName={item.name}
                      competitorURL={item.company_url}
                      competitorScore={item.market_score}
                      competitorKeyStrength={item.key_strength}
                    />
                  ))}
              </div>
            </div>
            <div className="brand-positioning flex flex-2 w-full">
              <XYMapLMS
                competitorList={props.competitorList}
                productName={props.productName}
                productXPosition={props.productXPosition}
                productYPosition={props.productYPosition}
                xLeftAttribute={props.xLeftAttribute}
                xRightAttribute={props.xRightAttribute}
                yTopAttribute={props.yTopAttribute}
                yBottomAttribute={props.yBottomAttribute}
              />
            </div>
          </main>
          <aside className="aside-industry-analisis flex flex-col flex-[1.2] gap-4 w-full">
            <div className="current-condition flex flex-col gap-2 w-full bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] p-5 rounded-lg border border-dashboard-border">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Lanskap Persaingan Industri
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: industryCurrentCondition,
                }}
              />
            </div>
            <AICitationLMS
              sources={props.sources}
              confidenceLevel={props.confidenceLevel}
            />
            <div className="room-of-growth flex flex-col gap-2 w-full bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] p-5 rounded-lg border border-dashboard-border">
              <h3 className="section-title text-lg font-bold font-bodycopy">
                Celah Kompetitif
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: growthOpportunity,
                }}
              />
            </div>
          </aside>
        </div>
      </div>
    </PageContainerDashboard>

    {/* Mobile */}
    <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
      {mobileHeader}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2 p-4 bg-card-bg border border-dashboard-border rounded-lg">
          <div className="flex flex-col">
            <h3 className="font-bodycopy font-bold text-base">Proyeksi Pertumbuhan Tahunan Industri (CAGR)</h3>
            <p className="text-sm text-emphasis font-bodycopy font-medium">dalam persen (%)</p>
          </div>
          <div className="w-full overflow-x-auto">
            <BarChart
              xAxis={[{ data: ["2024", "2025", "2026", "2027", "2028"] }]}
              series={[{ data: props.industryCAGRValue }]}
              height={240}
            />
          </div>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: industryCAGRReason }} />
        </div>
        <div className={`flex flex-col gap-3 p-4 bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg font-bodycopy dark:from-sevenpreneur-blue-midnight/50`}>
          <h3 className="text-base font-bold">Fase Perkembangan Industri</h3>
          <h4 className={`font-brand font-bold text-2xl ${maturity.color}`}>{maturity.label} {maturity.icon}</h4>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: industryMarketMaturityReason }} />
        </div>
        <div className="flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg">
          <h3 className="text-base font-bold font-bodycopy">Kompetitor Utama</h3>
          <div className="flex flex-col gap-2">
            {props.competitorList
              .sort((a, b) => b.market_score - a.market_score)
              .map((item, index) => (
                <AICompetitorItemLMS
                  key={item.name}
                  leaderboardIndex={index + 1}
                  competitorName={item.name}
                  competitorURL={item.company_url}
                  competitorScore={item.market_score}
                  competitorKeyStrength={item.key_strength}
                />
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Lanskap Persaingan Industri</h3>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: industryCurrentCondition }} />
        </div>
        <div className="flex flex-col gap-2 p-4 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Celah Kompetitif</h3>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: growthOpportunity }} />
        </div>
        <AICitationLMS sources={props.sources} confidenceLevel={props.confidenceLevel} />
        <XYMapLMS
          competitorList={props.competitorList}
          productName={props.productName}
          productXPosition={props.productXPosition}
          productYPosition={props.productYPosition}
          xLeftAttribute={props.xLeftAttribute}
          xRightAttribute={props.xRightAttribute}
          yTopAttribute={props.yTopAttribute}
          yBottomAttribute={props.yBottomAttribute}
        />
      </div>
      <BottomNavLMS />
    </div>
    </>
  );
}
