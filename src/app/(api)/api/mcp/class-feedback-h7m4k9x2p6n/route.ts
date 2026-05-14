import { Prisma } from "@prisma/client";
import { z } from "zod";
import dayjs from "dayjs";
import GetPrismaClient from "@/lib/prisma";
import { createSevenpreneurMcp, mcpJsonText as jsonText } from "@/lib/mcp";
import {
  dateString,
  NUMERIC_DIMENSIONS,
  buildRatingWhere,
  buildRawConditions,
  ratingInclude,
  round2,
  serializeRating,
  type Dimension,
} from "./utils";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const handler = createSevenpreneurMcp(
  "class-feedback-h7m4k9x2p6n",
  (server) => {
    // ────────────────────────────────────────────────────────────────────
    // RATINGS — individual student rating records
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_ratings",
      "List individual student ratings of cohort learning sessions, with each rating's 8 quality dimensions (coach_clarity, coach_mastery, coach_responsiveness, coach_engagement, material_relevance, material_flow, material_depth, learning_value — each on a SmallInt scale, typically 1–5) plus free-text feedback (missing_topics, favorite_material, disliked_material, improvement_suggestion). Filter by cohort, learning session, speaker, user, or date range. Ordered by created_at descending.",
      {
        cohort_id: z
          .number()
          .int()
          .optional()
          .describe("Filter to ratings for any learning in this cohort"),
        learning_id: z
          .number()
          .int()
          .optional()
          .describe("Filter to ratings for one learning session"),
        speaker_id: z
          .uuid()
          .optional()
          .describe("Filter to ratings for sessions taught by this speaker"),
        user_id: z
          .uuid()
          .optional()
          .describe("Filter to ratings submitted by this student"),
        only_with_text_feedback: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Only return ratings that have at least one non-empty free-text feedback field",
          ),
        from: dateString
          .optional()
          .describe("Earliest rating created_at (inclusive)"),
        to: dateString
          .optional()
          .describe("Latest rating created_at (inclusive)"),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async (args) => {
        const prisma = GetPrismaClient();
        const where = buildRatingWhere(args);
        if (args.only_with_text_feedback) {
          where.OR = [
            { missing_topics: { not: null } },
            { favorite_material: { not: null } },
            { disliked_material: { not: null } },
            { improvement_suggestion: { not: null } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.learningRating.findMany({
            where,
            include: ratingInclude,
            orderBy: { created_at: "desc" },
            take: args.limit,
            skip: args.offset,
          }),
          prisma.learningRating.count({ where }),
        ]);

        return jsonText({
          total,
          count: items.length,
          offset: args.offset,
          limit: args.limit,
          items: items.map(serializeRating),
        });
      },
    );

    server.tool(
      "get_rating",
      "Fetch a single rating by its numeric ID, including full scores and feedback.",
      {
        id: z.number().int().describe("LearningRating.id"),
      },
      async ({ id }) => {
        const prisma = GetPrismaClient();
        const r = await prisma.learningRating.findUnique({
          where: { id },
          include: ratingInclude,
        });
        if (!r) return jsonText({ error: "Rating not found" });
        return jsonText(serializeRating(r));
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // AGGREGATES — averages across the 8 quality dimensions
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "aggregate_ratings",
      "Aggregate quality scores across the 8 rating dimensions and compute an overall_avg per group. Returns count + per-dimension average + overall average. Use group_by=none for a single rollup, or group by cohort / learning / speaker to compare. Filters compose with grouping (e.g. group_by=learning + cohort_id shows every session of one cohort ranked by quality).",
      {
        cohort_id: z.number().int().optional(),
        learning_id: z.number().int().optional(),
        speaker_id: z.uuid().optional(),
        from: dateString.optional(),
        to: dateString.optional(),
        group_by: z
          .enum(["none", "cohort", "learning", "speaker"])
          .optional()
          .default("none"),
      },
      async (args) => {
        const prisma = GetPrismaClient();

        if (args.group_by === "none") {
          const where = buildRatingWhere(args);
          const agg = await prisma.learningRating.aggregate({
            where,
            _count: { _all: true },
            _avg: {
              coach_clarity: true,
              coach_mastery: true,
              coach_responsiveness: true,
              coach_engagement: true,
              material_relevance: true,
              material_flow: true,
              material_depth: true,
              learning_value: true,
            },
          });

          const averages: Record<Dimension, number> = {
            coach_clarity: round2(agg._avg.coach_clarity),
            coach_mastery: round2(agg._avg.coach_mastery),
            coach_responsiveness: round2(agg._avg.coach_responsiveness),
            coach_engagement: round2(agg._avg.coach_engagement),
            material_relevance: round2(agg._avg.material_relevance),
            material_flow: round2(agg._avg.material_flow),
            material_depth: round2(agg._avg.material_depth),
            learning_value: round2(agg._avg.learning_value),
          };
          const overallAvg =
            NUMERIC_DIMENSIONS.reduce((s, k) => s + averages[k], 0) /
            NUMERIC_DIMENSIONS.length;

          return jsonText({
            filters: {
              cohort_id: args.cohort_id ?? null,
              learning_id: args.learning_id ?? null,
              speaker_id: args.speaker_id ?? null,
              from: args.from ?? null,
              to: args.to ?? null,
            },
            count: agg._count._all,
            averages: { ...averages, overall_avg: round2(overallAvg) },
          });
        }

        const whereSql = buildRawConditions(args);

        if (args.group_by === "cohort") {
          const rows = await prisma.$queryRaw<
            Array<{
              cohort_id: number;
              cohort_name: string;
              cohort_slug: string | null;
              count: bigint;
              coach_clarity: number | null;
              coach_mastery: number | null;
              coach_responsiveness: number | null;
              coach_engagement: number | null;
              material_relevance: number | null;
              material_flow: number | null;
              material_depth: number | null;
              learning_value: number | null;
            }>
          >(Prisma.sql`
            SELECT
              c.id AS cohort_id,
              c.name AS cohort_name,
              c.slug_url AS cohort_slug,
              COUNT(*)::bigint AS count,
              AVG(lr.coach_clarity)::float AS coach_clarity,
              AVG(lr.coach_mastery)::float AS coach_mastery,
              AVG(lr.coach_responsiveness)::float AS coach_responsiveness,
              AVG(lr.coach_engagement)::float AS coach_engagement,
              AVG(lr.material_relevance)::float AS material_relevance,
              AVG(lr.material_flow)::float AS material_flow,
              AVG(lr.material_depth)::float AS material_depth,
              AVG(lr.learning_value)::float AS learning_value
            FROM learning_ratings lr
            JOIN learnings l ON l.id = lr.learning_id
            JOIN cohorts c ON c.id = l.cohort_id
            ${whereSql}
            GROUP BY c.id, c.name, c.slug_url
            ORDER BY learning_value DESC NULLS LAST
          `);

          return jsonText({
            group_by: "cohort",
            groups: rows.map((r) => {
              const averages: Record<Dimension, number> = {
                coach_clarity: round2(r.coach_clarity),
                coach_mastery: round2(r.coach_mastery),
                coach_responsiveness: round2(r.coach_responsiveness),
                coach_engagement: round2(r.coach_engagement),
                material_relevance: round2(r.material_relevance),
                material_flow: round2(r.material_flow),
                material_depth: round2(r.material_depth),
                learning_value: round2(r.learning_value),
              };
              const overall =
                NUMERIC_DIMENSIONS.reduce((s, k) => s + averages[k], 0) /
                NUMERIC_DIMENSIONS.length;
              return {
                cohort_id: r.cohort_id,
                cohort_name: r.cohort_name,
                cohort_slug: r.cohort_slug,
                count: Number(r.count),
                averages: { ...averages, overall_avg: round2(overall) },
              };
            }),
          });
        }

        if (args.group_by === "learning") {
          const rows = await prisma.$queryRaw<
            Array<{
              learning_id: number;
              learning_name: string;
              meeting_date: Date;
              cohort_id: number;
              cohort_name: string;
              speaker_id: string | null;
              speaker_name: string | null;
              count: bigint;
              coach_clarity: number | null;
              coach_mastery: number | null;
              coach_responsiveness: number | null;
              coach_engagement: number | null;
              material_relevance: number | null;
              material_flow: number | null;
              material_depth: number | null;
              learning_value: number | null;
            }>
          >(Prisma.sql`
            SELECT
              l.id AS learning_id,
              l.name AS learning_name,
              l.meeting_date AS meeting_date,
              c.id AS cohort_id,
              c.name AS cohort_name,
              l.speaker_id AS speaker_id,
              u.full_name AS speaker_name,
              COUNT(*)::bigint AS count,
              AVG(lr.coach_clarity)::float AS coach_clarity,
              AVG(lr.coach_mastery)::float AS coach_mastery,
              AVG(lr.coach_responsiveness)::float AS coach_responsiveness,
              AVG(lr.coach_engagement)::float AS coach_engagement,
              AVG(lr.material_relevance)::float AS material_relevance,
              AVG(lr.material_flow)::float AS material_flow,
              AVG(lr.material_depth)::float AS material_depth,
              AVG(lr.learning_value)::float AS learning_value
            FROM learning_ratings lr
            JOIN learnings l ON l.id = lr.learning_id
            JOIN cohorts c ON c.id = l.cohort_id
            LEFT JOIN users u ON u.id = l.speaker_id
            ${whereSql}
            GROUP BY l.id, l.name, l.meeting_date, c.id, c.name, l.speaker_id, u.full_name
            ORDER BY learning_value DESC NULLS LAST
          `);

          return jsonText({
            group_by: "learning",
            groups: rows.map((r) => {
              const averages: Record<Dimension, number> = {
                coach_clarity: round2(r.coach_clarity),
                coach_mastery: round2(r.coach_mastery),
                coach_responsiveness: round2(r.coach_responsiveness),
                coach_engagement: round2(r.coach_engagement),
                material_relevance: round2(r.material_relevance),
                material_flow: round2(r.material_flow),
                material_depth: round2(r.material_depth),
                learning_value: round2(r.learning_value),
              };
              const overall =
                NUMERIC_DIMENSIONS.reduce((s, k) => s + averages[k], 0) /
                NUMERIC_DIMENSIONS.length;
              return {
                learning_id: r.learning_id,
                learning_name: r.learning_name,
                meeting_date: dayjs(r.meeting_date).toISOString(),
                cohort: { id: r.cohort_id, name: r.cohort_name },
                speaker: r.speaker_id
                  ? { id: r.speaker_id, full_name: r.speaker_name }
                  : null,
                count: Number(r.count),
                averages: { ...averages, overall_avg: round2(overall) },
              };
            }),
          });
        }

        // group_by === "speaker"
        const rows = await prisma.$queryRaw<
          Array<{
            speaker_id: string | null;
            speaker_name: string | null;
            sessions: bigint;
            count: bigint;
            coach_clarity: number | null;
            coach_mastery: number | null;
            coach_responsiveness: number | null;
            coach_engagement: number | null;
            material_relevance: number | null;
            material_flow: number | null;
            material_depth: number | null;
            learning_value: number | null;
          }>
        >(Prisma.sql`
          SELECT
            l.speaker_id AS speaker_id,
            u.full_name AS speaker_name,
            COUNT(DISTINCT l.id)::bigint AS sessions,
            COUNT(*)::bigint AS count,
            AVG(lr.coach_clarity)::float AS coach_clarity,
            AVG(lr.coach_mastery)::float AS coach_mastery,
            AVG(lr.coach_responsiveness)::float AS coach_responsiveness,
            AVG(lr.coach_engagement)::float AS coach_engagement,
            AVG(lr.material_relevance)::float AS material_relevance,
            AVG(lr.material_flow)::float AS material_flow,
            AVG(lr.material_depth)::float AS material_depth,
            AVG(lr.learning_value)::float AS learning_value
          FROM learning_ratings lr
          JOIN learnings l ON l.id = lr.learning_id
          LEFT JOIN users u ON u.id = l.speaker_id
          ${whereSql}
          GROUP BY l.speaker_id, u.full_name
          ORDER BY learning_value DESC NULLS LAST
        `);

        return jsonText({
          group_by: "speaker",
          groups: rows.map((r) => {
            const averages: Record<Dimension, number> = {
              coach_clarity: round2(r.coach_clarity),
              coach_mastery: round2(r.coach_mastery),
              coach_responsiveness: round2(r.coach_responsiveness),
              coach_engagement: round2(r.coach_engagement),
              material_relevance: round2(r.material_relevance),
              material_flow: round2(r.material_flow),
              material_depth: round2(r.material_depth),
              learning_value: round2(r.learning_value),
            };
            const overall =
              NUMERIC_DIMENSIONS.reduce((s, k) => s + averages[k], 0) /
              NUMERIC_DIMENSIONS.length;
            return {
              speaker_id: r.speaker_id,
              speaker_name: r.speaker_name,
              sessions: Number(r.sessions),
              count: Number(r.count),
              averages: { ...averages, overall_avg: round2(overall) },
            };
          }),
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // DISCOVERY — list cohorts and learnings with rating summaries
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_cohorts",
      "List cohorts (classes) with each one's rating count and learning_value average. Use this to discover cohort_id values for other tools. Excludes soft-deleted cohorts by default.",
      {
        status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
        query: z
          .string()
          .optional()
          .describe("Substring search on cohort name (case-insensitive)"),
        include_deleted: z.boolean().optional().default(false),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async ({ status, query, include_deleted, limit, offset }) => {
        const prisma = GetPrismaClient();
        const where: Prisma.CohortWhereInput = {};
        if (!include_deleted) where.deleted_at = null;
        if (status) where.status = status;
        if (query) where.name = { contains: query, mode: "insensitive" };

        const [cohorts, total] = await Promise.all([
          prisma.cohort.findMany({
            where,
            select: {
              id: true,
              name: true,
              slug_url: true,
              status: true,
              start_date: true,
              end_date: true,
              tags: true,
              _count: { select: { learnings: true, users: true } },
            },
            orderBy: { id: "desc" },
            take: limit,
            skip: offset,
          }),
          prisma.cohort.count({ where }),
        ]);

        // Augment with rating count + learning_value avg per cohort
        const ids = cohorts.map((c) => c.id);
        const ratingStats =
          ids.length === 0
            ? []
            : await prisma.$queryRaw<
                Array<{
                  cohort_id: number;
                  count: bigint;
                  learning_value: number | null;
                }>
              >(Prisma.sql`
                SELECT
                  l.cohort_id AS cohort_id,
                  COUNT(*)::bigint AS count,
                  AVG(lr.learning_value)::float AS learning_value
                FROM learning_ratings lr
                JOIN learnings l ON l.id = lr.learning_id
                WHERE l.cohort_id IN (${Prisma.join(ids)})
                GROUP BY l.cohort_id
              `);
        const statsByCohort = new Map(
          ratingStats.map((s) => [
            s.cohort_id,
            {
              ratings_count: Number(s.count),
              learning_value_avg: round2(s.learning_value),
            },
          ]),
        );

        return jsonText({
          total,
          count: cohorts.length,
          offset,
          limit,
          items: cohorts.map((c) => ({
            id: c.id,
            name: c.name,
            slug_url: c.slug_url,
            status: c.status,
            tags: c.tags,
            start_date: dayjs(c.start_date).toISOString(),
            end_date: dayjs(c.end_date).toISOString(),
            learnings_count: c._count.learnings,
            students_count: c._count.users,
            ratings_count: statsByCohort.get(c.id)?.ratings_count ?? 0,
            learning_value_avg:
              statsByCohort.get(c.id)?.learning_value_avg ?? 0,
          })),
        });
      },
    );

    server.tool(
      "list_learnings",
      "List learning sessions (individual class meetings) with rating count and learning_value average. Filter by cohort or speaker. Use to discover learning_id values for other tools.",
      {
        cohort_id: z.number().int().optional(),
        speaker_id: z.uuid().optional(),
        status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
        from: dateString
          .optional()
          .describe("Earliest meeting_date (inclusive)"),
        to: dateString.optional().describe("Latest meeting_date (inclusive)"),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async ({ cohort_id, speaker_id, status, from, to, limit, offset }) => {
        const prisma = GetPrismaClient();
        const where: Prisma.LearningWhereInput = {};
        if (cohort_id !== undefined) where.cohort_id = cohort_id;
        if (speaker_id) where.speaker_id = speaker_id;
        if (status) where.status = status;
        if (from || to) {
          where.meeting_date = {};
          if (from) where.meeting_date.gte = dayjs(from).toDate();
          if (to) where.meeting_date.lte = dayjs(to).toDate();
        }

        const [learnings, total] = await Promise.all([
          prisma.learning.findMany({
            where,
            select: {
              id: true,
              name: true,
              method: true,
              meeting_date: true,
              status: true,
              cohort: { select: { id: true, name: true } },
              speaker: { select: { id: true, full_name: true } },
              _count: { select: { ratings: true } },
            },
            orderBy: { meeting_date: "desc" },
            take: limit,
            skip: offset,
          }),
          prisma.learning.count({ where }),
        ]);

        const ids = learnings.map((l) => l.id);
        const lvAvgs =
          ids.length === 0
            ? []
            : await prisma.$queryRaw<
                Array<{ learning_id: number; learning_value: number | null }>
              >(Prisma.sql`
                SELECT learning_id, AVG(learning_value)::float AS learning_value
                FROM learning_ratings
                WHERE learning_id IN (${Prisma.join(ids)})
                GROUP BY learning_id
              `);
        const lvByLearning = new Map(
          lvAvgs.map((s) => [s.learning_id, round2(s.learning_value)]),
        );

        return jsonText({
          total,
          count: learnings.length,
          offset,
          limit,
          items: learnings.map((l) => ({
            id: l.id,
            name: l.name,
            method: l.method,
            meeting_date: dayjs(l.meeting_date).toISOString(),
            status: l.status,
            cohort: l.cohort,
            speaker: l.speaker,
            ratings_count: l._count.ratings,
            learning_value_avg: lvByLearning.get(l.id) ?? 0,
          })),
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // DEEP DIVES — full quality report for one cohort or one learning
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "get_cohort_quality",
      "Full quality report for one cohort: rollup of all 8 dimensions plus a per-learning breakdown ranked by learning_value. Also returns up to 20 most recent text feedback excerpts (improvement_suggestion / disliked_material / favorite_material / missing_topics) so you can read what students actually said.",
      {
        cohort_id: z.number().int(),
        feedback_limit: z
          .number()
          .int()
          .min(0)
          .max(100)
          .optional()
          .default(20)
          .describe("Number of recent text feedback excerpts to include"),
      },
      async ({ cohort_id, feedback_limit }) => {
        const prisma = GetPrismaClient();
        const cohort = await prisma.cohort.findUnique({
          where: { id: cohort_id },
          select: {
            id: true,
            name: true,
            slug_url: true,
            status: true,
            start_date: true,
            end_date: true,
            tags: true,
            _count: { select: { learnings: true, users: true } },
          },
        });
        if (!cohort) return jsonText({ error: "Cohort not found" });

        const rollupRows = await prisma.$queryRaw<
          Array<{
            count: bigint;
            coach_clarity: number | null;
            coach_mastery: number | null;
            coach_responsiveness: number | null;
            coach_engagement: number | null;
            material_relevance: number | null;
            material_flow: number | null;
            material_depth: number | null;
            learning_value: number | null;
          }>
        >(Prisma.sql`
          SELECT
            COUNT(*)::bigint AS count,
            AVG(lr.coach_clarity)::float AS coach_clarity,
            AVG(lr.coach_mastery)::float AS coach_mastery,
            AVG(lr.coach_responsiveness)::float AS coach_responsiveness,
            AVG(lr.coach_engagement)::float AS coach_engagement,
            AVG(lr.material_relevance)::float AS material_relevance,
            AVG(lr.material_flow)::float AS material_flow,
            AVG(lr.material_depth)::float AS material_depth,
            AVG(lr.learning_value)::float AS learning_value
          FROM learning_ratings lr
          JOIN learnings l ON l.id = lr.learning_id
          WHERE l.cohort_id = ${cohort_id}
        `);
        const r = rollupRows[0];
        const rollupAvgs: Record<Dimension, number> = {
          coach_clarity: round2(r?.coach_clarity),
          coach_mastery: round2(r?.coach_mastery),
          coach_responsiveness: round2(r?.coach_responsiveness),
          coach_engagement: round2(r?.coach_engagement),
          material_relevance: round2(r?.material_relevance),
          material_flow: round2(r?.material_flow),
          material_depth: round2(r?.material_depth),
          learning_value: round2(r?.learning_value),
        };
        const rollupOverall =
          NUMERIC_DIMENSIONS.reduce((s, k) => s + rollupAvgs[k], 0) /
          NUMERIC_DIMENSIONS.length;

        const perLearning = await prisma.$queryRaw<
          Array<{
            learning_id: number;
            learning_name: string;
            meeting_date: Date;
            speaker_id: string | null;
            speaker_name: string | null;
            count: bigint;
            coach_clarity: number | null;
            coach_mastery: number | null;
            coach_responsiveness: number | null;
            coach_engagement: number | null;
            material_relevance: number | null;
            material_flow: number | null;
            material_depth: number | null;
            learning_value: number | null;
          }>
        >(Prisma.sql`
          SELECT
            l.id AS learning_id,
            l.name AS learning_name,
            l.meeting_date AS meeting_date,
            l.speaker_id AS speaker_id,
            u.full_name AS speaker_name,
            COUNT(*)::bigint AS count,
            AVG(lr.coach_clarity)::float AS coach_clarity,
            AVG(lr.coach_mastery)::float AS coach_mastery,
            AVG(lr.coach_responsiveness)::float AS coach_responsiveness,
            AVG(lr.coach_engagement)::float AS coach_engagement,
            AVG(lr.material_relevance)::float AS material_relevance,
            AVG(lr.material_flow)::float AS material_flow,
            AVG(lr.material_depth)::float AS material_depth,
            AVG(lr.learning_value)::float AS learning_value
          FROM learning_ratings lr
          JOIN learnings l ON l.id = lr.learning_id
          LEFT JOIN users u ON u.id = l.speaker_id
          WHERE l.cohort_id = ${cohort_id}
          GROUP BY l.id, l.name, l.meeting_date, l.speaker_id, u.full_name
          ORDER BY learning_value DESC NULLS LAST
        `);

        const recentFeedback =
          feedback_limit === 0
            ? []
            : await prisma.learningRating.findMany({
                where: {
                  learning: { cohort_id },
                  OR: [
                    { missing_topics: { not: null } },
                    { favorite_material: { not: null } },
                    { disliked_material: { not: null } },
                    { improvement_suggestion: { not: null } },
                  ],
                },
                select: {
                  id: true,
                  created_at: true,
                  learning: {
                    select: { id: true, name: true, meeting_date: true },
                  },
                  user: { select: { id: true, full_name: true } },
                  missing_topics: true,
                  favorite_material: true,
                  disliked_material: true,
                  improvement_suggestion: true,
                  learning_value: true,
                },
                orderBy: { created_at: "desc" },
                take: feedback_limit,
              });

        return jsonText({
          cohort: {
            id: cohort.id,
            name: cohort.name,
            slug_url: cohort.slug_url,
            status: cohort.status,
            tags: cohort.tags,
            start_date: dayjs(cohort.start_date).toISOString(),
            end_date: dayjs(cohort.end_date).toISOString(),
            learnings_count: cohort._count.learnings,
            students_count: cohort._count.users,
          },
          rollup: {
            count: Number(r?.count ?? 0),
            // response_rate = ratings ÷ (students × learnings).
            // Treat as informational — students may rate the same session at most once
            // (unique [learning_id, user_id]) but may skip sessions.
            response_rate:
              cohort._count.users > 0 && cohort._count.learnings > 0
                ? round2(
                    Number(r?.count ?? 0) /
                      (cohort._count.users * cohort._count.learnings),
                  )
                : 0,
            averages: { ...rollupAvgs, overall_avg: round2(rollupOverall) },
          },
          per_learning: perLearning.map((pl) => {
            const avgs: Record<Dimension, number> = {
              coach_clarity: round2(pl.coach_clarity),
              coach_mastery: round2(pl.coach_mastery),
              coach_responsiveness: round2(pl.coach_responsiveness),
              coach_engagement: round2(pl.coach_engagement),
              material_relevance: round2(pl.material_relevance),
              material_flow: round2(pl.material_flow),
              material_depth: round2(pl.material_depth),
              learning_value: round2(pl.learning_value),
            };
            const overall =
              NUMERIC_DIMENSIONS.reduce((s, k) => s + avgs[k], 0) /
              NUMERIC_DIMENSIONS.length;
            return {
              learning_id: pl.learning_id,
              learning_name: pl.learning_name,
              meeting_date: dayjs(pl.meeting_date).toISOString(),
              speaker: pl.speaker_id
                ? { id: pl.speaker_id, full_name: pl.speaker_name }
                : null,
              count: Number(pl.count),
              averages: { ...avgs, overall_avg: round2(overall) },
            };
          }),
          recent_feedback: recentFeedback.map((f) => ({
            id: f.id,
            learning: {
              id: f.learning.id,
              name: f.learning.name,
              meeting_date: dayjs(f.learning.meeting_date).toISOString(),
            },
            user: f.user,
            learning_value: f.learning_value,
            missing_topics: f.missing_topics,
            favorite_material: f.favorite_material,
            disliked_material: f.disliked_material,
            improvement_suggestion: f.improvement_suggestion,
            created_at: dayjs(f.created_at).toISOString(),
          })),
        });
      },
    );

    server.tool(
      "get_learning_quality",
      "Full quality report for one learning session: speaker info, attendance, averages on all 8 dimensions, and every text feedback comment submitted for that session.",
      {
        learning_id: z.number().int(),
      },
      async ({ learning_id }) => {
        const prisma = GetPrismaClient();
        const learning = await prisma.learning.findUnique({
          where: { id: learning_id },
          select: {
            id: true,
            name: true,
            description: true,
            method: true,
            meeting_date: true,
            status: true,
            cohort: { select: { id: true, name: true, slug_url: true } },
            speaker: {
              select: { id: true, full_name: true, email: true },
            },
            _count: { select: { ratings: true, attendances: true } },
          },
        });
        if (!learning) return jsonText({ error: "Learning not found" });

        const agg = await prisma.learningRating.aggregate({
          where: { learning_id },
          _count: { _all: true },
          _avg: {
            coach_clarity: true,
            coach_mastery: true,
            coach_responsiveness: true,
            coach_engagement: true,
            material_relevance: true,
            material_flow: true,
            material_depth: true,
            learning_value: true,
          },
        });
        const averages: Record<Dimension, number> = {
          coach_clarity: round2(agg._avg.coach_clarity),
          coach_mastery: round2(agg._avg.coach_mastery),
          coach_responsiveness: round2(agg._avg.coach_responsiveness),
          coach_engagement: round2(agg._avg.coach_engagement),
          material_relevance: round2(agg._avg.material_relevance),
          material_flow: round2(agg._avg.material_flow),
          material_depth: round2(agg._avg.material_depth),
          learning_value: round2(agg._avg.learning_value),
        };
        const overall =
          NUMERIC_DIMENSIONS.reduce((s, k) => s + averages[k], 0) /
          NUMERIC_DIMENSIONS.length;

        const allFeedback = await prisma.learningRating.findMany({
          where: {
            learning_id,
            OR: [
              { missing_topics: { not: null } },
              { favorite_material: { not: null } },
              { disliked_material: { not: null } },
              { improvement_suggestion: { not: null } },
            ],
          },
          include: ratingInclude,
          orderBy: { created_at: "desc" },
        });

        return jsonText({
          learning: {
            id: learning.id,
            name: learning.name,
            description: learning.description,
            method: learning.method,
            meeting_date: dayjs(learning.meeting_date).toISOString(),
            status: learning.status,
            cohort: learning.cohort,
            speaker: learning.speaker,
            attendances_count: learning._count.attendances,
          },
          rollup: {
            count: agg._count._all,
            // response_rate = ratings ÷ attendances. If attendance isn't tracked
            // (count = 0) we report 0 rather than guess.
            response_rate:
              learning._count.attendances > 0
                ? round2(agg._count._all / learning._count.attendances)
                : 0,
            averages: { ...averages, overall_avg: round2(overall) },
          },
          feedback: allFeedback.map(serializeRating),
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // QUALITATIVE — free-text feedback search
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "search_feedback",
      "Search free-text rating feedback (missing_topics, favorite_material, disliked_material, improvement_suggestion) by keyword across all four fields. Filter by cohort, learning, or speaker. Use this to surface specific complaints, praise, or topic gaps.",
      {
        query: z
          .string()
          .min(1)
          .describe(
            "Keyword to search across all 4 free-text feedback fields (case-insensitive)",
          ),
        cohort_id: z.number().int().optional(),
        learning_id: z.number().int().optional(),
        speaker_id: z.uuid().optional(),
        fields: z
          .array(
            z.enum([
              "missing_topics",
              "favorite_material",
              "disliked_material",
              "improvement_suggestion",
            ]),
          )
          .optional()
          .describe(
            "Restrict the search to specific feedback fields (default: all 4)",
          ),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async (args) => {
        const prisma = GetPrismaClient();
        const baseWhere = buildRatingWhere(args);

        const fields = args.fields ?? [
          "missing_topics",
          "favorite_material",
          "disliked_material",
          "improvement_suggestion",
        ];
        const orClauses: Prisma.LearningRatingWhereInput[] = fields.map(
          (f) =>
            ({
              [f]: { contains: args.query, mode: "insensitive" },
            }) as Prisma.LearningRatingWhereInput,
        );

        const where: Prisma.LearningRatingWhereInput = {
          ...baseWhere,
          OR: orClauses,
        };

        const [items, total] = await Promise.all([
          prisma.learningRating.findMany({
            where,
            include: ratingInclude,
            orderBy: { created_at: "desc" },
            take: args.limit,
            skip: args.offset,
          }),
          prisma.learningRating.count({ where }),
        ]);

        return jsonText({
          query: args.query,
          fields,
          total,
          count: items.length,
          offset: args.offset,
          limit: args.limit,
          items: items.map(serializeRating),
        });
      },
    );
  },
  { public: true },
);

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
