import {
  STATUS_FORBIDDEN,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { AutoParseableTextFormat } from "openai/lib/parser";
import z from "zod";

export const AI_TOOL_ID_IDEA_GEN = 1; // idea-gen
export const AI_TOOL_ID_MARKET_SIZE = 2; // market-size

export async function isEnrolledAITool(
  prisma: PrismaClient,
  user_id: string,
  error_message: string
) {
  const theEnrolledAITool = await prisma.userAITool.findFirst({
    where: {
      user_id: user_id,
    },
  });
  if (!theEnrolledAITool) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}

interface AIPrompt<T> {
  instructions: string;
  input: string;
  format: T;
}

export function AIFormatOutputText(result: object) {
  return JSON.stringify({
    title: "<response title>",
    response: result,
  });
}

export function AIFormatOutputZod<T extends z.ZodObject>(
  name: string,
  result: T
) {
  return zodTextFormat(
    z.object({
      title: z.string(),
      response: result,
    }),
    name
  );
}

const ChatGPTClient = new OpenAI();

export async function AIGenerate<T extends AutoParseableTextFormat<U>, U>(
  prompt: AIPrompt<T>
) {
  const generatedResult = await ChatGPTClient.responses.parse({
    model: "gpt-5-nano",
    reasoning: { effort: "low" },
    instructions: prompt.instructions,
    input: prompt.input,
    text: {
      format: prompt.format,
    },
  });

  if (generatedResult.output_parsed === null) {
    throw new TRPCError({
      code: STATUS_INTERNAL_SERVER_ERROR,
      message: "Failed to parse an AI result.",
    });
  }

  return generatedResult.output_parsed;
}

export async function AISaveResult(
  prisma: PrismaClient,
  user_id: string,
  ai_tool_id: number,
  title: string,
  result: object
) {
  const createdResult = await prisma.aIResult.create({
    data: {
      user_id: user_id,
      ai_tool_id: ai_tool_id,
      name: title,
      result: result,
    },
  });
  const theResult = await prisma.aIResult.findFirst({
    where: { id: createdResult.id },
  });
  if (!theResult) {
    throw new TRPCError({
      code: STATUS_INTERNAL_SERVER_ERROR,
      message: "Failed to save an AI result.",
    });
  }
}
