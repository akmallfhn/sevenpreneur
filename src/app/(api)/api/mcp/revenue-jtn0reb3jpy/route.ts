import {
  Prisma,
  CategoryEnum,
  StatusEnum,
  TStatusEnum,
} from "@prisma/client";
import { z } from "zod";
import dayjs from "dayjs";
import GetPrismaClient from "@/lib/prisma";
import { createSevenpreneurMcp, mcpJsonText as jsonText } from "@/lib/mcp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TStatus = z.enum(TStatusEnum);
const Category = z.enum(CategoryEnum);
const Status = z.enum(StatusEnum);
const dateString = z
  .string()
  .refine((s) => dayjs(s).isValid(), { message: "Invalid date string" })
  .describe(
    "Date string parseable by dayjs, e.g. 2025-01-01 or 2025-01-01T00:00:00Z",
  );

type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        full_name: true;
        email: true;
        phone_number: true;
      };
    };
    discount: { select: { id: true; code: true; name: true } };
  };
}>;

function serializeTransaction(t: TransactionWithRelations) {
  return {
    id: t.id,
    user_id: t.user_id,
    user: t.user
      ? {
          id: t.user.id,
          full_name: t.user.full_name,
          email: t.user.email,
          phone_number: t.user.phone_number,
        }
      : null,
    category: t.category,
    item_id: t.item_id,
    amount: t.amount.toString(),
    discount_id: t.discount_id,
    discount: t.discount
      ? { id: t.discount.id, code: t.discount.code, name: t.discount.name }
      : null,
    discount_amount: t.discount_amount.toString(),
    admin_fee: t.admin_fee.toString(),
    vat: t.vat.toString(),
    currency: t.currency,
    invoice_number: t.invoice_number,
    status: t.status,
    payment_method: t.payment_method,
    payment_channel: t.payment_channel,
    paid_at: t.paid_at ? dayjs(t.paid_at).toISOString() : null,
    created_at: dayjs(t.created_at).toISOString(),
    updated_at: dayjs(t.updated_at).toISOString(),
  };
}

const txInclude = {
  user: {
    select: { id: true, full_name: true, email: true, phone_number: true },
  },
  discount: { select: { id: true, code: true, name: true } },
} as const satisfies Prisma.TransactionInclude;

