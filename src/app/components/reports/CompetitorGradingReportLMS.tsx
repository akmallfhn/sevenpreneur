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
          <main className="main-contents flex flex-col flex-2 gap-4 w-full">
            <div className="cagr-projection flex flex-col flex-2 gap-2 w-full bg-white p-5 rounded-lg border">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                CAGR Projection
              </h3>
              <div className="flex w-full">
                <BarChart
                  xAxis={[{ data: ["2024", "2025", "2026", "2027", "2028"] }]}
                  series={[{ data: props.industryCAGRValue }]}
                  height={300}
                />
              </div>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{ __html: props.industryCAGRReason }}
              />
            </div>
            <div></div>
          </main>
          <aside className="aside-contents flex flex-col flex-1 gap-4 w-full">
            <div className="current-condition flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
              <h3 className="section-title font-bodycopy font-bold text-lg">
                Industry Competition Landscape
              </h3>
              <div
                className={styles.report}
                dangerouslySetInnerHTML={{
                  __html: props.industryCurrentCondition,
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
