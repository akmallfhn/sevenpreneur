import {
  STATUS_FORBIDDEN,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { CRoleEnum, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Client, openai } from "@upstash/qstash";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { AutoParseableTextFormat } from "openai/lib/parser";
import z from "zod";
import { aiToolPrompts } from "./prompt.ai_tool";

export enum AIModelName {
  GPT_5 = "gpt-5",
  GPT_5_MINI = "gpt-5-mini",
  GPT_5_NANO = "gpt-5-nano",
  GPT_4_1 = "gpt-4.1",
  GPT_4_1_MINI = "gpt-4.1-mini",
  GPT_4_1_NANO = "gpt-4.1-nano",
}

export const AI_TOOL_ID_IDEA_VAL = 1; // idea-val
export const AI_TOOL_ID_MARKET_SIZE = 2; // market-size
export const AI_TOOL_ID_COMPETITOR_GRADER = 3; // competitor-grader

export type AIChatRole = "user" | "assistant";

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

const QStashClient = new Client();

let baseURL = "https://api.sevenpreneur.com/";
if (process.env.DOMAIN_MODE === "local")
  baseURL = "https://api.example.com:3000/";
if (process.env.NGROK_DOMAIN !== "")
  baseURL = "https://" + process.env.NGROK_DOMAIN + "/";

export async function AIGenerate<T extends AutoParseableTextFormat<U>, U>(
  model: AIModelName,
  prompt: AIPrompt<T>,
  prisma: PrismaClient,
  user_id: string,
  ai_tool_id: number
) {
  const res = await QStashClient.publishJSON({
    url: "https://api.openai.com/v1/responses",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: {
      model: model,
      tools: [{ type: "web_search" }],
      reasoning: { effort: "low" },
      instructions: prompt.instructions,
      input: prompt.input,
      text: { format: prompt.format },
    },
    callback: baseURL + "qstash/callback",
  });
  const messageId = res.messageId as string;

  const createdResult = await prisma.aIResult.create({
    data: {
      user_id: user_id,
      ai_tool_id: ai_tool_id,
      name: "", // empty for now
      result: {}, // empty for now
      is_done: false,
      qstash_id: messageId,
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

  return theResult;
}

const ChatGPTClient = new OpenAI();

export async function AIGenerateTitle<T extends AutoParseableTextFormat<U>, U>(
  model: AIModelName,
  prompt: AIPrompt<T>
) {
  const generatedResult = await ChatGPTClient.responses.parse({
    model: model,
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

interface AIChatItem {
  role: AIChatRole;
  content: string;
}

export async function AISendChat(
  model: AIModelName,
  history: AIChatItem[],
  message: string
) {
  const generatedResult = await ChatGPTClient.responses.create({
    model: model,
    tools: [{ type: "web_search" }],
    instructions: aiToolPrompts.sendChat.instruction,
    input: [...history, { role: "user", content: message }],
  });

  return generatedResult.output_text;
}

export async function AISaveMessage(
  prisma: PrismaClient,
  conv_id: string,
  role: AIChatRole,
  message: string
) {
  const roleConversion = {
    user: CRoleEnum.USER,
    assistant: CRoleEnum.ASSISTANT,
  };
  const createdMessage = await prisma.aIChat.create({
    data: {
      conv_id: conv_id,
      role: roleConversion[role],
      message: message,
    },
  });
  const theMessage = await prisma.aIChat.findFirst({
    where: { id: createdMessage.id },
  });
  if (!theMessage) {
    throw new TRPCError({
      code: STATUS_INTERNAL_SERVER_ERROR,
      message: "Failed to save an AI chat result.",
    });
  }
  return theMessage;
}
