"use client";
import { Plus } from "lucide-react";
import AppButton from "../buttons/AppButton";
import LearningSessionItemCMS from "../items/LearningSessionItemCMS";

interface LearningListCMSProps {
  cohortId: number;
}

export default function LearningListCMS({ cohortId }: LearningListCMSProps) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-section-background rounded-md">
      <div className="section-name flex justify-between items-center">
        <h2 className="label-name font-brand font-bold">Learnings</h2>
        <AppButton variant="outline" size="small">
          <Plus className="size-4" />
          Add sessions
        </AppButton>
      </div>
      <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
        LIVE NOW
      </h3>
      <div className="learning-list flex flex-col gap-2">
        <LearningSessionItemCMS
          cohortId={cohortId}
          sessionName="Day 4 - Finance, Tax, Standard Accounting Procedure"
          sessionEducatorName="Felicia Putri Tjiasaka"
          sessionEducatorAvatar="https://cdn1-production-images-kly.akamaized.net/VMOMJZI5ThAIIVjSIk7B3CxYkYQ=/500x500/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3918744/original/035101900_1643478653-WhatsApp_Image_2022-01-27_at_16.46.27__1_.jpeg"
          sessionMethod="online"
        />
      </div>
      <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
        UPCOMING
      </h3>
      <div className="learning-list flex flex-col gap-2">
        <LearningSessionItemCMS
          cohortId={cohortId}
          sessionName="Day 7 - Idealisme Bernegara Pada Kaki Manusia"
          sessionEducatorName="Alm Tan Malaka"
          sessionEducatorAvatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU007Bi7Smlx3rX422NJsG5NKxQhLVEwyvmg&s"
          sessionMethod="online"
        />
        <LearningSessionItemCMS
          cohortId={cohortId}
          sessionName="Day 6 - Menata Kota Jakarta"
          sessionEducatorName="Bang Doel"
          sessionEducatorAvatar="https://img2.beritasatu.com/cache/investor/480x310-3/2024/09/1727592754-1190x669.webp"
          sessionMethod="hybrid"
        />
      </div>
      <h3 className="label-name text-alternative text-sm font-bodycopy font-semibold">
        COMPLETED
      </h3>
      <div className="learning-list flex flex-col gap-2">
        <LearningSessionItemCMS
          cohortId={cohortId}
          sessionName="Day 1 - Menemukan Tim Terbaik seperti One Piece"
          sessionEducatorName="Rafi Ahmad"
          sessionEducatorAvatar="https://foto.kontan.co.id/StXCKE_cdjxl3ync1Wq9iTMX4zg=/smart/2023/03/09/1036754397p.jpg"
          sessionMethod="online"
        />
        <LearningSessionItemCMS
          cohortId={cohortId}
          sessionName="Day 2 - Membentuk Ide dan Mindset Logika"
          sessionEducatorName="Tijjani Reinders"
          sessionEducatorAvatar="https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/80/2025/04/04/Screenshot_20250404_212706_Gallery-3123441984.jpg"
          sessionMethod="on site"
        />
        <LearningSessionItemCMS
          cohortId={cohortId}
          sessionName="Day 3 - Research by Yourself"
          sessionEducatorName="Lamine Yamal"
          sessionEducatorAvatar="https://akcdn.detik.net.id/community/media/visual/2025/06/06/2218118646-1749193061423_169.jpeg?w=600&q=90"
          sessionMethod="online"
        />
      </div>
      <p className="text-sm text-cms-primary text-center font-semibold font-bodycopy">
        Load more
      </p>
    </div>
  );
}
