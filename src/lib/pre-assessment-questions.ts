// Question definitions for the Ailene pre-assessment.
// `field` matches the column name on ail_pre_assessments.
// For single-choice, `valueCodes` lines up with `options` (same length, same order)
// and stores the enum literal sent to the server.

export type PreAssessmentCategory =
  | "Profil Dasar"
  | "Literasi AI"
  | "Penggunaan di Pekerjaan"
  | "Kemampuan Prompting"
  | "Keamanan & Etika"
  | "Refleksi"
  | "Ekspektasi Pelatihan";

export type PreAssessmentQuestionType = "single" | "multi" | "short" | "long";

interface BaseQuestion {
  id: number;
  field: string;
  category: PreAssessmentCategory;
  question: string;
  required: boolean;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: "single";
  options: string[];
  valueCodes: string[];
}

export interface MultiChoiceQuestion extends BaseQuestion {
  type: "multi";
  options: string[];
}

export interface ShortTextQuestion extends BaseQuestion {
  type: "short";
  placeholder: string;
}

export interface LongTextQuestion extends BaseQuestion {
  type: "long";
  placeholder: string;
}

export type PreAssessmentQuestion =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | ShortTextQuestion
  | LongTextQuestion;

export const PRE_ASSESSMENT_QUESTIONS: PreAssessmentQuestion[] = [
  {
    id: 1,
    field: "q1_ai_use_frequency",
    type: "single",
    category: "Profil Dasar",
    required: true,
    question:
      "Seberapa sering kamu menggunakan alat bantu AI (seperti ChatGPT, Copilot, Gemini, dll.) dalam pekerjaan sehari-hari?",
    options: [
      "Belum pernah sama sekali",
      "Pernah mencoba, tapi tidak rutin",
      "1–2 kali seminggu",
      "Hampir setiap hari",
      "Beberapa kali dalam sehari",
    ],
    valueCodes: ["NEVER", "TRIED", "WEEKLY", "DAILY", "INTENSIVE"],
  },
  {
    id: 2,
    field: "q2_ai_tools_used",
    type: "multi",
    category: "Profil Dasar",
    required: true,
    question:
      "Alat AI mana saja yang pernah kamu gunakan? (Pilih semua yang pernah dipakai)",
    options: [
      "ChatGPT (OpenAI)",
      "Copilot (Microsoft)",
      "Gemini (Google)",
      "Claude (Anthropic)",
      "Perplexity AI",
      "Midjourney / DALL·E / image generator",
      "GitHub Copilot (coding)",
      "Belum pernah menggunakan satupun",
    ],
  },
  {
    id: 3,
    field: "q3_job_role",
    type: "short",
    category: "Profil Dasar",
    required: true,
    question: "Apa jabatan / peran kamu saat ini di perusahaan?",
    placeholder:
      "Contoh: Marketing Manager, Software Engineer, HRD Specialist…",
  },
  {
    id: 4,
    field: "q4_ai_understanding",
    type: "single",
    category: "Literasi AI",
    required: true,
    question:
      "Bagaimana kamu menggambarkan tingkat pemahaman kamu tentang cara kerja AI saat ini?",
    options: [
      "Tidak tahu sama sekali cara kerjanya",
      "Tahu sedikit — pernah baca atau dengar, tapi belum dalam",
      "Cukup paham konsep dasarnya",
      "Paham cara kerja dan mulai bisa menjelaskan ke orang lain",
      "Sangat paham, termasuk limitasi dan risikonya",
    ],
    valueCodes: ["NONE", "AWARE", "BASIC", "EXPLAIN", "EXPERT"],
  },
  {
    id: 5,
    field: "q5_ai_limitations",
    type: "multi",
    category: "Literasi AI",
    required: true,
    question:
      "Menurut kamu, apa saja keterbatasan AI yang kamu ketahui? (Pilih semua yang kamu tahu)",
    options: [
      "AI bisa memberikan informasi yang salah (hallucination)",
      "AI tidak bisa mengakses data real-time (kecuali ada tool khusus)",
      "AI tidak memiliki pemahaman konteks panjang dengan sempurna",
      "AI bisa bias tergantung data pelatihannya",
      "AI tidak bisa berpikir kreatif seperti manusia",
      "AI tidak punya kesadaran atau perasaan",
      "Saya belum tahu keterbatasan spesifiknya",
    ],
  },
  {
    id: 6,
    field: "q6_output_review",
    type: "single",
    category: "Literasi AI",
    required: true,
    question:
      "Ketika AI menghasilkan sebuah jawaban atau konten, apa yang biasanya kamu lakukan?",
    options: [
      "Langsung pakai tanpa diperiksa",
      "Kadang saya cek, kadang tidak",
      "Selalu saya review dulu sebelum dipakai",
      "Saya cross-check dengan sumber lain sebelum menggunakan",
      "Saya belum pernah menggunakan output AI",
    ],
    valueCodes: ["NO_CHECK", "SOMETIMES", "ALWAYS", "CROSS_CHECK", "NO_USE"],
  },
  {
    id: 7,
    field: "q7_use_cases",
    type: "multi",
    category: "Penggunaan di Pekerjaan",
    required: true,
    question:
      "Untuk keperluan apa kamu (atau ingin) memanfaatkan AI dalam pekerjaan? (Pilih semua yang relevan)",
    options: [
      "Menulis email, laporan, atau dokumen",
      "Meringkas konten panjang (artikel, notulen, laporan)",
      "Riset dan pengumpulan informasi",
      "Membuat presentasi atau visual",
      "Analisis data dan insight",
      "Coding / debugging / otomasi",
      "Brainstorming dan ideasi",
      "Layanan pelanggan / customer support",
      "Pemasaran dan pembuatan konten",
    ],
  },
  {
    id: 8,
    field: "q8_team_adoption",
    type: "single",
    category: "Penggunaan di Pekerjaan",
    required: true,
    question: "Bagaimana kondisi adopsi AI di tim atau departemen kamu saat ini?",
    options: [
      "Tim kami belum menggunakan AI sama sekali",
      "Beberapa orang mencoba secara personal, tapi tidak terstruktur",
      "Ada inisiatif kecil, tapi belum ada panduan resmi",
      "Ada kebijakan dan tools AI yang sudah disetujui kantor",
      "Tim kami sudah rutin mengintegrasikan AI dalam workflow",
    ],
    valueCodes: ["NONE", "PERSONAL", "PILOT", "POLICY", "INTEGRATED"],
  },
  {
    id: 9,
    field: "q9_concrete_example",
    type: "short",
    category: "Penggunaan di Pekerjaan",
    required: false,
    question:
      "Jika pernah menggunakan AI untuk pekerjaan, sebutkan satu contoh konkret penggunaan yang paling berkesan atau paling membantu.",
    placeholder:
      "Contoh: Saya pakai ChatGPT untuk draft proposal klien dalam 10 menit…",
  },
  {
    id: 10,
    field: "q10_prompt_comfort",
    type: "single",
    category: "Kemampuan Prompting",
    required: true,
    question:
      "Seberapa nyaman kamu dalam menulis prompt (instruksi) ke AI agar hasilnya sesuai yang diinginkan?",
    options: [
      "Tidak tahu cara menulis prompt yang baik",
      "Cukup tahu cara dasar bertanya, tapi hasilnya sering kurang tepat",
      "Bisa menulis prompt yang cukup jelas dan hasilnya lumayan",
      "Terbiasa menggunakan teknik seperti konteks, persona, atau format output",
      "Mahir — bisa membuat prompt kompleks dengan hasil yang konsisten",
    ],
    valueCodes: ["NONE", "BASIC", "DECENT", "STRUCTURED", "EXPERT"],
  },
  {
    id: 11,
    field: "q11_safety_practices",
    type: "multi",
    category: "Keamanan & Etika",
    required: true,
    question:
      "Tindakan mana yang kamu tahu perlu dilakukan saat menggunakan AI di lingkungan kerja? (Pilih semua yang kamu sadari)",
    options: [
      "Jangan memasukkan data rahasia perusahaan ke AI publik",
      "Selalu review output AI sebelum digunakan secara resmi",
      "Perhatikan hak cipta konten yang dihasilkan AI",
      "Transparan kepada klien/kolega jika konten dibuat dengan bantuan AI",
      "Pahami kebijakan penggunaan AI perusahaan",
      "Saya belum memikirkan aspek keamanan ini",
    ],
  },
  {
    id: 12,
    field: "q12_professional_attitude",
    type: "single",
    category: "Keamanan & Etika",
    required: true,
    question:
      "Manakah yang paling mendekati sikap kamu terhadap penggunaan AI dalam konteks profesional?",
    options: [
      "AI terlalu berisiko, sebaiknya dihindari di pekerjaan",
      "Berguna, tapi perlu hati-hati dan ada batasannya",
      "Netral — tergantung kasusnya",
      "Sangat mendukung, asal ada panduan yang jelas",
      "AI adalah keharusan — yang tidak pakai akan tertinggal",
    ],
    valueCodes: [
      "TOO_RISKY",
      "CAUTIOUS",
      "NEUTRAL",
      "SUPPORTIVE",
      "ESSENTIAL",
    ],
  },
  {
    id: 13,
    field: "q13_biggest_challenge",
    type: "long",
    category: "Refleksi",
    required: true,
    question:
      "Apa tantangan terbesar yang kamu hadapi (atau bayangkan akan kamu hadapi) dalam mengadopsi AI untuk pekerjaan sehari-hari?",
    placeholder:
      "Tuliskan dengan bebas. Contoh: Tidak tahu dari mana harus mulai, takut salah, hasil AI kurang akurat untuk kebutuhan saya, tidak ada tools yang approved, dll…",
  },
  {
    id: 14,
    field: "q14_training_expectation",
    type: "long",
    category: "Ekspektasi Pelatihan",
    required: true,
    question:
      "Setelah mengikuti pelatihan AI ini, kemampuan atau pengetahuan apa yang paling ingin kamu dapatkan? Ceritakan secara spesifik.",
    placeholder:
      "Contoh: Saya ingin bisa menggunakan AI untuk menghemat waktu dalam membuat laporan bulanan, atau saya ingin memahami cara memilih tools AI yang tepat untuk tim saya…",
  },
  {
    id: 15,
    field: "q15_motivation",
    type: "single",
    category: "Ekspektasi Pelatihan",
    required: true,
    question:
      "Seberapa besar motivasi kamu untuk belajar dan menerapkan AI dalam pekerjaan setelah mengikuti pelatihan ini?",
    options: [
      "Rendah — saya ikut karena diwajibkan saja",
      "Cukup — mau coba kalau mudah dipahami",
      "Sedang — saya tertarik tapi butuh contoh nyata dulu",
      "Tinggi — saya siap langsung mencoba setelah pelatihan",
      "Sangat tinggi — saya sudah tidak sabar untuk mulai!",
    ],
    valueCodes: ["MANDATORY", "CURIOUS", "TENTATIVE", "READY", "EAGER"],
  },
];

export const PRE_ASSESSMENT_CATEGORY_COLORS: Record<
  PreAssessmentCategory,
  string
> = {
  "Profil Dasar": "bg-amber-100 text-amber-700",
  "Literasi AI": "bg-blue-100 text-blue-700",
  "Penggunaan di Pekerjaan": "bg-emerald-100 text-emerald-700",
  "Kemampuan Prompting": "bg-violet-100 text-violet-700",
  "Keamanan & Etika": "bg-red-100 text-red-700",
  "Refleksi": "bg-pink-100 text-pink-700",
  "Ekspektasi Pelatihan": "bg-cyan-100 text-cyan-700",
};

export const PRE_ASSESSMENT_TYPE_LABELS: Record<
  PreAssessmentQuestionType,
  string
> = {
  single: "Pilih Satu",
  multi: "Pilih Banyak",
  short: "Isian Singkat",
  long: "Isian Panjang",
};
