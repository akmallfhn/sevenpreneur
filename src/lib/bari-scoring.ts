// BARI Scoring Engine — deterministic, rule-based.
// Source of truth: docs/ScoringRules_BARI.md (v1.0).

import {
  BARI_QUESTION_MAP,
  BariOption,
  BariPillar,
  BariQuestion,
} from "@/lib/bari-questions";

export type BariTierCode = "T1" | "T2" | "T3" | "T4" | "T5";

export interface BariRawAnswer {
  question_code: string;
  option_codes: string[];
  likert_value: number | null;
  text_answer: string | null;
}

export interface BariPillarScore {
  pillar: BariPillar;
  raw_score: number;
  raw_max: number;
  normalised: number; // out of pillar_weight
  pillar_weight: number;
  pct: number; // 0..1
  tier_label: "Strength" | "Developing" | "Gap" | "Not Assessed";
}

export interface BariFlags {
  disruption_danger_zone: boolean;
  data_history_insufficient: boolean;
  founder_fluency_gap: boolean;
  no_ai_tools: boolean;
  visibility_self_gap: boolean;
}

export interface BariScoreResult {
  total_score: number; // 0..100
  tier: { label: string; code: BariTierCode };
  pillars: Record<BariPillar, BariPillarScore>;
  flags: BariFlags;
  qualitative: Record<string, string>;
  is_partial: boolean; // true when only Stage 1 answered
  stage_completed: 1 | 2;
}

// ── Helpers ────────────────────────────────────────────────

function getOptionScore(
  q: BariQuestion,
  optionCode: string | undefined
): number {
  if (!q.options || !optionCode) return 0;
  return q.options.find((o: BariOption) => o.code === optionCode)?.score ?? 0;
}

function answerSingleScore(
  questionCode: string,
  byCode: Map<string, BariRawAnswer>
): number {
  const q = BARI_QUESTION_MAP.get(questionCode);
  const a = byCode.get(questionCode);
  if (!q || !a) return 0;
  if (q.format !== "mc_single") return 0;
  return getOptionScore(q, a.option_codes[0]);
}

function likertScore(
  questionCode: string,
  byCode: Map<string, BariRawAnswer>
): number {
  const a = byCode.get(questionCode);
  if (!a || a.likert_value == null) return 0;
  // Likert 1..5 → 0..4
  return Math.max(0, Math.min(4, a.likert_value - 1));
}

// Q8 splits across Process Digitisation and AI Adoption.
// Per Section 3 split table.
function splitQ8(rawScore: number): { process: number; ai: number } {
  switch (rawScore) {
    case 0:
      return { process: 0, ai: 0 };
    case 1:
      return { process: 1, ai: 0 };
    case 2:
      return { process: 1, ai: 1 };
    case 3:
      return { process: 1, ai: 2 };
    case 4:
      return { process: 2, ai: 2 };
    default:
      return { process: 0, ai: 0 };
  }
}

// S2-Q11 multi-select scoring per #tools selected, "none" overrides.
function s2q11Score(byCode: Map<string, BariRawAnswer>): {
  score: number;
  noneSelected: boolean;
} {
  const a = byCode.get("S2-Q11");
  if (!a || a.option_codes.length === 0) {
    return { score: 0, noneSelected: false };
  }
  const noneSelected = a.option_codes.includes("none");
  if (noneSelected) return { score: 0, noneSelected: true };
  const count = a.option_codes.length;
  if (count === 0) return { score: 0, noneSelected: false };
  if (count === 1) return { score: 2, noneSelected: false };
  if (count === 2) return { score: 3, noneSelected: false };
  return { score: 4, noneSelected: false };
}

// S2-Q21 multi-select for online presence.
function s2q21Score(byCode: Map<string, BariRawAnswer>): number {
  const a = byCode.get("S2-Q21");
  if (!a || a.option_codes.length === 0) return 0;
  if (a.option_codes.includes("none")) return 0;
  const count = a.option_codes.length;
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  return 4;
}

function normalisePillar(
  rawScore: number,
  rawMax: number,
  pillarWeight: number
): number {
  if (rawMax === 0) return 0;
  return Math.round((rawScore / rawMax) * pillarWeight * 10) / 10;
}

