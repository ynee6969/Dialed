# Project Map

## Website UI

- `app/`
  Next.js pages and route segments for the website and dashboard.
- `components/marketing/`
  Public website UI such as the header, footer, hero, and navigation.
- `components/dashboard/`
  The dashboard finder, matchmaker, compare, and result layout.
- `components/phones/`
  Reusable phone cards, gallery UI, detail helpers, and client-side reference loading.

## Styling

- `app/globals.css`
  Main global stylesheet for layout, theme, dashboard, gallery, and phone detail pages.

## Backend / API

- `app/api/`
  API routes for phones, enrichment, recommendation, compare, bootstrap, and phone references.
- `lib/services/`
  Backend business logic for catalog queries, GSMArena reference lookup, scoring, bootstrap, and caching.
- `lib/pipeline/`
  Enrichment orchestration and normalization flow.
- `lib/ai/`
  AI provider integrations and extraction helpers.
- `lib/utils/`
  Shared formatting and normalization utilities.
- `lib/types/`
  Shared TypeScript types used across frontend and backend.

## Data Layer

- `prisma/`
  Database schema and seed entry points.
- `lib/data/seed-phones.ts`
  Base 70-phone dataset used to bootstrap the catalog.
- `scripts/`
  Local database/bootstrap helper scripts.

## Files You Usually Edit

- `app/`
- `components/`
- `lib/`
- `prisma/`
- `README.md`
- `app/globals.css`

## Generated / Runtime Files

- `.next/`
  Generated Next.js build output. Safe to recreate.
- `node_modules/`
  Installed dependencies.
- `dev.db`
  Local SQLite development database.
- `.next-dev.out.log`, `.next-dev.err.log`
  Local runtime logs.

## Suggested Mental Model

1. `app/` decides what page or API route exists.
2. `components/` decides how the UI looks and behaves.
3. `lib/services/` decides how data is fetched, scored, and normalized.
4. `prisma/` decides how data is stored.
