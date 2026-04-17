# AI Phone Matchmaker

AI Phone Matchmaker is a production-style SaaS starter built with Next.js App Router, Prisma, PostgreSQL, and an AI-first phone enrichment pipeline. It seeds a base smartphone catalog, queues missing specs for enrichment, normalizes extracted data, and powers a recommendation dashboard.

## Stack

- Next.js App Router with React 19 and TypeScript
- Prisma + PostgreSQL
- Firecrawl-ready content cleaning layer
- Pluggable LLM extraction providers (OpenAI, Anthropic, Ollama)
- Modular recommendation and comparison services
- Responsive SaaS UI with Framer Motion

## Quick Start

1. Copy `.env.example` to `.env` and fill in your database and provider keys.
2. Install dependencies with `npm install`.
3. Generate Prisma client with `npm run prisma:generate`.
4. Run migrations with `npm run prisma:migrate:dev`.
5. Seed the catalog with `npm run prisma:seed`.
6. Start the app with `npm run dev`.

## Environment Notes

- If `BOOTSTRAP_ON_STARTUP=true`, the app will ensure seed data exists and queue stale phones for enrichment on first load.
- If no AI provider keys are set, the system still operates using seed data and cached database values.
- `POST /api/enrich` can be called manually or by a scheduler/worker to process queued enrichment jobs.

## Main Modules

- `prisma/schema.prisma`: normalized database schema
- `lib/data/seed-phones.ts`: base smartphone dataset
- `lib/pipeline/`: source discovery, Firecrawl fetch, extraction orchestration, fallbacks
- `lib/services/`: bootstrap, recommendation, comparison, phone querying
- `app/api/`: production-style route handlers
- `app/dashboard`: interactive recommendation and compare UI

## Folder Guide

- Website pages: `app/`
- Reusable frontend UI: `components/`
- Main stylesheet: `app/globals.css`
- Backend services and data logic: `lib/services/`
- Enrichment pipeline: `lib/pipeline/`
- AI integrations: `lib/ai/`
- Database schema and seed setup: `prisma/`
- Dev scripts: `scripts/`
- Project map: `docs/PROJECT_MAP.md`

## Generated And Runtime Files

- `.next/` is generated build output.
- `node_modules/` contains installed packages.
- `dev.db` is the local SQLite dev database.
- `.next-dev.out.log` and `.next-dev.err.log` are local runtime logs.
