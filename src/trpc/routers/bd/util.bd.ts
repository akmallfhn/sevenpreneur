import { STATUS_BAD_REQUEST } from "@/lib/status_code";
import { TRPCError } from "@trpc/server";
import { parse as csvParse } from "csv-parse/sync";

export type RevenueByX = { name: string; amount: number };

export function ParseRevenueCSV(
  csv_text: string,
  product_column: string,
  channel_column: string,
  amount_column: string
) {
  const records = csvParse(csv_text, {
    columns: true,
    skip_empty_lines: true,
  }) as { [key: string]: string }[];
  if (records.length <= 0) {
    throw new TRPCError({
      code: STATUS_BAD_REQUEST,
      message: "Submitted CSV has no data rows.",
    });
  }
  if (!Object.prototype.hasOwnProperty.call(records[0], product_column)) {
    throw new TRPCError({
      code: STATUS_BAD_REQUEST,
      message: "Column " + product_column + " doesn't exist.",
    });
  }
  if (!Object.prototype.hasOwnProperty.call(records[0], channel_column)) {
    throw new TRPCError({
      code: STATUS_BAD_REQUEST,
      message: "Column " + channel_column + " doesn't exist.",
    });
  }
  if (!Object.prototype.hasOwnProperty.call(records[0], amount_column)) {
    throw new TRPCError({
      code: STATUS_BAD_REQUEST,
      message: "Column " + amount_column + " doesn't exist.",
    });
  }

  let totalAmount = 0;
  const byChannelMap = {} as { [key: string]: number };
  const byProductMap = {} as { [key: string]: number };

  for (const record of records) {
    const amount = Number(record[amount_column]);
    totalAmount += amount;
    byProductMap[record[product_column]] =
      (byProductMap[record[product_column]] || 0) + amount;
    byChannelMap[record[channel_column]] =
      (byChannelMap[record[channel_column]] || 0) + amount;
  }

  const byProduct = [] as RevenueByX[];
  Object.keys(byProductMap).forEach((key) => {
    byProduct.push({ name: key, amount: byProductMap[key] });
  });

  const byChannel = [] as RevenueByX[];
  Object.keys(byChannelMap).forEach((key) => {
    byChannel.push({ name: key, amount: byChannelMap[key] });
  });

  return {
    total_amount: totalAmount,
    by_product: byProduct,
    by_channel: byChannel,
  };
}
