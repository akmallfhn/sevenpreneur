import { Prisma } from "@prisma/client";
import { z } from "zod";
import dayjs from "dayjs";

export const dateString = z
  .string()
  .refine((s) => dayjs(s).isValid(), { message: "Invalid date string" })
  .describe(
    "Date string parseable by dayjs, e.g. 2025-01-01 or 2025-01-01T00:00:00Z",
  );

/**
 * The 8 numeric quality dimensions captured per student rating.
 * Each is a SmallInt on a fixed scale (typically 1–5 in the UI).
 *
 * Coach dimensions evaluate the speaker / coach of the session.
 * Material dimensions evaluate the curriculum / content.
 * learning_value is the holistic "was this worth my time" score.
 */
export const NUMERIC_DIMENSIONS = [
  "coach_clarity",
  "coach_mastery",
  "coach_responsiveness",
  "coach_engagement",
  "material_relevance",
  "material_flow",
  "material_depth",
  "learning_value",
] as const;

export type Dimension = (typeof NUMERIC_DIMENSIONS)[number];

export type RatingWithRelations = Prisma.LearningRatingGetPayload<{
  include: {
    user: { select: { id: true; full_name: true; email: true } };
    learning: {
      select: {
        id: true;
        name: true;
        meeting_date: true;
        cohort_id: true;
        speaker_id: true;
        cohort: { select: { id: true; name: true; slug_url: true } };
        speaker: { select: { id: true; full_name: true } };
      };
    };
  };
}>;

export function round2(n: number | null | undefined): number {
  if (n === null || n === undefined || Number.isNaN(n)) return 0;
  return Number(n.toFixed(2));
}

export function serializeRating(r: RatingWithRelations) {
  const sum = NUMERIC_DIMENSIONS.reduce((s, k) => s + r[k], 0);
  const overall = sum / NUMERIC_DIMENSIONS.length;
  return {
    id: r.id,
    learning_id: r.learning_id,
    learning: r.learning
      ? {
          id: r.learning.id,
          name: r.learning.name,
          meeting_date: dayjs(r.learning.meeting_date).toISOString(),
          cohort: r.learning.cohort
            ? {
                id: r.learning.cohort.id,
                name: r.learning.cohort.name,
                slug_url: r.learning.cohort.slug_url,
              }
            : null,
          speaker: r.learning.speaker
            ? {
                id: r.learning.speaker.id,
                full_name: r.learning.speaker.full_name,
              }
            : null,
        }
      : null,
    user_id: r.user_id,
    user: r.user
      ? { id: r.user.id, full_name: r.user.full_name, email: r.user.email }
      : null,
    scores: {
      coach_clarity: r.coach_clarity,
      coach_mastery: r.coach_mastery,
      coach_responsiveness: r.coach_responsiveness,
      coach_engagement: r.coach_engagement,
      material_relevance: r.material_relevance,
      material_flow: r.material_flow,
      material_depth: r.material_depth,
      learning_value: r.learning_value,
      overall_avg: round2(overall),
    },
    feedback: {
      missing_topics: r.missing_topics,
      favorite_material: r.favorite_material,
      disliked_material: r.disliked_material,
      improvement_suggestion: r.improvement_suggestion,
    },
    created_at: dayjs(r.created_at).toISOString(),
  };
}

export const ratingInclude = {
  user: { select: { id: true, full_name: true, email: true } },
  learning: {
    select: {
      id: true,
      name: true,
      meeting_date: true,
      cohort_id: true,
      speaker_id: true,
      cohort: { select: { id: true, name: true, slug_url: true } },
      speaker: { select: { id: true, full_name: true } },
    },
  },
} as const satisfies Prisma.LearningRatingInclude;

export type RatingFilterArgs = {
  cohort_id?: number;
  learning_id?: number;
  speaker_id?: string;
  user_id?: string;
  from?: string;
  to?: string;
};

export function buildRatingWhere(
  args: RatingFilterArgs,
): Prisma.LearningRatingWhereInput {
  const where: Prisma.LearningRatingWhereInput = {};
  if (args.learning_id !== undefined) where.learning_id = args.learning_id;
  if (args.user_id) where.user_id = args.user_id;
  if (args.cohort_id !== undefined || args.speaker_id !== undefined) {
    where.learning = {};
    if (args.cohort_id !== undefined) where.learning.cohort_id = args.cohort_id;
    if (args.speaker_id !== undefined)
      where.learning.speaker_id = args.speaker_id;
  }
  if (args.from || args.to) {
    where.created_at = {};
    if (args.from) where.created_at.gte = dayjs(args.from).toDate();
    if (args.to) where.created_at.lte = dayjs(args.to).toDate();
  }
  return where;
}

export function buildRawConditions(args: RatingFilterArgs): Prisma.Sql {
  const conditions: Prisma.Sql[] = [];
  if (args.cohort_id !== undefined)
    conditions.push(Prisma.sql`l.cohort_id = ${args.cohort_id}`);
  if (args.learning_id !== undefined)
    conditions.push(Prisma.sql`lr.learning_id = ${args.learning_id}`);
  if (args.speaker_id)
    conditions.push(Prisma.sql`l.speaker_id = ${args.speaker_id}::uuid`);
  if (args.user_id)
    conditions.push(Prisma.sql`lr.user_id = ${args.user_id}::uuid`);
  if (args.from)
    conditions.push(Prisma.sql`lr.created_at >= ${dayjs(args.from).toDate()}`);
  if (args.to)
    conditions.push(Prisma.sql`lr.created_at <= ${dayjs(args.to).toDate()}`);
  return conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;
}
