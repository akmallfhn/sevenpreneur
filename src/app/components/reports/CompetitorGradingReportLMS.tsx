"use client";
import styles from "./Report.module.css";
import { useRouter } from "next/navigation";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { useEffect, useState } from "react";
import { setSessionToken, trpc } from "@/trpc/client";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import LoadingAIGeneratingResult from "../state/LoadingAIGeneratingResultLMS";
import { SourcesArticle } from "./MarketSizeReportLMS";
import { Progress } from "@/components/ui/progress";
import { BarChart } from "@mui/x-charts";
import { AICompetitorGrader_MarketMaturity } from "@/trpc/routers/ai_tool/enum.ai_tool";
import { markdownToHtml } from "@/lib/markdown-to-html";

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
  industryCurrentCondition: string;
  industryCAGRValue: number[];
  industryCAGRReason: string;
  industryMarketMaturity: AICompetitorGrader_MarketMaturity;
  industryMarketMaturityReason: string;
  sources: SourcesArticle[];
  confidenceLevel: number;
}

export default function CompetitorGradingReportLMS(
  props: CompetitorGradingReportLMSProps
) {
  const router = useRouter();
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);

  useEffect(() => {
    if (setSessionToken) {
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
      setIntervalMs(false);
    }
  }, [isDoneResult, router]);

  const maturity = maturityAttributes[props.industryMarketMaturity];

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
          headerTitle="Competitor Grading Result"
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
        headerTitle="Competitor Grading Result"
        headerResultName={props.resultName}
        headerDescription={`For ${props.productName}`}
      />
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4">
        <div className="industry-analysis flex w-full gap-4">
          <main className="main-industry-analysis flex flex-col flex-2 gap-4 w-full">
            <div className="cagr-projection flex flex-col flex-2 gap-2 w-full bg-white p-5 rounded-lg border">
              <div className="section-title flex flex-col">
                <h3 className="title font-bodycopy font-bold text-lg">
                  Proyeksi Pertumbuhan Tahunan Industri (CAGR)
                </h3>
                <p className="remarks font-bodycopy font-medium text-[15px] text-[#333333]">
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
                  __html: markdownToHtml(props.industryCAGRReason),
                }}
              />
            </div>
            <div className="market-maturity flex flex-col gap-4 w-full bg-linear-to-bl from-0% from-[#EFEDF9] to-50% to-white p-5 rounded-lg border font-bodycopy">
              <h3 className="text-lg font-bold">Fase Perkembangan Industri</h3>
              <h4 className={`font-brand font-bold text-3xl ${maturity.color}`}>
                {maturity.label} {maturity.icon}
              </h4>
              <div className="market-maturity-reason flex flex-col gap-2">
                <p className="text-[#111111] text-[15px]">
                  Fase industri {maturity.label} menunjukkan kondisi di mana
                  pertumbuhan {maturity.description}
                </p>
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(props.industryMarketMaturityReason),
                  }}
                />
              </div>
            </div>
          </main>
          <aside className="aside-industry-analisis flex flex-col flex-[1.2] gap-4 w-full">
            <div className="current-condition flex flex-col gap-2 w-full bg-linear-to-br from-0% from-[#D2E5FC] to-40% to-white p-5 rounded-lg border">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Lanskap Persaingan Industri
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(props.industryCurrentCondition),
                }}
              />
            </div>
            <div className="data-confidence flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
              <h3 className="section-title font-bold text-lg font-bodycopy">
                Data Confidence
              </h3>
              <div className="confidence-level flex flex-col gap-2">
                <Progress value={props.confidenceLevel} />
                <p className="confidence-status font-semibold font-bodycopy text-sm">
                  {confidenceStatus}
                </p>
              </div>
              <div className="sources-data flex flex-col gap-2 font-bodycopy">
                <p className="font-semibold">Sources</p>
                {props.sources.map((post, index) => (
                  <div
                    className="source-item flex flex-col gap-0.5"
                    key={index}
                  >
                    <a
                      href={post.source_url}
                      className="source-url font-medium text-sm text-primary hover:underline underline-offset-2"
                      target="__blank"
                      rel="noopener noreferrer"
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
          </aside>
        </div>
      </div>
    </div>
  );
}
