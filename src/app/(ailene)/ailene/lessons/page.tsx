import LessonsListAilene from "@/components/pages/LessonsListAilene";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Materi" };

export default function LessonsPage() {
  return <LessonsListAilene />;
}
