import GetPrismaClient from "@/lib/prisma";
import { WAAssetType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const GetWAAssetsSchema = z.strictObject({
  type: z
    .enum(Object.values(WAAssetType) as [WAAssetType, ...WAAssetType[]])
    .optional(),
});

export type GetWAAssetsBody = z.infer<typeof GetWAAssetsSchema>;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = GetWAAssetsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const prisma = GetPrismaClient();

  const list = await prisma.wAAsset.findMany({
    where: parsed.data.type ? { type: parsed.data.type } : undefined,
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json({ list });
}
