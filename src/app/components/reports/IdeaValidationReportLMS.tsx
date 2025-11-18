"use client";
import styles from "./Report.module.css";
import { Progress } from "@/components/ui/progress";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { SourcesArticle } from "./MarketSizeReportLMS";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { AIIdeaValidation_ProblemFreq } from "@/trpc/routers/ai_tool/enum.ai_tool";
import { Minus, TrendingDown, TrendingUp, User } from "lucide-react";
import { ReactNode } from "react";
import { getShortNumber } from "@/lib/convert-number";
import AIItemSegmentLMS from "../items/AIItemSegmentLMS";

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
      "bg-linear-to-br from-0% from-bg-green-200 to-70% to-[#FCFCFC]",
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
  sessionUserRole: number;
  resultName: string;
  problemDiscovery: string;
  problemFrequency: AIIdeaValidation_ProblemFreq;
  problemFitScore: number;
  problemFactors: string;
  affectedSegments: AffectedSegments[];
  existingAlternatives: string;
  confidenceLevel: number;
  sources: SourcesArticle[];
}

export default function IdeaValidationReportLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  resultName,
  problemDiscovery,
  problemFrequency,
  problemFitScore,
  problemFactors,
  affectedSegments,
  existingAlternatives,
  confidenceLevel,
  sources,
}: IdeaValidationReportLMSProps) {
  const freq = freqAttributes[problemFrequency];

  let problemScoreDesc;
  if (problemFitScore >= 75) {
    problemScoreDesc = "sangat kuat dan layak menjadi prioritas utama.";
  } else if (problemFitScore >= 50) {
    problemScoreDesc =
      "cukup penting, namun tetap perlu dibandingkan dengan peluang lain.";
  } else {
    problemScoreDesc =
      "kurang mendesak dan tidak wajib diprioritaskan saat ini.";
  }

  let confidenceStatus;
  if (confidenceLevel >= 80) {
    confidenceStatus = "High";
  } else if (confidenceLevel >= 70) {
    confidenceStatus = "Medium";
  } else {
    confidenceStatus = "Low";
  }

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
      <HeaderAIResultDetailsLMS
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
        headerTitle="Idea Validation Result"
        headerResultName={resultName}
      />
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4">
        <h2 className="sectiontitle font-bold font-brand text-xl">
          Problem-Fit Analysis
        </h2>
        <div className="problem-fit flex w-full h-[420px] gap-4 bg-[#EAECFF] p-5 border rounded-lg xl:h-[320px]">
          <div className="discovery relative flex flex-col flex-2 gap-2 shrink-0 bg-linear-to-br from-0% from-[#D2E5FC] to-60% to-white p-4 border rounded-lg">
            <h3 className="section-title sticky top-0 left-0 font-bodycopy font-bold text-lg">
              Ringkasan Temuan Penelitian
            </h3>
            <div
              className={`${styles.report} overflow-y-auto pb-10`}
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(problemDiscovery),
              }}
            />
          </div>
          <div className="problem-frequency flex flex-col flex-1 w-full p-2 items-center gap-4">
            <h2 className="section-title font-bodycopy font-bold text-lg text-center">
              Frekuensi Masalah
            </h2>
            <div className="indikator flex flex-col items-center gap-4">
              <div
                className={`justify-center items-center p-2 rounded-xl ${freq.icon_background}`}
              >
                {freq.icon}
              </div>
              <p className={`font-brand font-bold text-3xl ${freq.color}`}>
                {problemFrequency.toUpperCase()}
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
            <div className="indikator relative flex max-w-[124px] items-center justify-center">
              <Gauge
                value={problemFitScore}
                width={124}
                height={124}
                cornerRadius={50}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: "#0165FC",
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: "B8C9DD",
                  },
                })}
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EAECFF] text-3xl font-brand font-bold">
                {problemFitScore}
              </p>
            </div>
            <p className="description font-bodycopy font-medium text-[15px] text-[#333333] text-center">
              Skor {problemFitScore} menunjukkan bahwa masalah ini{" "}
              {problemScoreDesc}
            </p>
          </div>
        </div>

        <div className="problem-fit flex w-full gap-4">
          <div className="affected-segments flex flex-col flex-2 gap-2 w-full bg-white p-5 pb-10 rounded-lg border">
            <h3 className="section-title font-bodycopy font-bold text-lg">
              Segmen yang Terdampak
            </h3>
            <div className="segment-list flex flex-col gap-4">
              {affectedSegments.map((post) => (
                <AIItemSegmentLMS
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
          <div className="data-confidence flex flex-col flex-1 gap-4 w-full bg-white p-5 rounded-lg border">
            <h2 className="section-title font-bold text-lg font-bodycopy">
              Data Confidence
            </h2>
            <div className="confidence-level flex flex-col gap-2">
              <Progress value={confidenceLevel} />
              <p className="confidence-status font-semibold font-bodycopy text-sm">
                {confidenceStatus}
              </p>
            </div>
            <div className="sources-data flex flex-col gap-2 font-bodycopy">
              <p className="font-semibold">Sources</p>
              {sources.map((post, index) => (
                <div className="source-item flex flex-col gap-0.5" key={index}>
                  <a
                    href={post.source_url}
                    className="source-url font-medium text-sm text-primary hover:underline underline-offset-2"
                  >
                    {post.source_name}
                  </a>
                  <p className="source-publisher text-sm text-alternative">
                    {`${post.source_publisher} ${post.source_year}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="market-size-insights flex flex-col gap-4 w-full bg-linear-to-br from-0% from-[#D2E5FC] to-20% to-white p-5 rounded-lg border">
          <div className="flex gap-6 font-bodycopy">
            <div className="tam-details flex flex-col flex-1 gap-4">
              <div className="tam-description flex flex-col gap-1">
                <h3 className="text-lg font-bold">
                  Mengapa Masalah Ini Terjadi?
                </h3>
                <p className="text-[#333333] text-[15px]">{problemFactors}</p>
              </div>
            </div>
            <div className="divider border-l self-stretch" />
            <div className="sam-details flex flex-col flex-1 gap-4">
              <div className="sam-description flex flex-col gap-1">
                <h3 className="text-lg font-bold">Alternatif yang Tersedia</h3>
                <p className="text-[#333333] text-[15px]">
                  {existingAlternatives}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="market-size-insights flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
          <h2 className="section-title font-bold text-lg font-bodycopy">
            Scenario Analysis (SOM)
          </h2>
          <div className="flex gap-6 font-bodycopy">
            <div className="conservative-scenario flex flex-col flex-1 gap-1">
              <p className="text-3xl text-primary font-brand font-bold">
                {getShortRupiahCurrency(conservativeScenario)}
              </p>
              <h3 className="text-lg font-bold">Conservative Scenario</h3>
              <p className="text-[#333333] text-[15px]">
                Menggambarkan hasil dengan pendekatan kehati-hatian tinggi.
                <br /> Asumsi difokuskan pada kondisi pasar yang bergerak lebih
                lambat, konversi lebih rendah, dan pertumbuhan adopsi minimal.
                <br /> Skenario ini merepresentasikan batas bawah potensi pasar.
              </p>
            </div>
            <div className="divider border-l self-stretch" />
            <div className="conservative-scenario flex flex-col flex-1 gap-1">
              <p className="text-3xl text-primary font-brand font-bold">
                {getShortRupiahCurrency(somValue)}
              </p>
              <h3 className="text-lg font-bold">Normal Scenario</h3>
              <p className="text-[#333333] text-[15px]">
                Menunjukkan estimasi paling rasional dan seimbang berdasarkan
                tren, kapasitas eksekusi, serta dinamika pasar saat ini. <br />{" "}
                Proyeksi ini menjadi acuan utama dalam menilai ukuran pasar yang
                paling mungkin tercapai secara realistis.
              </p>
            </div>
            <div className="divider border-l self-stretch" />
            <div className="conservative-scenario flex flex-col flex-1 gap-1">
              <p className="text-3xl text-primary font-brand font-bold">
                {getShortRupiahCurrency(aggresiveScenario)}
              </p>
              <h3 className="text-lg font-bold">Aggresive Scenario</h3>
              <p className="text-[#333333] text-[15px]">
                Merepresentasikan potensi tertinggi yang dapat dicapai apabila
                seluruh faktor pertumbuhan berjalan optimal, mencakup percepatan
                penetrasi pasar, peningkatan adopsi pengguna, dan keunggulan
                kompetitif yang kuat.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
