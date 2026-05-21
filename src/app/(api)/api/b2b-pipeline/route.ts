import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PAGE_SIZE = 20;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const rawPage = Number(body?.page);
  const page =
    Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const prisma = GetPrismaClient();

  const [pipelines, total] = await Promise.all([
    prisma.b2BPipeline.findMany({
      orderBy: { created_at: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        owner: {
          select: { id: true, full_name: true, email: true, avatar: true },
        },
        industry: {
          select: { id: true, industry_name: true },
        },
        actions: {
          orderBy: { created_at: "desc" },
        },
      },
    }),
    prisma.b2BPipeline.count(),
  ]);

  const list = pipelines.map((p) => ({
    id: p.id,
    name: p.name,
    industry: p.industry,
    pic_name: p.pic_name,
    pic_job_title: p.pic_job_title,
    pic_wa: p.pic_wa,
    pic_email: p.pic_email,
    product: p.product,
    source: p.source,
    stage: p.stage,
    probability: p.probability,
    project_value: Number(p.project_value),
    project_start_month: p.project_start_month,
    project_end_month: p.project_end_month,
    owner: p.owner,
    created_at: p.created_at,
    updated_at: p.updated_at,
    actions: p.actions.map((a) => ({
      id: a.id,
      company_id: a.company_id,
      activity_type: a.activity_type,
      summary: a.summary,
      created_at: a.created_at,
      updated_at: a.updated_at,
    })),
  }));

  return NextResponse.json({
    page,
    page_size: PAGE_SIZE,
    total,
    total_pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    list,
  });
}
