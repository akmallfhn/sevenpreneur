"use client";
import { useRouter } from "next/navigation";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { useEffect, useState } from "react";
import { setSessionToken, trpc } from "@/trpc/client";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import LoadingAIGeneratingResult from "../state/LoadingAIGeneratingResultLMS";

interface CompetitorGradingReportLMSProps extends AvatarBadgeLMSProps {
  sessionToken: string;
  sessionUserRole: number;
  resultId: string;
  resultName: string;
  resultStatus: boolean;
  productName: string;
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
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4"></div>
    </div>
  );
}
