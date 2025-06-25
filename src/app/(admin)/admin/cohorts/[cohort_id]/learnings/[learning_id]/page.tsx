import CohortDetailsCMS from "@/app/components/templates/CohortDetailsCMS";
import { cookies } from "next/headers";

interface LearningDetailPageProps {
  params: Promise<{ cohort_id: string }>;
}

export default async function LearningDetailPage({
  params,
}: LearningDetailPageProps) {
  const { cohort_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";
  const cohortId = parseInt(cohort_id);

  return (
    <div className="root flex flex-col w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
      <p>Metadata sesi: title | description</p>
      <p>Upload video recording</p>
      <p>Edit Metode Meeting : online | offline | on site </p>
      <p>Meeting: url | date-time</p>
      <p>assign speaker</p>
      <p>nambahin dokumen materi</p>
      <p>future: nambahin quiz</p>
    </div>
  );
}