function pillarTier(
  normalised: number,
  pillarWeight: number
): BariPillarScore["tier_label"] {
  if (pillarWeight === 0) return "Not Assessed";
  const pct = normalised / pillarWeight;
  if (pct >= 0.7) return "Strength";
  if (pct >= 0.4) return "Developing";
  return "Gap";
}

function assignTier(totalScore: number): {
  label: string;
  code: BariTierCode;
} {
  if (totalScore >= 80) return { label: "AI-Native", code: "T5" };
  if (totalScore >= 60) return { label: "AI-Capable", code: "T4" };
  if (totalScore >= 40) return { label: "AI-Adjacent", code: "T3" };
  if (totalScore >= 20) return { label: "AI-Aware", code: "T2" };
  return { label: "Pre-AI", code: "T1" };
}

// ── Main scoring ───────────────────────────────────────────

export function scoreBari(answers: BariRawAnswer[]): BariScoreResult {
  const byCode = new Map(answers.map((a) => [a.question_code, a]));

  // Detect stage completeness — does the assessment include any Stage 2 answers?
  const hasStage2 = answers.some((a) => a.question_code.startsWith("S2-"));
  const isPartial = !hasStage2;

  // ── Per-question scores ───────
  const q4 = answerSingleScore("Q4", byCode);
  const q5 = answerSingleScore("Q5", byCode);
  const q6 = answerSingleScore("Q6", byCode);
  const q7 = answerSingleScore("Q7", byCode);
  const q8raw = answerSingleScore("Q8", byCode);
  const q8 = splitQ8(q8raw);
  const q9 = answerSingleScore("Q9", byCode);
  const q10 = answerSingleScore("Q10", byCode);
  const q11 = answerSingleScore("Q11", byCode);
  const q12 = Math.max(1, answerSingleScore("Q12", byCode)); // floor at 1

  const s2q1 = answerSingleScore("S2-Q1", byCode);
  const s2q2 = answerSingleScore("S2-Q2", byCode);
  const s2q3 = answerSingleScore("S2-Q3", byCode);
  const s2q4 = answerSingleScore("S2-Q4", byCode);
  const s2q5 = likertScore("S2-Q5", byCode);

  const s2q6 = answerSingleScore("S2-Q6", byCode);
  const s2q7 = answerSingleScore("S2-Q7", byCode);
  const s2q8 = answerSingleScore("S2-Q8", byCode);
  const s2q9 = answerSingleScore("S2-Q9", byCode);

  const { score: s2q11, noneSelected: noAiTools } = s2q11Score(byCode);
  const s2q12 = noAiTools ? 0 : answerSingleScore("S2-Q12", byCode);
  const s2q13 = noAiTools ? 0 : answerSingleScore("S2-Q13", byCode);
  const s2q14 = likertScore("S2-Q14", byCode);

  const s2q16 = likertScore("S2-Q16", byCode);
  const s2q17 = answerSingleScore("S2-Q17", byCode);
  const s2q18 = answerSingleScore("S2-Q18", byCode);
  const s2q19 = answerSingleScore("S2-Q19", byCode);
  const s2q20 = answerSingleScore("S2-Q20", byCode);

  const s2q21 = s2q21Score(byCode);
  const s2q22 = answerSingleScore("S2-Q22", byCode);
  const s2q24 = likertScore("S2-Q24", byCode);

  const s2q25 = Math.max(1, answerSingleScore("S2-Q25", byCode)); // floor at 1
  const s2q26 = answerSingleScore("S2-Q26", byCode);
  const s2q27 = answerSingleScore("S2-Q27", byCode);

  // ── Pillar raw scores ───────
  const dataFoundationRaw =
    q4 + q5 + q6 + (hasStage2 ? s2q1 + s2q2 + s2q3 + s2q4 + s2q5 : 0);
  const dataFoundationMax = hasStage2 ? 32 : 12;

  const processRaw =
    q7 + q8.process + (hasStage2 ? s2q6 + s2q7 + s2q8 + s2q9 : 0);
  const processMax = hasStage2 ? 22 : 6;

  const aiAdoptionRaw =
    q8.ai + q9 + (hasStage2 ? s2q11 + s2q12 + s2q13 + s2q14 : 0);
  const aiAdoptionMax = hasStage2 ? 22 : 6;

  const teamRaw =
    q10 +
    q11 +
    (hasStage2 ? s2q16 + s2q17 + s2q18 + s2q19 + s2q20 : 0);
  const teamMax = hasStage2 ? 28 : 8;

  const visibilityRaw = hasStage2 ? s2q21 + s2q22 + s2q24 : 0;
  const visibilityMax = hasStage2 ? 12 : 0;

  const disruptionRaw = q12 + (hasStage2 ? s2q25 + s2q26 + s2q27 : 0);
  const disruptionMax = hasStage2 ? 16 : 4;

  // ── Normalise to pillar weights ───────
  const dataFoundationN = normalisePillar(
    dataFoundationRaw,
    dataFoundationMax,
    20
  );
  const processN = normalisePillar(processRaw, processMax, 20);
  const aiAdoptionN = normalisePillar(aiAdoptionRaw, aiAdoptionMax, 15);
  const teamN = normalisePillar(teamRaw, teamMax, 20);
  const visibilityN = hasStage2
    ? normalisePillar(visibilityRaw, visibilityMax, 10)
    : 0;
  const disruptionN = normalisePillar(disruptionRaw, disruptionMax, 15);

  // Total: when partial (Stage 1 only), exclude AI Visibility (10pt) from
  // the denominator and rescale to 100. Otherwise sum normalised pillars.
  let totalScore: number;
  if (hasStage2) {
    totalScore = Math.round(
      dataFoundationN +
        processN +
        aiAdoptionN +
        teamN +
        visibilityN +
        disruptionN
    );
  } else {
    const partialSum =
      dataFoundationN + processN + aiAdoptionN + teamN + disruptionN;
    // Stage 1 max = 90 (everything except 10pt Visibility). Rescale to 100.
    totalScore = Math.round((partialSum / 90) * 100);
  }

  const tier = assignTier(totalScore);

  // ── Flags ───────
  const flags: BariFlags = {
    disruption_danger_zone: false,
    data_history_insufficient: hasStage2 && s2q3 === 0,
    founder_fluency_gap:
      hasStage2 && (byCode.get("S2-Q16")?.likert_value ?? 5) <= 2,
    no_ai_tools: hasStage2 && noAiTools,
    visibility_self_gap:
      hasStage2 &&
      Math.abs(s2q24 - (s2q21 + s2q22) / 2) > 1.5,
  };

  if (hasStage2) {
    const exposurePct =
      (s2q25 + s2q26 + s2q27 + q12) / 16;
    const adoptionPct =
      (q8.ai + q9 + s2q11 + s2q12 + s2q13 + s2q14) / 22;
    const teamPct =
      (q10 + q11 + s2q16 + s2q17 + s2q18 + s2q19 + s2q20) / 28;
    if (exposurePct >= 0.55 && adoptionPct <= 0.3 && teamPct <= 0.3) {
      flags.disruption_danger_zone = true;
    }
  }

  // ── Qualitative context ───────
  const qualitative: Record<string, string> = {};
  for (const a of answers) {
    if (a.text_answer && a.text_answer.trim().length > 0) {
      qualitative[a.question_code] = a.text_answer.trim();
    }
  }

  return {
    total_score: totalScore,
    tier,
    pillars: {
      data_foundation: {
        pillar: "data_foundation",
        raw_score: dataFoundationRaw,
        raw_max: dataFoundationMax,
        normalised: dataFoundationN,
        pillar_weight: 20,
        pct: dataFoundationRaw / dataFoundationMax,
        tier_label: pillarTier(dataFoundationN, 20),
      },
      process_digitisation: {
        pillar: "process_digitisation",
        raw_score: processRaw,
        raw_max: processMax,
        normalised: processN,
        pillar_weight: 20,
        pct: processRaw / processMax,
        tier_label: pillarTier(processN, 20),
      },
      ai_adoption_baseline: {
        pillar: "ai_adoption_baseline",
        raw_score: aiAdoptionRaw,
        raw_max: aiAdoptionMax,
        normalised: aiAdoptionN,
        pillar_weight: 15,
        pct: aiAdoptionRaw / aiAdoptionMax,
        tier_label: pillarTier(aiAdoptionN, 15),
      },
      team_readiness: {
        pillar: "team_readiness",
        raw_score: teamRaw,
        raw_max: teamMax,
        normalised: teamN,
        pillar_weight: 20,
        pct: teamRaw / teamMax,
        tier_label: pillarTier(teamN, 20),
      },
      ai_search_visibility: {
        pillar: "ai_search_visibility",
        raw_score: visibilityRaw,
        raw_max: visibilityMax,
        normalised: visibilityN,
        pillar_weight: 10,
        pct: hasStage2 ? visibilityRaw / Math.max(visibilityMax, 1) : 0,
        tier_label: hasStage2
          ? pillarTier(visibilityN, 10)
          : "Not Assessed",
      },
      disruption_exposure: {
        pillar: "disruption_exposure",
        raw_score: disruptionRaw,
        raw_max: disruptionMax,
        normalised: disruptionN,
        pillar_weight: 15,
        pct: disruptionRaw / disruptionMax,
        tier_label: pillarTier(disruptionN, 15),
      },
    },
    flags,
    qualitative,
    is_partial: isPartial,
    stage_completed: hasStage2 ? 2 : 1,
  };
}

