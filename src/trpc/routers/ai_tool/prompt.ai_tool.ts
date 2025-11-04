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
    sources: {
      source_name: string;
      source_url: string;
      source_publisher: string;
      source_year: number;
    }[];
    confidence_level: number;
    remarks: string;
  };
  SAM_insight: {
    SAM_size_estimate: AIMarketSize_SizeEstimate;
    ARPU_estimate: AIMarketSize_ARPUEstimate;
    SAM_value: number;
    remarks: string;
  };
  SOM_insight: {
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
        `4. Tentukan TAM size (besar/sedang/kecil) dan ARPU (average revenue per unit) (tinggi/sedang/rendah) berdasarkan ${customer_type}, market_need, dan regulation\n` +
        "5. Cantumkan TAM value berdasarkan deskripsi produk, market need, regulasi, dan geografi. Dapatkan dari sumber artikel paling kredibel (Statista, IBISWorld, McKinsey, World Bank, laporan pemerintah, dsb).\n" +
        "6. Tentukan confidence_level dalam skala 1-100 berdasarkan kualitas sumber, kejelasan data pasar, serta konsistensi antar variabel. Beri nilai dalam rentang 90-100 jika data berasal dari sumber kredibel dan perhitungan konsisten. Beri nilai dalam rentang 70-80 jika sebagian data diasumsikan tetapi masih logis. Beri nilai dalam rentang 50-60 jika data terbatas, perlu validasi lebih lanjut." +
        "7. Buat remarks singkat terkait populasi, pasar, regulasi, atau strategi go-to-market.\n" +
        "8. Buat SAM insight: perkirakan SAM_size_estimate, ARPU_estimate, dan SAM_value berdasarkan TAM value, area operasi perusahaan, dan channel penjualan.\n" +
        "9. Buat remarks tambahan untuk SAM yang menjelaskan pasar yang bisa dijangkau perusahaan dan strategi channel penjualan.\n" +
        "10. Validasi bahwa TAM ≥ SAM dan sesuaikan jika perlu." +
        "Output harus dalam format JSON seperti berikut:\n" +
        AIFormatOutputText({
          market_need: "<essential/niche/luxury>",
          regulation: "<unrestricted/restricted>",
          TAM_insight: {
            geography_scope: "<lokal/regional/global>",
            TAM_size_estimate: "<kecil/sedang/besar>",
            ARPU_estimate: "<rendah/sedang/tinggi>",
            TAM_value: "<estimasi nilai TAM setahun dalam Rupiah>",
            sources: [
              {
                source_name:
                  "<judul referensi artikel atau sumber data yang digunakan>",
                source_url:
                  "<url referensi artikel atau sumber data yang dipakai>",
                source_publisher:
                  "<lembaga penerbit dari referensi artikel atau sumber data>",
                source_year:
                  "tahun diterbitkannya referensi artikel atau sumber data",
              },
            ],
            confidence_level: "<estimasi nilai kredibilitas sumber data>",
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
          SOM_insight: {
            remarks:
              "<catatan tambahan terkait strategi kompetitif, kapasitas, atau tantangan penetrasi>",
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
            sources: z.array(
              z.object({
                source_name: z.string(),
                source_url: z.string(),
                source_publisher: z.string(),
                source_year: z.number(),
              })
            ),
            confidence_level: z.number(),
            remarks: z.string(),
          }),
          SAM_insight: z.object({
            SAM_size_estimate: z.enum(AIMarketSize_SizeEstimate),
            ARPU_estimate: z.enum(AIMarketSize_ARPUEstimate),
            SAM_value: z.number(),
            remarks: z.string(),
          }),
          SOM_insight: z.object({
            remarks: z.string(),
          }),
        })
      ),
    };
  },
};
