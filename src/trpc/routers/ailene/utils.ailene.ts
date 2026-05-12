import { z } from "zod";

export const chapterProgressEnum = z.enum([
  "not_started",
  "in_progress",
  "completed",
]);
export type ChapterProgress = z.infer<typeof chapterProgressEnum>;
