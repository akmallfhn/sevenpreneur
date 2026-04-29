"use client";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  AIIdeaValidation_LongevityAlignment,
  AIIdeaValidation_ProblemFreq,
} from "@/trpc/routers/ai_tool/enum.ai_tool";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { ChevronLeft, Loader2, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AICitationLMS, { SourcesArticle } from "../items/AICitationLMS";
import AISegmentItemLMS from "../items/AISegmentItemLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import PageContainerDashboard from "../pages/PageContainerDashboard";
import LoadingAIGeneratingResult from "../states/LoadingAIGeneratingResultLMS";
import styles from "./Report.module.css";

const freqAttributes: Record<
  AIIdeaValidation_ProblemFreq,
  {
    description: string;
    color: string;
    icon: ReactNode;
    icon_background: string;
  }
> = {
  tinggi: {
    description:
      "terjadi di banyak tempat, banyak pengguna merasakannya, dan dampaknya cukup besar.",
    color: "text-destructive",
    icon: <TrendingUp className="text-destructive size-10" />,
    icon_background:
      "bg-linear-to-br from-0% from-semi-destructive to-70% to-[#FCFCFC] dark:to-[#11141b]",
  },
  sedang: {
    description:
      "muncul cukup sering, tidak universal, tapi cukup berarti untuk tidak diabaikan.",
    color: "text-[#FB8C00]",
    icon: <Minus className="text-[#FB8C00] size-10" />,
    icon_background:
      "bg-linear-to-br from-0% from-yellow-100 to-70% to-[#FCFCFC] dark:to-[#11141b]",
  },
  rendah: {
    description: "hanya dialami sedikit pengguna dan jarang muncul.",
    color: "text-[#43A047]",
    icon: <TrendingDown className="text-[#43A047] size-10" />,
    icon_background:
      "bg-linear-to-br from-0% from-green-200 to-70% to-[#FCFCFC] dark:to-[#11141b]",
  },
};

const longevityAttributes: Record<
  AIIdeaValidation_LongevityAlignment,
  {
    name: string;
    description: string;
    icon: ReactNode;
    icon_background: string;
  }
> = {
  longterm: {
    name: "Long-term Product",
    description:
      "Produk ini memiliki potensi jangka panjang dan relevan dalam waktu yang lama.",
    icon: "🌲",
    icon_background:
      "bg-linear-to-br from-0% from-green-200 to-80% to-[#FCFCFC] dark:to-[#11141b]",
  },
  shortterm: {
    name: "Short-term Product",
    description:
      "Produk ini cocok untuk kebutuhan jangka pendek atau fase awal.",
    icon: "⚡",
    icon_background:
      "bg-linear-to-br from-0% from-yellow-100 to-80% to-[#FCFCFC] dark:to-[#11141b]",
  },
  seasonal: {
    name: "Seasonal Product",
    description:
      "Produk ini bersifat musiman dan relevansinya bergantung pada momen tertentu.",
    icon: "🍂",
    icon_background:
      "bg-linear-to-br from-0% from-semi-destructive to-80% to-[#FCFCFC] dark:to-[#11141b]",
  },
};

interface AffectedSegments {
  segment_name: string;
  segment_size: number;
  severity_percentage: number;
  pain_points: string;
  segment_description: string;
}

interface IdeaValidationReportLMSProps extends AvatarBadgeLMSProps {
  sessionToken: string;
  sessionUserRole: number;
  resultId: string;
  resultName: string;
  resultStatus: boolean;
  problemDiscovery: string;
  problemFrequency: AIIdeaValidation_ProblemFreq;
  problemFitScore: number;
  problemFactor: string;
  affectedSegments: AffectedSegments[];
  existingAlternatives: string;
  sources: SourcesArticle[];
  confidenceLevel: number;
  solutionValue: string;
  solutionFitScore: number;
  solutionFeasibility: string;
  industryDirection: string;
  longevityAlignment: AIIdeaValidation_LongevityAlignment;
  longevityReason: string;
  ideaMarketRecommendation: string;
  ideaCompetitiveRecommendation: string;
  ideaResourceRecommendation: string;
  ideaPriorityFocus: string;
  ideaNextStep: string[];
}

export default function IdeaValidationReportLMS(
  props: IdeaValidationReportLMSProps
) {
  const router = useRouter();
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data } = trpc.read.ai.ideaValidation.useQuery(
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

  let problemScoreDesc;
  if (props.problemFitScore >= 75) {
    problemScoreDesc = "sangat kuat dan layak menjadi prioritas utama.";
  } else if (props.problemFitScore >= 50) {
    problemScoreDesc =
      "cukup penting, namun tetap perlu dibandingkan dengan peluang lain.";
  } else {
    problemScoreDesc =
      "kurang mendesak dan tidak wajib diprioritaskan saat ini.";
  }

  let solutionScoreDesc;
  if (props.solutionFitScore >= 75) {
    solutionScoreDesc =
      "relevan dengan masalah yang diidentifikasi dan kemungkinan dapat membantu sebagian besar pengguna.";
  } else if (props.solutionFitScore >= 50) {
    solutionScoreDesc =
      "memiliki kecocokan terbatas. Beberapa pengguna mungkin merasakan manfaat, tapi tidak semua.";
  } else {
    solutionScoreDesc =
      "kurang cocok dengan masalah yang ada dan dampaknya terhadap pengguna kemungkinan kecil.";
  }

  const freq = freqAttributes[props.problemFrequency];
  const longevity = longevityAttributes[props.longevityAlignment] || {
    name: "",
    description: "",
    icon: "",
    icon_background: "",
  };
  const problemDiscovery = markdownToHtml(props.problemDiscovery);
  const solutionValue = markdownToHtml(props.solutionValue);
  const solutionFeasibility = markdownToHtml(props.solutionFeasibility);
  const industryDirection = markdownToHtml(props.industryDirection);
  const longevityReason = markdownToHtml(
    `${longevity.description} ${props.longevityReason}`
  );

  const mobileHeader = (
    <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 bg-dashboard-bg border-b border-dashboard-border">
      <Link href="/ai" className="flex items-center justify-center size-8 rounded-full hover:bg-card-inside-bg transition-colors">
        <ChevronLeft className="size-5" />
      </Link>
      <h1 className="font-brand font-bold text-lg truncate">Idea Validation</h1>
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
            headerTitle="Idea Validation Result"
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
        headerTitle="Idea Validation Result"
        headerResultName={props.resultName}
      />
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4">
        <h2 className="section-title font-bold font-brand text-xl">
          Problem-Fit Analysis
        </h2>
        <div className="problem-fit flex w-full h-[420px] gap-4 bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] p-5 border border-dashboard-border rounded-lg xl:h-[320px]">
          <div className="discovery relative flex flex-col flex-2 gap-2 shrink-0 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] p-4 border border-dashboard-border rounded-lg">
            <h3 className="section-title sticky top-0 left-0 font-bodycopy font-bold text-lg">
              Ringkasan Temuan Penelitian
            </h3>
            <div
              className={`${styles.report} overflow-y-auto pb-10`}
              dangerouslySetInnerHTML={{
                __html: problemDiscovery,
              }}
            />
          </div>
          <div className="problem-frequency flex flex-col flex-1 w-full p-2 items-center gap-4">
            <h3 className="section-title font-bodycopy font-bold text-lg text-center">
              Frekuensi Masalah
            </h3>
            <div className="indicator flex flex-col items-center gap-4">
              <div
                className={`justify-center items-center p-2 rounded-xl ${freq.icon_background}`}
              >
                {freq.icon}
              </div>
              <p className={`font-brand font-bold text-3xl ${freq.color}`}>
                {props.problemFrequency.toUpperCase()}
              </p>
            </div>
            <p className="description font-bodycopy font-medium text-[15px] text-emphasis text-center">
              Masalah yang kamu identifikasi {freq.description}
            </p>
          </div>
          <div className="problem-fit-score flex flex-col flex-1 w-full p-2 items-center gap-2">
            <h3 className="section-title font-bodycopy font-bold text-lg text-center">
              Kelayakan Masalah
            </h3>
            <div className="indicator relative flex max-w-[124px] items-center justify-center">
              <Gauge
                value={props.problemFitScore}
                width={124}
                height={124}
                cornerRadius={50}
                sx={() => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    display: "none",
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#0165FC",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: "B8C9DD",
                  },
                })}
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-brand font-bold">
                {props.problemFitScore}
              </p>
            </div>
            <p className="description font-bodycopy font-medium text-[15px] text-emphasis text-center">
              Skor {props.problemFitScore} menunjukkan bahwa masalah ini{" "}
              {problemScoreDesc}
            </p>
          </div>
        </div>
        <div className="problem-fit flex w-full gap-4">
          <div className="affected-segments flex flex-col flex-2 gap-2 w-full bg-card-bg p-5 rounded-lg border border-dashboard-border">
            <h3 className="section-title font-bodycopy font-bold text-lg">
              Segmen yang Terdampak
            </h3>
            <div className="segment-list flex flex-col gap-4">
              {props.affectedSegments.map((post) => (
                <AISegmentItemLMS
                  key={post.segment_name}
                  segmentName={post.segment_name}
                  segmentDescription={post.segment_description}
                  segmentSize={post.segment_size}
                  segmentPercentage={post.severity_percentage}
                  segmentPainPoints={post.pain_points}
                />
              ))}
            </div>
          </div>
          <div className="sources flex flex-[1.5] w-full">
            <AICitationLMS
              sources={props.sources}
              confidenceLevel={props.confidenceLevel}
            />
          </div>
        </div>
        <div className="problem-fit flex gap-6 font-bodycopy w-full bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] p-5 rounded-lg border border-dashboard-border">
          <div className="problem-factors flex flex-col flex-1 gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="section-title text-lg font-bold">
                Mengapa Masalah Ini Terjadi?
              </h3>
              <p className="text-emphasis text-[15px]">
                {props.problemFactor}
              </p>
            </div>
          </div>
          <div className="divider border-l self-stretch" />
          <div className="existing_alternative flex flex-col flex-1 gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="section-title text-lg font-bold">
                Alternatif yang Tersedia
              </h3>
              <p className="text-emphasis text-[15px]">
                {props.existingAlternatives}
              </p>
            </div>
          </div>
        </div>
        <h2 className="section-title font-bold font-brand text-xl">
          Solution-Fit Analysis
        </h2>
        <div className="solution-fit flex w-full h-[420px] gap-4 bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] p-5 border border-dashboard-border rounded-lg xl:h-[300px]">
          <div className="value-proposition relative flex flex-col flex-2 gap-2 shrink-0 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-40% to-white dark:to-[#11141b] p-4 border border-dashboard-border rounded-lg">
            <h3 className="section-title sticky top-0 left-0 font-bodycopy font-bold text-lg">
              Nilai Utama Solusi
            </h3>
            <div
              className={`${styles.report} overflow-y-auto pb-10`}
              dangerouslySetInnerHTML={{
                __html: solutionValue,
              }}
            />
          </div>
          <div className="solution-fit-score flex flex-col flex-[1.5] w-full p-2 items-center justify-between">
            <h3 className="section-title font-bodycopy font-bold text-lg text-center">
              Kecocokan Solusi
            </h3>
            <div className="indicator relative flex max-w-[124px] items-center justify-center">
              <Gauge
                value={props.solutionFitScore}
                width={124}
                height={124}
                cornerRadius={50}
                sx={() => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    display: "none",
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#0165FC",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: "B8C9DD",
                  },
                })}
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-brand font-bold">
                {props.solutionFitScore}
              </p>
            </div>
            <p className="description font-bodycopy font-medium text-[15px] text-emphasis text-center">
              Skor {props.solutionFitScore} menunjukkan solusi ini{" "}
              {solutionScoreDesc}
            </p>
          </div>
        </div>
        <div className="solution-fit flex w-full gap-4">
          <div className="affected-segments flex flex-col flex-2 gap-4 w-full bg-card-bg p-5 rounded-lg border border-dashboard-border">
            <div className="solution-feasibility flex flex-col gap-2">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Kemungkinan Pengembangan
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: solutionFeasibility,
                }}
              />
            </div>
            <div className="industry-direction flex flex-col gap-2">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Tren Industri ke Depan
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: industryDirection,
                }}
              />
            </div>
          </div>
          <div className="data-confidence flex flex-col flex-1 gap-4 w-full bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] p-5 items-center text-center rounded-lg border border-dashboard-border">
            <div
              className={`aspect-square p-1 rounded-full ${longevity.icon_background}`}
            >
              <p className="text-[72px] leading-snug">{longevity.icon}</p>
            </div>
            <p className="section-title font-bold text-lg font-bodycopy">
              {longevity.name}
            </p>
            <div
              className={styles.report}
              dangerouslySetInnerHTML={{
                __html: longevityReason,
              }}
            />
          </div>
        </div>
        <h2 className="section-title font-bold font-brand text-xl">
          Idea Refinement
        </h2>
        <div className="idea-refinement flex w-full gap-4">
          <div className="suggestions flex flex-col flex-2 gap-2 w-full bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] p-5 rounded-lg border border-dashboard-border">
            <h3 className="section-title font-bodycopy font-bold text-lg">
              Rekomendasi & Saran
            </h3>
            <div className="suggestion-list flex flex-col gap-3">
              <div className="market-suggestions w-full bg-card-inside-bg p-3 rounded-lg border border-dashboard-border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaMarketRecommendation,
                  }}
                />
              </div>
              <div className="competitive-suggestions w-full bg-card-inside-bg p-3 rounded-lg border border-dashboard-border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaCompetitiveRecommendation,
                  }}
                />
              </div>
              <div className="resource-suggestions w-full bg-card-inside-bg p-3 rounded-lg border border-dashboard-border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaResourceRecommendation,
                  }}
                />
              </div>
              <div className="priority-suggestions w-full bg-card-inside-bg p-3 rounded-lg border border-dashboard-border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaPriorityFocus,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="data-confidence flex flex-col flex-1 gap-4 w-full bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] p-5 rounded-lg border border-dashboard-border">
            <h3 className="section-title font-bold text-lg font-bodycopy">
              Next Step Actions
            </h3>
            <div className="step-list relative flex flex-col gap-4 pb-2">
              {props.ideaNextStep.map((item) => (
                <div
                  key={item}
                  className="step-item flex items-center gap-6 z-10"
                >
                  <div className="step-point bg-primary size-3 rounded-full shrink-0 outline-primary-light/60 outline-4" />
                  <p className="step-action font-bodycopy font-medium text-[15px] text-emphasis">
                    {item}
                  </p>
                </div>
              ))}
              <div
                className="step-rail absolute left-1 w-[2px] h-full self-stretch"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #B8C9DD 0, #B8C9DD 6px, transparent 6px, transparent 12px)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainerDashboard>

    {/* Mobile */}
    <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
      {mobileHeader}
      <div className="flex flex-col gap-4 p-4">
        <h2 className="font-bold font-brand text-lg">Problem-Fit Analysis</h2>
        <div className={`flex flex-col gap-3 p-4 bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg`}>
          <h3 className="font-bodycopy font-bold text-base">Ringkasan Temuan Penelitian</h3>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: problemDiscovery }} />
        </div>
        <div className={`flex flex-col items-center gap-3 p-4 text-center ${freq.icon_background} border border-dashboard-border rounded-lg`}>
          <h3 className="font-bodycopy font-bold text-base">Frekuensi Masalah</h3>
          <div className={`p-2 rounded-xl ${freq.icon_background}`}>{freq.icon}</div>
          <p className={`font-brand font-bold text-2xl ${freq.color}`}>{props.problemFrequency.toUpperCase()}</p>
          <p className="font-bodycopy font-medium text-[15px] text-emphasis">{freq.description}</p>
        </div>
        <div className="flex flex-col items-center gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg text-center">
          <h3 className="font-bodycopy font-bold text-base">Kelayakan Masalah</h3>
          <div className="relative flex max-w-[124px] items-center justify-center">
            <Gauge value={props.problemFitScore} width={124} height={124} cornerRadius={50} sx={() => ({ [`& .${gaugeClasses.valueText}`]: { display: "none" }, [`& .${gaugeClasses.valueArc}`]: { fill: "#0165FC" }, [`& .${gaugeClasses.referenceArc}`]: { fill: "B8C9DD" } })} />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-brand font-bold">{props.problemFitScore}</p>
          </div>
          <p className="font-bodycopy font-medium text-[15px] text-emphasis">Skor {props.problemFitScore} menunjukkan bahwa masalah ini {problemScoreDesc}</p>
        </div>
        <div className="flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Segmen yang Terdampak</h3>
          <div className="flex flex-col gap-4">
            {props.affectedSegments.map((post) => (
              <AISegmentItemLMS key={post.segment_name} segmentName={post.segment_name} segmentDescription={post.segment_description} segmentSize={post.segment_size} segmentPercentage={post.severity_percentage} segmentPainPoints={post.pain_points} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Mengapa Masalah Ini Terjadi?</h3>
          <p className="text-emphasis text-[15px] font-bodycopy">{props.problemFactor}</p>
        </div>
        <div className="flex flex-col gap-2 p-4 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Alternatif yang Tersedia</h3>
          <p className="text-emphasis text-[15px] font-bodycopy">{props.existingAlternatives}</p>
        </div>
        <AICitationLMS sources={props.sources} confidenceLevel={props.confidenceLevel} />

        <h2 className="font-bold font-brand text-lg">Solution-Fit Analysis</h2>
        <div className={`flex flex-col gap-3 p-4 bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg`}>
          <h3 className="font-bodycopy font-bold text-base">Nilai Utama Solusi</h3>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: solutionValue }} />
        </div>
        <div className="flex flex-col items-center gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg text-center">
          <h3 className="font-bodycopy font-bold text-base">Kecocokan Solusi</h3>
          <div className="relative flex max-w-[124px] items-center justify-center">
            <Gauge value={props.solutionFitScore} width={124} height={124} cornerRadius={50} sx={() => ({ [`& .${gaugeClasses.valueText}`]: { display: "none" }, [`& .${gaugeClasses.valueArc}`]: { fill: "#0165FC" }, [`& .${gaugeClasses.referenceArc}`]: { fill: "B8C9DD" } })} />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-brand font-bold">{props.solutionFitScore}</p>
          </div>
          <p className="font-bodycopy font-medium text-[15px] text-emphasis">Skor {props.solutionFitScore} menunjukkan solusi ini {solutionScoreDesc}</p>
        </div>
        <div className="flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Kemungkinan Pengembangan</h3>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: solutionFeasibility }} />
          <h3 className="font-bodycopy font-bold text-base">Tren Industri ke Depan</h3>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: industryDirection }} />
        </div>
        <div className={`flex flex-col items-center gap-3 p-4 text-center ${longevity.icon_background} border border-dashboard-border rounded-lg`}>
          <p className="text-[72px] leading-snug">{longevity.icon}</p>
          <p className="font-bodycopy font-bold text-base">{longevity.name}</p>
          <div className={styles.report} dangerouslySetInnerHTML={{ __html: longevityReason }} />
        </div>

        <h2 className="font-bold font-brand text-lg">Idea Refinement</h2>
        <div className="flex flex-col gap-3 p-4 bg-linear-to-br from-0% from-[#D2E5FC] dark:from-sevenpreneur-blue-midnight/50 to-20% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Rekomendasi &amp; Saran</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-card-inside-bg p-3 rounded-lg border border-dashboard-border"><div className={styles.report} dangerouslySetInnerHTML={{ __html: props.ideaMarketRecommendation }} /></div>
            <div className="bg-card-inside-bg p-3 rounded-lg border border-dashboard-border"><div className={styles.report} dangerouslySetInnerHTML={{ __html: props.ideaCompetitiveRecommendation }} /></div>
            <div className="bg-card-inside-bg p-3 rounded-lg border border-dashboard-border"><div className={styles.report} dangerouslySetInnerHTML={{ __html: props.ideaResourceRecommendation }} /></div>
            <div className="bg-card-inside-bg p-3 rounded-lg border border-dashboard-border"><div className={styles.report} dangerouslySetInnerHTML={{ __html: props.ideaPriorityFocus }} /></div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 bg-linear-to-bl from-0% from-[#EFEDF9] dark:from-[#1a1640] to-50% to-white dark:to-[#11141b] border border-dashboard-border rounded-lg">
          <h3 className="font-bodycopy font-bold text-base">Next Step Actions</h3>
          <div className="relative flex flex-col gap-4 pb-2">
            {props.ideaNextStep.map((item) => (
              <div key={item} className="flex items-center gap-6 z-10">
                <div className="bg-primary size-3 rounded-full shrink-0 outline-primary-light/60 outline-4" />
                <p className="font-bodycopy font-medium text-[15px] text-emphasis">{item}</p>
              </div>
            ))}
            <div className="absolute left-1 w-[2px] h-full" style={{ backgroundImage: "repeating-linear-gradient(to bottom, #B8C9DD 0, #B8C9DD 6px, transparent 6px, transparent 12px)" }} />
          </div>
        </div>
      </div>
      <BottomNavLMS />
    </div>
    </>
  );
}