// ── Narrative templates ────────────────────────────────────
// Used until LLM-generated narrative is wired in.

export const PILLAR_LABEL: Record<BariPillar, string> = {
  data_foundation: "Data Foundation",
  process_digitisation: "Process Digitisation",
  ai_adoption_baseline: "AI Adoption Baseline",
  team_readiness: "Team & Leadership Readiness",
  ai_search_visibility: "AI Search Visibility",
  disruption_exposure: "Disruption Exposure",
};

export const PILLAR_SUBTITLE: Record<BariPillar, string> = {
  data_foundation: "the inputs your AI strategy will run on",
  process_digitisation: "the operational substrate AI plugs into",
  ai_adoption_baseline: "where your team currently sits on the curve",
  team_readiness: "the human side of execution",
  ai_search_visibility: "how AI answer engines see your business",
  disruption_exposure: "the strategic shifts already in motion",
};

export const TIER_VERDICT: Record<BariTierCode, string> = {
  T5: "A business positioned to compound from AI — the window for outsized advantage is now.",
  T4: "A business with the foundation to move — if it chooses where to move first.",
  T3: "Partial readiness with clear gaps. A structured roadmap is required to convert potential into outcomes.",
  T2: "Awareness exceeds infrastructure. Foundational work precedes AI strategy.",
  T1: "Not yet ready for meaningful AI adoption. Start with digitisation discipline first.",
};

