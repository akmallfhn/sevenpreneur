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

// https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/text-messages/?locale=en_US
export const whatsappMessageRequest = (
  userPhoneNumber: string,
  message: string
): Promise<WhatsappMessageResponse> => {
  return new Promise((resolve, reject) => {
    const whatsappRequestBody = JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: userPhoneNumber,
      type: "text",
      text: {
        preview_url: true,
        body: message,
      },
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
