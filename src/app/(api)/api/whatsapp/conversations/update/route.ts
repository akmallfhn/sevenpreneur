import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateWAConversationSchema = z.strictObject({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  handler_id: z.string().nullable().optional(),
  lead_status: z.enum(["COLD", "WARM", "HOT"]).optional(),
  winning_rate: z.number().int().optional(),
  mode: z.enum(["AI", "HUMAN"]).optional(),
  note: z.string().nullable().optional(),
  last_read_id: z.string().nullable().optional(),
});

export type UpdateWAConversationBody = z.infer<typeof UpdateWAConversationSchema>;

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = UpdateWAConversationSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: z.flattenError(parsed.error).fieldErrors },
      { status: 400 }
    );
  }

  const {
    id,
    user_id,
    full_name,
    phone_number,
    handler_id,
    lead_status,
    winning_rate,
    mode,
    note,
    last_read_id,
  } = parsed.data;

  const prisma = GetPrismaClient();

  const conversation = await prisma.wAConversation.findFirst({
    select: { id: true },
    where: { id },
  });
  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.wAConversation.update({
    where: { id },
    data: {
      ...(user_id !== undefined && { user_id }),
      ...(full_name !== undefined && { full_name }),
      ...(phone_number !== undefined && { phone_number }),
      ...(handler_id !== undefined && { handler_id }),
      ...(lead_status !== undefined && { lead_status }),
      ...(winning_rate !== undefined && { winning_rate }),
      ...(mode !== undefined && { mode }),
      ...(note !== undefined && { note }),
      ...(last_read_id !== undefined && { last_read_id }),
    },
  });

  return NextResponse.json({ data: updated });
}
