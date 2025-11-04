import { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import { AIFormatOutputText, AIFormatOutputZod } from "./util.ai_tool";

// Idea Generation //

export interface AIResultIdeaGeneration extends JsonObject {
  idea: {
    idea_name: string;
    explanation: string;
  }[];
}

// Market Size //

export enum AIMarketSize_ProductType {
  DIGITAL = "digital",
  FISIK = "fisik",
  HYBRID = "hybrid",
}

export enum AIMarketSize_CustomerType {
  B2B = "B2B",
  B2C = "B2C",
  HYBRID = "hybrid",
}

export enum AIMarketSize_MarketNeed {
  ESSENTIAL = "essential",
  NICHE = "niche",
  LUXURY = "luxury",
}

export enum AIMarketSize_Regulation {
  UNRESTRICTED = "unrestricted",
  RESTRICTED = "restricted",
}

export enum AIMarketSize_GeographyScope {
  LOKAL = "lokal",
  REGIONAL = "regional",
  GLOBAL = "global",
}

export enum AIMarketSize_SizeEstimate {
  KECIL = "kecil",
  SEDANG = "sedang",
  BESAR = "besar",
}

export enum AIMarketSize_ARPUEstimate {
  RENDAH = "rendah",
  SEDANG = "sedang",
  TINGGI = "tinggi",
}

export interface AIResultMarketSize extends JsonObject {
  market_need: AIMarketSize_MarketNeed;
  regulation: AIMarketSize_Regulation;
  TAM_insight: {
    geography_scope: AIMarketSize_GeographyScope;
    TAM_size_estimate: AIMarketSize_SizeEstimate;
    ARPU_estimate: AIMarketSize_ARPUEstimate;
    TAM_value: number;
    source_url: string;
    remarks: string;
  };
  SAM_insight: {
    SAM_size_estimate: AIMarketSize_SizeEstimate;
    ARPU_estimate: AIMarketSize_ARPUEstimate;
    SAM_value: number;
    remarks: string;
  };
}

// Prompts //

export const aiToolPrompts = {
  ideaGeneration: (count: number) => {
    count = Math.max(0, Math.min(5, count));
    return {
      instructions:
        "Kamu adalah pebisnis handal dengan pengalaman 10+ tahun dalam konsultan bisnis, pengembangan bisnis, dan evaluasi peluang investasi bisnis." +
        `Berikan ${count} ide bisnis.` +
        "Output harus dalam format JSON seperti berikut:\n" +
        AIFormatOutputText({
          idea: [{ idea_name: "<nama ide>", explanation: "<penjelasan ide>" }],
        }),
      input: `Saya punya lahan 900 hektar di Kalimantan`,
      format: AIFormatOutputZod(
        "respons_ide_bisnis",
        z.object({
          idea: z
            .array(
              z.object({
                idea_name: z.string(),
                explanation: z.string(),
              })
            )
            .length(count),
        })
      ),
    };
  },

  marketSize: (
    additional_persona: string,
    product_name: string,
    description: string,
    product_type: AIMarketSize_ProductType,
    customer_type: AIMarketSize_CustomerType,
    company_operating_area: string,
    sales_channel: string
  ) => {
    return {
      instructions:
        `Kamu adalah analis pasar cerdas dengan pengalaman 10+ tahun dalam analisis pasar global, pengembangan bisnis, dan evaluasi peluang investasi. Kamu mahir menggabungkan data kuantitatif dan wawasan industri untuk memberikan estimasi TAM (total addressable market) yang realistis, analisis regulasi yang akurat, serta rekomendasi strategi pasar yang actionable. ${additional_persona}\n` +
        "Tugasmu:\n" +
        "1. Analisis market_need: apakah produk ini essential, niche, atau luxury.\n" +
        "2. Analisis regulasi: apakah industri dibatasi hukum atau tidak.\n" +
        `3. Tentukan geografi pasar (lokal/regional/global) berdasarkan ${product_type}.\n` +
        "4. Tentukan TAM size (besar/sedang/kecil) dan ARPU (average revenue per unit) (tinggi/sedang/rendah) berdasarkan tipe pelanggan, market_need, dan regulation\n" +
        "5. Cantumkan TAM value berdasarkan deskripsi produk, market need, regulasi, dan geografi. Dapatkan dari sumber artikel paling kredibel.\n" +
        "6. Buat remarks singkat terkait populasi, pasar, regulasi, atau strategi go-to-market.\n" +
        "7. Buat SAM insight: perkirakan SAM_size_estimate, ARPU_estimate, dan SAM_value berdasarkan TAM value, area operasi perusahaan, dan channel penjualan.\n" +
        "8. Buat remarks tambahan untuk SAM yang menjelaskan pasar yang bisa dijangkau perusahaan dan strategi channel penjualan.\n" +
        "Output harus dalam format JSON seperti berikut:\n" +
        AIFormatOutputText({
          market_need: "<essential/niche/luxury>",
          regulation: "<unrestricted/restricted>",
          TAM_insight: {
            geography_scope: "<lokal/regional/global>",
            TAM_size_estimate: "<kecil/sedang/besar>",
            ARPU_estimate: "<rendah/sedang/tinggi>",
            TAM_value: "<estimasi nilai TAM setahun dalam Rupiah>",
            source_url: "<referensi artikel atau sumber data yang dipakai>",
            remarks:
              "<catatan tambahan terkait populasi, pasar, regulasi, atau strategi go-to-market>",
          },
          SAM_insight: {
            SAM_size_estimate: "<kecil/sedang/besar>",
            ARPU_estimate: "<rendah/sedang/tinggi>",
            SAM_value:
              "<estimasi nilai SAM setahun dalam Rupiah berdasarkan TAM value, area operasi, dan sales channels>",
            remarks:
              "<catatan tambahan terkait pasar terjangkau perusahaan dan strategi channel penjualan>",
          },
        }),
      input:
        "Data produk:\n" +
        `- Nama: ${product_name}\n` +
        `- Deskripsi: ${description}\n` +
        `- Jenis produk/layanan: ${product_type}\n` +
        `- Tipe pelanggan: ${customer_type}\n` +
        `- Area operasi perusahaan: ${company_operating_area}\n` +
        `- Channel penjualan: ${sales_channel}`,
      format: AIFormatOutputZod(
        "respons_ukuran_pasar",
        z.object({
          market_need: z.enum(AIMarketSize_MarketNeed),
          regulation: z.enum(AIMarketSize_Regulation),
          TAM_insight: z.object({
            geography_scope: z.enum(AIMarketSize_GeographyScope),
            TAM_size_estimate: z.enum(AIMarketSize_SizeEstimate),
            ARPU_estimate: z.enum(AIMarketSize_ARPUEstimate),
            TAM_value: z.number(),
            source_url: z.string(),
            remarks: z.string(),
          }),
          SAM_insight: z.object({
            SAM_size_estimate: z.enum(AIMarketSize_SizeEstimate),
            ARPU_estimate: z.enum(AIMarketSize_ARPUEstimate),
            SAM_value: z.number(),
            remarks: z.string(),
          }),
        })
      ),
    };
  },
};
