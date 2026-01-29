"use client";
import { StatusType } from "@/lib/app-types";
import PriceItemBlueprintProgramSVP from "../items/PriceItemBlueprintProgramSVP";
import PackageLabelBlueprintProgramSVP from "../labels/PackageLabelBlueprintProgramSVP";

export interface PackageItem {
  id: number;
  name: string;
  amount: number;
  status: StatusType;
}

interface PriceTiersBlueprintProgramSVPProps {
  cohortId: number;
  cohortName: string;
  cohortSlug: string;
  cohortPrices: PackageItem[];
}

export default function PriceTiersBlueprintProgramSVP(
  props: PriceTiersBlueprintProgramSVPProps,
) {
  const regularPrice = props.cohortPrices.find((item) => item.id === 59);
  const vipPrice = props.cohortPrices.find((item) => item.id === 60);

  return (
    <section id="package-plans">
      <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
        <div className="section-container flex flex-col w-full items-center p-5 py-10 gap-8 z-10 lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
            <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl lg:text-4xl">
              Find the Plan That Works Best for You
            </h2>
            <p className="section-desc text-sm font-bodycopy text-white max-w-[326px] sm:text-base sm:max-w-[400px] lg:text-xl lg:max-w-[712px]">
              Dua opsi sesuai kebutuhanmu. Pilih Reguler untuk pelajari
              kurikulum 7 Framework lengkap, atau upgrade ke VIP untuk
              pengalaman lebih eksklusif.
            </p>
          </div>
          <div className="packages flex flex-col w-full items-center gap-9 lg:flex-row lg:justify-center">
            {regularPrice && (
              <PriceItemBlueprintProgramSVP
                cohortId={props.cohortId}
                cohortName={regularPrice.name}
                cohortSlug={props.cohortSlug}
                priceId={regularPrice.id}
                priceName="Batch 7"
                priceDescription="Kuasai 7 framework lengkap untuk upgrade mindset & skill bisnismu."
                priceLabel={
                  <PackageLabelBlueprintProgramSVP variant="regular" />
                }
                priceStatus={regularPrice.status}
                priceAmount={regularPrice.amount}
                priceAnchor={3000000}
                priceBenefits={[
                  <>
                    <b>7 sesi interaktif</b> membahas 7 Framework, dipandu oleh
                    Professional Business Coach.
                  </>,
                  <>
                    <b>3 insightful talk</b> tentang founder readiness, market
                    research, & smart networking bersama expert.
                  </>,
                  <>
                    <b>Lifetime Access</b> ke semua materi dan rekaman kelas.
                  </>,
                  <>
                    <b>20+ Modul, Framework, & Tools AI Praktis</b> dari real
                    case bisnis
                  </>,
                  <>
                    <b>Q&A interaktif </b> – bebas tanya apa saja tentang
                    bisnismu ke coach & expert
                  </>,
                  <>
                    <b>Koneksi & Kolaborasi </b> dengan sesama entrepreneur
                    ambisius dan expert industri.
                  </>,
                ]}
                featureProductName={regularPrice.name}
                featurePosition={1}
              />
            )}
            {vipPrice && (
              <PriceItemBlueprintProgramSVP
                cohortId={props.cohortId}
                cohortName={vipPrice.name}
                cohortSlug={props.cohortSlug}
                priceId={vipPrice.id}
                priceName="Batch 7"
                priceDescription="Pengalaman lebih eksklusif dalam satu paket lengkap."
                priceLabel={<PackageLabelBlueprintProgramSVP variant="vip" />}
                priceStatus={vipPrice.status}
                priceAmount={vipPrice.amount}
                priceAnchor={10000000}
                priceBenefits={[
                  <>
                    <b>1 hari offline event di Jakarta</b>, kuasai investasi &
                    fundraising
                  </>,
                  <>
                    <b>Pitch Perfect Workshop</b> eksklusif bersama Wafa
                    Taftazani.
                  </>,
                  <>
                    <b>2 sesi eksklusif</b> bersama Tom Lembong & Basuki T.
                    Purnama (Ahok)
                  </>,
                  <>
                    <b>Intimate Dinner & Networking</b> bersama Tom Lembong,
                    Basuki T. Purnama (Ahok), & para business leader visioner.
                  </>,
                  <>
                    <b>Mentoring privat 1-on-1</b> dengan business coach
                  </>,
                ]}
                featureProductName={vipPrice.name}
                featurePosition={2}
                isPriority
              />
            )}
          </div>
        </div>
        <div className="color-background absolute bg-[#3417E3] blur-[120px] w-[500px] h-[1000px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full z-[1] will-change-transform lg:blur-[200px] lg:w-[1488px] lg:h-[400px]" />
      </div>
    </section>
  );
}
