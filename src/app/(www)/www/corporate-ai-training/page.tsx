import { Metadata } from "next";
import CorporateAITrainingSVP from "@/components/pages/CorporateAITrainingSVP";

export const metadata: Metadata = {
  title:
    "Corporate AI Training Program | Tingkatkan Produktivitas Tim 60% — Sevenpreneur",
  description:
    "Program pelatihan AI untuk tim perusahaan Anda. Dari prompt engineering hingga AI workflow automation — langsung applicable ke pekerjaan sehari-hari. Terbukti meningkatkan produktivitas tim hingga 60%.",
  keywords: [
    "corporate AI training",
    "pelatihan AI perusahaan",
    "AI training Indonesia",
    "prompt engineering training",
    "AI workflow automation",
    "produktivitas tim AI",
    "sevenpreneur",
  ],
  openGraph: {
    title: "Corporate AI Training Program | Tingkatkan Produktivitas Tim 60%",
    description:
      "Program pelatihan AI untuk tim perusahaan Anda. Dari prompt engineering hingga AI workflow automation — langsung applicable ke pekerjaan sehari-hari.",
    url: "https://sevenpreneur.com/www/corporate-ai-training",
    siteName: "Sevenpreneur",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate AI Training Program | Tingkatkan Produktivitas Tim 60%",
    description:
      "Program pelatihan AI untuk tim perusahaan Anda. Dari prompt engineering hingga AI workflow automation — langsung applicable ke pekerjaan sehari-hari.",
  },
  alternates: {
    canonical: "https://www.sevenpreneur.com/corporate-ai-training",
  },
};

export default function CorporateAITrainingPage() {
  return <CorporateAITrainingSVP />;
}
