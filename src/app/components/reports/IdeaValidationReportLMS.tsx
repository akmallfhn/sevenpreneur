"use client";
import styles from "./Report.module.css";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import {
  AIIdeaValidation_LongevityAlignment,
  AIIdeaValidation_ProblemFreq,
} from "@/trpc/routers/ai_tool/enum.ai_tool";
import { Minus, TrendingDown, TrendingUp, User } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setSessionToken, trpc } from "@/trpc/client";
import LoadingAIGeneratingResult from "../state/LoadingAIGeneratingResultLMS";
import AICitationLMS, { SourcesArticle } from "../indexes/AICitationLMS";
import AISegmentItemLMS from "../items/AISegmentItemLMS";

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
      "bg-linear-to-br from-0% from-semi-destructive to-70% to-[#FCFCFC]",
  },
  sedang: {
    description:
      "muncul cukup sering, tidak universal, tapi cukup berarti untuk tidak diabaikan.",
    color: "text-[#FB8C00]",
    icon: <Minus className="text-[#FB8C00] size-10" />,
    icon_background:
      "bg-linear-to-br from-0% from-yellow-100 to-70% to-[#FCFCFC]",
  },
  rendah: {
    description: "hanya dialami sedikit pengguna dan jarang muncul.",
    color: "text-[#43A047]",
    icon: <TrendingDown className="text-[#43A047] size-10" />,
    icon_background:
      "bg-linear-to-br from-0% from-green-200 to-70% to-[#FCFCFC]",
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
      "bg-linear-to-br from-0% from-green-200 to-80% to-[#FCFCFC]",
  },
  shortterm: {
    name: "Short-term Product",
    description:
      "Produk ini cocok untuk kebutuhan jangka pendek atau fase awal.",
    icon: "⚡",
    icon_background:
      "bg-linear-to-br from-0% from-yellow-100 to-80% to-[#FCFCFC]",
  },
  seasonal: {
    name: "Seasonal Product",
    description:
      "Produk ini bersifat musiman dan relevansinya bergantung pada momen tertentu.",
    icon: "🍂",
    icon_background:
      "bg-linear-to-br from-0% from-semi-destructive to-80% to-[#FCFCFC]",
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
      setIntervalMs(false);
    }
  }, [isDoneResult, router]);

  const freq = freqAttributes[props.problemFrequency];
  const longevity = longevityAttributes[props.longevityAlignment];

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

  let confidenceStatus;
  if (props.confidenceLevel >= 80) {
    confidenceStatus = "High";
  } else if (props.confidenceLevel >= 70) {
    confidenceStatus = "Medium";
  } else {
    confidenceStatus = "Low";
  }

  if (!props.resultStatus) {
    return (
      <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
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
      </div>
    );
  }

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
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
        <div className="problem-fit flex w-full h-[420px] gap-4 bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white p-5 border rounded-lg xl:h-[320px]">
          <div className="discovery relative flex flex-col flex-2 gap-2 shrink-0 bg-linear-to-br from-0% from-[#D2E5FC] to-40% to-white p-4 border rounded-lg">
            <h3 className="section-title sticky top-0 left-0 font-bodycopy font-bold text-lg">
              Ringkasan Temuan Penelitian
            </h3>
            <div
              className={`${styles.report} overflow-y-auto pb-10`}
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(props.problemDiscovery),
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
            <p className="description font-bodycopy font-medium text-[15px] text-[#333333] text-center">
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
                sx={(theme) => ({
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
            <p className="description font-bodycopy font-medium text-[15px] text-[#333333] text-center">
              Skor {props.problemFitScore} menunjukkan bahwa masalah ini{" "}
              {problemScoreDesc}
            </p>
          </div>
        </div>
        <div className="problem-fit flex w-full gap-4">
          <div className="affected-segments flex flex-col flex-2 gap-2 w-full bg-white p-5 rounded-lg border">
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
        <div className="problem-fit flex gap-6 font-bodycopy w-full bg-linear-to-br from-0% from-[#D2E5FC] to-20% to-white p-5 rounded-lg border">
          <div className="problem-factors flex flex-col flex-1 gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="section-title text-lg font-bold">
                Mengapa Masalah Ini Terjadi?
              </h3>
              <p className="text-[#333333] text-[15px]">
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
              <p className="text-[#333333] text-[15px]">
                {props.existingAlternatives}
              </p>
            </div>
          </div>
        </div>
        <h2 className="section-title font-bold font-brand text-xl">
          Solution-Fit Analysis
        </h2>
        <div className="solution-fit flex w-full h-[420px] gap-4 bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white p-5 border rounded-lg xl:h-[300px]">
          <div className="value-proposition relative flex flex-col flex-2 gap-2 shrink-0 bg-linear-to-br from-0% from-[#D2E5FC] to-40% to-white p-4 border rounded-lg">
            <h3 className="section-title sticky top-0 left-0 font-bodycopy font-bold text-lg">
              Nilai Utama Solusi
            </h3>
            <div
              className={`${styles.report} overflow-y-auto pb-10`}
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(props.solutionValue),
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
                sx={(theme) => ({
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
            <p className="description font-bodycopy font-medium text-[15px] text-[#333333] text-center">
              Skor {props.solutionFitScore} menunjukkan solusi ini{" "}
              {solutionScoreDesc}
            </p>
          </div>
        </div>
        <div className="solution-fit flex w-full gap-4">
          <div className="affected-segments flex flex-col flex-2 gap-4 w-full bg-white p-5 rounded-lg border">
            <div className="solution-feasibility flex flex-col gap-2">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Kemungkinan Pengembangan
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(props.solutionFeasibility),
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
                  __html: markdownToHtml(props.industryDirection),
                }}
              />
            </div>
          </div>
          <div className="data-confidence flex flex-col flex-1 gap-4 w-full bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white p-5 items-center text-center rounded-lg border">
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
                __html: markdownToHtml(
                  `${longevity.description} ${props.longevityReason}`
                ),
              }}
            />
          </div>
        </div>
        <h2 className="section-title font-bold font-brand text-xl">
          Idea Refinement
        </h2>
        <div className="idea-refinement flex w-full gap-4">
          <div className="suggestions flex flex-col flex-2 gap-2 w-full bg-linear-to-br from-0% from-[#D2E5FC] to-20% to-white p-5 rounded-lg border">
            <h3 className="section-title font-bodycopy font-bold text-lg">
              Rekomendasi & Saran
            </h3>
            <div className="suggestion-list flex flex-col gap-3">
              <div className="market-suggestions w-full bg-[#F7F6F6] p-3 rounded-lg border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaMarketRecommendation,
                  }}
                />
              </div>
              <div className="competitive-suggestions w-full bg-[#F7F6F6] p-3 rounded-lg border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaCompetitiveRecommendation,
                  }}
                />
              </div>
              <div className="resource-suggestions w-full bg-[#F7F6F6] p-3 rounded-lg border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaResourceRecommendation,
                  }}
                />
              </div>
              <div className="priority-suggestions w-full bg-[#F7F6F6] p-3 rounded-lg border">
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: props.ideaPriorityFocus,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="data-confidence flex flex-col flex-1 gap-4 w-full bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white p-5 rounded-lg border">
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
                  <p className="step-action font-bodycopy font-medium text-[15px] text-[#333333]">
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
    </div>
  );
}