export function getPillarSignal(
  pillar: BariPillar,
  pillarScore: BariPillarScore
): string {
  if (pillarScore.tier_label === "Not Assessed") {
    return "Not assessed in Stage 1. Complete Stage 2 to reveal this pillar.";
  }
  const pct = pillarScore.pct;
  const tier: "low" | "mid" | "high" =
    pct >= 0.65 ? "high" : pct >= 0.35 ? "mid" : "low";
  const signals: Record<BariPillar, Record<typeof tier, string>> = {
    data_foundation: {
      low: "Your data infrastructure has gaps that will limit what AI can do for you.",
      mid: "Your data foundation is partially there — specific gaps are identified below.",
      high: "Your data infrastructure is a relative strength.",
    },
    process_digitisation: {
      low: "Critical processes are still running manually. AI adoption requires digitisation first.",
      mid: "Your operations are partially digitised — clear next steps are outlined below.",
      high: "Your process digitisation is ahead of most businesses at your stage.",
    },
    ai_adoption_baseline: {
      low: "Your AI adoption baseline is early-stage. There is a clear path forward.",
      mid: "AI tools are present but not yet strategic.",
      high: "Your current AI adoption gives you a meaningful head start.",
    },
    team_readiness: {
      low: "Your team and leadership readiness has a critical gap that will slow any AI initiative.",
      mid: "Team readiness is developing.",
      high: "Your team has the foundation to execute an AI strategy.",
    },
    ai_search_visibility: {
      low: "Your online presence may not reflect the depth of your business to AI answer engines.",
      mid: "You have meaningful presence but distinctiveness is limited.",
      high: "You appear well-positioned for AI-driven discovery.",
    },
    disruption_exposure: {
      low: "Your business has limited exposure to short-term AI displacement.",
      mid: "You face meaningful disruption exposure.",
      high: "Your disruption exposure is significant and warrants strategic response.",
    },
  };
  return signals[pillar][tier];
}

