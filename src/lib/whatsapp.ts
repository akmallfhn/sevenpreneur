import https from "https";

export type WhatsappMessageResponse = {
  messaging_product: "whatsapp";
  contacts: {
    input: string;
    wa_id: string;
  }[];
  messages: {
    id: string;
  }[];
};

const whatsappMessageRequest = (
  userPhoneNumber: string,
  type: "text" | "audio" | "document" | "image" | "sticker" | "video",
  payload: object
): Promise<WhatsappMessageResponse> => {
  return new Promise((resolve, reject) => {
    const whatsappRequestBody = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: userPhoneNumber,
      type: type,
      ...payload,
    });

    const whatsappRequestOptions: https.RequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(whatsappRequestBody),
        Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
      },
    };

    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const whatsappReq = https.request(
      `https://graph.facebook.com/v23.0/${whatsappPhoneNumberId}/messages`,
      whatsappRequestOptions,
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    whatsappReq.on("error", (e) => {
      reject(e);
    });

    whatsappReq.write(whatsappRequestBody);
    whatsappReq.end();
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/text-messages/?locale=en_US
export const whatsappTextMessageRequest = (
  userPhoneNumber: string,
  message: string
) => {
  return whatsappMessageRequest(userPhoneNumber, "text", {
    text: {
      preview_url: true,
      body: message,
    },
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/audio-messages/?locale=en_US
export const whatsappAudioMessageRequest = (
  userPhoneNumber: string,
  audioUrl: string,
  isVoice: boolean
) => {
  return whatsappMessageRequest(userPhoneNumber, "audio", {
    audio: {
      link: audioUrl,
      voice: isVoice,
    },
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/document-messages/?locale=en_US
export const whatsappDocumentMessageRequest = (
  userPhoneNumber: string,
  documentUrl: string,
  caption: string,
  fileName: string
) => {
  return whatsappMessageRequest(userPhoneNumber, "document", {
    document: {
      link: documentUrl,
      caption: caption,
      filename: fileName,
    },
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/image-messages/?locale=en_US
export const whatsappImageMessageRequest = (
  userPhoneNumber: string,
  imageUrl: string,
  caption: string
) => {
  return whatsappMessageRequest(userPhoneNumber, "image", {
    image: {
      link: imageUrl,
      caption: caption,
    },
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/sticker-messages/?locale=en_US
export const whatsappStickerMessageRequest = (
  userPhoneNumber: string,
  stickerUrl: string
) => {
  return whatsappMessageRequest(userPhoneNumber, "sticker", {
    sticker: {
      link: stickerUrl,
    },
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/video-messages/?locale=en_US
export const whatsappVideoMessageRequest = (
  userPhoneNumber: string,
  videoUrl: string,
  caption: string
) => {
  return whatsappMessageRequest(userPhoneNumber, "video", {
    video: {
      link: videoUrl,
      caption: caption,
    },
  });
};

export type WhatsappGetMediaURLResponse = {
  messaging_product: "whatsapp";
  url: string;
  mime_type: string;
  sha256: string;
  file_size: string;
  id: string;
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media/?locale=en_US#get-media-url
export const whatsappGetMediaURLRequest = (
  mediaID: string
): Promise<WhatsappGetMediaURLResponse> => {
  return new Promise((resolve, reject) => {
    const whatsappRequestOptions: https.RequestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
      },
    };

    const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const whatsappReq = https.request(
      `https://graph.facebook.com/v23.0/${mediaID}/?phone_number_id=${whatsappPhoneNumberId}`,
      whatsappRequestOptions,
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    whatsappReq.on("error", (e) => {
      reject(e);
    });

    whatsappReq.end();
  });
};

// https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/media/?locale=en_US#download-media
export const whatsappDownloadMediaRequest = (
  mediaURL: string
): Promise<Buffer<ArrayBuffer>> => {
  return new Promise((resolve, reject) => {
    const whatsappRequestOptions: https.RequestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + process.env.WHATSAPP_ACCESS_TOKEN,
      },
    };

    const whatsappReq = https.request(
      mediaURL,
      whatsappRequestOptions,
      (res) => {
        const chunks: Uint8Array<ArrayBufferLike>[] = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", async () => {
          try {
            const fileBuffer = Buffer.concat(chunks);
            resolve(fileBuffer);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    whatsappReq.on("error", (e) => {
      reject(e);
    });

    whatsappReq.end();
  });
};
