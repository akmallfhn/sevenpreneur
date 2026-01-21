"use client";
import { getShortRupiahCurrency } from "@/lib/currency";

import { markdownToHtml } from "@/lib/markdown-to-html";
import { setSessionToken, trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AICitationLMS, { SourcesArticle } from "../indexes/AICitationLMS";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import LoadingAIGeneratingResult from "../states/LoadingAIGeneratingResultLMS";
import styles from "./Report.module.css";

interface MarketSizeReportLMSProps extends AvatarBadgeLMSProps {
  sessionToken: string;
  sessionUserRole: number;
  resultId: string;
  resultName: string;
  resultStatus: boolean;
  productName: string;
  tamValue: number;
  samValue: number;
  tamInsight: string;
  samInsight: string;
  somInsight: string;
  confidenceLevel: number;
  sources: SourcesArticle[];
}

export default function MarketSizeReportLMS(props: MarketSizeReportLMSProps) {
  const router = useRouter();
  const [intervalMs, setIntervalMs] = useState<number | false>(2000);

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data } = trpc.read.ai.marketSize.useQuery(
    { id: props.resultId },
    {
      refetchInterval: intervalMs,
      enabled: !!props.sessionToken,
    },
  );
  const isDoneResult = data?.result.is_done;

  useEffect(() => {
    if (isDoneResult) {
      router.refresh();
      queueMicrotask(() => setIntervalMs(false));
    }
  }, [isDoneResult, router]);

  const somValue = 0.01 * props.samValue;
  const conservativeScenario = 0.7 * somValue;
  const aggresiveScenario = 1.5 * somValue;
  const tamInsight = markdownToHtml(props.tamInsight);
  const samInsight = markdownToHtml(props.samInsight);
  const somInsight = markdownToHtml(props.somInsight);

  if (!props.resultStatus) {
    return (
      <div className="root-page hidden flex-col pl-64 pb-8 w-full items-center justify-center lg:flex">
        <HeaderAIResultDetailsLMS
          sessionUserName={props.sessionUserName}
          sessionUserAvatar={props.sessionUserAvatar}
          sessionUserRole={props.sessionUserRole}
          headerTitle="Market Size Estimation Result"
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
        headerTitle="Market Size Estimation Result"
        headerResultName={props.resultName}
        headerDescription={`For ${props.productName}`}
      />
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4">
        <div className="market-analysis flex w-full gap-4">
          <div className="market-size-chart flex flex-col flex-2 items-center gap-8 w-full bg-white p-5 pb-10 rounded-lg border">
            <h2 className="section-title font-bold text-lg font-bodycopy">
              Market Size Analysis
            </h2>
            <div className="flex flex-col w-full items-center justify-center gap-10 xl:flex-row xl:items-end">
              <div className="tam-chart flex flex-col size-52 bg-primary outline-[12px] outline-primary/50 items-center justify-center rounded-full overflow-hidden">
                <p className="font-bodycopy font-bold text-white text-xl">
                  TAM
                </p>
                <p className="font-bodycopy font-bold text-white text-2xl text-center">
                  {getShortRupiahCurrency(props.tamValue)}
                </p>
              </div>
              <div className="sam-chart flex flex-col size-40 bg-[#FBBF24] outline-[12px] outline-[#FBBF24]/50 items-center justify-center rounded-full overflow-hidden">
                <p className="font-bodycopy font-bold text-white text-lg">
                  SAM
                </p>
                <p className="font-bodycopy font-bold text-white text-2xl text-center">
                  {getShortRupiahCurrency(props.samValue)}
                </p>
              </div>
              <div className="som-chart flex flex-col size-32 bg-[#EF4444] outline-[12px] outline-[#EF4444]/50 items-center justify-center rounded-full overflow-hidden">
                <p className="font-bodycopy font-bold text-white text-lg">
                  SOM
                </p>
                <p className="font-bodycopy font-bold text-white text-lg text-center">
                  {getShortRupiahCurrency(somValue)}
                </p>
              </div>
            </div>
          </div>
          <div className="sources flex flex-1 w-full">
            <AICitationLMS
              sources={props.sources}
              confidenceLevel={props.confidenceLevel}
            />
          </div>
        </div>

        <div className="market-size-insights flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
          <h2 className="section-title font-bold text-lg font-bodycopy">
            Detail & Insights
          </h2>
          <div className="flex gap-6 font-bodycopy">
            <div className="tam-details flex flex-col flex-1 gap-4">
              <div className="tam-description flex flex-col gap-1">
                <h3 className="text-lg font-bold">
                  Total Addressable Market (TAM)
                </h3>
                <p className="text-[#333333] text-[15px]">
                  TAM adalah total permintaan pasar untuk produk/jasa Anda,
                  mengasumsikan Anda menguasai 100% pasar.
                </p>
              </div>
              <div className="tam-insight flex flex-col gap-1">
                <h3 className="text-lg font-bold">Insight</h3>
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: tamInsight,
                  }}
                />
              </div>
            </div>
            <div className="divider border-l self-stretch" />
            <div className="sam-details flex flex-col flex-1 gap-4">
              <div className="sam-description flex flex-col gap-1">
                <h3 className="text-lg font-bold">
                  Serviceable Available Market (SAM)
                </h3>
                <p className="text-[#333333] text-[15px]">
                  SAM adalah bagian dari TAM yang dapat Anda jangkau dengan
                  channel penjualan dan model bisnis Anda saat ini.
                </p>
              </div>
              <div className="sam-insight flex flex-col gap-1">
                <h3 className="text-lg font-bold">Insight</h3>
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: samInsight,
                  }}
                />
              </div>
            </div>
            <div className="divider border-l self-stretch" />
            <div className="som-details flex flex-col flex-1 gap-4">
              <div className="som-description flex flex-col gap-1">
                <h3 className="text-lg font-bold">
                  Serviceable Obtainable Market (SOM)
                </h3>
                <p className="text-[#333333] text-[15px]">
                  SOM adalah bagian dari SAM yang realistis untuk Anda dapatkan
                  dalam jangka waktu 1 tahun.
                </p>
              </div>
              <div className="som-insight flex flex-col gap-1">
                <h3 className="text-lg font-bold">Insight</h3>
                <div
                  className={styles.report}
                  dangerouslySetInnerHTML={{
                    __html: somInsight,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="market-size-insights flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
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
        </div>
      </div>
    </div>
  );
}
