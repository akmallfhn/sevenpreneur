import GetPrismaClient from "@/lib/prisma";
import { WACDirection, WACSenderType } from "@prisma/client";
import { WhatsAppWebhookMessageStatusType } from "./type.wa.webhook";

async function getOrCreateConversation(
  prisma: ReturnType<typeof GetPrismaClient>,
  full_name: string,
  phone_number: string
) {
  let waConversation = await prisma.wAConversation.findFirst({
    select: { id: true, full_name: true },
    where: { phone_number: phone_number },
  });

  if (!waConversation) {
    const createdConversation = await prisma.wAConversation.create({
      data: {
        full_name: full_name,
        phone_number: phone_number,
      },
    });
    waConversation = await prisma.wAConversation.findFirst({
      select: { id: true, full_name: true },
      where: { id: createdConversation.id },
    });
    if (!waConversation) {
      console.error("Failed to create a new conversation.");
      return undefined;
    }
  }

  return waConversation;
}

export async function appendChatFromUser(
  prisma: ReturnType<typeof GetPrismaClient>,
  full_name: string,
  phone_number: string,
  wam_id: string,
  message: string,
  created_at: string
) {
  const waConversation = await getOrCreateConversation(
    prisma,
    full_name,
    phone_number
  );
  if (!waConversation) {
    return false;
  }
  if (full_name !== waConversation.full_name) {
    const updatedConversation = await prisma.wAConversation.updateManyAndReturn(
      {
        data: { full_name: full_name },
        where: { id: waConversation.id },
      }
    );
    if (updatedConversation.length != 1) {
      console.error("Failed to update conversation.");
    }
  }

  const createdAtAsDate = new Date(Number(created_at) * 1e3); // from seconds to ms
  const createdChat = await prisma.wAChat.create({
    data: {
      conv_id: waConversation.id,
      wam_id: wam_id,
      direction: WACDirection.INBOUND,
      sender_type: WACSenderType.USER,
      message: message,
      created_at: createdAtAsDate,
    },
  });
  if (!createdChat) {
    console.error("Failed to create a new chat.");
    return false;
  }

  return true;
}

export async function updateStatusByMessageID(
  prisma: ReturnType<typeof GetPrismaClient>,
  phone_number: string,
  wam_id: string,
  status: WhatsAppWebhookMessageStatusType,
  updated_at: string
) {
  const updatedAtAsDate = new Date(Number(updated_at) * 1e3); // from seconds to ms

  let waChat = await prisma.wAChat.findFirst({
    select: { id: true },
    where: { wam_id: wam_id },
  });
  if (!waChat) {
    const waConversation = await getOrCreateConversation(
      prisma,
      "",
      phone_number
    );
    if (!waConversation) {
      return false;
    }

    const createdChat = await prisma.wAChat.create({
      data: {
        conv_id: waConversation.id,
        wam_id: wam_id,
        direction: WACDirection.OUTBOUND,
        sender_type: WACSenderType.ADMIN,
        message: "",
        created_at: updatedAtAsDate,
      },
    });
    waChat = await prisma.wAChat.findFirst({
      select: { id: true },
      where: { id: createdChat.id },
    });
    if (!waChat) {
      console.error("Failed to create a new chat.");
      return undefined;
    }
  }

  const updateChatData = {} as {
    sent_at?: Date;
    delivered_at?: Date;
    read_at?: Date;
    failed_at?: Date;
  };
  switch (status) {
    case "sent":
      updateChatData["sent_at"] = updatedAtAsDate;
      break;
    case "delivered":
      updateChatData["delivered_at"] = updatedAtAsDate;
      break;
    case "read":
    case "played":
      updateChatData["read_at"] = updatedAtAsDate;
      break;
    case "failed":
      updateChatData["failed_at"] = updatedAtAsDate;
      break;
    default:
      console.error("Unknown message status type.");
      return false;
  }
  const updatedChat = await prisma.wAChat.updateManyAndReturn({
    data: updateChatData,
    where: { id: waChat.id },
  });
  if (updatedChat.length != 1) {
    console.error("Failed to update chat.");
    return false;
  }

  return true;
}
