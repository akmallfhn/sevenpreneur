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
