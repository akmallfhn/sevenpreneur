import { Optional } from "@/lib/optional-type";
import { STATUS_FORBIDDEN } from "@/lib/status_code";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function isEnrolledCohort(
  prisma: PrismaClient,
  user_id: string,
  cohort_id: number,
  error_message: string
) {
  const theEnrolledCohort = await prisma.userCohort.findFirst({
    where: {
      user_id: user_id,
      cohort_id: cohort_id,
    },
  });
  if (!theEnrolledCohort) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
  return theEnrolledCohort;
}

export async function isEnrolledLearning(
  prisma: PrismaClient,
  user_id: string,
  learning_id: number,
  error_message: string
) {
  const theEnrolledLearning = await prisma.learning.findFirst({
    include: { price: { select: { cohort_id: true } } },
    where: { id: learning_id },
  });
  if (!theEnrolledLearning) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }

  let cohortId = theEnrolledLearning.cohort_id;
  let cohortPriceId: Optional<number> = undefined;
  if (
    theEnrolledLearning.price_id !== null &&
    theEnrolledLearning.price !== null
  ) {
    cohortId = theEnrolledLearning.price.cohort_id;
    cohortPriceId = theEnrolledLearning.price_id;
  }

  const theEnrolledCohort = await prisma.userCohort.findFirst({
    where: {
      user_id: user_id,
      cohort_id: cohortId,
      cohort_price_id: cohortPriceId,
    },
  });
  if (!theEnrolledCohort) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}

// ── Qualitative feedback analysis helpers ────────────────────────────────────

const ID_STOP_WORDS = new Set([
  // Pronouns
  "saya",
  "kami",
  "kita",
  "mereka",
  "dia",
  "ia",
  "anda",
  "kamu",
  "aku",
  // Articles / determiners
  "ini",
  "itu",
  "tersebut",
  "para",
  // Prepositions
  "di",
  "ke",
  "dari",
  "pada",
  "dalam",
  "atas",
  "untuk",
  "oleh",
  "bagi",
  "antara",
  "melalui",
  "tentang",
  "dengan",
  "per",
  "sejak",
  "hingga",
  // Conjunctions
  "dan",
  "atau",
  "tapi",
  "tetapi",
  "namun",
  "karena",
  "jika",
  "kalau",
  "agar",
  "supaya",
  "bahwa",
  "maka",
  "serta",
  "juga",
  "yang",
  "maupun",
  // Particles
  "lah",
  "kah",
  "pun",
  "deh",
  "dong",
  "sih",
  "nih",
  "tuh",
  "ya",
  "yg",
  "nya",
  "aja",
  "saja",
  // Common verbs / copulas with low info value
  "ada",
  "adalah",
  "jadi",
  "akan",
  "oleh",
  // Informal fillers
  "ga",
  "gak",
  "ngga",
  "nggak",
  "emang",
  "kayak",
  // Degree intensifiers — pure modifiers, no standalone meaning
  "sangat",
  "banget",
  "amat",
  "sekali",
]);

function normText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normText(text)
    .split(" ")
    .filter((w) => w.length > 2 && !ID_STOP_WORDS.has(w));
}

function ngrams(tokens: string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++)
    out.push(tokens.slice(i, i + n).join(" "));
  return out;
}

const POSITIVE_SIGNALS = new Set([
  "bagus", "baik", "oke", "ok", "mantap", "keren", "seru",
  "mudah", "jelas", "menarik", "informatif", "bermanfaat", "membantu",
  "senang", "puas", "suka", "nyaman", "relevan", "tepat", "pas",
  "cocok", "sesuai", "cukup",
]);

const NEGATIVE_SIGNALS = new Set([
  "kurang", "tidak", "susah", "sulit", "bingung", "membingungkan",
  "lama", "lambat", "membosankan", "bosan", "boring", "terlalu",
  "sayang", "kecewa", "belum", "capek", "lelah",
]);

export function textSentiment(text: string): "positive" | "negative" | "neutral" {
  const tokens = normText(text).split(" ");
  let pos = 0, neg = 0;
  for (const w of tokens) {
    if (POSITIVE_SIGNALS.has(w)) pos++;
    if (NEGATIVE_SIGNALS.has(w)) neg++;
  }
  if (pos > neg) return "positive";
  if (neg > pos) return "negative";
  return "neutral";
}

export function extractThemes(texts: string[], topN = 7) {
  if (texts.length === 0) return [];

  const freq = new Map<string, number>();
  for (const text of texts) {
    const tokens = tokenize(text);
    const candidates = [...ngrams(tokens, 2), ...ngrams(tokens, 3)];
    const seen = new Set<string>();
    for (const ng of candidates) {
      if (!seen.has(ng)) {
        freq.set(ng, (freq.get(ng) ?? 0) + 1);
        seen.add(ng);
      }
    }
  }

  const minCount = texts.length === 1 ? 1 : 2;
  const sorted = [...freq.entries()]
    .filter(([, c]) => c >= minCount)
    .sort((a, b) => b[1] - a[1]);

  // Step 1: Drop n-grams that are strict contiguous sub-sequences of a longer
  // n-gram in the candidate list — prefer the more-specific phrase
  const allNgrams = sorted.map(([ng]) => ng);
  const deduped = sorted.filter(
    ([ng]) => !allNgrams.some((other) => other !== ng && other.includes(ng))
  );

  // Step 2: Merge boundary-overlapping bigrams (last word of A == first word of
  // B) into a trigram when the merged phrase actually appears in texts — handles
  // cases like "tidak terlalu" + "terlalu lama" → "tidak terlalu lama".
  // If the trigram can't be verified in texts, the second bigram is just dropped.
  const picked: [string, number][] = [];
  const consumed = new Set<string>();

  for (const [ng, count] of deduped) {
    if (consumed.has(ng)) continue;
    const ngWords = ng.split(" ");

    if (ngWords.length === 2) {
      let merged = false;
      for (let i = 0; i < picked.length; i++) {
        const [sel] = picked[i];
        const selWords = sel.split(" ");
        if (selWords.length !== 2) continue;

        let trigram: string | null = null;
        if (selWords[1] === ngWords[0])
          trigram = `${selWords[0]} ${selWords[1]} ${ngWords[1]}`;
        else if (ngWords[1] === selWords[0])
          trigram = `${ngWords[0]} ${ngWords[1]} ${selWords[1]}`;

        if (trigram) {
          const tc = texts.filter((t) => normText(t).includes(trigram!)).length;
          if (tc >= minCount) picked[i] = [trigram, tc];
          consumed.add(ng);
          merged = true;
          break;
        }
      }
      if (merged) continue;
    }

    picked.push([ng, count]);
  }

  picked.sort((a, b) => b[1] - a[1]);

  return picked.slice(0, topN).map(([theme, count]) => {
    const words = theme.split(" ");
    const example_quotes = texts
      .filter((t) => words.every((w) => normText(t).includes(w)))
      .slice(0, 2);
    return { theme, count, example_quotes };
  });
}
