# Sevenpreneur — Claude Code Instructions

## Project Overview

Sevenpreneur adalah multi-platform SaaS untuk AI adoption dan entrepreneurship education. Satu codebase Next.js dengan subdomain-based routing ke empat platform:

| Subdomain | Route Group | Suffix Kode | Purpose                                                         |
| --------- | ----------- | ----------- | --------------------------------------------------------------- |
| `www`     | `(www)`     | `SVP`       | Public website — marketing, auth, events, cohorts, articles     |
| `admin`   | `(admin)`   | `CMS`       | Internal CMS untuk manage semua konten dan user                 |
| `agora`   | `(agora)`   | `LMS`       | Logged-in learning platform — cohorts, playlists, AI tools      |
| `ailene`  | `(ailene)`  | `AILN`      | AI Learn — lesson journeys, quizzes, live sessions, leaderboard |

> Platform `lab` sudah dihapus sepenuhnya dari codebase.

## Dev Commands

```bash
npm run dev       # Start dengan HTTPS (wajib — pakai --experimental-https)
npm run build     # prisma generate + next build
npm run lint      # ESLint check
```

> Dev server **wajib** pakai HTTPS. Google OAuth dan subdomain rewrites butuh ini.

## Architecture

### Routing

Subdomain routing ditangani sepenuhnya di `next.config.mjs` via rewrites — `admin.localhost` → `/admin/*`, dst. Semua navigasi internal pakai path-based routes (`/admin/...`). Jangan pernah pakai subdomain URL di `<Link>` atau `router.push`.

### API Layer — tRPC

Semua data fetching lewat tRPC. REST API routes hanya untuk webhooks (Xendit, WhatsApp, n8n, QStash).

- **Routers di** `src/trpc/routers/`
- **Main router:** `src/trpc/routers/_app.ts` — tambah router baru di sini
- **Client:** `src/trpc/client.tsx` (React Query integration)
- **Procedures:**
  - `publicProcedure` — unauthenticated
  - `loggedInProcedure` — butuh session token valid
  - `administratorProcedure` — admin role
  - `aileneProcedure` — Ailene platform members
  - `roleBasedProcedure(roleId)` — custom role check

### Authentication

Token-based (bukan NextAuth). Session tokens disimpan di tabel `Token` DB dan dikirim sebagai `Authorization: Bearer <token>`. tRPC context (`src/trpc/init.ts`) baca header, validasi ke DB, dan attach `ctx.user`.

### Database — Prisma + Supabase

- Schema: `prisma/schema.prisma`
- Client singleton: `src/lib/prisma.ts`
- Connection string pakai Supabase pooler; direct URL untuk migrations
- Jalankan `prisma generate` sebelum build (sudah ada di `npm run build`)
- **Jangan jalankan migration di prod tanpa review terlebih dahulu**
- **Setiap update SQL di PostgreSQL, selalu update juga file `sevenpreneur-ddl` dan `ailene-ddl`**

### Background Jobs

- **QStash** (`src/lib/qstash.ts`) — async AI result processing, delayed tasks
- **Upstash Redis** (`src/lib/redis.ts`) — caching, rate limiting

### Payments

Xendit integration di `src/lib/xendit.ts`. Webhook endpoint di `src/app/(api)/api/xendit/`. Selalu verify webhook signature sebelum processing.

## Component Conventions

### Naming Suffix

| Suffix          | Dipakai di     | Contoh                            |
| --------------- | -------------- | --------------------------------- |
| `App*` (prefix) | Semua platform | `AppButton`, `AppModal`           |
| `*SVP`          | www saja       | `HeroSVP`, `FooterSVP`            |
| `*CMS`          | admin saja     | `UserTableCMS`, `CohortFormCMS`   |
| `*LMS`          | agora saja     | `PlaylistCardLMS`, `CourseTabLMS` |
| `*AILN`         | ailene saja    | `LeaderboardAILN`, `QuizCardAILN` |

> Komponen dengan prefix `App` bisa dipakai lintas platform. Komponen dengan suffix spesifik hanya boleh diimport di route group masing-masing.

### Folder Structure

Komponen diorganisir berdasarkan purpose di `src/components/`:

| Folder            | Isi                                                              |
| ----------------- | ---------------------------------------------------------------- |
| `ui/`             | Primitive shadcn/ui components                                   |
| `buttons/`        | Button variants                                                  |
| `cards/`          | Card-shaped UI blocks                                            |
| `charts/`         | Wrapper MUI chart components untuk visualisasi data              |
| `customs/`        | Customisasi library eksternal (Swiper, dll)                      |
| `elements/`       | Reusable UI elements — `App*` lintas platform + platform-spesifik |
| `emails/`         | React Email templates                                            |
| `fields/`         | Form inputs — rich editor, file upload, select, dll              |
| `forms/`          | Full form layout components                                      |
| `gateways/`       | Complex interactive sections                                     |
| `heroes/`         | Hero / banner section di atas halaman                            |
| `indexes/`        | List / index page components (tabel, grid listing)               |
| `items/`          | Line-item / list-row components                                  |
| `labels/`         | Label, badge, tag components                                     |
| `messages/`       | Message / notification / alert components                        |
| `modals/`         | Dialog dan drawer components                                     |
| `navigations/`    | Nav bars dan sidebars                                            |
| `pages/`          | Full-page layout components (satu per route)                     |
| `reports/`        | AI tool result report components (LMS)                           |
| `states/`         | Loading skeletons dan empty states                               |
| `static-sections/`| Static marketing sections (SVP — hardcoded content)              |
| `steppers/`       | Multi-step wizard / stepper components                           |
| `svg-logos/`      | Brand logos sebagai React SVG components                         |
| `tables/`         | Table components                                                 |
| `tabs/`           | Tab panel components                                             |
| `titles/`         | Heading / title section components                               |

