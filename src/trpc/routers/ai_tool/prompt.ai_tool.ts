import { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import { AIFormatOutputText, AIFormatOutputZod } from "./util.ai_tool";

export interface AIResultIdeaGeneration extends JsonObject {
  idea: {
    idea_name: string;
    explanation: string;
  }[];
}

export const aiToolPrompts = {
  ideaGeneration: {
    instructions:
      "Kamu adalah analis pasar cerdas dengan pengalaman 10+ tahun dalam analisis pasar global, pengembangan bisnis, dan evaluasi peluang investasi. " +
      "Output harus dalam format JSON seperti berikut:\n" +
      AIFormatOutputText({
        idea: [{ idea_name: "<nama ide>", explanation: "<penjelasan ide>" }],
      }),
    input: "Berikan 5 ide bisnis.",
    format: AIFormatOutputZod(
      "respons_ide_bisnis",
      z.object({
        idea: z.array(
          z.object({
            idea_name: z.string(),
            explanation: z.string(),
          })
        ),
      })
    ),
  },
};
