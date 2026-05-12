import GetPrismaClient from "@/lib/prisma";
import { finalizeQuizSubmission } from "@/trpc/routers/ailene/utils.ailene";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

type QStashAutoSubmitQuizPayload = {
  submission_id?: number;
};

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const body = (await req.json()) as QStashAutoSubmitQuizPayload;
  const submissionId = body.submission_id;

  if (typeof submissionId !== "number") {
    return Response.json(
      { received: true, error: "Missing submission_id" },
      { status: 200 }
    );
  }

  const prisma = GetPrismaClient();

  try {
    const result = await finalizeQuizSubmission(prisma, submissionId);
    return Response.json({
      received: true,
      already_completed: result.already_completed,
      score: result.score,
    });
  } catch (err) {
    console.error("qstash.auto-submit-quiz:", err);
    return Response.json({ received: true, error: "finalize_failed" });
  }
});