const handler = createSevenpreneurMcp(
  "revenue-jtn0reb3jpy",
  (server) => {
    // ────────────────────────────────────────────────────────────────────
    // TRANSACTIONS
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_transactions",
      "List Sevenpreneur transactions (Xendit invoices) with optional filters and pagination. Ordered by created_at descending.",
      {
        status: TStatus.optional().describe("Filter by payment status"),
        category: Category.optional().describe("Filter by purchase category"),
        user_id: z.uuid().optional().describe("Filter by user UUID"),
        user_email: z
          .email()
          .optional()
          .describe("Filter by user email (exact match)"),
        invoice_number: z
          .string()
          .optional()
          .describe("Filter by Xendit invoice number"),
        from: dateString.optional().describe("Earliest created_at (inclusive)"),
        to: dateString.optional().describe("Latest created_at (inclusive)"),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async (args) => {
        const prisma = GetPrismaClient();
        const where: Prisma.TransactionWhereInput = {};
        if (args.status) where.status = args.status;
        if (args.category) where.category = args.category;
        if (args.user_id) where.user_id = args.user_id;
        if (args.user_email) where.user = { email: args.user_email };
        if (args.invoice_number) where.invoice_number = args.invoice_number;
        if (args.from || args.to) {
          where.created_at = {};
          if (args.from) where.created_at.gte = dayjs(args.from).toDate();
          if (args.to) where.created_at.lte = dayjs(args.to).toDate();
        }

        const [items, total] = await Promise.all([
          prisma.transaction.findMany({
            where,
            include: txInclude,
            orderBy: { created_at: "desc" },
            take: args.limit,
            skip: args.offset,
          }),
          prisma.transaction.count({ where }),
        ]);

        return jsonText({
          total,
          count: items.length,
          offset: args.offset,
          limit: args.limit,
          items: items.map(serializeTransaction),
        });
      },
    );

    server.tool(
      "get_transaction",
      "Fetch a single transaction by transaction ID (21-char nanoid) or Xendit invoice_number.",
      {
        id: z.string().optional().describe("Transaction ID (21-char nanoid)"),
        invoice_number: z
          .string()
          .optional()
          .describe("Xendit invoice number"),
      },
      async ({ id, invoice_number }) => {
        if (!id && !invoice_number) {
          return jsonText({ error: "Provide either `id` or `invoice_number`." });
        }
        const prisma = GetPrismaClient();
        const tx = await prisma.transaction.findFirst({
          where: id ? { id } : { invoice_number: invoice_number! },
          include: txInclude,
        });
        if (!tx) return jsonText({ error: "Transaction not found" });
        return jsonText(serializeTransaction(tx));
      },
    );

    server.tool(
      "aggregate_transactions",
      "Aggregate transaction metrics (count + sum of amount) with optional filters and grouping. Use status=PAID to get actual revenue. Group by status, category, payment_channel, day, or month.",
      {
        status: TStatus.optional().describe("Filter by status (use PAID for revenue)"),
        category: Category.optional(),
        from: dateString.optional(),
        to: dateString.optional(),
        group_by: z
          .enum(["none", "status", "category", "payment_channel", "day", "month"])
          .optional()
          .default("none"),
      },
      async (args) => {
        const prisma = GetPrismaClient();
        const where: Prisma.TransactionWhereInput = {};
        if (args.status) where.status = args.status;
        if (args.category) where.category = args.category;
        if (args.from || args.to) {
          where.created_at = {};
          if (args.from) where.created_at.gte = dayjs(args.from).toDate();
          if (args.to) where.created_at.lte = dayjs(args.to).toDate();
        }

        if (args.group_by === "none") {
          const agg = await prisma.transaction.aggregate({
            where,
            _count: { _all: true },
            _sum: {
              amount: true,
              discount_amount: true,
              admin_fee: true,
              vat: true,
            },
          });
          return jsonText({
            filters: {
              status: args.status ?? null,
              category: args.category ?? null,
              from: args.from ?? null,
              to: args.to ?? null,
            },
            count: agg._count._all,
            total_amount: agg._sum.amount?.toString() ?? "0",
            total_discount_amount: agg._sum.discount_amount?.toString() ?? "0",
            total_admin_fee: agg._sum.admin_fee?.toString() ?? "0",
            total_vat: agg._sum.vat?.toString() ?? "0",
          });
        }

        if (args.group_by === "day" || args.group_by === "month") {
          const conditions: Prisma.Sql[] = [];
          if (args.status)
            conditions.push(
              Prisma.sql`status = ${args.status}::t_status_enum`,
            );
          if (args.category)
            conditions.push(
              Prisma.sql`category = ${args.category}::category_enum`,
            );
          if (args.from)
            conditions.push(
              Prisma.sql`created_at >= ${dayjs(args.from).toDate()}`,
            );
          if (args.to)
            conditions.push(
              Prisma.sql`created_at <= ${dayjs(args.to).toDate()}`,
            );

          const whereClause =
            conditions.length > 0
              ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
              : Prisma.empty;

          const truncUnit = args.group_by === "day" ? "day" : "month";
          const rows = await prisma.$queryRaw<
            Array<{
              bucket: Date;
              count: bigint;
              total_amount: Prisma.Decimal | null;
            }>
          >(
            Prisma.sql`
              SELECT date_trunc(${truncUnit}, created_at) AS bucket,
                     COUNT(*)::bigint AS count,
                     COALESCE(SUM(amount), 0) AS total_amount
              FROM transactions
              ${whereClause}
              GROUP BY bucket
              ORDER BY bucket ASC
            `,
          );

          return jsonText({
            group_by: args.group_by,
            groups: rows.map((r) => ({
              bucket: dayjs(r.bucket).toISOString(),
              count: Number(r.count),
              total_amount: r.total_amount?.toString() ?? "0",
            })),
          });
        }

        // group_by: status | category | payment_channel
        let grouped: Array<{
          key: string | null;
          count: number;
          total_amount: string;
        }> = [];

        if (args.group_by === "status") {
          const rows = await prisma.transaction.groupBy({
            by: ["status"],
            where,
            _count: { _all: true },
            _sum: { amount: true },
          });
          grouped = rows.map((r) => ({
            key: r.status,
            count: r._count._all,
            total_amount: r._sum.amount?.toString() ?? "0",
          }));
        } else if (args.group_by === "category") {
          const rows = await prisma.transaction.groupBy({
            by: ["category"],
            where,
            _count: { _all: true },
            _sum: { amount: true },
          });
          grouped = rows.map((r) => ({
            key: r.category,
            count: r._count._all,
            total_amount: r._sum.amount?.toString() ?? "0",
          }));
        } else {
          const rows = await prisma.transaction.groupBy({
            by: ["payment_channel"],
            where,
            _count: { _all: true },
            _sum: { amount: true },
          });
          grouped = rows.map((r) => ({
            key: r.payment_channel,
            count: r._count._all,
            total_amount: r._sum.amount?.toString() ?? "0",
          }));
        }

        return jsonText({
          group_by: args.group_by,
          groups: grouped,
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // USERS
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_users",
      "List users with optional search by name/email/phone. Excludes soft-deleted users.",
      {
        query: z
          .string()
          .optional()
          .describe("Search term — matched against full_name, email, phone_number"),
        role_id: z.number().int().optional().describe("Filter by role_id"),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async ({ query, role_id, limit, offset }) => {
        const prisma = GetPrismaClient();
        const where: Prisma.UserWhereInput = { deleted_at: null };
        if (role_id !== undefined) where.role_id = role_id;
        if (query) {
          where.OR = [
            { full_name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone_number: { contains: query } },
          ];
        }
        const [items, total] = await Promise.all([
          prisma.user.findMany({
            where,
            select: {
              id: true,
              full_name: true,
              email: true,
              phone_number: true,
              role_id: true,
              status: true,
              created_at: true,
              last_login: true,
            },
            orderBy: { created_at: "desc" },
            take: limit,
            skip: offset,
          }),
          prisma.user.count({ where }),
        ]);

        return jsonText({
          total,
          count: items.length,
          offset,
          limit,
          items: items.map((u) => ({
            id: u.id,
            full_name: u.full_name,
            email: u.email,
            phone_number: u.phone_number,
            role_id: u.role_id,
            status: u.status,
            created_at: dayjs(u.created_at).toISOString(),
            last_login: dayjs(u.last_login).toISOString(),
          })),
        });
      },
    );

    server.tool(
      "get_user",
      "Fetch a single user by id (UUID), email, or phone_number. Includes up to 10 most recent transactions.",
      {
        id: z.uuid().optional(),
        email: z.email().optional(),
        phone_number: z.string().optional(),
      },
      async ({ id, email, phone_number }) => {
        if (!id && !email && !phone_number) {
          return jsonText({
            error: "Provide one of: id, email, phone_number.",
          });
        }
        const prisma = GetPrismaClient();
        const where: Prisma.UserWhereInput = id
          ? { id }
          : email
            ? { email }
            : { phone_number: phone_number! };

        const user = await prisma.user.findFirst({
          where,
          include: {
            transactions: {
              orderBy: { created_at: "desc" },
              take: 10,
              include: txInclude,
            },
          },
        });
        if (!user) return jsonText({ error: "User not found" });

        return jsonText({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          role_id: user.role_id,
          status: user.status,
          created_at: dayjs(user.created_at).toISOString(),
          last_login: dayjs(user.last_login).toISOString(),
          recent_transactions: user.transactions.map(serializeTransaction),
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // ENROLLMENTS (UserCohort)
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_enrollments",
      "List cohort enrollments — students enrolled in cohorts with their selected price tier.",
      {
        user_id: z.uuid().optional(),
        cohort_id: z.number().int().optional(),
        is_scout: z.boolean().optional(),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async ({ user_id, cohort_id, is_scout, limit, offset }) => {
        const prisma = GetPrismaClient();
        const where: Prisma.UserCohortWhereInput = {};
        if (user_id) where.user_id = user_id;
        if (cohort_id) where.cohort_id = cohort_id;
        if (is_scout !== undefined) where.is_scout = is_scout;

        const [items, total] = await Promise.all([
          prisma.userCohort.findMany({
            where,
            include: {
              user: {
                select: { id: true, full_name: true, email: true },
              },
              cohort: {
                select: {
                  id: true,
                  name: true,
                  slug_url: true,
                  status: true,
                  start_date: true,
                  end_date: true,
                },
              },
              cohort_price: {
                select: { id: true, name: true, amount: true },
              },
            },
            take: limit,
            skip: offset,
          }),
          prisma.userCohort.count({ where }),
        ]);

        return jsonText({
          total,
          count: items.length,
          offset,
          limit,
          items: items.map((uc) => ({
            user_id: uc.user_id,
            cohort_id: uc.cohort_id,
            user: uc.user,
            cohort: {
              id: uc.cohort.id,
              name: uc.cohort.name,
              slug_url: uc.cohort.slug_url,
              status: uc.cohort.status,
              start_date: dayjs(uc.cohort.start_date).toISOString(),
              end_date: dayjs(uc.cohort.end_date).toISOString(),
            },
            cohort_price: {
              id: uc.cohort_price.id,
              name: uc.cohort_price.name,
              amount: uc.cohort_price.amount.toString(),
            },
            certificate_url: uc.certificate_url,
            is_scout: uc.is_scout,
          })),
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // DISCOUNTS / VOUCHERS
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_discounts",
      "List discount/voucher codes with optional filters. Each item includes a usage_count derived from related transactions.",
      {
        status: Status.optional(),
        category: Category.optional(),
        code: z
          .string()
          .optional()
          .describe("Substring search on code (case-insensitive)"),
        limit: z.number().int().min(1).max(200).optional().default(50),
        offset: z.number().int().min(0).optional().default(0),
      },
      async ({ status, category, code, limit, offset }) => {
        const prisma = GetPrismaClient();
        const where: Prisma.DiscountWhereInput = {};
        if (status) where.status = status;
        if (category) where.category = category;
        if (code) where.code = { contains: code, mode: "insensitive" };

        const [items, total] = await Promise.all([
          prisma.discount.findMany({
            where,
            include: { _count: { select: { transactions: true } } },
            orderBy: { id: "desc" },
            take: limit,
            skip: offset,
          }),
          prisma.discount.count({ where }),
        ]);

        return jsonText({
          total,
          count: items.length,
          offset,
          limit,
          items: items.map((d) => ({
            id: d.id,
            code: d.code,
            name: d.name,
            description: d.description,
            category: d.category,
            item_id: d.item_id,
            calc_percent: d.calc_percent.toString(),
            status: d.status,
            start_date: dayjs(d.start_date).toISOString(),
            end_date: dayjs(d.end_date).toISOString(),
            usage_count: d._count.transactions,
          })),
        });
      },
    );

    server.tool(
      "get_discount",
      "Fetch a single discount by id or code, with usage count and recent transactions that used it.",
      {
        id: z.number().int().optional(),
        code: z.string().optional(),
      },
      async ({ id, code }) => {
        if (id === undefined && !code) {
          return jsonText({ error: "Provide either `id` or `code`." });
        }
        const prisma = GetPrismaClient();
        const d = await prisma.discount.findFirst({
          where: id !== undefined ? { id } : { code: code! },
          include: {
            _count: { select: { transactions: true } },
            transactions: {
              orderBy: { created_at: "desc" },
              take: 10,
              include: txInclude,
            },
          },
        });
        if (!d) return jsonText({ error: "Discount not found" });

        return jsonText({
          id: d.id,
          code: d.code,
          name: d.name,
          description: d.description,
          category: d.category,
          item_id: d.item_id,
          calc_percent: d.calc_percent.toString(),
          status: d.status,
          start_date: dayjs(d.start_date).toISOString(),
          end_date: dayjs(d.end_date).toISOString(),
          usage_count: d._count.transactions,
          recent_transactions: d.transactions.map(serializeTransaction),
        });
      },
    );
  },
  { public: true },
);

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