export function getPillarBody(
  pillar: BariPillar,
  pillarScore: BariPillarScore
): string[] {
  const tier: "low" | "mid" | "high" =
    pillarScore.pct >= 0.65 ? "high" : pillarScore.pct >= 0.35 ? "mid" : "low";

  const bodies: Record<BariPillar, Record<typeof tier, string[]>> = {
    data_foundation: {
      low: [
        "Your data signals describe a business where critical operational records are not yet in a form AI can use. Information lives in messages, spreadsheets, or people's heads — not in connected systems that can be queried, joined, or analysed at speed.",
        "AI tools that deliver the highest return — forecasting, anomaly detection, automated personalisation — require data that is clean, connected, and accessible. Until that foundation exists, AI deployment will produce thin or unreliable results regardless of which tool you pick.",
      ],
      mid: [
        "Your data signals describe a business that has moved beyond chaos but has not yet built the connected infrastructure that makes AI useful at scale. Operational data exists, but the architecture is fragmented across siloed tools.",
        "This matters for AI adoption in a specific way. The high-return AI use cases — forecasting, personalisation, anomaly detection — assume queryable historical data. Below roughly 12 months of structured records in a connected system, those tools cannot perform at the level their marketing suggests.",
      ],
      high: [
        "Your data foundation is a real asset. Operational data is connected, queryable, and available to the people who need it. This is the substrate AI runs on — and most businesses your size do not yet have it.",
        "The leverage point now is shifting from infrastructure to insight. The data is there; the next move is structured experimentation against high-value AI use cases your data can support.",
      ],
    },
    process_digitisation: {
      low: [
        "A meaningful share of your operational work still runs through manual or verbal handoffs. SOPs are absent, outdated, or unused, and repetitive tasks remain stubbornly hands-on.",
        "AI cannot automate what is not yet digital. Before tooling decisions, the priority is mapping and documenting the three or four highest-volume processes — that work pays dividends regardless of which AI tools you eventually adopt.",
      ],
      mid: [
        "Your operations are partially digitised. Some processes are documented and tool-supported; others are still tribal. The risk is not lack of progress — it is inconsistency.",
        "AI deployment compounds where processes are stable and documented. Identify the two processes most ready for AI augmentation today, lock them in writing, and build from there.",
      ],
      high: [
        "Your process digitisation is genuinely ahead of most businesses at your stage. Operations are documented, tool-supported, and reasonably consistent across the team — the substrate AI plugs into.",
        "The next move is selective AI augmentation against your most repetitive and structured workflows. The infrastructure is ready; the question is which workflows to upgrade first.",
      ],
    },
    ai_adoption_baseline: {
      low: [
        "Your team's relationship with AI is early-stage. Tools are absent, used sporadically, or limited to a few power users without spread.",
        "This is not a weakness so much as an unpriced opportunity. Start with one high-return use case — proposal drafting, customer-message templating, or research synthesis — and codify a single repeatable workflow before expanding.",
      ],
      mid: [
        "AI tools are present in your business but not yet strategic. Usage is real but uneven, and measurable impact has not been formalised.",
        "The path forward is shifting from ad-hoc adoption to systematic deployment. Pick one or two functions where AI is already getting used, document the actual workflow, and turn it into a team-wide standard.",
      ],
      high: [
        "AI is meaningfully embedded in how work gets done across your team. Multiple functions use AI tools consistently, and impact is observable.",
        "The leverage shifts now from adoption to optimisation: structured prompt frameworks, ROI tracking, and selective deployment of more advanced tools where the foundation supports them.",
      ],
    },
    team_readiness: {
      low: [
        "The human side of AI execution is the most consistent failure mode in adoption. Your readiness signals suggest the capability and the ownership for an AI strategy do not yet exist in a sustained form.",
        "Before tool selection, the priority is a designated owner with mandate and bandwidth, plus a foundational layer of team AI literacy. Without those, even the right tools fail to land.",
      ],
      mid: [
        "Your team and leadership readiness is developing. Capability and ownership exist in patches but are not yet structured to execute a sustained AI strategy.",
        "The investment that pays off most reliably here is not tools — it is a clear AI owner with allocated time, plus structured upskilling for the people who would use AI day-to-day.",
      ],
      high: [
        "Your team has the foundation to execute. There is ownership, there is appetite, and there is the cultural readiness to absorb new tools without resistance.",
        "This is rare and underrated. The constraint on your AI adoption from here is unlikely to be people — it will be sequencing, focus, and the discipline to measure what's working.",
      ],
    },
    ai_search_visibility: {
      low: [
        "When potential customers ask AI tools about businesses like yours, your presence in the answer is unlikely. Online footprint is thin, content is rare or promotional, and third-party signals are limited.",
        "AI answer engines preferentially cite educational, opinionated, and data-rich content. The first move is publishing one or two substantive pieces that answer the questions your buyers actually ask — quality matters more than cadence.",
      ],
      mid: [
        "Your online presence is real but undifferentiated. Content exists, but the share that is genuinely substantive — educational, opinionated, data-driven — is limited.",
        "The leverage point is not more channels but better signal: a small body of high-quality content that AI engines will surface when relevant questions are asked. Consistency over volume.",
      ],
      high: [
        "Your online presence and content quality position you well for AI-driven discovery. You are likely to appear in answer-engine responses for relevant queries.",
        "The next move is reinforcing the moat: structured content frameworks, third-party citation cultivation, and topic authority in the dimensions that matter most to your buyer.",
      ],
    },
    disruption_exposure: {
      low: [
        "Your business model has limited exposure to near-term AI displacement. Work that requires physical presence, relationships, or complex judgment compounds rather than commoditises.",
        "Lower exposure is not the same as immunity. The strategic question is where AI changes the economics of your industry over a 3–5 year horizon — that warrants annual revisiting even if the current snapshot is favourable.",
      ],
      mid: [
        "You face meaningful disruption exposure. A material share of your operations could be AI-assisted or automated, and competitive pressure is rising in your space.",
        "The strategic position is not yet documented. The priority is articulating where AI changes your industry's economics over 12–24 months and identifying the two or three moves that compound your defensibility.",
      ],
      high: [
        "Your disruption exposure is significant. A majority of your current work is in principle automatable, and adoption among your competitors has likely already begun.",
        "The strategic move is not delaying AI — it is leading the transition deliberately. A documented AI strategy with priorities, owners, and timelines is the highest-leverage artefact you can produce in the next 30 days.",
      ],
    },
  };

  return bodies[pillar][tier];
}

