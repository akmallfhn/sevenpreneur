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

/**
 * Net amount = base price + admin_fee + VAT − discount.
 * Pajak & admin fee dibebankan ke user, jadi ini total yang user bayar
 * (gross revenue dari sisi merchant).
 */
function calcNetAmount(t: {
  amount: Prisma.Decimal;
  admin_fee: Prisma.Decimal;
  vat: Prisma.Decimal;
  discount_amount: Prisma.Decimal;
}): Prisma.Decimal {
  return t.amount.plus(t.admin_fee).plus(t.vat).minus(t.discount_amount);
}

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
    net_amount: calcNetAmount(t).toString(),
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
      "List Sevenpreneur transactions (Xendit invoices) with optional filters and pagination. Ordered by created_at descending. Use cohort_id / event_id / playlist_id (mutually exclusive) to scope to a specific product across all its price tiers.",
      {
        status: TStatus.optional().describe("Filter by payment status"),
        category: Category.optional().describe("Filter by purchase category"),
        cohort_id: z
          .number()
          .int()
          .optional()
          .describe(
            "Filter to all transactions for any price tier of this cohort (resolves via cohort_prices)",
          ),
        event_id: z
          .number()
          .int()
          .optional()
          .describe(
            "Filter to all transactions for any price tier of this event (resolves via event_prices)",
          ),
        playlist_id: z
          .number()
          .int()
          .optional()
          .describe(
            "Filter to transactions for this playlist (item_id matches playlist.id directly)",
          ),
        item_id: z
          .number()
          .int()
          .optional()
          .describe(
            "Direct filter on Transaction.item_id (cohort_price.id / event_price.id / playlist.id depending on category)",
          ),
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
        const productFilters = [
          args.cohort_id,
          args.event_id,
          args.playlist_id,
        ].filter((v) => v !== undefined);
        if (productFilters.length > 1) {
          return jsonText({
            error:
              "Set at most one of: cohort_id, event_id, playlist_id (a transaction can only belong to one product type).",
          });
        }

        const prisma = GetPrismaClient();
        const where: Prisma.TransactionWhereInput = {};
        if (args.status) where.status = args.status;
        if (args.category) where.category = args.category;
        if (args.user_id) where.user_id = args.user_id;
        if (args.user_email) where.user = { email: args.user_email };
        if (args.invoice_number) where.invoice_number = args.invoice_number;
        if (args.item_id !== undefined) where.item_id = args.item_id;
        if (args.from || args.to) {
          where.created_at = {};
          if (args.from) where.created_at.gte = dayjs(args.from).toDate();
          if (args.to) where.created_at.lte = dayjs(args.to).toDate();
        }

        // Resolve high-level product IDs → category + item_id IN [...]
        if (args.cohort_id !== undefined) {
          const prices = await prisma.cohortPrice.findMany({
            where: { cohort_id: args.cohort_id },
            select: { id: true },
          });
          where.category = "COHORT";
          where.item_id = { in: prices.map((p) => p.id) };
        } else if (args.event_id !== undefined) {
          const prices = await prisma.eventPrice.findMany({
            where: { event_id: args.event_id },
            select: { id: true },
          });
          where.category = "EVENT";
          where.item_id = { in: prices.map((p) => p.id) };
        } else if (args.playlist_id !== undefined) {
          where.category = "PLAYLIST";
          where.item_id = args.playlist_id;
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
      "Aggregate transaction metrics with optional filters and grouping. Returns count, total_amount (base price sum), total_admin_fee, total_vat, total_discount_amount, and total_net_amount (= amount + admin_fee + vat − discount, what user actually paid). Use status=PAID for actual revenue. Group by status, category, payment_channel, day, or month.",
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

        const ZERO = new Prisma.Decimal(0);
        const sumNet = (sums: {
          amount: Prisma.Decimal | null;
          admin_fee: Prisma.Decimal | null;
          vat: Prisma.Decimal | null;
          discount_amount: Prisma.Decimal | null;
        }) =>
          (sums.amount ?? ZERO)
            .plus(sums.admin_fee ?? ZERO)
            .plus(sums.vat ?? ZERO)
            .minus(sums.discount_amount ?? ZERO);

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
            total_amount: (agg._sum.amount ?? ZERO).toString(),
            total_discount_amount: (agg._sum.discount_amount ?? ZERO).toString(),
            total_admin_fee: (agg._sum.admin_fee ?? ZERO).toString(),
            total_vat: (agg._sum.vat ?? ZERO).toString(),
            total_net_amount: sumNet(agg._sum).toString(),
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
              total_admin_fee: Prisma.Decimal | null;
              total_vat: Prisma.Decimal | null;
              total_discount_amount: Prisma.Decimal | null;
              total_net_amount: Prisma.Decimal | null;
            }>
          >(
            Prisma.sql`
              SELECT date_trunc(${truncUnit}, created_at) AS bucket,
                     COUNT(*)::bigint AS count,
                     COALESCE(SUM(amount), 0) AS total_amount,
                     COALESCE(SUM(admin_fee), 0) AS total_admin_fee,
                     COALESCE(SUM(vat), 0) AS total_vat,
                     COALESCE(SUM(discount_amount), 0) AS total_discount_amount,
                     COALESCE(SUM(amount + admin_fee + vat - discount_amount), 0) AS total_net_amount
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
              total_amount: (r.total_amount ?? ZERO).toString(),
              total_admin_fee: (r.total_admin_fee ?? ZERO).toString(),
              total_vat: (r.total_vat ?? ZERO).toString(),
              total_discount_amount: (r.total_discount_amount ?? ZERO).toString(),
              total_net_amount: (r.total_net_amount ?? ZERO).toString(),
            })),
          });
        }

        // group_by: status | category | payment_channel
        const sumSelect = {
          amount: true,
          admin_fee: true,
          vat: true,
          discount_amount: true,
        } as const;

        type GroupRow = {
          key: string | null;
          count: number;
          total_amount: string;
          total_admin_fee: string;
          total_vat: string;
          total_discount_amount: string;
          total_net_amount: string;
        };

        let grouped: GroupRow[] = [];
        const formatRow = (
          key: string | null,
          row: {
            _count: { _all: number };
            _sum: {
              amount: Prisma.Decimal | null;
              admin_fee: Prisma.Decimal | null;
              vat: Prisma.Decimal | null;
              discount_amount: Prisma.Decimal | null;
            };
          },
        ): GroupRow => ({
          key,
          count: row._count._all,
          total_amount: (row._sum.amount ?? ZERO).toString(),
          total_admin_fee: (row._sum.admin_fee ?? ZERO).toString(),
          total_vat: (row._sum.vat ?? ZERO).toString(),
          total_discount_amount: (row._sum.discount_amount ?? ZERO).toString(),
          total_net_amount: sumNet(row._sum).toString(),
        });

        if (args.group_by === "status") {
          const rows = await prisma.transaction.groupBy({
            by: ["status"],
            where,
            _count: { _all: true },
            _sum: sumSelect,
          });
          grouped = rows.map((r) => formatRow(r.status, r));
        } else if (args.group_by === "category") {
          const rows = await prisma.transaction.groupBy({
            by: ["category"],
            where,
            _count: { _all: true },
            _sum: sumSelect,
          });
          grouped = rows.map((r) => formatRow(r.category, r));
        } else {
          const rows = await prisma.transaction.groupBy({
            by: ["payment_channel"],
            where,
            _count: { _all: true },
            _sum: sumSelect,
          });
          grouped = rows.map((r) => formatRow(r.payment_channel, r));
        }

        return jsonText({
          group_by: args.group_by,
          groups: grouped,
        });
      },
    );

    // ────────────────────────────────────────────────────────────────────
    // PRODUCTS (cohorts, events, playlists)
    // ────────────────────────────────────────────────────────────────────

    server.tool(
      "list_products",
      "List sellable products: cohorts, events, and playlists. Each cohort/event includes its price tiers — those tier IDs are what appear as Transaction.item_id. For playlists, the playlist.id is the item_id directly.",
      {
        status: Status.optional().describe("Filter products by status"),
        include_deleted: z
          .boolean()
          .optional()
          .default(false)
          .describe("Include soft-deleted products"),
      },
      async ({ status, include_deleted }) => {
        const prisma = GetPrismaClient();
        const where: { deleted_at?: null; status?: "ACTIVE" | "INACTIVE" } = {};
        if (!include_deleted) where.deleted_at = null;
        if (status) where.status = status;

        const [cohorts, events, playlists] = await Promise.all([
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
              cohort_prices: {
                select: { id: true, name: true, amount: true, status: true },
              },
            },
            orderBy: { id: "desc" },
          }),
          prisma.event.findMany({
            where,
            select: {
              id: true,
              name: true,
              slug_url: true,
              status: true,
              method: true,
              start_date: true,
              end_date: true,
              tags: true,
              event_prices: {
                select: { id: true, name: true, amount: true, status: true },
              },
            },
            orderBy: { id: "desc" },
          }),
          prisma.playlist.findMany({
            where,
            select: {
              id: true,
              name: true,
              tagline: true,
              slug_url: true,
              status: true,
              price: true,
              tags: true,
            },
            orderBy: { id: "desc" },
          }),
        ]);

        return jsonText({
          counts: {
            cohorts: cohorts.length,
            events: events.length,
            playlists: playlists.length,
          },
          cohorts: cohorts.map((c) => ({
            id: c.id,
            name: c.name,
            slug_url: c.slug_url,
            status: c.status,
            tags: c.tags,
            start_date: dayjs(c.start_date).toISOString(),
            end_date: dayjs(c.end_date).toISOString(),
            prices: c.cohort_prices.map((p) => ({
              id: p.id, // ← this is Transaction.item_id when category=COHORT
              name: p.name,
              amount: p.amount.toString(),
              status: p.status,
            })),
          })),
          events: events.map((e) => ({
            id: e.id,
            name: e.name,
            slug_url: e.slug_url,
            status: e.status,
            method: e.method,
            tags: e.tags,
            start_date: dayjs(e.start_date).toISOString(),
            end_date: dayjs(e.end_date).toISOString(),
            prices: e.event_prices.map((p) => ({
              id: p.id, // ← this is Transaction.item_id when category=EVENT
              name: p.name,
              amount: p.amount.toString(),
              status: p.status,
            })),
          })),
          playlists: playlists.map((p) => ({
            id: p.id, // ← this is Transaction.item_id when category=PLAYLIST
            name: p.name,
            tagline: p.tagline,
            slug_url: p.slug_url,
            status: p.status,
            price: p.price.toString(),
            tags: p.tags,
          })),
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
