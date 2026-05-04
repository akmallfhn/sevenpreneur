import {
  WACDirection,
  WACSenderType,
  WACStatus,
  WACType,
  WAMode,
} from "@/generated/prisma/client";
import GetPrismaClient from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import {
  whatsappDownloadMediaRequest,
  whatsappGetMediaURLRequest,
} from "@/lib/whatsapp";
import { WhatsappAttachmentAllTypes } from "@/lib/whatsapp-types";
import { WhatsAppWebhookMessageStatusType } from "./type.wa.webhook";

async function getOrCreateConversation(
  prisma: ReturnType<typeof GetPrismaClient>,
  full_name: string,
  phone_number: string
) {
  let waConversation = await prisma.wAConversation.findFirst({
    select: { id: true, full_name: true, mode: true },
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
      select: { id: true, full_name: true, mode: true },
      where: { id: createdConversation.id },
    });
    if (!waConversation) {
      console.error("whatsapp.webhook: Failed to create a new conversation.");
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
  type: WACType,
  message: string,
  attachment: WhatsappAttachmentAllTypes,
  created_at: string
): Promise<{ conv_id: string; mode: WAMode } | false> {
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
      console.error("whatsapp.webhook: Failed to update conversation.");
    }
  }

  const createdAtAsDate = new Date(Number(created_at) * 1e3); // from seconds to ms
  const createdChat = await prisma.wAChat.create({
    data: {
      conv_id: waConversation.id,
      wam_id: wam_id,
      direction: WACDirection.INBOUND,
      sender_type: WACSenderType.USER,
      type: type,
      message: message,
      attachment: attachment,
      created_at: createdAtAsDate,
    },
  });
  if (!createdChat) {
    console.error("whatsapp.webhook: Failed to create a new chat.");
    return false;
  }

  return { conv_id: waConversation.id, mode: waConversation.mode };
}

export async function triggerLangGraphAgent(payload: {
  conv_id: string;
  wam_id: string;
  direction: string;
  sender_type: string;
  type: string;
  message: string;
  attachment: object | null;
  sent_at: string | null;
}) {
  const agentUrl = process.env.AGENT_URL;
  const agentSecretKey = process.env.AGENT_SECRET_KEY;
  if (!agentUrl || !agentSecretKey) {
    console.error(
      "whatsapp.webhook: AGENT_URL or AGENT_SECRET_KEY not configured."
    );
    return;
  }
  try {
    await fetch(`${agentUrl}/api/v1/messages/incoming`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${agentSecretKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("whatsapp.webhook: Failed to trigger LangGraph agent.", e);
  }
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
        type: WACType.TEXT,
        message: "",
        created_at: updatedAtAsDate,
      },
    });
    waChat = await prisma.wAChat.findFirst({
      select: { id: true },
      where: { id: createdChat.id },
    });
    if (!waChat) {
      console.error("whatsapp.webhook: Failed to create a new chat.");
      return undefined;
    }
  }

  const updateChatData = { status: null } as {
    status: WACStatus | null;
    sent_at?: Date;
    delivered_at?: Date;
    read_at?: Date;
    failed_at?: Date;
  };
  switch (status) {
    case "sent":
      updateChatData["status"] = WACStatus.SENT;
      updateChatData["sent_at"] = updatedAtAsDate;
      break;
    case "delivered":
      updateChatData["status"] = WACStatus.DELIVERED;
      updateChatData["delivered_at"] = updatedAtAsDate;
      break;
    case "read":
    case "played":
      updateChatData["status"] = WACStatus.READ;
      updateChatData["read_at"] = updatedAtAsDate;
      break;
    case "failed":
      updateChatData["status"] = WACStatus.FAILED;
      updateChatData["failed_at"] = updatedAtAsDate;
      break;
    default:
      console.error("whatsapp.webhook: Unknown message status type.");
      return false;
  }
  const updatedChat = await prisma.wAChat.updateManyAndReturn({
    data: updateChatData,
    where: { id: waChat.id },
  });
  if (updatedChat.length != 1) {
    console.error("whatsapp.webhook: Failed to update chat.");
    return false;
  }

  return true;
}

export async function saveWhatsappAttachment(
  prisma: ReturnType<typeof GetPrismaClient>,
  media_type: "audio" | "document" | "image" | "sticker" | "video",
  attachment: object & { id: string },
  wam_id: string
) {
  const getMediaURL = await whatsappGetMediaURLRequest(attachment.id);
  const fileBuffer = await whatsappDownloadMediaRequest(getMediaURL.url);

  const fileExt = getMediaURL.mime_type.split("/")[1] || "bin";
  const fileName = `${Date.now()}_${attachment.id}.${fileExt}`;
  const filePath = `whatsapp/${media_type}s/${fileName}`;
  const { error } = await supabase.storage
    .from("sevenpreneur")
    .upload(filePath, fileBuffer, {
      contentType: getMediaURL.mime_type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("whatsapp.webhook: Supabase upload error:", error.message);
  }

  const { data } = supabase.storage.from("sevenpreneur").getPublicUrl(filePath);

  const updatedChat = await prisma.wAChat.updateManyAndReturn({
    data: {
      attachment: {
        ...attachment,
        storage_url: data.publicUrl,
      },
    },
    where: { wam_id: wam_id },
  });
  if (updatedChat.length != 1) {
    console.error("whatsapp.webhook: Failed to update chat.");
    return false;
  }
}