export function getPillarActions(
  pillar: BariPillar,
  pillarScore: BariPillarScore
): string[] {
  const tier: "low" | "mid" | "high" =
    pillarScore.pct >= 0.65 ? "high" : pillarScore.pct >= 0.35 ? "mid" : "low";

  const actions: Record<BariPillar, Record<typeof tier, string[]>> = {
    data_foundation: {
      low: [
        "Choose one operational system (CRM, POS, finance) where you record the most critical business data. Commit to a 30-day window of clean, consistent data entry there.",
        "Stop trying to deploy advanced AI tools until your data is queryable. Move foundational records out of WhatsApp and spreadsheets into one canonical system.",
        "Document the three pieces of business data you check most often. Build a single dashboard that surfaces them automatically before introducing any AI layer.",
      ],
      mid: [
        "Audit your three most important operational tools. Identify which pairs are not exchanging data and implement one integration in the next 30 days using Make, Zapier, or built-in connectors.",
        "Set a minimum data retention and entry standard for client records. Every engagement should produce the same structured fields.",
        "If you have less than 12 months of structured, queryable engagement data, prioritise accumulation before deploying AI tools that require predictive history.",
      ],
      high: [
        "Identify the two highest-value AI use cases your data can already support — forecasting, anomaly detection, personalisation — and run a 30-day pilot with measurable outcomes.",
        "Establish a quarterly data-quality review. The risk at your level is not infrastructure but drift; metric-tracked quality keeps the foundation usable.",
        "Begin sharing data access with a wider operating layer of the team. Insight bottlenecks happen when data stays with founders or single departments.",
      ],
    },
    process_digitisation: {
      low: [
        "Pick the single most repetitive task in your business. Document it end-to-end this week — even a rough version is more valuable than no version.",
        "Move all SOPs into one shared, current location. Set a quarterly review cadence so they don't decay back to tribal knowledge.",
        "Don't buy AI tools yet. Buy time to digitise the three highest-friction workflows first; AI lands harder on stable digital substrate.",
      ],
      mid: [
        "Identify the two processes already documented and tool-supported. Add an AI augmentation layer (drafting, summarisation, categorisation) and measure time saved.",
        "Resolve the 'tried but abandoned' tools first. The pattern under failed adoption is usually missing process — not missing tooling.",
        "Standardise customer-facing workflows across the team. Consistency unlocks AI; inconsistency makes AI output unreliable.",
      ],
      high: [
        "Run a quarterly process audit: which workflows have decayed, which new ones lack documentation. Maintenance compounds.",
        "Layer AI on top of the workflows where structure is highest — not those where pain is highest. Counterintuitive but the ROI is more reliable.",
        "Begin codifying institutional knowledge into prompt frameworks. The team's expertise should outlive any individual contributor.",
      ],
    },
    ai_adoption_baseline: {
      low: [
        "Pick one task — drafting, research, summarising — and run it through ChatGPT or Claude for two weeks. The goal is exposure, not output.",
        "Set a $20-per-month budget for one AI tool that fits the business function with the highest repetitive output. Treat it as a learning expense, not a productivity one.",
        "Identify one team member who has shown curiosity about AI. Give them 2 hours per week to experiment and report back.",
      ],
      mid: [
        "Build a structured prompt framework for your highest-volume task — proposals, client emails, internal reports. Document it. Spread it.",
        "Track AI impact informally for one month: hours saved, output volume, quality. The act of measuring shifts the conversation.",
        "Identify one function (sales, ops, content) where AI is already partially adopted. Make it the centre of gravity for further investment.",
      ],
      high: [
        "Move from ad-hoc to systematic. Establish a small evaluation framework for new AI tools: who tries it, when, what success looks like.",
        "Track AI impact as a metric. Hours saved, output increase, defect reduction — pick two and report them monthly.",
        "Begin selectively deploying agentic and workflow-level AI tools. The substrate exists; the next layer is autonomy.",
      ],
    },
    team_readiness: {
      low: [
        "Designate one person — even part-time — as the AI lead. The single most predictive variable for adoption success is having a named owner.",
        "Run one structured AI literacy session for the broader team. The goal is shared vocabulary, not advanced skill.",
        "If you're the founder and AI fluency is a personal gap, invest 4 hours this month in your own learning before delegating strategy.",
      ],
      mid: [
        "Allocate explicit time to your designated AI lead. Without protected time, AI initiatives compete with operational fires and lose.",
        "Set up a monthly internal demo: someone shows what they've built or used. Visibility breeds adoption.",
        "Identify the team members most resistant to new tools. Their concerns often surface real adoption blockers worth fixing.",
      ],
      high: [
        "Your team is your AI moat. Invest in retention and continued upskilling more than tooling.",
        "Establish formal AI experimentation time — 10% or a half-day a week. The compound returns are larger than they look.",
        "Begin building AI capability into hiring criteria for new roles where AI will be a meaningful productivity multiplier.",
      ],
    },
    ai_search_visibility: {
      low: [
        "Publish one substantive piece of content this month that answers a question your buyers actually ask. Quality over cadence.",
        "Get listed where your buyers search. Reviews on Google, G2, or industry directories are higher-signal than social posts.",
        "Audit the three competitors most cited by AI tools in your category. Reverse-engineer what content earns the citation.",
      ],
      mid: [
        "Pick one content channel and commit to consistency. Two substantive pieces a month outperform ten promotional posts.",
        "Build a small library of opinionated, data-rich content on your domain. AI answer engines preferentially cite distinctive voices.",
        "Cultivate third-party citations: industry publications, partner blogs, podcast appearances. External signals weight heavily.",
      ],
      high: [
        "Reinforce topic authority in the two or three dimensions most relevant to your buyer. Depth beats breadth in AI-driven discovery.",
        "Track your appearance in AI answers quarterly. Test the questions your ideal buyer would ask.",
        "Begin formal thought-leadership content with structured frameworks. AI engines reward citable, structured insight.",
      ],
    },
    disruption_exposure: {
      low: [
        "Build a 12-month watchlist of AI capabilities most likely to change your industry's economics. Revisit quarterly.",
        "Identify the human element in your value delivery that genuinely cannot be replaced. Invest in deepening it.",
        "Use your low exposure as runway. Adopt AI internally for productivity now while the strategic stakes remain low.",
      ],
      mid: [
        "Document your current AI strategy in one page. Owners, priorities, timelines. The artifact forces clarity.",
        "Map two or three competitors' AI moves. Where they have advantages today is often where you have weeks, not years, to respond.",
        "Identify your defensible moat in writing. Vague answers to 'what AI cannot replace' signal a strategic gap worth closing now.",
      ],
      high: [
        "Treat AI strategy as a board-level priority. Documented, owned, and reviewed monthly — not delegated to operations.",
        "Sequence offensive AI adoption (productivity, augmentation) before defensive moves (positioning, repositioning). The first compounds; the second buys time.",
        "Identify the part of your business with the highest disruption exposure. Move it onto AI-augmented rails first, deliberately, with measurement.",
      ],
    },
  };

  return actions[pillar][tier];
}

