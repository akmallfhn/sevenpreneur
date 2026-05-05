# Sevenpreneur — AI Agent Guide

This document covers the AI-powered features built into the platform and how to extend them. It is intended for developers (and AI coding assistants) building on top of the agentic infrastructure.

## Platform AI Features

### 1. AI Tools (Agora)

Interactive AI tools for entrepreneurs — idea validator, market size estimator, competitor grader, COGS calculator, business chat.

**Data flow:**
1. User submits a prompt via a tool UI in `/agora/ai-tools/`
2. `ai_tool.use` tRPC procedure dispatches a QStash job
3. QStash calls the webhook at `src/app/(api)/api/qstash/` with the job payload
4. The webhook calls OpenAI, writes the result to `AIResult`
5. Frontend polls `ai_tool.read` until `status === "DONE"`

**Key files:**
- `src/trpc/routers/ai_tool/` — procedures: `check`, `use`, `read`, `delete`, `list`, `prompt`
- `src/lib/qstash.ts` — QStash client
- Prisma models: `AITool`, `AIResult`, `AIConversation`, `AIChat`

**Adding a new AI tool:**
1. Create a row in the `AITool` table (via admin or migration seed)
2. Write the system prompt in the `Template` table or inline in the router
3. The `use` procedure accepts `tool_id` + user input — no new procedure needed for most tools
4. Add UI in `src/components/pages/` with the `*SVP` or `*LMS` suffix convention

### 2. AI Conversations (Chat)

Persistent chat history per user per tool. Stored in `AIConversation` (session) and `AIChat` (messages).

- Context window management is manual — trim history before sending to OpenAI if conversation grows long
- Multi-turn context: load prior `AIChat` rows, format as `[{role, content}]`, prepend to new request

### 3. Ailene — AI Learn Platform

Structured learning journeys with quizzes and live sessions. The "AI" in Ailene refers to the subject matter (teaching AI adoption), not an embedded LLM agent — though AI can be added to lessons.

**Prisma models:** `AiLearnJourney` → `AiLearnLesson` → `AiLearnQuizQuestion` / `AiLearnQuizOption`
**Participation:** `AiLearnMember`, `AiLearnUserProgress`, `AiLearnSession`, `AiLearnSessionAttendance`

**Router:** `src/trpc/routers/ailene/`
**Procedure guard:** `aileneProcedure` (user must be an Ailene member)

### 4. Lab — B2B AI Adoption Program

Enterprise-facing program. Three stakeholder roles drive the product design (see below).

**Stakeholder hierarchy (always design in this order):**
1. **Sponsor** (C-Level) — needs ROI proof, renewal decision maker
2. **Champion** (Manager) — drives team adoption, needs team health visibility
3. **Student** (Employee) — integrates AI into daily workflow, needs quick wins

**Key Prisma models:**
- `LabCompany`, `LabMember`, `LabTeam`, `LabTeamMember`
- `LabUseCase` — AI use case submissions by students
- `LabCompetencyScore` — skill/adoption scoring
- `LabCoachingNote`, `LabCoachingSession` — coaching records
- `LabObstacle`, `LabAchievement`, `LabAppreciation` — engagement tracking

**Router:** `src/trpc/routers/lab/`
**Procedure guard:** `labProcedure`

**B2B demo page:** `src/app/(ailene)/ailene/b2b/` — hardcoded demo showing all three stakeholder views as tabs (Sponsor dashboard, Champion team roster, Student onboarding)

## OpenAI Integration

Client is initialized inline in route handlers/procedures (not a shared singleton) using `process.env.OPENAI_API_KEY`.

**Calling OpenAI from a tRPC procedure:**
```ts
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userInput },
  ],
});

const result = response.choices[0].message.content;
```

**For long-running AI tasks:** dispatch via QStash instead of blocking the tRPC call.

## QStash — Async Job Pattern

Used when an AI call would exceed tRPC's request timeout.

```ts
// 1. Dispatch job (inside a tRPC procedure or API route)
import { qstash } from "@/lib/qstash";

await qstash.publishJSON({
  url: `${process.env.APP_URL}/api/qstash/your-job`,
  body: { jobId, userId, input },
});

// 2. Handle job (src/app/(api)/api/qstash/your-job/route.ts)
export async function POST(req: Request) {
  // Verify QStash signature first
  const body = await req.json();
  // ... call OpenAI, write result to DB
}
```

Always verify the QStash signing key in webhook handlers before processing.

## WhatsApp Integration

Used for lead management and automated alerts.

- API client: `src/lib/whatsapp.ts`
- Utilities/templates: `src/lib/whatsapp-utils.tsx`
- Prisma models: `WAConversation`, `WAChat`, `WAAsset`, `WAAlert`
- Router: `src/trpc/routers/wa/`
- Webhook: `src/app/(api)/api/whatsapp/`
- Scheduled alerts dispatched via QStash or n8n

## Adding a New Agentic Feature — Checklist

1. Define the Prisma model(s) and run `prisma migrate dev`
2. Write the tRPC procedure(s) in the appropriate router under `src/trpc/routers/`
3. Register the procedure in `src/trpc/routers/_app.ts`
4. For async AI: add a QStash webhook handler in `src/app/(api)/api/qstash/`
5. Build UI components with the correct suffix (`*CMS`, `*LMS`, `*Lab`, `*SVP`)
6. Use `loggedInProcedure` / role-specific procedures — never expose AI costs to unauthenticated users

## Environment Variables (AI-related)

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI API access |
| `QSTASH_TOKEN` | QStash publish token |
| `QSTASH_CURRENT_SIGNING_KEY` | Webhook verification |
| `QSTASH_NEXT_SIGNING_KEY` | Webhook verification (rotation) |
| `UPSTASH_REDIS_REST_URL` | Redis for caching/rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth |
