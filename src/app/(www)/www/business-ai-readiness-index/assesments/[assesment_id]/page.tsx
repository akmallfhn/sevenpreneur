import BARIReportSVP from "@/components/pages/BARIReportSVP";
import { scoreBari } from "@/lib/bari-scoring";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "BARI Report | Sevenpreneur",
  description:
    "Your Business AI Readiness Index — full diagnostic across six dimensions, with tailored recommendations and a 30-60-90 day roadmap.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ assesment_id: string }>;
}

export default async function BARIReportPage(props: PageProps) {
  const { assesment_id } = await props.params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) {
    redirect(
      `/auth/login?redirectTo=/business-ai-readiness-index/assesments/${assesment_id}`
    );
  }
  setSessionToken(sessionToken);

  let assessment;
  try {
    const res = await trpc.read.bari.assessment({ id: assesment_id });
    assessment = res.assessment;
  } catch {
    notFound();
  }

  const score = scoreBari(
    assessment.answers.map((a) => ({
      question_code: a.question_code,
      option_codes: a.option_codes,
      likert_value: a.likert_value,
      text_answer: a.text_answer,
    }))
  );

  return (
    <BARIReportSVP
      assessmentId={assessment.id}
      industryName={assessment.industry?.industry_name ?? null}
      teamSize={assessment.team_size}
      revenueModel={assessment.revenue_model}
      completedAt={assessment.completed_at?.toISOString() ?? null}
      createdAt={assessment.created_at.toISOString()}
      score={score}
    />
  );
}
