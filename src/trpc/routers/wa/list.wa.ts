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
import { Prisma, WALeadStatus } from "@prisma/client";
import z from "zod";

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
    wa_get_unread_count(wa_conversations.id) AS unread_count,
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
        select: {
          full_name: true,
          phone_number: true,
          lead_status: true,
          winning_rate: true,
          note: true,
          last_read_id: true,
          user: {
            select: {
              full_name: true,
              email: true,
              phone_country: { omit: { id: true } },
              phone_number: true,
              avatar: true,
            },
          },
          handler: {
            select: { full_name: true, avatar: true },
          },
        },
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

      return {
        code: STATUS_OK,
        message: "Success",
        conv_full_name: waConversation.full_name,
        conv_phone_number: waConversation.phone_number,
        conv_lead_status: waConversation.lead_status,
        conv_winning_rate: waConversation.winning_rate,
        conv_note: waConversation.note,
        conv_last_read_id: waConversation.last_read_id,
        conv_user_full_name: waConversation.user?.full_name ?? null,
        conv_user_email: waConversation.user?.email ?? null,
        conv_user_phone_country: waConversation.user?.phone_country ?? null,
        conv_user_phone_number: waConversation.user?.phone_number ?? null,
        conv_user_avatar: waConversation.user?.avatar ?? null,
        conv_handler_full_name: waConversation.handler?.full_name ?? null,
        conv_handler_avatar: waConversation.handler?.avatar ?? null,
        list: waChatsList,
      };
    }),
};
