"use client";
import styles from "./Report.module.css";
import { Progress } from "@/components/ui/progress";
import { getShortRupiahCurrency } from "@/lib/currency";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderAIResultDetailsLMS from "../navigations/HeaderAIResultDetailsLMS";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { SourcesArticle } from "./MarketSizeReportLMS";

interface IdeaValidationReportLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  resultName: string;
  problemDiscovery: string;
  confidenceLevel: number;
  sources: SourcesArticle[];
}

export default function IdeaValidationReportLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  resultName,
  problemDiscovery,
  confidenceLevel,
  sources,
}: IdeaValidationReportLMSProps) {
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
        <div className="market-analysis flex w-full gap-4">
          <div className="market-size-chart flex flex-col flex-2 items-center gap-2 w-full bg-white p-5 pb-10 rounded-lg border">
            <h2 className="section-title font-bold text-lg font-bodycopy">
              Idea Problem Discovery
            </h2>
            <p
              className={styles.report}
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(problemDiscovery),
              }}
            />
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

        {/* <div className="market-size-insights flex flex-col gap-4 w-full bg-white p-5 rounded-lg border">
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
                    __html: markdownToHtml(tamInsight),
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
                    __html: markdownToHtml(samInsight),
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
                    __html: markdownToHtml(somInsight),
                  }}
                />
              </div>
            </div>
          </div>
        </div> */}

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
