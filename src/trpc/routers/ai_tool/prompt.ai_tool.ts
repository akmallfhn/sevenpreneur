import { JsonObject } from "@prisma/client/runtime/library";
import { z } from "zod";
import {
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
        segment: string;
        segment_size: number;
        severity_percentage: number;
        pain_points: string;
        segment_description: string;
      }[];
      frequency: AIIdeaValidation_ProblemFreq;
      key_factors: string;
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
      scalability_potential: {
        is_scalable: boolean;
        scaling_factors: string;
        barriers: string;
      };
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
        "Kamu adalah seorang business coach & market strategist berpengalaman yang membantu founder dan tim startup dalam memvalidasi ide bisnis mereka secara sistematis.\n" +
        "Kamu berpikir analitis seperti consultant McKinsey, tapi berkomunikasi seperti mentor yang membimbing dengan empati dan berbasis data.\n" +
        "Tugasmu:\n" +
        `1. Evaluasi apakah masalah "${problem}" pada saat "${location}" benar-benar nyata dan relevan\n` +
        "2. Gunakan konteks publik seperti tren online, laporan riset, atau publikasi media untuk mendukung analisis.\n" +
        "3. Tentukan data_confidence_level (1-100) berdasarkan kualitas data publik dan konsistensi analisis. Beri nilai dalam rentang 90-100 jika data berasal dari sumber kredibel dan perhitungan konsisten. Beri nilai dalam rentang 70-80 jika sebagian data diasumsikan tetapi masih logis. Beri nilai dalam rentang 50-60 jika data terbatas, perlu validasi lebih lanjut.\n" +
        "4. Identifikasi segmen pengguna yang paling terdampak, ukur skalanya, dan jelaskan pain point mereka.\n" +
        "5. Tentukan frekuensi masalah muncul di publik (low/medium/high).\n" +
        "6. Jelaskan akar penyebab + hambatan dari berbagai faktor (sosial/ekonomi/teknologi/perilaku).\n" +
        "7. Jelaskan alternatif solusi yang sudah ada dan mengapa belum optimal.\n" +
        "8. Hitung dan interpretasikan final_problem_fit_score dalam rentang 1–100, di mana semakin tinggi skor berarti problem semakin layak untuk diselesaikan. Skor dihitung menggunakan weighted scoring yang mencakup: severity_score (30%), urgency_score (20%), segment_size_score (20%), evidence_strength_score (20%), dan competitive_gap_score (10%)\n" +
        `9. Analisis value proposition ide "${ideation}": seberapa tepat untuk menyelesaikan masalah.\n` +
        "10. Analisis feasibility dari sisi teknis, operasional, finansial.\n" +
        "11. Tentukan apakah ide ini short-term / long-term / seasonal, dan alasannya." +
        "12. Berikan proyeksi arah industri dalam 1–3 tahun ke depan.\n" +
        "13. Nilai skalabilitas: apakah bisa berkembang lintas pasar, monetizable, dan hambatannya.\n" +
        "14. Hitung final_solution_fit_score (1–100) dengan weighted scoring yang kamu tentukan secara logis. \n" +
        "15. Berikan saran agar ide lebih sesuai kebutuhan pasar.\n" +
        "16. Berikan cara memperkuat competitive advantage.\n" +
        "17. Berikan recommended focus area yang paling berdampak." +
        `18. Berikan rekomendasi cara memanfaatkan resource "${resources}" yang dimiliki untuk memprekuat posisi.\n` +
        "Output harus dalam format JSON seperti berikut:\n" +
        AIFormatOutputText({
          problem_fit: {
            validation: {
              discovery:
                "<analisis relevansi dan seberapa nyata problem yang disebut user berdasarkan data publik/tren sosial/perilaku pasar/wawancara>",
              sources: [
                {
                  source_name:
                    "<nama sumber data atau publikasi yang mendukung validasi problem>",
                  source_url: "<tautan sumber data>",
                  source_publisher: "<pihak penerbit sumber data>",
                  source_year: "<tahun publikasi sumber data>",
                },
              ],
              data_confidence_level:
                "<estimasi tingkat kepercayaan validasi data (1-100)>",
              affected_segments: [
                {
                  segment:
                    "<kelompok customer utama yang paling terdampak, misal: UMKM, mahasiswa, ibu rumah tangga, pekerja remote>",
                  segment_size:
                    "<jumlah kelompok customer dalam angka absolut>",
                  severity_percentage:
                    "<estimasi proporsi kelompok customer yang terdampak masalah dalam persen (%)>",
                  pain_points:
                    "<pain point utama yang dialami segmen ini, termasuk apa yang mereka coba lakukan, apa yang menghambat, dan konsekuensi negatif yang mereka rasakan>",
                  segment_description:
                    "<ringkasan perilaku dan karakteristik dari segmen customer tersebut dalam 1-2 paragraf pendek>",
                },
              ],
              frequency: "<low/medium/high>",
              key_factors: "<akar penyebab utama dan potensi hambatan>",
              existing_alternatives:
                "<solusi atau alternatif yang sudah ada di pasar untuk mengatasi masalah ini>",
            },
            final_problem_fit_score:
              "<skor akhir (1-100) yang menunjukkan seberapa layak masalah ini untuk diselesaikan berdasarkan weighted scoring dari berbagai faktor>",
          },
          solution_fit: {
            validation: {
              value_proposition:
                "<analisis kekuatan proposisi nilai dari ide yang diajukan berdasarkan kesesuaian dengan kebutuhan pasar, diferensiasi dari solusi yang ada, dan potensi dampak positif bagi pengguna>",
              feasibility_analysis:
                "<evaluasi kelayakan ide dari segi teknis, operasional, dan finansial, termasuk sumber daya yang dibutuhkan dan tantangan potensial dalam implementasinya>",
              longevity_alignment: "<long-term/short-term/seasonal>",
              longevity_reason:
                "<alasan logis mengapa ide diprediksi berkelanjutan atau tidak>",
              industry_direction:
                "<perkembangan industri dalam 1–3 tahun ke depan>",
              scalability_potential: {
                is_scalable:
                  "<true/false — apakah ide ini dapat dikembangkan ke pasar lain atau dimonetisasi dengan mudah>",
                scaling_factors:
                  "<faktor pendukung skalabilitas, misal: model bisnis digital, kemudahan replikasi, demand lintas pasar>",
                barriers: "<hambatan potensial pertumbuhan ide>",
              },
            },
            final_solution_fit_score:
              "<skor akhir (1-100) yang menunjukkan seberapa layak solusi ini untuk dijalankan berdasarkan weighted scoring dari berbagai faktor>",
          },
          idea_refinement: {
            market_alignment_suggestions:
              "<saran penyempurnaan ide agar lebih fit dengan kebutuhan pasar>",
            competitive_advantage_suggestions:
              "<cara memperkuat keunggulan kompetitif>",
            priority_focus: "<area yang harus jadi fokus utama>",
            next_validation_steps: [
              "<contoh: landing page test>",
              "<contoh: pricing experiment>",
              "<contoh: 5-user interview>",
            ],
            resource_based_recommendation:
              "<cara memanfaatkan resources untuk memperkuat posisi>",
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
                  segment: z.string(),
                  segment_size: z.number(),
                  severity_percentage: z.number(),
                  pain_points: z.string(),
                  segment_description: z.string(),
                })
              ),
              frequency: z.enum(AIIdeaValidation_ProblemFreq),
              key_factors: z.string(),
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
              scalability_potential: z.object({
                is_scalable: z.boolean(),
                scaling_factors: z.string(),
                barriers: z.string(),
              }),
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