export function getExecutiveSummary(result: BariScoreResult): string[] {
  const pillars = Object.values(result.pillars).filter(
    (p) => p.tier_label !== "Not Assessed"
  );
  const sorted = [...pillars].sort((a, b) => b.pct - a.pct);
  const strengths = sorted.slice(0, 2).map((p) => PILLAR_LABEL[p.pillar]);
  const gaps = sorted
    .slice(-2)
    .reverse()
    .map((p) => PILLAR_LABEL[p.pillar]);

  const tierVerdict = TIER_VERDICT[result.tier.code];

  const para1 =
    `Your business enters this assessment with two relative strengths — ${strengths.join(" and ")} — and clear room in ${gaps.join(" and ")}. ` +
    `A score of ${result.total_score} places you in the ${result.tier.label} tier: ${tierVerdict.toLowerCase()}`;

  const para2 = result.is_partial
    ? "This is a Stage 1 partial assessment. AI Search Visibility was not yet evaluated; complete Stage 2 to surface the full six-pillar profile and a tailored 30-60-90 day roadmap."
    : "The clearest tension in your profile is between what your team can execute and what your operational and data infrastructure can support today. The actions below are sequenced to close that gap deliberately.";

  return [para1, para2];
}

export function getRoadmap(
  result: BariScoreResult
): { phase: string; theme: string; milestones: string[] }[] {
  const sorted = Object.values(result.pillars)
    .filter((p) => p.tier_label !== "Not Assessed")
    .sort((a, b) => a.pct - b.pct);
  const weakestPillar = sorted[0]?.pillar ?? "data_foundation";

  const day30: Record<BariPillar, { theme: string; milestones: string[] }> = {
    data_foundation: {
      theme: "Connect the infrastructure",
      milestones: [
        "Audit and connect your three core operational tools",
        "Set a minimum data-quality standard for new records",
        "Move critical data out of WhatsApp / spreadsheets into one canonical system",
      ],
    },
    process_digitisation: {
      theme: "Document the highest-volume processes",
      milestones: [
        "Map and document your three most repetitive workflows",
        "Move all SOPs into one shared, current location",
        "Identify the one process most ready for AI augmentation",
      ],
    },
    ai_adoption_baseline: {
      theme: "Establish a foothold",
      milestones: [
        "Pick one task and run it through Claude or ChatGPT for two weeks",
        "Allocate a small monthly budget to one fit-for-purpose AI tool",
        "Identify one team member to lead AI experimentation",
      ],
    },
    team_readiness: {
      theme: "Designate ownership",
      milestones: [
        "Name a single AI lead with allocated time",
        "Run one structured AI literacy session for the broader team",
        "If founder fluency is a gap, invest 4 hours of personal learning",
      ],
    },
    ai_search_visibility: {
      theme: "Publish substantive signal",
      milestones: [
        "Publish one substantive piece of content this month",
        "Get listed in the directories and review sites your buyers consult",
        "Audit and reverse-engineer the most-cited competitors",
      ],
    },
    disruption_exposure: {
      theme: "Document the strategic position",
      milestones: [
        "Document your one-page AI strategy: owners, priorities, timelines",
        "Identify your defensible moat in writing",
        "Map the AI moves of your two most concerning competitors",
      ],
    },
  };

  const day60 = {
    phase: "Days 31–60",
    theme: "Deploy first AI functions",
    milestones: [
      "Apply AI augmentation to the workflow you documented in days 1–30",
      "Spread the new workflow to the full team in a structured session",
      "Establish a measurement habit — track time saved or output increase",
    ],
  };

  const day90 = {
    phase: "Days 61–90",
    theme: "Measure, adjust, scale",
    milestones: [
      "Run an AI adoption review — what's working, by whom, with what impact",
      "Identify the next workflow to systematise",
      "Draft your one-page AI strategy with priorities and owners",
    ],
  };

  return [
    {
      phase: "Days 1–30",
      ...day30[weakestPillar],
    },
    day60,
    day90,
  ];
}
