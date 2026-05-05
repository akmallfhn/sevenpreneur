# Sevenpreneur — Claude Code Instructions

## Project Overview

Sevenpreneur is a multi-platform SaaS for AI adoption and entrepreneurship education. It runs on a single Next.js codebase with subdomain-based routing to five distinct platforms:

| Subdomain | Route Group | Purpose |
|-----------|-------------|---------|
| `www` | `(www)` | Public website — marketing, auth, events, cohorts, articles |
| `admin` | `(admin)` | Internal CMS for managing all content and users |
| `agora` | `(agora)` | Logged-in learning platform — cohorts, playlists, AI tools |
| `ailene` | `(ailene)` | AI Learn — lesson journeys, quizzes, live sessions, leaderboard |
| `lab` | `(lab)` | Lab AI Adoption — B2B enterprise AI adoption program |

## Dev Commands

```bash
npm run dev       # Start with HTTPS (required — uses --experimental-https)
npm run build     # prisma generate + next build
npm run lint      # ESLint check
```

> Dev server **must** use HTTPS. Google OAuth and subdomain rewrites depend on it. Ngrok tunneling is supported for local testing.

## Architecture

### Routing

Subdomain routing is handled entirely in `next.config.mjs` via rewrites — `admin.localhost` → `/admin/*`, etc. All internal navigation uses path-based routes (`/admin/...`). Never use subdomain URLs in `<Link>` or `router.push`.

### API Layer — tRPC

All data fetching goes through tRPC. REST API routes are only used for webhooks (Xendit, WhatsApp, n8n, QStash).

- **Routers live in** `src/trpc/routers/`
- **Main router:** `src/trpc/routers/_app.ts` — add new routers here
- **Client:** `src/trpc/client.tsx` (React Query integration)
- **Procedures:**
  - `publicProcedure` — unauthenticated
  - `loggedInProcedure` — requires valid session token
  - `administratorProcedure` — admin role
  - `aileneProcedure` — Ailene platform members
  - `labProcedure` — Lab platform members
  - `roleBasedProcedure(roleId)` — custom role check

### Authentication

Token-based (not NextAuth). Session tokens are stored in the `Token` DB table and passed as `Authorization: Bearer <token>`. The tRPC context (`src/trpc/init.ts`) reads the header, validates against DB, and attaches `ctx.user`.

- Login entry point: `src/trpc/routers/auth.ts`
- Google OAuth via `@react-oauth/google` — token verified in `src/trpc/utils/google-token.ts`
- JWT (for external service integration) — `auth.createJWT`, expires 1h

### Database — Prisma + Supabase

- Schema: `prisma/schema.prisma`
- Client singleton: `src/lib/prisma.ts`
- Connection string uses Supabase pooler; direct URL for migrations
- Run `prisma generate` before building (it's in `npm run build`)
- Never run migrations in prod without reviewing them first

### Background Jobs

- **QStash** (`src/lib/qstash.ts`) — async AI result processing, delayed tasks
- **n8n webhooks** — payment reminders, WhatsApp alerts (external, no code here)
- **Upstash Redis** (`src/lib/redis.ts`) — caching, rate limiting

### Payments

Xendit integration at `src/lib/xendit.ts`. Webhook endpoint at `src/app/(api)/api/xendit/`. Always verify the webhook signature before processing.

## Component Conventions

Components are organized by purpose under `src/components/`:

| Folder | Contents |
|--------|----------|
| `ui/` | Primitive shadcn/ui components |
| `cards/` | Card-shaped UI blocks |
| `pages/` | Full-page layout components (one per route) |
| `modals/` | Dialog/drawer components |
| `fields/` | Form inputs (rich editor, file upload, etc.) |
| `gateways/` | Complex interactive sections |
| `items/` | Line-item / list-row components |
| `states/` | Loading skeletons & empty states |
| `navigations/` | Nav bars and sidebars |

**Naming suffix conventions:**
- `*CMS` — admin-only component
- `*SVP` — public-facing (www)
- `*LMS` — learning platform component (agora/ailene)
- `*Lab` — Lab platform component

## Styling

- Tailwind CSS v4 — config is in `src/app/globals.css` (not `tailwind.config.js`)
- Brand color tokens are defined there (blues, pinks, purples, etc.)
- Dark mode via `next-themes`
- MUI (`@mui/material`, `@mui/x-charts`) used for data visualizations only — prefer Tailwind + Radix for everything else

## Key Patterns

### Data mutations
```tsx
// Always invalidate the relevant query after mutation
const utils = trpc.useUtils();
const mutation = trpc.something.create.useMutation({
  onSuccess: () => utils.something.list.invalidate(),
});
```

### Rich text content
- Editor: `TextAreaRichEditorCMS` (wraps Tiptap)
- Stored as Tiptap JSON in DB
- Rendered with `marked` or the Tiptap renderer on the frontend

### File uploads
- Upload to Supabase Storage via `src/lib/supabase.ts`
- Store the public URL in the DB field

### AI results (async)
- AI tasks are dispatched via QStash, result written back to `AIResult` table
- Frontend polls or uses optimistic UI — check `src/trpc/routers/ai_tool/` for the pattern

## Important Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Subdomain rewrites, auth redirects, image domains |
| `prisma/schema.prisma` | Full data model |
| `src/trpc/init.ts` | tRPC context, auth middleware, procedure definitions |
| `src/trpc/routers/_app.ts` | Root router — all sub-routers registered here |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/app/globals.css` | Tailwind v4 theme tokens |

## What to Avoid

- Do not use `fetch` directly for internal data — use tRPC procedures
- Do not hardcode subdomain URLs — routing is path-based internally
- Do not bypass the `loggedInProcedure` check for protected data
- Do not add raw SQL unless Prisma cannot express it (use `$queryRaw` with parameterized queries only)
- Do not store secrets in code — all keys live in `.env`
- Do not use MUI for layout/UI outside of charts — keep styling in Tailwind
