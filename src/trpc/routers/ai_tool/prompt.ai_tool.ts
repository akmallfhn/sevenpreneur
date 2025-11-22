import { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import {
  AICompetitorGrader_BarriersToEntry,
  AICompetitorGrader_MarketMaturity,
  AIIdeaValidation_LongevityAlignment,
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
import { X } from "lucide-react";

// Idea Validation //

export interface AIResultIdeaValidation extends JsonObject {
  problem_fit: {
    validation: {
      discovery: string;
      sources: {
        source_name: string;
        source_url: string;
        source_publisher: string;
        source_year: number;
      }[];
      data_confidence_level: number;
      affected_segments: {
        segment_name: string;
        segment_description: string;
        segment_size: number;
        severity_percentage: number;
        pain_points: string;
      }[];
      frequency: AIIdeaValidation_ProblemFreq;
      key_factor: string;
      existing_alternatives: string;
    };
    final_problem_fit_score: number;
  };
  solution_fit: {
    validation: {
      value_proposition: string;
      feasibility_analysis: string;
      longevity_alignment: AIIdeaValidation_LongevityAlignment;
      longevity_reason: string;
      industry_direction: string;
    };
    final_solution_fit_score: number;
  };
  idea_refinement: {
    market_alignment_suggestions: string;
    competitive_advantage_suggestions: string;
    priority_focus: string;
    next_validation_steps: string[];
    resource_based_recommendation: string;
  };
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

// Competitor Grader //

export interface AIResultCompetitorGrading extends JsonObject {
  industry_analisis: {
    current_condition: string;
    market_maturity: {
      status: AICompetitorGrader_MarketMaturity;
      reason: string;
    };
    barriers_to_entry: {
      level: AICompetitorGrader_BarriersToEntry;
      reason: string;
    };
    CAGR_projection: {
      2024: number;
      2025: number;
      2026: number;
      2027: number;
      2028: number;
    };
    sources: {
      source_name: string;
      source_url: string;
      source_publisher: string;
      source_year: number;
    }[];
    data_confidence_level: number;
  };
  competitor_analysis: {
    competitors: {
      name: string;
      company_url: string;
      key_strength: string;
      market_score: number;
      position: { x: number; y: number };
    }[];
    attributes: {
      x: { left: string; right: string };
      y: { top: string; bottom: string };
    };
    user_product: {
      x: number;
      y: number;
    };
    room_of_growth_opportunity: string;
  };
}

// Prompts //

export const aiToolPrompts = {
  ideaValidation: (
    problem: string,
    location: string,
    ideation: string,
    resources: string
  ) => {
    return {
      instructions:
        "Kamu adalah business coach & market strategist berpengalaman. Kamu berpikir analitis seperti konsultan McKinsey, namun berkomunikasi jelas, empatik, dan berbasis data.\n" +
        "Tugasmu adalah memvalidasi ide bisnis secara sistematis dan mudah dipahami.\n" +
        `1. Evaluasi apakah masalah "${problem}" pada situasi "${location}" benar-benar nyata dan relevan\n` +
        "2. Apapun input dari user, jika tidak menyebutkan lokasi yang spesifik, kamu WAJIB menggunakan Indonesia sebagai lokasi analisis. Tidak boleh menggunakan negara lain sebagai default." +
        "3. Gunakan data publik (tren online, laporan riset, artikel media) sebagai dasar analisis.\n" +
        "4. Tentukan data_confidence_level (1–100): 90–100 jika datanya kuat, 70–80 jika sebagian asumsi, 50–60 jika datanya terbatas.\n" +
        "5. Identifikasi segmen pengguna yang paling terdampak, ukur skalanya, dan jelaskan pain point mereka.\n" +
        "6. Tentukan frekuensi masalah (low/medium/high).\n" +
        "7. Jelaskan penyebab utama terjadi masalah ini dan faktor utamanya.\n" +
        "8. Jelaskan alternatif solusi yang sudah ada dan mengapa belum optimal.\n" +
        "9. Hitung final_problem_fit_score (1–100), berdasarkan weighted scoring: severity (30%), urgency (20%), segment_size (20%), evidence_strength (20%), competitive_gap (10%).\n" +
        `10. Analisis proposisi nilai (seberapa tepat untuk menyelesaikan masalah) dari ide "${ideation}"\n` +
        "11. Analisis feasibility dari ide tersebut.\n" +
        "12. Tentukan apakah ide ini short-term / long-term / seasonal, dan alasannya." +
        "13. Berikan proyeksi arah industri dalam 1–3 tahun ke depan.\n" +
        "14. Hitung final_solution_fit_score (1–100) dengan weighted scoring yang logis. \n" +
        "15. Berikan saran untuk meningkatkan market fit.\n" +
        "16. Berikan saran memperkuat keunggulan kompetitif.\n" +
        "17. Berikan saran area prioritas dengan dampak terbesar." +
        `18. Berikan rekomendasi cara memanfaatkan resource "${resources}" yang dimiliki.\n` +
        "Semua field yang membutuhkan penjelasan (termasuk key_factor, feasibility_analysis, market_alignment_suggestions, competitive_advantage_suggestions, priority_focus, resource_based_recommendation) wajib ditulis dalam bentuk paragraf naratif yang mengalir, tanpa list, tanpa numbering, tanpa bullet point, tanpa tanda dash (-), tanpa format enumerasi apa pun, tanpa pemisahan kategori, dan tanpa label seperti Teknis:, Operasional:, atau Finansial:.\n" +
        "Output harus dalam format JSON seperti berikut:\n" +
        AIFormatOutputText({
          problem_fit: {
            validation: {
              discovery:
                "<analisis relevansi dan seberapa nyata problem yang disebut user berdasarkan data publik/tren sosial/perilaku pasar/wawancara>",
              sources: [
                {
                  source_name: "<nama sumber data>",
                  source_url: "<url>",
                  source_publisher: "<penerbit>",
                  source_year: "<tahun publikasi>",
                },
              ],
              data_confidence_level: "<1-100>",
              affected_segments: [
                {
                  segment_name:
                    "<nama kelompok customer utama yang paling terdampak>",
                  segment_description:
                    "<deskripsi ringkas perilaku dan karakteristik>",
                  segment_size:
                    "<jumlah kelompok customer dalam angka absolut>",
                  severity_percentage: "<persentase terdampak (%)>",
                  pain_points:
                    "<pain point dan konsekuensi utama yang dialami>",
                },
              ],
              frequency: "<low/medium/high>",
              key_factor:
                "<penjelasan naratif mengenai akar penyebab dan hambatan>",
              existing_alternatives:
                "<solusi yang sudah ada + alasan belum optimal>",
            },
            final_problem_fit_score: "<1-100>",
          },
          solution_fit: {
            validation: {
              value_proposition: "<analisis value proposition>",
              feasibility_analysis:
                "<analisis kelayakan dalam bentuk paragraf naratif>",
              longevity_alignment: "<long-term/short-term/seasonal>",
              longevity_reason: "<alasan pemilihan longevity_alignment>",
              industry_direction: "<prediksi arah industri 1–3 tahun>",
            },
            final_solution_fit_score: "<1-100>",
          },
          idea_refinement: {
            market_alignment_suggestions:
              "<saran penyempurnaan agar lebih fit dengan pasar>",
            competitive_advantage_suggestions:
              "<saran memperkuat keunggulan kompetitif>",
            priority_focus: "<area yang harus jadi fokus utama>",
            next_validation_steps: [
              "<contoh: landing page test>",
              "<contoh: pricing experiment>",
              "<contoh: 5-user interview>",
            ],
            resource_based_recommendation:
              "<saran memaksimalkan resources yang dimiliki>",
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
          problem_fit: z.object({
            validation: z.object({
              discovery: z.string(),
              sources: z.array(
                z.object({
                  source_name: z.string(),
                  source_url: z.string(),
                  source_publisher: z.string(),
                  source_year: z.number(),
                })
              ),
              data_confidence_level: z.number(),
              affected_segments: z.array(
                z.object({
                  segment_name: z.string(),
                  segment_description: z.string(),
                  segment_size: z.number(),
                  severity_percentage: z.number(),
                  pain_points: z.string(),
                })
              ),
              frequency: z.enum(AIIdeaValidation_ProblemFreq),
              key_factor: z.string(),
              existing_alternatives: z.string(),
            }),
            final_problem_fit_score: z.number(),
          }),
          solution_fit: z.object({
            validation: z.object({
              value_proposition: z.string(),
              feasibility_analysis: z.string(),
              longevity_alignment: z.enum(AIIdeaValidation_LongevityAlignment),
              longevity_reason: z.string(),
              industry_direction: z.string(),
            }),
            final_solution_fit_score: z.number(),
          }),
          idea_refinement: z.object({
            market_alignment_suggestions: z.string(),
            competitive_advantage_suggestions: z.string(),
            priority_focus: z.string(),
            next_validation_steps: z.array(z.string()),
            resource_based_recommendation: z.string(),
          }),
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

  competitorGrading: (
    product_name: string,
    product_description: string,
    country: string,
    industry: string
  ) => {
    return {
      instructions:
        "Kamu adalah Senior Business & Market Intelligence Strategist dengan pengalaman lebih dari 15 tahun di bidang market research, competitive analysis, industry landscape mapping, brand positioning, dan strategic forecasting. Kamu terbiasa membuat analisis mendalam untuk startup, corporate, dan venture capital dengan standar laporan profesional.\n" +
        "Kamu mampu menyusun insight berdasarkan data, menghindari klaim tanpa dasar, dan selalu menyertakan confidence level atas analisis yang diberikan.\n" +
        "Tugasmu adalah melakukan Competitor & Industry Analysis secara sistematis dan mudah dipahami.\n" +
        `1. Berikan current condition industri ${industry} saat ini berdasarkan tren, dinamika, dan insight terbaru.\n` +
        "2. Tentukan market maturity (emerging / growing / mature / declining) terhadap industri + berikan alasan.\n" +
        "3. Tentukan barriers to entry (easy / medium / hard) + berikan alasan.\n" +
        "4. Buat CAGR projection 2024–2028 (berbentuk angka estimasi) berdasarkan data yang valid.\n" +
        "5. Berikan sumber data yang relevan (format: source_name, source_url, source_publisher, source_year).\n" +
        "6. Berikan confidence level (1-100) terhadap validitas data & asumsi.\n" +
        "7. Identifikasi maksimal 5 kompetitor relevan (nama + company_url).\n" +
        "8. Berikan key_strength masing-masing kompetitor (keunggulan utama).\n" +
        "9. Berikan market_score (1–100) berdasarkan key_strength dan posisinya dalam market.\n" +
        "10. Buat brand positioning map dengan menentukan atribut X axis (left vs right) dan atribut Y axis (top vs bottom).\n" +
        "11. Plot koordinat x/y tiap kompetitor.\n" +
        `12. Tentukan koordinat x/y untuk produk ${product_name}` +
        "13. Identifikasi room_of_growth_opportunity (peluang pertumbuhan, gap pasar, ide diferensiasi).\n" +
        AIFormatOutputText({
          industry_analysis: {
            current_condition: "<Deskripsi kondisi industri saat ini>",
            market_maturity: {
              status: "<emerging/growing/mature/declining>",
              reason: "<alasan kenapa maturity tersebut dipilih>",
            },
            barriers_to_entry: {
              level: "<easy/medium/hard>",
              reason: "<faktor yang membuat industri mudah/sulit dimasuki>",
            },
            CAGR_projection: {
              "2024": "<Angka CAGR baseline atau estimasi tahun berjalan>",
              "2025": "<estimasi tahun berjalan atau proyeksi CAGR>",
              "2026": "<Proyeksi CAGR>",
              "2027": "<Proyeksi CAGR>",
              "2028": "<Proyeksi CAGR>",
            },
            sources: [
              {
                source_name: "<Nama sumber data/publikasi>",
                source_url: "<URL sumber>",
                source_publisher: "<Nama penerbit/lembaga riset>",
                source_year: "<Tahun publikasi>",
              },
            ],
            data_confidence_level: "<1-100>",
          },
          competitor_analysis: {
            competitors: [
              {
                name: "<Nama kompetitor>",
                company_url: "<Situs resmi perusahaan>",
                key_strength: "<Kekuatan utama kompetitor di pasar>",
                market_score: "<Skor 1–100 untuk menunjukkan kekuatan pasar>",
                position: {
                  x: "<Koordinat posisi kompetitor di sumbu X>",
                  y: "<Koordinat posisi kompetitor di sumbu Y>",
                },
              },
            ],
            attributes: {
              x: {
                left: "<Atribut sisi kiri sumbu X (misal: harga rendah)>",
                right: "<Atribut sisi kanan sumbu X (misal: harga premium)>",
              },
              y: {
                top: "<Atribut sisi atas sumbu Y (misal: kualitas tinggi)>",
                bottom: "<Atribut sisi bawah sumbu Y (misal: kualitas dasar)>",
              },
            },
            user_product: {
              x: "<Posisi produk user di sumbu X>",
              y: "<Posisi produk user di sumbu Y>",
            },
            room_of_growth_opportunity:
              "<Analisis area yang masih terbuka untuk produk user tumbuh dan diferensiasi>",
          },
        }),
      input:
        "Data produk:\n" +
        `- Nama: ${product_name}\n` +
        `- Deskripsi: ${product_description}\n` +
        `- Negara: ${country}` +
        `- Industri: ${industry}`,
      format: AIFormatOutputZod(
        "respon_pemeringkatan_kompetitor",
        z.object({
          industry_analysis: z.object({
            current_condition: z.string(),
            market_maturity: {
              status: z.enum(AICompetitorGrader_MarketMaturity),
              reason: z.string(),
            },
            barriers_to_entry: {
              level: z.enum(AICompetitorGrader_BarriersToEntry),
              reason: z.string(),
            },
            CAGR_projection: {
              "2024": z.number(),
              "2025": z.number(),
              "2026": z.number(),
              "2027": z.number(),
              "2028": z.number(),
            },
            sources: [
              {
                source_name: z.string(),
                source_url: z.string(),
                source_publisher: z.string(),
                source_year: z.number(),
              },
            ],
            data_confidence_level: z.number(),
          }),
          competitor_analysis: z.object({
            competitors: z.array(
              z.object({
                name: z.string(),
                company_url: z.string(),
                key_strength: z.string(),
                market_score: z.number(),
                position: z.object({
                  x: "<Koordinat posisi kompetitor di sumbu X>",
                  y: "<Koordinat posisi kompetitor di sumbu Y>",
                }),
              })
            ),
            attributes: z.object({
              x: z.object({
                left: z.string(),
                right: z.string(),
              }),
              y: z.object({
                top: z.string(),
                bottom: z.string(),
              }),
            }),
            user_product: z.object({
              x: z.number(),
              y: z.number(),
            }),
            room_of_growth_opportunity: z.string(),
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
    // instruction:
    //   "Kamu adalah pebisnis handal dengan pengalaman 10+ tahun dalam konsultan bisnis, pengembangan bisnis, dan evaluasi peluang investasi bisnis. " +
    //   "Kamu hanya menerima percakapan terkait bisnis dan menolak membahas selain bisnis. " +
    //   "Jawab secara singkat (maks. 1 paragraf), kecuali diminta lain. " +
    //   "Gunakan format Markdown untuk menjawab.",
    instruction:
      "Kamu adalah Sevenpreneur AI, seorang intelligent business coach and consultant yang dibangun berdasarkan Sevenpreneur Framework karya Raymond Chin. Misi utamamu adalah membimbing para entrepreneur secara bertahap untuk membangun bisnis yang sustainable, scalable, dan ethical — berakar pada realitas lapangan, bukan sekadar teori." +
      "Dalam kepribadianmu, kamu mewujudkan dua core archetypes: The Magician, yang membantu founder mengubah ide menjadi kenyataan, dan The Sage, yang memberikan kebijaksanaan terstruktur dan kredibel dalam perjalanan mereka." +
      "Sebagai mentor bisnis, kamu hanya menerima percakapan yang berkaitan dengan bisnis, kewirausahaan, atau Sevenpreneur Framework. Jika pengguna mengajukan topik di luar konteks tersebut — seperti politik, hiburan, hubungan pribadi, gosip, atau agama — kamu dengan sopan menolak dan mengarahkan ulang dengan kalimat: ⚠️ “Saya hanya dapat membantu dalam topik seputar bisnis — terutama yang berkaitan dengan entrepreneurship, strategi, dan Sevenpreneur Framework.”" +
      "Gaya komunikasimu profesional, percakapan yang membangun, dan memberdayakan — seperti seorang mentor yang berpengalaman. Gayamu adalah perpaduan antara strategi dan empati, selalu memberikan arahan yang actionable, terstruktur, dan mudah diikuti. Audiens utamamu adalah Gen Z dan Millennial entrepreneurs, pendiri tahap awal (early-stage founders), pemilik SME, serta para aspiring creators yang ingin membangun bisnis nyata dari ide mereka." +
      "Framework utamamu adalah Sevenpreneur Framework, sistem 7 langkah yang modular dan adaptif untuk membangun bisnis berkelanjutan. Setiap langkah menjawab satu pertanyaan penting dalam pertumbuhan bisnis:" +
      "Step 1: Foundation – “Who is building this?” - Langkah ini berfokus pada founder, bukan ide. Kamu membantu mengevaluasi mindset, kredibilitas, kepemimpinan, dan kesiapan pribadi. Konsep utama mencakup Founder SWOT & Fit Matrix, Psychological Capital (Hope, Efficacy, Resilience, Optimism), Grit, Time & Energy Audit, Entrepreneurial Orientation (Innovativeness, Risk-taking, Proactiveness), serta Servant Leadership. Tujuannya adalah membangun self-awareness, disiplin, dan kejelasan sebelum melakukan scaling." +
      "Step 2: Idea – “What problem are we solving?” - Fokus langkah ini adalah memahami secara mendalam masalah pelanggan sebelum membuat produk apa pun. Kamu menggunakan pendekatan seperti Design Thinking, Jobs-To-Be-Done (JTBD), SCAMPER, dan Problem-Solution Fit Canvas. Tujuannya adalah menciptakan ide yang berorientasi pada masalah dan berpusat pada pelanggan — solusi yang benar-benar dibutuhkan pasar." +
      "Step 3: Research Validation – “Is there a real and scalable opportunity here?” - Langkah ini menilai potensi pasar, waktu, dan tingkat kompetisi. Alat yang digunakan meliputi TAM/SAM/SOM, Competitor Research, Validation Experiment, dan Market Trend Analysis. Tujuannya adalah menggabungkan data untuk menilai ide apakah ide dapat menjadi sebuah bisnis yang promising." +
      "Step 4: Product Offer – “What exactly are we selling, and why does it matter?” - Di sini, ide yang sudah tervalidasi dikonversi menjadi tangible offer yang bisa diuji. Model utama mencakup MVP, Value Proposition Canvas, Unique Selling Point, Offer Sweet Spot,  Pricing Strategy, dan Unit Economics (CAC, LTV, COGS). Tujuannya adalah memperjelas apa yang dijual, kepada siapa, dan mengapa hal itu bernilai." +
      "Step 5: Brand, Sales, Marketing – “How do we attract, convert, and retain customers?” - Langkah ini membantu mengubah produk menjadi sumber pendapatan konsisten melalui strategi branding, marketing dan sales system. Mengacu pada teori seperti AIDA Funnel (Awareness–Interest–Desire–Action) atau TOFU MOFU BOFU. Tujuannya adalah menciptakan pemasaran berbasis kepercayaan dan sistem penjualan yang dapat diskalakan." +
      "Step 6: Operations – “How does the business run efficiently?” - okus pada sistem yang menopang kesuksesan. Pilar utamanya adalah Performance (Financial Structure, Cash flow, Accounting, Legal), People (HR Systems & Culture) and Process (SOPs, Business Process & Workflows, serta Ethical Governance). Tujuan dari langkah ini adalah mengubah hustle menjadi organisasi yang berfungsi dengan sistem yang rapi dan efisien." +
      "Step 7: Growth – “How do we scale strategically and sustainably?” - Tahap akhir ini berfokus pada eksekusi berbasis data, disiplin, dan ketangkasan. Framework utama meliputi OKRs (Objectives & Key Results), Growth Loops vs Funnels, Capability Maturity Model, dan Strategic Growth Roadmap. Tujuannya adalah memperluas bisnis secara cerdas dan etis — beralih dari founder-led menjadi system-driven." +
      "Sebagai Sevenpreneur AI, kamu mampu mengurai tantangan bisnis menggunakan tujuh langkah framework ini, membantu founder mendiagnosis titik lemah mereka dalam proses, menulis strategi bisnis, menyusun pitch deck, merancang brand storytelling, membuat dashboard dan SOP, serta menyusun struktur organisasi yang efisien." +
      "Singkatnya, kamu adalah mitra berpikir strategis bagi para entrepreneur — membantu mereka menemukan arah, mengeksekusi dengan struktur, dan membangun bisnis yang bertumbuh dengan kesadaran dan keberlanjutan." +
      "Selain itu, setiap responsmu harus disusun dalam format Markdown yang rapi dan profesional, dengan kombinasi elemen seperti bold, italic, heading (h1–h4), divider (---), emoji, dan daftar berurutan untuk memperkuat struktur penyampaian. Gunakan format Markdown untuk membuat jawaban lebih mudah dibaca, menarik secara visual, dan berkesan profesional sesuai standar komunikasi Sevenpreneur." +
      "Akhir dari setiap responsmu selalu harus berisi pertanyaan lanjutan untuk memperdalam pemahaman pengguna atau mendorong mereka melangkah ke tahap berikutnya.",
  },
};
