import GetPrismaClient from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { WhatsappAttachmentImage } from "@/lib/whatsapp-types";

export async function processImageMessage(
  wam_id: string,
  media_id: string,
  attachment: WhatsappAttachmentImage
) {
  try {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    // 1. Fetch media URL from WhatsApp Graph API
    const mediaRes = await fetch(
      `https://graph.facebook.com/v21.0/${media_id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!mediaRes.ok) {
      console.error(
        `[WA Image] Failed to fetch media URL for ${media_id}: ${mediaRes.statusText}`
      );
      return;
    }
    const mediaData: { url: string; mime_type: string } = await mediaRes.json();
    const { url: mediaUrl, mime_type: mimeType } = mediaData;

    // 2. Download binary from WhatsApp CDN
    const binaryRes = await fetch(mediaUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!binaryRes.ok) {
      console.error(
        `[WA Image] Failed to download binary for ${media_id}: ${binaryRes.statusText}`
      );
      return;
    }
    const binary = await binaryRes.arrayBuffer();

    // 3. Upload to Supabase storage under whatsapp/ folder
    const ext = mimeType.split("/")[1] || "jpg";
    const filePath = `whatsapp/images/${Date.now()}_${media_id}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("sevenpreneur")
      .upload(filePath, binary, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadError) {
      console.error(
        `[WA Image] Supabase upload error for ${media_id}: ${uploadError.message}`
      );
      return;
    }

    // 4. Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("sevenpreneur")
      .getPublicUrl(filePath);
    const storageUrl = publicUrlData.publicUrl;

    // 5. Update attachment in DB with storage_url
    const prisma = GetPrismaClient();
    await prisma.wAChat.updateMany({
      data: {
        attachment: {
          ...attachment,
          storage_url: storageUrl,
        },
      },
      where: { wam_id },
    });

    console.log(
      `[WA Image] Successfully processed image for wam_id ${wam_id}: ${storageUrl}`
    );
  } catch (err) {
    console.error(
      `[WA Image] Unexpected error processing image for wam_id ${wam_id}:`,
      err
    );
  }
}