Saat membuat komponen baru, tentukan dulu platform-nya dan masukkan ke folder yang sesuai dengan suffix yang benar.

## Library (`src/lib/`)

**Sebelum membuat function baru, selalu cek `src/lib/` dulu** — kemungkinan sudah ada dan bisa direuse. Kalau belum ada dan akan dipakai secara global di banyak tempat, buat di `src/lib/`. Kalau hanya dipakai di satu router/feature, bisa langsung di file tersebut.

File-file penting di `src/lib/`:

| File                       | Purpose                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `actions.ts`               | Next.js Server Actions (`"use server"`) untuk operasi server   |
| `after-payment.ts`         | Post-payment processing — enrollment cohort setelah bayar      |
| `app-types.ts`             | Shared TypeScript types lintas codebase                        |
| `array.ts`                 | Array utility functions                                        |
| `conference-variant.ts`    | Detect platform dari meeting URL (Zoom, GMeet, Teams)          |
| `convert-case.ts`          | Case conversion — camelCase, snake_case, dll                   |
| `convert-number.ts`        | Number formatting utilities                                    |
| `currency.ts`              | Currency formatting (IDR, USD)                                 |
| `date-time-manipulation.ts`| Date/time manipulation dan formatting                          |
| `device.ts`                | User agent based device detection                              |
| `encode.ts`                | Base64URL encoding untuk tokens dan URL params                 |
| `extract-youtube-id.ts`    | Ekstrak YouTube video ID dari berbagai format URL              |
| `feature-tracking.ts`      | Client-side hook untuk track feature usage                     |
| `file-variants.ts`         | File type dan MIME type variant helpers                        |
| `mailtrap.ts`              | Email sender via Mailtrap                                      |
| `markdown-to-html.ts`      | Konversi Markdown ke HTML                                      |
| `optional-type.ts`         | TypeScript helper untuk optional/nullable types                |
| `parse-stream.ts`          | Client hook untuk parse AI streaming response                  |
| `price-calc.ts`            | Price dan discount calculation dengan Prisma Decimal           |
| `prisma.ts`                | Prisma client singleton                                        |
| `qstash.ts`                | QStash client untuk background jobs dan scheduled tasks        |
| `redis.ts`                 | Upstash Redis client — caching dan rate limiting               |
| `sounds.ts`                | Browser notification sound player                              |
| `status_code.ts`           | HTTP status code constants                                     |
| `supabase.ts`              | Supabase Storage upload                                        |
| `use-clipboard.ts`         | Hook untuk copy teks ke clipboard                              |
| `utils.ts`                 | General utilities — `cn()` class merger, dll                   |
| `valid-redirect.ts`        | Validasi URL sebelum redirect (security guard)                 |
| `whatsapp-types.ts`        | Type definitions untuk WhatsApp message payload                |
| `whatsapp-utils.tsx`       | WhatsApp message formatting dan template helpers               |
| `whatsapp.ts`              | WhatsApp API integration — send message via HTTPS              |
| `xendit.ts`                | Xendit payment gateway — create invoice, verify webhook        |

## Styling

- Tailwind CSS v4 — config di `src/app/globals.css` (bukan `tailwind.config.js`)
- Brand color tokens didefinisikan di sana
- Dark mode via `next-themes`
- MUI (`@mui/material`, `@mui/x-charts`) hanya untuk data visualisasi — pakai Tailwind + Radix untuk yang lain

## Key Patterns

### Data mutations

```tsx
const utils = trpc.useUtils();
const mutation = trpc.something.create.useMutation({
  onSuccess: () => utils.something.list.invalidate(),
});
```

### React Email

- Template di `src/components/emails/`
- Render ke HTML dengan `render()` dari `@react-email/render` (async)
- Kirim via `sendEmail()` dari `src/lib/mailtrap.ts` menggunakan field `mailHtml`
- Di file `.ts` (bukan `.tsx`), pakai `createElement()` dari React untuk instantiate komponen

### File uploads

- Upload ke Supabase Storage via `src/lib/supabase.ts`
- Simpan public URL di field DB

## What to Avoid

- Jangan pakai `fetch` langsung untuk data internal — pakai tRPC
- Jangan hardcode subdomain URL — routing internal path-based
- Jangan bypass `loggedInProcedure` untuk protected data
- Jangan pakai raw SQL kecuali Prisma tidak bisa express-nya (pakai `$queryRaw` dengan parameterized queries)
- Jangan simpan secrets di kode — semua keys di `.env`
- Jangan pakai MUI untuk layout/UI di luar charts
- Jangan import komponen `*SVP` / `*CMS` / `*LMS` / `*AILN` di luar route group masing-masing
