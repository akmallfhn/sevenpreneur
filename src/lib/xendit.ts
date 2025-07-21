import https from "https";

export type XenditCreateInvoiceRequestParameters = {
  external_id: string;
  amount: number;
  description: string;
  invoice_duration: number;
  success_redirect_url: string;
  failure_redirect_url: string;
  payment_methods: string[];
  currency: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};

export type XenditExpireInvoiceRequestParameters = {
  invoice_id: string;
};

export type XenditInvoiceResponse = {
  id: string;
  external_id: string;
  status: "PENDING" | "PAID" | "EXPIRED";
  expiry_date: string;
  invoice_url: string;
};

type XenditRequestParameters = XenditCreateInvoiceRequestParameters | object;
type XenditResponse = XenditInvoiceResponse & object;

export type XenditInvoiceCallback = {
  external_id: string;
  status: "PAID" | "EXPIRED";
  paid_at: string;
  payment_method: string;
  payment_channel: string;
};

export const xenditRequestCreateInvoice = (
  params: XenditCreateInvoiceRequestParameters
): Promise<XenditInvoiceResponse> => {
  return xenditRequest("https://api.xendit.co/v2/invoices", params);
};

export const xenditRequestExpireInvoice = (
  params: XenditExpireInvoiceRequestParameters
): Promise<XenditInvoiceResponse> => {
  return xenditRequest(
    `https://api.xendit.co/invoices/${params.invoice_id}/expire!`,
    {} // no parameter
  );
};

const xenditRequest = (
  endpoint: string,
  params: XenditRequestParameters
): Promise<XenditResponse> => {
  return new Promise((resolve, reject) => {
    const xenditRequestBody = JSON.stringify(params);
    const xenditAuthString = Buffer.from(
      process.env.XENDIT_API_KEY + ":" // only username, no password
    ).toString("base64");

    const xenditRequestOptions: https.RequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(xenditRequestBody),
        Authorization: "Basic " + xenditAuthString,
      },
    };

    const xenditReq = https.request(endpoint, xenditRequestOptions, (res) => {
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
    });

    xenditReq.on("error", (e) => {
      reject(e);
    });

    xenditReq.write(xenditRequestBody);
    xenditReq.end();
  });
};
