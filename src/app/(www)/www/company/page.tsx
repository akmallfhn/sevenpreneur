import AppPageState from "@/components/states/AppPageState";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company | Sevenpreneur",
  description:
    "Kenali Sevenpreneur lebih dalam — visi, misi, nilai-nilai kami, dan tim yang membangun ekosistem pelatihan bisnis berbasis AI pertama di Indonesia.",
  metadataBase: new URL("https://www.sevenpreneur.com"),
  alternates: { canonical: "/company" },
  openGraph: {
    title: "Company | Sevenpreneur",
    description:
      "Kenali Sevenpreneur lebih dalam — visi, misi, nilai-nilai kami, dan tim yang membangun ekosistem pelatihan bisnis berbasis AI pertama di Indonesia.",
  },
};

export default function CompanyPage() {
  return <AppPageState variant="DEVELOPMENT" />;
}
