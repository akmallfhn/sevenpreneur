// BARI (Business AI Readiness Index) — hardcoded question bank.
// Source: docs/QuestionBank_BARI.md (v1.0, 43 questions).
//
// Q1–Q3 (context block) are stored on the bari_assessments row directly:
//   - Q1 industry  → industry_id (FK industries)
//   - Q2 team_size → NumEmployeeEnum
//   - Q3 revenue   → BariRevenueModelEnum
// Q4 onward live in bari_answers with question_code matching `code` below.

export type BariPillar =
  | "data_foundation"
  | "process_digitisation"
  | "ai_adoption_baseline"
  | "team_readiness"
  | "ai_search_visibility"
  | "disruption_exposure";

export type BariFormat =
  | "mc_single"
  | "mc_multi"
  | "likert"
  | "open_text"
  | "url";

export type BariWeight = "high" | "medium" | "low" | "context";

export interface BariOption {
  code: string;
  label: string;
  score: number;
  is_override?: boolean;
}

export interface BariQuestion {
  code: string;
  stage: 1 | 2;
  pillar?: BariPillar;
  format: BariFormat;
  prompt: string;
  weight: BariWeight;
  is_scored: boolean;
  max_select?: number;
  char_limit?: number;
  options?: BariOption[];
}

export const BARI_QUESTIONS: BariQuestion[] = [
  // ── Stage 1 ──
  {
    code: "Q4",
    stage: 1,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "Where does the most important operational data in your business currently live?",
    options: [
      { code: "a", label: "Mostly in people's heads or verbal handoffs", score: 0 },
      { code: "b", label: "Primarily in WhatsApp, email threads, or text messages", score: 1 },
      { code: "c", label: "In spreadsheets — well-organised but not connected to other systems", score: 2 },
      { code: "d", label: "In dedicated software (CRM, ERP, POS, etc.) but siloed per tool", score: 3 },
      { code: "e", label: "In connected systems where data flows between tools automatically", score: 4 },
    ],
  },
  {
    code: "Q5",
    stage: 1,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "How often does your business produce a structured report — sales, finance, operations — without someone manually compiling it?",
    options: [
      { code: "a", label: "Never. Reports require manual work every time", score: 0 },
      { code: "b", label: "Occasionally, but it takes hours of prep", score: 1 },
      { code: "c", label: "Monthly or quarterly, with moderate effort", score: 2 },
      { code: "d", label: "Weekly or more often, mostly automated", score: 3 },
      { code: "e", label: "Real-time dashboards exist and are actively used", score: 4 },
    ],
  },
  {
    code: "Q6",
    stage: 1,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "If you needed to find all sales transactions from the last 90 days, filtered by product category and customer location — how long would that take?",
    options: [
      { code: "a", label: "We don't have that data in a queryable form", score: 0 },
      { code: "b", label: "Days — someone would need to manually compile from multiple sources", score: 1 },
      { code: "c", label: "A few hours — the data exists but needs significant cleaning", score: 2 },
      { code: "d", label: "Under an hour — the data is mostly there, needs minor work", score: 3 },
      { code: "e", label: "Minutes — it's a filter or query away", score: 4 },
    ],
  },
  {
    code: "Q7",
    stage: 1,
    pillar: "process_digitisation",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "When a new employee joins your team, how do they learn what to do and how to do it?",
    options: [
      { code: "a", label: "Someone explains it verbally and they figure it out", score: 0 },
      { code: "b", label: "There are informal notes or old documents, but nothing current", score: 1 },
      { code: "c", label: "There are written SOPs, but they live in someone's Drive folder and aren't regularly updated", score: 2 },
      { code: "d", label: "We have documented processes accessible to the team, updated at least once this year", score: 3 },
      { code: "e", label: "We have structured onboarding with digital SOPs, checklists, and tracked completion", score: 4 },
    ],
  },
  {
    code: "Q8",
    stage: 1,
    pillar: "process_digitisation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "Think about the most repetitive task your team does every week. What is its current state?",
    options: [
      { code: "a", label: "Still fully manual — done by a person every time", score: 0 },
      { code: "b", label: "Partially reduced by tools, but a person still completes most of it", score: 1 },
      { code: "c", label: "Handled by a digital tool, but not AI-powered", score: 2 },
      { code: "d", label: "Partially automated with AI — saves time but still needs oversight", score: 3 },
      { code: "e", label: "Fully automated with minimal human intervention", score: 4 },
    ],
  },
  {
    code: "Q9",
    stage: 1,
    pillar: "ai_adoption_baseline",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt: "How would you describe your team's current relationship with AI tools?",
    options: [
      { code: "a", label: "We don't use any AI tools", score: 0 },
      { code: "b", label: "A few people use consumer AI tools personally (ChatGPT, etc.) but not for work", score: 1 },
      { code: "c", label: "We use AI tools occasionally for work, but informally and without clear intent", score: 2 },
      { code: "d", label: "AI tools are part of how specific functions work — used consistently by those teams", score: 3 },
      { code: "e", label: "AI tools are embedded across multiple functions, with measurable impact we can point to", score: 4 },
    ],
  },
  {
    code: "Q10",
    stage: 1,
    pillar: "team_readiness",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "If you decided tomorrow to deploy an AI tool across your operations — who in your organisation would own making it work?",
    options: [
      { code: "a", label: "No one. It would fall to whoever had time", score: 0 },
      { code: "b", label: "It would fall to me (the founder) on top of everything else", score: 1 },
      { code: "c", label: "We have someone tech-savvy who could probably handle it", score: 2 },
      { code: "d", label: "We have a designated person or small team with the skills and bandwidth", score: 3 },
      { code: "e", label: "We have a dedicated operations or technology lead with a clear mandate for this", score: 4 },
    ],
  },
  {
    code: "Q11",
    stage: 1,
    pillar: "team_readiness",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "When your team encounters a new digital tool or system, what usually happens?",
    options: [
      { code: "a", label: "Resistance is the default — change is slow and painful", score: 0 },
      { code: "b", label: "Some people adapt; most wait to see if it sticks", score: 1 },
      { code: "c", label: "Generally receptive, but adoption is inconsistent across the team", score: 2 },
      { code: "d", label: "Most people engage with new tools willingly with enough context", score: 3 },
      { code: "e", label: "The team actively seeks better tools and pushes for adoption themselves", score: 4 },
    ],
  },
  {
    code: "Q12",
    stage: 1,
    pillar: "disruption_exposure",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "How much of what your business does today could, in principle, be done by AI within the next three years?",
    options: [
      { code: "a", label: "Very little — our work requires human judgment, relationships, or physical presence", score: 1 },
      { code: "b", label: "Some parts could be automated, but the core value is human-driven", score: 2 },
      { code: "c", label: "A significant portion could be automated, though we haven't mapped it out", score: 2 },
      { code: "d", label: "Most of our operations could be AI-assisted or automated", score: 3 },
      { code: "e", label: "Almost all of our current work could theoretically be done by AI", score: 4 },
    ],
  },
  {
    code: "Q13",
    stage: 1,
    format: "open_text",
    weight: "context",
    is_scored: false,
    char_limit: 300,
    prompt:
      "What is one specific task or process in your business that you most wish AI could handle for you right now?",
  },
  {
    code: "Q14",
    stage: 1,
    format: "open_text",
    weight: "context",
    is_scored: false,
    char_limit: 300,
    prompt:
      "What is the single biggest operational bottleneck slowing your business down right now — AI-related or not?",
  },
  {
    code: "Q15",
    stage: 1,
    format: "open_text",
    weight: "context",
    is_scored: false,
    char_limit: 200,
    prompt: "In one sentence: what does your business look like in two years if you get AI right?",
  },

  // ── Stage 2 — Pillar 1: Data Foundation ──
  {
    code: "S2-Q1",
    stage: 2,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "Who in your business can access your core operational data — sales figures, customer records, financial performance — without asking someone else for it?",
    options: [
      { code: "a", label: "Only me (the founder)", score: 1 },
      { code: "b", label: "Me and one or two senior people", score: 2 },
      { code: "c", label: "Each department head has access to their own silo", score: 2 },
      { code: "d", label: "Most managers can access the data relevant to their function", score: 3 },
      { code: "e", label: "Data is accessible to anyone who needs it, with appropriate permissions in place", score: 4 },
    ],
  },
  {
    code: "S2-Q2",
    stage: 2,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "How confident are you that the data your business records today is accurate, consistent, and complete enough to draw decisions from?",
    options: [
      { code: "a", label: "Not confident — there are known errors and gaps we haven't fixed", score: 0 },
      { code: "b", label: "Somewhat confident in some areas, but major inconsistencies exist", score: 1 },
      { code: "c", label: "Reasonably confident for most purposes, though edge cases are unreliable", score: 2 },
      { code: "d", label: "Confident — data is clean enough that we regularly make decisions from it", score: 3 },
      { code: "e", label: "Very confident — we have data validation processes and track data quality as a metric", score: 4 },
    ],
  },
  {
    code: "S2-Q3",
    stage: 2,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt: "How far back does your structured, queryable business data go?",
    options: [
      { code: "a", label: "Less than 6 months, or we don't have structured historical data", score: 0 },
      { code: "b", label: "6 months to 1 year", score: 1 },
      { code: "c", label: "1 to 2 years", score: 2 },
      { code: "d", label: "2 to 4 years", score: 3 },
      { code: "e", label: "More than 4 years of structured, accessible records", score: 4 },
    ],
  },
  {
    code: "S2-Q4",
    stage: 2,
    pillar: "data_foundation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "How many of your core business tools — your CRM, POS, accounting software, marketing platform — share data with each other automatically?",
    options: [
      { code: "a", label: "None. Each tool is a separate island", score: 0 },
      { code: "b", label: "One or two are connected (e.g., Shopify syncs to a spreadsheet)", score: 1 },
      { code: "c", label: "Some are integrated but we still do manual data transfers regularly", score: 2 },
      { code: "d", label: "Most are integrated with minimal manual intervention", score: 3 },
      { code: "e", label: "All core tools are connected in a unified data flow", score: 4 },
    ],
  },
  {
    code: "S2-Q5",
    stage: 2,
    pillar: "data_foundation",
    format: "likert",
    weight: "low",
    is_scored: true,
    prompt:
      "When your team makes an important business decision, how often is it backed by data rather than intuition or experience alone?",
  },

  // ── Stage 2 — Pillar 2: Process Digitisation ──
  {
    code: "S2-Q6",
    stage: 2,
    pillar: "process_digitisation",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "For your core business functions — sales, operations, customer service, finance — what percentage of key processes have written, up-to-date documentation?",
    options: [
      { code: "a", label: "Less than 10% — almost nothing is written down", score: 0 },
      { code: "b", label: "10–30% — some documentation exists, mostly outdated", score: 1 },
      { code: "c", label: "30–60% — key processes are documented but inconsistently", score: 2 },
      { code: "d", label: "60–85% — most processes documented, reviewed in the last year", score: 3 },
      { code: "e", label: "More than 85% — comprehensive, current, actively used documentation", score: 4 },
    ],
  },
  {
    code: "S2-Q7",
    stage: 2,
    pillar: "process_digitisation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt: "How are payroll, invoicing, and expense management handled in your business?",
    options: [
      { code: "a", label: "Manually in spreadsheets or on paper", score: 0 },
      { code: "b", label: "Partially in software but significant manual steps remain", score: 1 },
      { code: "c", label: "Managed in software, but tools are not connected to each other", score: 2 },
      { code: "d", label: "Mostly digital and connected, minor manual reconciliation needed", score: 3 },
      { code: "e", label: "Fully digital, integrated, and largely automated", score: 4 },
    ],
  },
  {
    code: "S2-Q8",
    stage: 2,
    pillar: "process_digitisation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "Does your business use any workflow automation tools — Zapier, Make, n8n, or built-in automations in your existing software?",
    options: [
      { code: "a", label: "No — we haven't implemented any automation", score: 0 },
      { code: "b", label: "We've tried but abandoned it — too complex or unreliable", score: 0 },
      { code: "c", label: "Yes, one or two simple automations that save minor time", score: 2 },
      { code: "d", label: "Yes — meaningful automations across multiple functions that we depend on", score: 3 },
      { code: "e", label: "Yes — automation is a core operational strategy; we continuously build and improve it", score: 4 },
    ],
  },
  {
    code: "S2-Q9",
    stage: 2,
    pillar: "process_digitisation",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "How do most customer interactions — inquiries, orders, support requests, follow-ups — get handled in your business?",
    options: [
      { code: "a", label: "Primarily via WhatsApp or direct messages, manually managed", score: 0 },
      { code: "b", label: "Mix of WhatsApp and email, mostly manual", score: 1 },
      { code: "c", label: "Digital channels (email, chat) but managed manually per message", score: 2 },
      { code: "d", label: "Partially systematised — ticketing, CRM tracking, or templated responses in use", score: 3 },
      { code: "e", label: "Fully systematised — CRM-tracked, templated, partially automated with clear workflows", score: 4 },
    ],
  },
  {
    code: "S2-Q10",
    stage: 2,
    pillar: "process_digitisation",
    format: "open_text",
    weight: "low",
    is_scored: false,
    char_limit: 400,
    prompt:
      "Name one process in your business that you know should be digitised or systematised but hasn't been yet. What has stopped you?",
  },

  // ── Stage 2 — Pillar 3: AI Adoption Baseline ──
  {
    code: "S2-Q11",
    stage: 2,
    pillar: "ai_adoption_baseline",
    format: "mc_multi",
    weight: "high",
    is_scored: true,
    max_select: 8,
    prompt:
      "Which of the following AI tools does your team actively use for work — not just occasionally, but as part of how work gets done?",
    options: [
      { code: "a", label: "ChatGPT, Claude, Gemini, or similar general-purpose AI", score: 1 },
      { code: "b", label: "AI-powered design tools (Midjourney, Adobe Firefly, Canva AI, etc.)", score: 1 },
      { code: "c", label: "AI sales or CRM tools", score: 1 },
      { code: "d", label: "AI content or marketing tools (Jasper, Copy.ai, etc.)", score: 1 },
      { code: "e", label: "AI customer service tools (chatbot, auto-response, ticket categorisation)", score: 1 },
      { code: "f", label: "AI analytics or BI tools", score: 1 },
      { code: "g", label: "AI coding or development tools (GitHub Copilot, Cursor, etc.)", score: 1 },
      { code: "none", label: "None of the above", score: 0, is_override: true },
    ],
  },
  {
    code: "S2-Q12",
    stage: 2,
    pillar: "ai_adoption_baseline",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "For the AI tools your team uses most — how deeply are they integrated into how work actually gets done?",
    options: [
      { code: "a", label: "We use them when we remember to, but they're not part of any regular workflow", score: 1 },
      { code: "b", label: "They're used regularly by a few people but haven't spread across the team", score: 2 },
      { code: "c", label: "They're part of how specific functions work, used consistently by those teams", score: 3 },
      { code: "d", label: "AI tools are central to our output — we'd notice immediately if they were unavailable", score: 4 },
    ],
  },
  {
    code: "S2-Q13",
    stage: 2,
    pillar: "ai_adoption_baseline",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "Can you point to a specific, measurable impact that AI tools have had on your business — time saved, cost reduced, output increased?",
    options: [
      { code: "a", label: "No — we use AI tools but haven't measured any impact", score: 0 },
      { code: "b", label: "Anecdotally yes, but we haven't formally tracked it", score: 1 },
      { code: "c", label: "We have rough estimates — AI probably saves us X hours per week", score: 2 },
      { code: "d", label: "Yes — we can point to specific, documented impact in at least one function", score: 3 },
      { code: "e", label: "Yes — we track AI impact as a metric and use it to guide adoption decisions", score: 4 },
    ],
  },
  {
    code: "S2-Q14",
    stage: 2,
    pillar: "ai_adoption_baseline",
    format: "likert",
    weight: "medium",
    is_scored: true,
    prompt:
      "When a new AI tool or capability is released that's relevant to your business, what typically happens?",
  },
  {
    code: "S2-Q15",
    stage: 2,
    pillar: "ai_adoption_baseline",
    format: "open_text",
    weight: "low",
    is_scored: false,
    char_limit: 300,
    prompt:
      "What is one specific business outcome — not a tool, but an outcome — that you want AI to help you achieve in the next 12 months?",
  },

  // ── Stage 2 — Pillar 4: Team & Leadership Readiness ──
  {
    code: "S2-Q16",
    stage: 2,
    pillar: "team_readiness",
    format: "likert",
    weight: "high",
    is_scored: true,
    prompt:
      "How would you honestly describe your own working knowledge of AI — not general awareness, but practical ability to evaluate, select, and deploy AI tools?",
  },
  {
    code: "S2-Q17",
    stage: 2,
    pillar: "team_readiness",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "Is there a specific person in your organisation — other than yourself — who is responsible for driving technology or AI adoption?",
    options: [
      { code: "a", label: "No — it falls entirely on me or whoever has bandwidth", score: 0 },
      { code: "b", label: "Informally, there's someone who tends to take on tech initiatives", score: 1 },
      { code: "c", label: "Yes — there's a designated person, though it's not their primary role", score: 2 },
      { code: "d", label: "Yes — there's someone with a clear mandate and meaningful time allocated to it", score: 3 },
      { code: "e", label: "Yes — we have a dedicated technology or operations lead for this", score: 4 },
    ],
  },
  {
    code: "S2-Q18",
    stage: 2,
    pillar: "team_readiness",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "What is the general AI literacy of your broader team — the people who would need to use AI tools day-to-day?",
    options: [
      { code: "a", label: "Most team members are unfamiliar with AI tools and would need significant training", score: 0 },
      { code: "b", label: "Awareness is there but practical skills are limited across most of the team", score: 1 },
      { code: "c", label: "A portion of the team is capable; the majority would need structured support", score: 2 },
      { code: "d", label: "Most team members can use AI tools with minimal guidance", score: 3 },
      { code: "e", label: "The team is generally capable and proactively looks for ways to use AI in their work", score: 4 },
    ],
  },
  {
    code: "S2-Q19",
    stage: 2,
    pillar: "team_readiness",
    format: "mc_single",
    weight: "medium",
    is_scored: true,
    prompt:
      "Has your business invested in any formal AI or technology training for your team in the last 12 months?",
    options: [
      { code: "a", label: "No, and it hasn't been a priority", score: 0 },
      { code: "b", label: "No, but we've discussed it", score: 1 },
      { code: "c", label: "Informally — some people have taken courses on their own", score: 2 },
      { code: "d", label: "Yes — we've run one or more structured training sessions", score: 3 },
      { code: "e", label: "Yes — AI upskilling is an ongoing programme with budget allocated", score: 4 },
    ],
  },
  {
    code: "S2-Q20",
    stage: 2,
    pillar: "team_readiness",
    format: "mc_single",
    weight: "low",
    is_scored: true,
    prompt:
      "When you identify a new tool or process change that could improve operations, how long does it typically take to go from decision to implementation?",
    options: [
      { code: "a", label: "Months — getting alignment and executing is consistently slow", score: 0 },
      { code: "b", label: "Weeks to a month — depends on who needs to be involved", score: 1 },
      { code: "c", label: "One to two weeks for most decisions", score: 2 },
      { code: "d", label: "Under a week for most decisions", score: 3 },
      { code: "e", label: "Days — the culture supports fast experimentation and iteration", score: 4 },
    ],
  },

  // ── Stage 2 — Pillar 5: AI Search Visibility ──
  {
    code: "S2-Q21",
    stage: 2,
    pillar: "ai_search_visibility",
    format: "mc_multi",
    weight: "high",
    is_scored: true,
    max_select: 7,
    prompt:
      "Where does your business have a meaningful, regularly updated online presence? Select all that apply.",
    options: [
      { code: "a", label: "A website with original, substantive content", score: 1 },
      { code: "b", label: "Active LinkedIn company page with regular posts", score: 1 },
      { code: "c", label: "YouTube channel or podcast with original content", score: 1 },
      { code: "d", label: "Active presence on industry forums, Reddit, or community platforms", score: 1 },
      { code: "e", label: "Features or mentions in third-party publications, blogs, or news", score: 1 },
      { code: "f", label: "Customer reviews on Google, Trustpilot, G2, or similar platforms", score: 1 },
      { code: "none", label: "None of the above — our online presence is minimal", score: 0, is_override: true },
    ],
  },
  {
    code: "S2-Q22",
    stage: 2,
    pillar: "ai_search_visibility",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "When your business publishes content online — articles, posts, guides — how would you describe it?",
    options: [
      { code: "a", label: "We rarely publish content", score: 0 },
      { code: "b", label: "We publish occasionally but it's mostly promotional", score: 1 },
      { code: "c", label: "We publish a mix of promotional and informational content", score: 2 },
      { code: "d", label: "Most of our content is substantive — educational, opinionated, or data-driven", score: 3 },
      { code: "e", label: "We consistently publish high-quality content that our audience finds genuinely useful and cites", score: 4 },
    ],
  },
  {
    code: "S2-Q23",
    stage: 2,
    pillar: "ai_search_visibility",
    format: "url",
    weight: "context",
    is_scored: false,
    char_limit: 500,
    prompt:
      "If you have a business website, enter the URL here. We'll use it to provide more specific visibility feedback in your report.",
  },
  {
    code: "S2-Q24",
    stage: 2,
    pillar: "ai_search_visibility",
    format: "likert",
    weight: "medium",
    is_scored: true,
    prompt:
      "If a potential customer asked ChatGPT or Google to recommend a business like yours in your city or industry, how likely do you think your business would appear in the response?",
  },

  // ── Stage 2 — Pillar 6: Disruption Exposure ──
  {
    code: "S2-Q25",
    stage: 2,
    pillar: "disruption_exposure",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "What percentage of your current team's core tasks are primarily cognitive and repetitive — writing, data entry, analysis, routing, categorisation — rather than requiring physical presence, complex judgment, or deep relationships?",
    options: [
      { code: "a", label: "Less than 20% — our work is mostly physical, relational, or highly complex", score: 1 },
      { code: "b", label: "20–40% — a minority of tasks are repetitive and cognitive", score: 2 },
      { code: "c", label: "40–60% — about half our work could theoretically be automated", score: 3 },
      { code: "d", label: "60–80% — a majority of what we do today could be AI-assisted or automated", score: 3 },
      { code: "e", label: "More than 80% — most of our current work is in principle automatable", score: 4 },
    ],
  },
  {
    code: "S2-Q26",
    stage: 2,
    pillar: "disruption_exposure",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "Are your direct competitors actively adopting AI in ways that could give them a meaningful advantage over you?",
    options: [
      { code: "a", label: "I'm not sure — I haven't looked at what competitors are doing with AI", score: 0 },
      { code: "b", label: "Probably not — our industry is slow to adopt new technology", score: 1 },
      { code: "c", label: "Some are experimenting, but it hasn't created obvious advantages yet", score: 2 },
      { code: "d", label: "Yes — I can name at least one competitor using AI in a way I find concerning", score: 3 },
      { code: "e", label: "Yes — AI adoption is already reshaping competition in our space and we feel the pressure", score: 4 },
    ],
  },
  {
    code: "S2-Q27",
    stage: 2,
    pillar: "disruption_exposure",
    format: "mc_single",
    weight: "high",
    is_scored: true,
    prompt:
      "Does your business have a deliberate strategy for responding to AI disruption in your industry — not just adopting AI tools, but positioning the business against the shifts AI is causing?",
    options: [
      { code: "a", label: "No — we haven't thought about AI at a strategic level", score: 0 },
      { code: "b", label: "We've discussed it informally but have no plan", score: 1 },
      { code: "c", label: "We have a general sense of direction but no formal strategy", score: 2 },
      { code: "d", label: "We have identified our key risks and opportunities and are actively working on them", score: 3 },
      { code: "e", label: "We have a documented AI strategy with clear priorities, owners, and timelines", score: 4 },
    ],
  },
  {
    code: "S2-Q28",
    stage: 2,
    pillar: "disruption_exposure",
    format: "open_text",
    weight: "medium",
    is_scored: false,
    char_limit: 400,
    prompt:
      "What is the part of your business that you believe AI genuinely cannot replace — your most defensible advantage? Be specific.",
  },
];

export const BARI_QUESTION_MAP = new Map(
  BARI_QUESTIONS.map((q) => [q.code, q] as const)
);

export function getBariQuestion(code: string): BariQuestion | undefined {
  return BARI_QUESTION_MAP.get(code);
}
