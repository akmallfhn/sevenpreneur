import { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import {
  AIIdeaValidation_BusinessAlignment,
  AIIdeaValidation_ProblemFreq,
  AIMarketSize_ARPUEstimate,
  AIMarketSize_CustomerType,
  AIMarketSize_GeographyScope,
  AIMarketSize_MarketNeed,
  AIMarketSize_ProductType,
  AIMarketSize_Regulation,
  AIMarketSize_SizeEstimate,
} from "./enum.ai_tool";
import { AIFormatOutputText, AIFormatOutputZod } from "./util.ai_tool";

// Idea Generation //

export interface AIResultIdeaGeneration extends JsonObject {
  idea: {
    idea_name: string;
    explanation: string;
  }[];
}

// Market Size //

export interface AIResultMarketSize extends JsonObject {
  product_name: string;
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
    SOM_value: string;
    remarks: string;
  };
}

// Idea Validation //

export interface AIResultIdeaValidation extends JsonObject {
  problem_validation: {
    discovery: string;
    sources: {
      source_name: string;
      source_url: string;
      source_publisher: string;
      source_year: number;
    }[];
    confidence_level: number;
    affected_users: {
      percentage: number;
      segment: string;
      segment_description: string;
    }[];
    frequency: AIIdeaValidation_ProblemFreq;
  };
  key_factors: {
    PESTEL_factor: string;
    root_cause: string;
  };
  sustainability_and_longevity: {
    business_alignment: AIIdeaValidation_BusinessAlignment;
    reason: string;
    future_prospect: {
      industry_direction: string;
      technology_influence: string;
      forecast_summary: string;
    };
    scalability_potential: {
      is_scalable: boolean;
      scaling_factors: string;
      barriers: string;
    };
  };
  idea_refinement: {
    market_alignment_suggestions: string;
    competitive_advantage_suggestions: string;
    pivot_opportunities: {
      pivot_direction: string;
      reason: string;
    }[];
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
        "7. Buat remarks TAM terkait insight populasi, pasar, regulasi, dan anjuran strategi go-to-market.\n" +
        "8. Buat SAM insight: perkirakan SAM_size_estimate, ARPU_estimate, dan SAM_value berdasarkan TAM value, area operasi perusahaan, dan channel penjualan.\n" +
        "9. Buat remarks SAM terkait insight yang menjelaskan pasar yang bisa dijangkau perusahaan dan anjuran strategi channel penjualan.\n" +
        "10. Validasi bahwa TAM ≥ SAM dan sesuaikan jika perlu." +
        "11. Tentukan estimasi SOM_value yang nilainya sekitar 1-2% dari total nilai SAM" +
        "12. Buat remarks SOM terkait anjuran strategi kompetitif, kapasitas, atau tantangan penetrasi" +
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
              "<catatan tambahan terkait populasi, pasar, regulasi, atau strategi go-to-market. Beri jeda 2 spasi jika ingin membuat paragraf baru agar mudah dibaca>",
          },
          SAM_insight: {
            SAM_size_estimate: "<kecil/sedang/besar>",
            ARPU_estimate: "<rendah/sedang/tinggi>",
            SAM_value:
              "<estimasi nilai SAM setahun dalam Rupiah berdasarkan TAM value, area operasi, dan sales channels>",
            remarks:
              "<catatan tambahan terkait keterjangkauan pasar dan strategi channel penjualan. Beri jeda 2 spasi jika ingin membuat paragraf baru agar mudah dibaca>",
          },
          SOM_insight: {
            SOM_value:
              "estimasi nilai SOM dalam Rupiah, berkisar antara 1-2% dari SAM_value",
            remarks:
              "<catatan tambahan terkait strategi kompetitif, kapasitas, atau tantangan penetrasi. Beri jeda 2 spasi jika ingin membuat paragraf baru agar mudah dibaca>",
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
            SOM_value: z.number(),
            remarks: z.string(),
          }),
        })
      ),
    };
  },

  ideaValidation: (
    problem: string,
    location: string,
    ideation: string,
    resources: string
  ) => {
    return {
      instructions:
        "Kamu adalah seorang business coach & market strategist berpengalaman yang membantu founder dan tim startup dalam memvalidasi ide bisnis mereka secara sistematis.\n" +
        "Kamu berpikir analitis seperti consultant McKinsey, tapi berkomunikasi seperti mentor yang membimbing dengan empati dan berbasis data.\n" +
        "Tugasmu:\n" +
        "1. Evaluasi apakah problem yang disebutkan oleh user benar-benar relevan dan sering terjadi di masyarakat.\n" +
        "2. Carilah konteks publik seperti tren diskusi online/laporan riset/publikasi media yang mendukung.\n" +
        "3. Tentukan confidence_level dalam skala 1-100 berdasarkan kualitas sumber, kejelasan data, serta konsistensi antarvariabel. Beri nilai dalam rentang 90-100 jika data berasal dari sumber kredibel dan perhitungan konsisten. Beri nilai dalam rentang 70-80 jika sebagian data diasumsikan tetapi masih logis. Beri nilai dalam rentang 50-60 jika data terbatas, perlu validasi lebih lanjut.\n" +
        "4. Estimasikan siapa target pengguna yang paling terdampak dan seberapa besar skalanya.\n" +
        "5. Jelaskan faktor sosial/ekonomi/teknologi/perilaku/regulasi yang berpengaruh terhadap masalah tersebut.\n" +
        "6. Sebutkan akar penyebab dan hambatan potensial dalam masalah ini.\n" +
        "7. Tentukan apakah ide ini termasuk tren jangka pendek atau kebutuhan jangka panjang.\n" +
        "8. Berikan pandangan tentang prospek ide dalam 1–3 tahun ke depan berdasarkan arah industri dan teknologi.\n" +
        "9. Nilai potensi skalabilitas (apakah bisa dikembangkan ke pasar lain atau dimonetisasi).\n" +
        "10. Berikan rekomendasi konkrit untuk memperkuat ide dari sisi produk/positioning/monetisasi.\n" +
        "11. Tambahkan saran competitive advantage agar ide ini lebih unggul di pasar.\n" +
        "12. Jika perlu, berikan saran pivot yang lebih menjanjikan berdasarkan tren pasar.\n" +
        "Output harus dalam format JSON seperti berikut:\n" +
        AIFormatOutputText({
          problem_validation: {
            discovery:
              "<analisis seberapa relevan dan nyata problem yang disebut user berdasarkan data publik/tren sosial/perilaku pasar>",
            sources: [
              {
                source_name:
                  "<nama sumber data atau publikasi yang mendukung validasi problem>",
                source_url: "<tautan sumber data>",
                source_publisher: "<pihak penerbit atau lembaga riset>",
                source_year: "<tahun publikasi sumber>",
              },
            ],
            confidence_level: "<estimasi tingkat kepercayaan validasi data>",
            affected_users: [
              {
                percentage:
                  "<estimasi proporsi pengguna yang terdampak oleh problem, dalam persen>",
                segment:
                  "<kelompok pengguna utama yang paling terdampak, misal UMKM digital, mahasiswa, ibu rumah tangga, pekerja remote>",
                segment_description:
                  "<deskripsi perilaku, kebutuhan, dan pain point dari segmen pengguna tersebut>",
              },
            ],
            frequency:
              "<low/medium/high — tingkat frekuensi munculnya masalah di ranah publik>",
          },
          key_factors: {
            PESTEL_factor:
              "<faktor sosial, ekonomi, teknologi, perilaku, lingkungan, atau regulasi yang memengaruhi problem, misal adopsi teknologi meningkat, regulasi e-commerce, perubahan gaya hidup digital>",
            root_cause:
              "<akar penyebab utama dari masalah dan potensi hambatan saat menyelesaikannya, misal kurangnya literasi digital, biaya tinggi, infrastruktur belum memadai>",
          },
          sustainability_and_longevity: {
            business_alignment:
              "<longevity/short-term/seasonal — klasifikasi apakah ide ini berkelanjutan, hanya tren sementara, atau musiman>",
            reason:
              "<penjelasan logis alasan ide ini diprediksi berkelanjutan atau tidak>",
            future_prospect: {
              industry_direction:
                "<deskripsi arah perkembangan industri dalam 1–3 tahun ke depan yang relevan dengan ide, misal automasi AI, sustainable economy, digital health>",
              technology_influence:
                "<dampak inovasi teknologi peluang ide ini, misal mempermudah adopsi/menggantikan model bisnis lama/menambah efisiensi>",
              forecast_summary:
                "<ringkasan prospek ide: apakah akan tumbuh/stagnan/menurun dalam jangka 1–3 tahun>",
            },
            scalability_potential: {
              is_scalable:
                "<true/false — apakah ide ini dapat dikembangkan ke pasar lain atau dimonetisasi dengan mudah>",
              scaling_factors:
                "<faktor pendukung skalabilitas, misal: model bisnis digital, kemudahan replikasi, demand lintas pasar>",
              barriers: "<hambatan potensial pertumbuhan ide>",
            },
          },
          idea_refinement: {
            market_alignment_suggestions:
              "<saran penyempurnaan ide agar lebih fit dengan kebutuhan pasar>",
            competitive_advantage_suggestions:
              "<rekomendasi cara memperkuat keunggulan kompetitif>",
            pivot_opportunities: [
              {
                pivot_direction:
                  "<arah pivot yang lebih menjanjikan berdasarkan tren>",
                reason: "<alasan logis pivot ini lebih potensial>",
              },
            ],
          },
        }),
      input:
        "Ide bisnis\n" +
        `- Masalah yang dialami: ${problem}\n` +
        `- Lokasi masalah: ${location}\n` +
        `- Alternatif solusi yang ditawarkan: ${ideation}\n` +
        `- Sumber daya yang dimiliki: ${resources}\n`,
      format: AIFormatOutputZod(
        "respons_validasi_ide",
        z.object({
          problem_validation: z.object({
            discovery: z.string(),
            sources: z.array(
              z.object({
                source_name: z.string(),
                source_url: z.string(),
                source_publisher: z.string(),
                source_year: z.number(),
              })
            ),
            confidence_level: z.number(),
            affected_users: z.array(
              z.object({
                percentage: z.number(),
                segment: z.string(),
                segment_description: z.string(),
              })
            ),
            frequency: z.enum(AIIdeaValidation_ProblemFreq),
          }),
          key_factors: z.object({
            PESTEL_factor: z.string(),
            root_cause: z.string(),
          }),
          sustainability_and_longevity: z.object({
            business_alignment: z.enum(AIIdeaValidation_BusinessAlignment),
            reason: z.string(),
            future_prospect: z.object({
              industry_direction: z.string(),
              technology_influence: z.string(),
              forecast_summary: z.string(),
            }),
            scalability_potential: z.object({
              is_scalable: z.boolean(),
              scaling_factors: z.string(),
              barriers: z.string(),
            }),
          }),
          idea_refinement: z.object({
            market_alignment_suggestions: z.string(),
            competitive_advantage_suggestions: z.string(),
            pivot_opportunities: z.array(
              z.object({
                pivot_direction: z.string(),
                reason: z.string(),
              })
            ),
          }),
        })
      ),
    };
  },

  generateTitle: (message: string) => {
    return {
      instructions:
        "Tulis judul secara singkat dari pesan yang diberikan. " +
        "Gunakan format JSON berikut untuk menjawab:\n" +
        AIFormatOutputText({
          title: "<judul singkat dari isi pesan>",
        }),
      input: `Isi pesan: ${message}`,
      format: AIFormatOutputZod(
        "respons_judul_pesan",
        z.object({
          title: z.string(),
        })
      ),
    };
  },

  sendChat: {
    instruction:
      "Kamu adalah pebisnis handal dengan pengalaman 10+ tahun dalam konsultan bisnis, pengembangan bisnis, dan evaluasi peluang investasi bisnis. " +
      "Kamu hanya menerima percakapan terkait bisnis dan menolak membahas selain bisnis. " +
      "Jawab secara singkat (maks. 1 paragraf), kecuali diminta lain. " +
      "Gunakan format Markdown untuk menjawab.",
  },
};
