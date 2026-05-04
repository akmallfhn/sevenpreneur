import {
  Prisma,
  WAAssetType,
  WACDirection,
  WACStatus,
  WACType,
  WALeadStatus,
} from "@/generated/prisma/client";
import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsPosInt,
  stringIsNanoid,
  stringNotBlank,
} from "@/trpc/utils/validation";
import z from "zod";
import { convertToWhatsAppChatWithAttachment } from "./type.wa";

export const listWA = {
  conversations: administratorProcedure
    .input(
      z.object({
        full_name: stringNotBlank().optional(),
        lead_status: z.enum(WALeadStatus).optional(),
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        full_name: undefined as Optional<{
          contains: string;
          mode: "insensitive";
        }>,
        lead_status: undefined as Optional<WALeadStatus>,
      };
      let whereClauseSql = Prisma.sql`WHERE 1 = 1`;

      if (opts.input.full_name !== undefined) {
        whereClause.full_name = {
          contains: opts.input.full_name,
          mode: "insensitive",
        };
        const ilikeFullName = `%${opts.input.full_name}%`;
        whereClauseSql = Prisma.sql`
${whereClauseSql}
AND (
  wa_conversations.full_name ILIKE ${ilikeFullName} OR
  users.full_name ILIKE ${ilikeFullName}
)`;
      }

      if (opts.input.lead_status !== undefined) {
        whereClause.lead_status = opts.input.lead_status;
        whereClauseSql = Prisma.sql`
${whereClauseSql}
AND wa_conversations.lead_status = ${opts.input.lead_status.toLowerCase()}::wa_lead_status`;
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.wAConversation.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      type WAConvItem = {
        id: string;
        full_name: string;
        lead_status: WALeadStatus;
        last_message: string;
        last_message_at: Date;
        last_message_status: WACStatus | null;
        last_message_type: WACType;
        last_message_direction: WACDirection;
        unread_count: number;
        user_full_name?: string;
        user_avatar?: string;
      };
      const conversationList = await opts.ctx.prisma.$queryRaw<WAConvItem[]>`
SELECT *
FROM (
  SELECT DISTINCT ON (wa_conversations.id)
    wa_conversations.id, wa_conversations.full_name, wa_conversations.lead_status,
    wa_chats.message AS last_message, wa_chats.created_at AS last_message_at,
    wa_chats.status AS last_message_status, wa_chats.type AS last_message_type,
    wa_chats.direction AS last_message_direction,
    (
      SELECT COUNT(wc.id)
      FROM wa_chats wc
      WHERE wc.conv_id = wa_conversations.id AND wc.direction = 'inbound' AND wc.created_at > (
        SELECT COALESCE(wc2.created_at, '2000-01-01 00:00:00Z'::TIMESTAMPTZ)
        FROM wa_conversations wconv
        LEFT JOIN wa_chats wc2 ON wconv.last_read_id = wc2.id
        WHERE wconv.id = wa_conversations.id
        LIMIT 1
      )
    ) AS unread_count,
    users.full_name AS user_full_name, users.avatar AS user_avatar
  FROM wa_conversations
    LEFT JOIN wa_chats ON wa_conversations.id = wa_chats.conv_id
    LEFT JOIN users ON wa_conversations.user_id = users.id
  ${whereClauseSql}
  ORDER BY wa_conversations.id, wa_chats.created_at DESC
) AS t
ORDER BY last_message_at DESC`;

      const returnedList = conversationList.map((entry) => {
        entry.lead_status = entry.lead_status.toUpperCase() as WALeadStatus;
        entry.last_message_type =
          entry.last_message_type.toUpperCase() as WACType;
        entry.last_message_direction =
          entry.last_message_direction.toUpperCase() as WACDirection;
        if (entry.last_message_status) {
          entry.last_message_status =
            entry.last_message_status.toUpperCase() as WACStatus;
        }
        entry.unread_count = Number(entry.unread_count);
        return entry;
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        full_name: opts.input.full_name,
        lead_status: opts.input.lead_status,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  chats: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        size: numberIsPosInt().optional(),
        before: stringIsNanoid().optional(),
      })
    )
    .query(async (opts) => {
      const waConversation = await opts.ctx.prisma.wAConversation.findFirst({
        select: { id: true },
        where: { id: opts.input.conv_id },
      });
      if (!waConversation) {
        throw readFailedNotFound("conversation");
      }

      let lastTime: Optional<Date> = undefined;
      if (opts.input.before) {
        const lastChat = await opts.ctx.prisma.wAChat.findFirst({
          select: { created_at: true },
          where: { id: opts.input.before },
        });
        if (lastChat) {
          lastTime = lastChat.created_at;
        }
      }

      const waChatsList = await opts.ctx.prisma.wAChat.findMany({
        where: {
          conv_id: opts.input.conv_id,
          created_at: {
            lt: lastTime,
          },
        },
        orderBy: [{ created_at: "desc" }],
        take: opts.input.size,
      });

      const returnedList = convertToWhatsAppChatWithAttachment(waChatsList);

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  assets: administratorProcedure
    .input(
      z.object({
        type: z.enum(WAAssetType).optional(),
      })
    )
    .query(async (opts) => {
      const waAssetsList = await opts.ctx.prisma.wAAsset.findMany({
        where: {
          type: opts.input.type,
        },
        orderBy: [{ url: "asc" }],
      });

      const returnedList = waAssetsList.map((entry) => {
        const fileUrl = new URL(entry.url);
        const segments = fileUrl.pathname.split("/").filter(Boolean);
        const fileName = segments.length ? segments[segments.length - 1] : "";
        return {
          ...entry,
          file_name: fileName,
        };
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  alerts: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
      })
    )
    .query(async (opts) => {
      const waAlertList = await opts.ctx.prisma.wAAlert.findMany({
        select: {
          id: true,
          scheduled_at: true,
          status: true,
        },
        where: {
          conv_id: opts.input.conv_id,
        },
        orderBy: { scheduled_at: "asc" },
      });

      const returnedList = waAlertList.map((entry) => {
        return {
          id: entry.id,
          scheduled_at: entry.scheduled_at,
          status: entry.status,
        };
      });

      return {
        code: STATUS_OK,
        message: "Success",
        alerts: returnedList,
      };
    }),
};
