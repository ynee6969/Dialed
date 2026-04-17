# 1. Project Overview

- This repository is a phone discovery web application. In simple terms, it helps someone browse smartphones, filter them by practical shopping needs, get recommendations, compare a short list, and open a longer spec sheet for each phone.
- The main problem it solves is information overload. Instead of making the user jump between online stores, review pages, and spec websites, it tries to bring the decision-making steps into one place.
- The user mainly interacts with it in three ways:
  - Public pages such as Home, About, Services, Compare, Gallery, and Contact.
  - A Dashboard page where filters, recommendation tools, and comparison tools live.
  - A dynamic phone detail page that shows a longer spec reference for one device.
- The project is both a frontend app and a backend data-processing app:
  - The frontend is the visible website and dashboard.
  - The backend loads phones, stores them in a database, recommends them, compares them, and enriches missing specs.
- The project is designed to keep working even when advanced services are missing:
  - If the main database is unavailable, it can still use a seed catalog stored in code.
  - If no AI extraction provider is configured, it can still show basic catalog data and fall back to simpler reference generation.
- There is an important naming detail in this repository:
  - `package.json` and `README.md` still use the name `ai-phone-matchmaker` / "AI Phone Matchmaker".
  - The actual site branding used by the running UI comes from `lib/site.ts`, where the product name is `DeviceIQ`.
  - `docs/WEBSITE_DEFENSE_PACKAGE.md` uses another older name, `Dialed`.
  - So the codebase shows signs of iteration, but the current visible app brand is `DeviceIQ`.

# 2. How the Whole System Works (Big Picture)

## Big picture in one sentence

The app starts from a built-in phone catalog, optionally stores that catalog in a database, lets the user browse and score phones through a web interface, and tries to improve phone details over time by fetching outside sources and extracting structured specs.

## Step-by-step flow

1. A user opens the website.
   - Next.js serves the requested route.
   - `app/layout.tsx` wraps every page with the same shell: header, footer, mobile tab bar, theme support, and a background bootstrap trigger.

2. The app makes sure catalog data exists.
   - A client-side `BootstrapProvider` sends `POST /api/bootstrap` when the app loads.
   - Important server routes such as `/dashboard`, `/gallery`, and the API routes also call `ensureApplicationBootstrapped()`.
   - This means both the UI layer and the server layer try to make sure the catalog is ready.

3. Bootstrap decides how to prepare data.
   - If bootstrapping is disabled, it does nothing.
   - If no database URL exists, it skips database work and the app falls back to the code-based catalog.
   - If a database exists and the `Phone` table is empty, the app seeds phones into the database.
   - After seeding, it queues phones that need spec enrichment.

4. The user moves through the website.
   - The Home, About, Services, Compare, and Contact pages are mostly presentational.
   - The Gallery page and Dashboard page are data-driven and depend on the phone catalog.

5. When the user opens the Gallery or Dashboard, the app asks for phones.
   - The server calls `listPhones()`.
   - If Prisma and the database are working, phones come from the `Phone` table.
   - If the database is missing or Prisma fails, the app returns a fallback catalog generated from the seed dataset in code.

6. When the user filters in the Dashboard, the browser calls `/api/phones`.
   - The Dashboard stores the filter values in React state.
   - Search input is deferred and debounced so the app does not hit the API on every keystroke.
   - The API returns matching phones, total count, and available brands.
   - The Dashboard updates the visible phone cards.

7. When the user asks for recommendations, the browser calls `/api/recommend`.
   - The backend validates and normalizes the recommendation input.
   - It loads candidate phones from the catalog.
   - It computes a custom "personalized score" based on the chosen use case and weights.
   - It returns the best matches plus short reasons.

8. When the user selects phones to compare, the browser calls `/api/compare`.
   - The UI allows up to 4 selected phones.
   - The backend loads those phones and identifies which one leads each major score category.
   - The compare panel shows leaders for performance, camera, battery, value, and overall score.

9. When the user opens a phone card or detail page, the app loads spec references.
   - Dashboard and Gallery cards lazy-load reference data only when a card is near the viewport.
   - The full phone detail page loads reference data on the server before rendering the page.
   - The reference system first tries cache, then saved source data, then live scraping/parsing fallbacks, then a locally synthesized reference as a final fallback.

10. In the background or on manual request, the app can enrich phone specs.
   - It queues enrichment jobs for stale or incomplete phones.
   - It fetches source content from trusted websites.
   - It sends cleaned source text to an extraction provider such as OpenAI, Anthropic, or Ollama.
   - It normalizes the extracted data and updates the `Phone` record.
   - If extraction fails, it falls back to simpler score values derived from seed data.

## Why the architecture is split this way

- The frontend needs to feel fast and simple for the user.
- The backend needs to protect the app from missing data, missing APIs, and missing infrastructure.
- So the codebase uses layered fallbacks:
  - Seed data if the database is unavailable.
  - Local reference generation if scraping fails.
  - Seed-based scoring if AI extraction fails.

# 3. Folder-by-Folder Breakdown (VERY IMPORTANT)

## `/.git`

- This is Git's internal repository metadata folder.
- It stores commit history, branch pointers, and version-control state.
- It is not part of the running app logic, but it is essential for source control and collaboration.

## `/.next`

- This is generated Next.js build output, not handwritten application code.
- In this workspace it contains folders such as `cache`, `diagnostics`, `server`, `static`, and `types`, plus build manifests like `routes-manifest.json` and `build-manifest.json`.
- It connects to the rest of the system as the compiled result of the files in `app/`, `components/`, and `lib/`.
- If deleted, Next.js can recreate it during `next dev` or `next build`.

## `/app`

- This is the main routing folder because the project uses the Next.js App Router.
- It defines both website pages and HTTP API endpoints.
- It also holds the global stylesheet and the root layout.
- This folder controls what URLs exist and what code runs when those URLs are requested.

## `/app/about`

- This folder contains the About page.
- It explains the purpose and design goals of the app in plain language.
- It connects to the rest of the system by giving context to the user, but it does not trigger backend processing.

## `/app/api`

- This folder contains the server-side route handlers.
- These files behave like backend endpoints.
- They connect the frontend to business logic in `lib/services/` and `lib/pipeline/`.

## `/app/api/bootstrap`

- This folder contains the bootstrap endpoint.
- Its job is to make sure seed data exists and stale phones can be queued for enrichment.
- It connects directly to `lib/services/bootstrap.ts`.

## `/app/api/compare`

- This folder contains the compare endpoint.
- It receives selected phone IDs from the Dashboard and returns comparison leaders.
- It connects directly to `lib/services/comparison.ts`.

## `/app/api/enrich`

- This folder contains the enrichment endpoint.
- It can report enrichment job counts with `GET` and queue/process enrichment jobs with `POST`.
- It connects directly to `lib/pipeline/enrichment.ts`, Prisma, rate limiting, and runtime-safety helpers.

## `/app/api/phones`

- This folder contains the phone catalog listing endpoint.
- It accepts filters such as search, brand, price range, minimum battery, minimum RAM, sort, take, and skip.
- It connects to `lib/services/phones.ts`.

## `/app/api/phones/[slug]`

- This is a route segment folder for one phone's API space.
- In the current project it only exists to hold the nested `reference` route.
- There is no direct `/api/phones/[slug]` general detail endpoint in this codebase.

## `/app/api/phones/[slug]/reference`

- This folder contains the endpoint that returns a phone reference document for one slug.
- It is used by the client-side lazy reference hook and indirectly supports the full detail experience.
- It connects to `lib/services/gsmarena-reference.ts`.

## `/app/api/recommend`

- This folder contains the recommendation endpoint.
- It receives recommendation preferences such as budget and use case, then returns ranked phone matches.
- It connects to `lib/services/recommendations.ts` and the in-memory rate limiter.

## `/app/compare`

- This folder contains the public Compare information page.
- It explains how the compare feature works.
- It does not run the real comparison logic itself; the real compare interaction happens inside the Dashboard.

## `/app/contact`

- This folder contains the Contact page.
- It presents contact information and a UI form layout.
- Important accuracy note: the current form is visual only. It has inputs and a button, but no `form` submission logic and no API call.

## `/app/dashboard`

- This folder contains the main interactive Dashboard page.
- It loads initial phone data on the server, then hands control to the client-side dashboard component.
- This is the most important user workflow page in the project.

## `/app/gallery`

- This folder contains the Gallery page.
- It loads a broad list of phones and renders them in a card grid.
- It connects to `lib/services/bootstrap.ts`, `lib/services/phones.ts`, and the reusable gallery/card components.

## `/app/phones`

- This is the route space for individual phone pages.
- It holds the dynamic `[slug]` route.
- It connects the general catalog experience to deep device-level detail pages.

## `/app/phones/[slug]`

- This folder contains the full phone detail page for a single phone.
- It loads the phone record and its best available reference document on the server.
- It connects to `lib/services/phones.ts`, `lib/services/gsmarena-reference.ts`, and presentation utilities.

## `/app/services`

- This folder contains the Services page.
- It describes the app's major user-facing tools such as browsing, comparing, and opening full specs.
- It is informative, not computational.

## `/components`

- This folder contains reusable React UI pieces.
- It keeps page files smaller and makes shared UI behavior easier to maintain.
- It is divided into dashboard, marketing, phone, and provider subfolders.

## `/components/dashboard`

- This folder contains the main interactive Dashboard UI.
- It holds filtering, recommendation, compare selection, and mobile sheets.
- It connects the browser directly to the app's API routes.

## `/components/marketing`

- This folder contains reusable public-site UI pieces such as the header, footer, hero, brand, mobile tab bar, and theme toggle.
- These components shape the app shell and public pages.
- They connect mostly to `lib/site.ts` and CSS classes in `app/globals.css`.

## `/components/phones`

- This folder contains reusable phone presentation components and hooks.
- It handles phone cards, gallery rendering, and lazy loading of phone reference data.
- It connects UI display to `/api/phones/[slug]/reference`.

## `/components/providers`

- This folder contains app-wide client helpers that behave like lightweight providers.
- `bootstrap-provider.tsx` triggers initial backend bootstrap.
- `theme-provider.tsx` manages light/dark theme state through local storage and the `data-theme` attribute on `<html>`.

## `/docs`

- This folder contains supporting documentation, not runtime code.
- `PROJECT_MAP.md` is a short internal map of the project structure.
- `WEBSITE_DEFENSE_PACKAGE.md` is a much longer explanation/presentation script focused mostly on frontend defense and uses older naming.
- These files help humans understand or present the project, but the app does not import them.

## `/lib`

- This folder contains the project's core logic.
- It is where configuration, data definitions, backend services, enrichment pipeline code, and utility helpers live.
- If `app/` defines "what routes exist", `lib/` defines "how the app actually works".

## `/lib/ai`

- This folder contains abstractions for AI-based extraction.
- It defines what an extraction provider looks like and what data it receives.
- It connects the enrichment pipeline to provider-specific integrations.

## `/lib/ai/providers`

- This folder contains the concrete AI extraction providers.
- It supports OpenAI, Anthropic, and Ollama, plus a shared extraction prompt and provider selection logic.
- It connects to `lib/pipeline/enrichment.ts`, which asks these providers to convert source text into structured specs.

## `/lib/data`

- This folder contains static seed data.
- In this project, it holds the curated built-in phone catalog.
- It is the starting point for seeding the database and also powers the fallback catalog when the database is unavailable.

## `/lib/pipeline`

- This folder contains the enrichment workflow.
- It decides which sources to consult, how to fetch content, how to extract specs, and how to save results.
- It connects seed data, external sources, AI providers, normalization logic, Prisma, and the enrichment job system.

## `/lib/services`

- This folder contains business logic that the pages and API routes use.
- Examples include bootstrap, phone listing, recommendations, comparison, scoring, reference scraping, caching, rate limiting, and runtime safety.
- This is the biggest "application brain" folder in the project.

## `/lib/types`

- This folder contains shared TypeScript type definitions.
- In this project it defines the shape of a phone reference document.
- It helps the frontend and backend agree on the same data structure.

## `/lib/utils`

- This folder contains small reusable helpers.
- These helpers format money and scores, normalize extracted AI output, and generate user-friendly phone display names and marketplace links.
- They support both backend calculations and frontend display.

## `/node_modules`

- This folder contains installed third-party packages from npm.
- In the current workspace it has roughly 302 top-level package directories.
- It is vendor code, not app-authored code.
- It connects to the app by supplying Next.js, React, Prisma, Zod, Framer Motion, Playwright, and many smaller dependencies.

## `/prisma`

- This folder contains database schema files and the seed entry script.
- It defines the shape of stored phone records, phone source records, and enrichment jobs.
- It also contains a local SQLite database file in this workspace.

## `/public`

- This folder is the usual place for static assets in a Next.js app.
- In this repository it is currently empty.
- That means the app is not relying on committed local images or static files from `public/`.
- Phone images are loaded from external reference sources instead.

## `/scripts`

- This folder contains developer helper scripts.
- In this project it has a Python script that creates SQLite tables in local database files.
- It supports local setup outside the normal Prisma migration path.

# 4. File-Level Explanation (Selective but Meaningful)

## Root and configuration files

- `package.json`
  - Defines the project name, scripts, dependencies, and Prisma seed command.
  - It shows that the app is a Next.js + React + Prisma + TypeScript project.
  - It also shows dual database support patterns: standard Prisma commands plus SQLite-specific commands.

- `package-lock.json`
  - Pins exact package versions.
  - It makes installs reproducible across machines.
  - It is operationally important, even though it is not where app behavior is written.

- `tsconfig.json`
  - Turns on strict TypeScript, uses modern module resolution, and defines the `@/*` import alias.
  - This helps keep imports shorter and types safer.

- `next.config.mjs`
  - Enables `typedRoutes: true`.
  - This helps Next.js catch route mistakes at compile time.

- `.eslintrc.json`
  - Extends `next/core-web-vitals`.
  - This adds Next.js-oriented linting rules and quality checks.

- `.gitignore`
  - Excludes generated and machine-specific files such as `.next`, `node_modules`, `.env`, logs, coverage, `dist`, and `prisma/dev.db`.
  - It helps keep the Git repository clean.

- `.env.example`
  - Documents the environment variables the app expects.
  - It includes database URL, AI provider keys/models, Firecrawl settings, app URL, bootstrap flag, enrichment staleness days, and max enrichment batch size.

- `.env`
  - This exists locally in the workspace but is gitignored.
  - It is the real machine-specific configuration file used during local runs.

- `README.md`
  - Explains the project's intended architecture and startup flow.
  - It is useful orientation, but parts of it reflect a slightly earlier framing because the current codebase also contains SQLite support and current UI branding as `DeviceIQ`.

- `next-env.d.ts`
  - Auto-generated Next.js type declaration file.
  - It should not be edited manually.

- `.next-dev.out.log` and `.next-dev.err.log`
  - Local runtime logs from a previous Next.js server start.
  - In the current workspace the output log shows a successful `next start`, while the error log is empty.

- `dev.db`
  - A local SQLite database file at the project root.
  - In the current workspace it exists but contains zero rows in the main tables.

## Core app shell and pages

- `app/layout.tsx`
  - The global wrapper for all routes.
  - Imports global CSS, loads Google fonts, sets metadata, and renders the shared shell: `BootstrapProvider`, `ThemeProvider`, `SiteHeader`, `main`, `SiteFooter`, and `MobileTabBar`.
  - This file is the structural backbone of the frontend.

- `app/globals.css`
  - The single global stylesheet for the whole app.
  - Defines design tokens, dark/light themes, layout classes, card styles, dashboard styles, phone detail table styles, mobile sheet styles, and responsive breakpoints.
  - Nearly every React component depends on these classes.

- `app/page.tsx`
  - The Home page.
  - Uses `HeroSection`, seed catalog stats, and curated gallery data to explain the product and funnel the user toward Dashboard, Gallery, and Compare.

- `app/about/page.tsx`
  - A short explanatory page about the product's purpose and guiding principles.

- `app/services/page.tsx`
  - A short feature overview page.
  - Helps explain the app as a set of tools rather than a single screen.

- `app/compare/page.tsx`
  - A public explanatory page for the compare workflow.
  - Important detail: this is not the actual comparison engine; it is a guide page that points people back to the Dashboard.

- `app/contact/page.tsx`
  - Renders contact information plus a non-submitting contact form layout.
  - Useful for presentation, but not wired to backend message handling.

- `app/gallery/page.tsx`
  - Server-rendered page that bootstraps data, loads up to 100 phones, and renders `GalleryGrid`.
  - Uses `dynamic = "force-dynamic"` so it always pulls fresh server data instead of being fully static.

- `app/dashboard/page.tsx`
  - Server entry point for the interactive Dashboard.
  - Loads initial phone and brand data, serializes it into a lighter `DashboardPhone` shape, then passes it into `MatchmakerDashboard`.

- `app/phones/[slug]/page.tsx`
  - The dynamic server-rendered phone detail page.
  - Loads both the base phone record and the best available phone reference, with careful fallback handling.
  - Builds Lazada and Shopee links, shows score chips, and renders a multi-section spec table.

- `app/error.tsx`
  - Global route-level error boundary UI.
  - If a page fails to render on the server, this gives the user a retry button and fallback navigation choices.

## API route files

- `app/api/bootstrap/route.ts`
  - Thin wrapper around `ensureApplicationBootstrapped()`.
  - Returns success or safe failure JSON.

- `app/api/phones/route.ts`
  - Reads query parameters, converts number-like values, and calls `listPhones()`.
  - This is the primary endpoint used by the Dashboard for live filtering.

- `app/api/recommend/route.ts`
  - Applies rate limiting and calls `recommendPhones()`.
  - Returns recommendation matches or an error payload.

- `app/api/compare/route.ts`
  - Validates that the request includes 2 to 4 IDs using Zod.
  - Calls `comparePhones()` and returns the leaders plus compared phones.

- `app/api/enrich/route.ts`
  - Exposes the enrichment system.
  - `GET` reports job counts.
  - `POST` can queue specific phones or stale phones and optionally process a batch immediately.
  - Also handles "database not configured" cases gracefully.

- `app/api/phones/[slug]/reference/route.ts`
  - Returns a phone reference document for one slug.
  - This is the endpoint that powers lazy-loaded card summaries.

## UI components

- `components/dashboard/matchmaker-dashboard.tsx`
  - The largest client-side UI file in the project.
  - Manages filters, debounced search, recommendation requests, comparison requests, enrichment requests, mobile sheets, selected phones, and status messaging.
  - It is the main orchestration layer of the frontend.

- `components/phones/device-card.tsx`
  - Reusable card for showing one phone.
  - Supports both Dashboard and Gallery variants.
  - Loads reference data lazily, shows image/summary/score information, and exposes compare selection plus detail/marketplace links.

- `components/phones/gallery-grid.tsx`
  - Simple wrapper that renders many `DeviceCard` components in gallery mode.

- `components/phones/use-phone-reference.ts`
  - Custom client hook that waits until a card is near the viewport, then fetches `/api/phones/[slug]/reference`.
  - Uses `IntersectionObserver` so the app does not fetch every reference immediately.

- `components/marketing/hero-section.tsx`
  - Animated Home page hero using Framer Motion.
  - Uses catalog stats and public CTA buttons to drive users into the main product flow.

- `components/marketing/site-header.tsx`
  - Global top navigation.
  - Provides links to the public routes and Dashboard, plus the theme toggle.

- `components/marketing/site-footer.tsx`
  - Global footer with brand lockup and tagline-style note.

- `components/marketing/mobile-tabbar.tsx`
  - Fixed bottom navigation for mobile devices.
  - Appears below the mobile breakpoint defined in CSS.

- `components/marketing/brand-lockup.tsx`
  - Shared product logo/wordmark component.
  - Centralizes visual branding.

- `components/marketing/theme-toggle.tsx`
  - Small client button that flips between dark and light modes.

- `components/providers/bootstrap-provider.tsx`
  - Fires the bootstrap API call on first client render.
  - It does not render visible UI.

- `components/providers/theme-provider.tsx`
  - Stores theme in local storage, writes `data-theme` to the `<html>` element, and exports `useThemeValue()`.
  - Important detail: this is a simple hook-based provider pattern, not a React context provider.

## Core backend and data files

- `lib/site.ts`
  - Central site metadata: product name, short name, tagline, description, and email.
  - Used by layout and public-facing components.

- `lib/env.ts`
  - Validates environment variables with Zod and provides defaults.
  - Prevents the app from reading unstructured environment data directly all over the codebase.

- `lib/prisma.ts`
  - Creates the singleton Prisma client.
  - Avoids recreating many database clients during development.

- `lib/data/seed-phones.ts`
  - The core built-in phone catalog.
  - Defines phone segments, seed data, update overrides, merged catalog order, overall catalog stats, and the six-item curated Home page gallery.
  - After merging updates, the working catalog has 70 phones and 7 segments.

- `lib/services/catalog-seeder.ts`
  - Takes the seed catalog and upserts it into the database.
  - This is what turns code-level seed data into stored `Phone` rows.

- `lib/services/catalog-fallback.ts`
  - Builds an in-memory fallback `Phone` list from seed data.
  - This is what keeps the app usable even when Prisma or the database cannot be used.

- `lib/services/bootstrap.ts`
  - The startup guard for data readiness.
  - Seeds the database if needed, then queues stale phones for enrichment.
  - Uses a global promise so the app does not bootstrap multiple times in parallel.

- `lib/services/phones.ts`
  - Main phone query service.
  - Lists phones, gets one phone by slug, gets phones by IDs, and counts phones by segment.
  - Chooses database mode when possible and fallback mode when necessary.

- `lib/services/scoring.ts`
  - Defines how battery, value, camera, and final scores are computed.
  - Also estimates performance from chipset names or benchmark numbers.
  - This file is the scoring model of the app.

- `lib/services/recommendations.ts`
  - Validates recommendation input with Zod.
  - Normalizes weights based on use case, filters candidate phones, computes a personalized score, and returns top matches with reasons.

- `lib/services/comparison.ts`
  - Loads selected phones and decides which phone leads each score category.
  - It is intentionally lightweight and score-focused.

- `lib/services/gsmarena-reference.ts`
  - The most complex reference-generation file.
  - Builds locally synthesized references, checks memory/DB cache, optionally uses Playwright to search and scrape GSM Arena, falls back to a GSM Arena BD parser, and persists good reference data into `PhoneSource`.

- `lib/services/gsmarena-bd-reference.ts`
  - HTML parser for `gsmarena.com.bd`.
  - Tries multiple slug guesses, fetches HTML directly, parses sections/rows, builds a summary, and returns a `PhoneReference`.

- `lib/services/firecrawl.ts`
  - Fetches cleaned text for enrichment sources.
  - Uses Firecrawl if configured; otherwise fetches raw HTML and strips tags locally.
  - Adds an in-memory cache with a 6-hour TTL plus a rate limit.

- `lib/services/cache.ts`
  - Simple in-memory cache store.
  - Good for local or single-process use, but not shared across multiple servers.

- `lib/services/rate-limit.ts`
  - Simple in-memory rate limiter.
  - Used by recommendation, enrichment, and Firecrawl fetch flows.

- `lib/services/runtime-safety.ts`
  - Helper functions for detecting Prisma runtime errors, checking database availability, extracting readable error messages, and logging server failures.

- `lib/utils/normalization.ts`
  - Converts raw extracted AI output into a clean internal shape.
  - Recomputes final scores using extracted values plus seed baselines.
  - This is the bridge between "messy extracted text" and "clean database record".

- `lib/utils/format.ts`
  - Formats Philippine peso prices, numeric scores, and slugs.

- `lib/utils/phone-presentation.ts`
  - Produces user-friendly phone display names, removes duplicate brand text, builds catalog keys, and creates marketplace search links.

- `lib/utils/cn.ts`
  - Tiny `clsx` wrapper for class-name composition.
  - In the current tracked code it exists but is not used elsewhere.

- `lib/types/phone-reference.ts`
  - Shared type contract for reference payloads.
  - Defines sections, items, summary fields, image URL, source URL, and timestamps.

## AI provider files

- `lib/ai/types.ts`
  - Defines the types for source documents, extraction context, extraction results, and provider interfaces.

- `lib/ai/providers/base.ts`
  - Contains the shared extraction prompt.
  - It tells providers exactly what JSON shape to return.

- `lib/ai/providers/index.ts`
  - Registers provider instances and selects the first configured provider that succeeds.
  - Tries providers in this order: OpenAI, Anthropic, then Ollama.

- `lib/ai/providers/openai.ts`
  - Sends a structured chat completion request to OpenAI and expects JSON back.

- `lib/ai/providers/anthropic.ts`
  - Sends a message request to Anthropic and expects JSON text back.

- `lib/ai/providers/ollama.ts`
  - Sends a local generation request to Ollama and expects JSON text back.

## Pipeline files

- `lib/pipeline/source-adapters.ts`
  - Builds trusted source URLs for GSM Arena, Kimovil, and NanoReview search pages.
  - This gives the enrichment system places to look for each phone.

- `lib/pipeline/enrichment.ts`
  - Orchestrates the entire enrichment job lifecycle.
  - Queues jobs, loads phone/job records, fetches source content, calls AI extraction, normalizes output, updates `Phone`, upserts `PhoneSource`, and marks jobs completed or fallback.

## Database and script files

- `prisma/schema.prisma`
  - Main Prisma schema for PostgreSQL.
  - Defines `Phone`, `PhoneSource`, `EnrichmentJob`, plus enums for phone segment, enrichment status, and source kind.

- `prisma/schema.sqlite.prisma`
  - SQLite version of the same schema.
  - Structurally almost identical, but tuned for SQLite.

- `prisma/seed.ts`
  - Simple seed entry point that calls `upsertSeedCatalog(prisma)`.

- `prisma/dev.db`
  - Local SQLite database under the Prisma folder.
  - In the current workspace it contains seeded and enriched data: 70 `Phone` rows, 70 `PhoneSource` rows, and 82 `EnrichmentJob` rows.

- `scripts/init_sqlite_dev.py`
  - Manual SQLite bootstrap script.
  - Creates the three main tables and indexes in both `dev.db` and `prisma/dev.db`.
  - This is a practical local setup helper outside Prisma migrations.

## Supporting docs

- `docs/PROJECT_MAP.md`
  - Short structural cheat sheet for the project.

- `docs/WEBSITE_DEFENSE_PACKAGE.md`
  - Long-form presentation and defense notes centered on the frontend.
  - Helpful for human explanation, but not consumed by the running app.

# 5. Core Logic Explanation (CRITICAL)

## A. Startup and bootstrap logic

The app assumes a phone catalog should exist before the user starts browsing. To make that happen reliably, it uses a bootstrap step.

### What bootstrap does

1. Check if bootstrapping is enabled through `BOOTSTRAP_ON_STARTUP`.
2. Check if a database URL exists.
3. If the `Phone` table is empty, seed the catalog from `lib/data/seed-phones.ts`.
4. Queue phones that are missing specs or have stale enrichment data.

### Why it matters

- Without bootstrap, a database-backed app might open with zero phones.
- With bootstrap, the first load can prepare a usable catalog automatically.
- If the database is missing, the app does not crash. It falls back to the code-based catalog.

## B. Catalog browsing logic

This is the logic used by the Gallery and Dashboard when they need a list of phones.

### Step-by-step

1. A page or API route calls `listPhones(filters)`.
2. `listPhones()` checks whether the database is available.
3. If the database is available:
   - It builds a Prisma `where` filter using search text, segment, brand, min/max price, minimum RAM, and minimum battery.
   - It builds an `orderBy` array based on sort choice.
   - It returns matching phones, total count, and distinct brands.
4. If the database is not available:
   - It uses `listFallbackPhones()` from `catalog-fallback.ts`.
   - That fallback catalog is built from the seed dataset and precomputed scores.

### Important detail

- The fallback catalog creates full `Phone`-shaped objects in memory, so the rest of the app can keep working with a familiar structure.
- That is why the frontend can stay mostly unaware of whether data came from Prisma or fallback seed generation.

## C. Dashboard interaction logic

The Dashboard is the most interactive part of the app.

### What happens when the user types or changes filters

1. Filter values are stored in React state inside `MatchmakerDashboard`.
2. Search text goes through:
   - `useDeferredValue()` to lower UI pressure.
   - A custom `useDebouncedValue()` hook with a 260ms delay.
3. A `useEffect()` builds a query string and fetches `/api/phones`.
4. The returned phone list replaces the visible grid.
5. If some previously selected phones are no longer in the filtered result, those selections are removed.

### Why this design is useful

- It avoids hammering the API on every keystroke.
- It keeps the UI responsive while the list refreshes.
- It prevents the compare list from containing items the user can no longer see in the current result set.

## D. Recommendation logic

Recommendations are not AI chat recommendations. They are weighted ranking recommendations based on stored scores and user preferences.

### Input fields the system understands

- `budget`
- `minBudget`
- `brands`
- `osPreference`
- `useCase`
- `minBattery`
- `minRam`
- `priorities`
- `limit`

### How the score is built

1. The app starts with base weights:
   - performance: 0.35
   - camera: 0.30
   - battery: 0.20
   - value: 0.15
2. If the user chooses a use case, the system swaps in purpose-specific weights:
   - Gaming gives more weight to performance.
   - Camera gives more weight to camera.
   - Battery gives more weight to battery.
   - Value gives more weight to value.
3. The weights are normalized so they still total 1.
4. The system filters phones by budget and minimum requirements.
5. It optionally filters by brand and OS.
6. It computes:
   - `personalizedScore = performance * w1 + camera * w2 + battery * w3 + value * w4`
7. It sorts descending and returns the top matches.

### How to explain this simply

Think of it like a report card where different subjects matter more depending on the student's goal. A gamer cares more about performance, while a camera-focused buyer cares more about photography.

## E. Comparison logic

The compare feature is intentionally simple and focused.

### Step-by-step

1. The user selects phones with the "Compare" checkbox on Dashboard cards.
2. The UI stores selected IDs in an array.
3. If the user adds a 5th phone, the oldest selected phone is dropped automatically so the list stays capped at 4.
4. When the user clicks "Compare selected", the app sends the selected IDs to `/api/compare`.
5. The backend loads the phone records and calculates leaders for:
   - Performance
   - Camera
   - Battery
   - Value
   - Overall
6. The UI renders leader cards and a compact per-phone summary.

### What this feature does not do

- It does not compare raw spec tables field by field.
- It compares score categories, which makes it quicker and simpler for users.

## F. Score calculation logic

This is one of the most important parts of the project because many pages depend on these numbers.

### 1. Battery score

- Function: `computeBatteryScore(batteryCapacity, chargingWatts)`
- Simple meaning:
  - Bigger batteries score better.
  - Faster charging adds bonus points.
- Intuition:
  - A 5000mAh phone starts from a better place than a 3300mAh phone.
  - A phone with fast charging gets extra credit.

### 2. Value score

- Function: `computeValueScore(performanceScore, price)`
- Simple meaning:
  - It asks: "How much performance am I getting for this amount of money?"
- Intuition:
  - A fast but affordable phone gets rewarded.
  - A very expensive phone needs exceptional performance to keep up on value.

### 3. Camera score

- Function: `computeCameraScore(baselineScore, cameraMain, cameraUltrawide, aiSummary)`
- Simple meaning:
  - The seed camera score is the starting point.
  - Higher main camera megapixels can add a small boost.
  - Having an ultrawide camera adds a little.
  - Helpful summary clues like `telephoto`, `OIS`, `HDR`, or `night mode` can add a little more.

### 4. Performance score

- Source:
  - Seed value from the original dataset, or
  - Estimated from chipset name / benchmark score during normalization.
- Intuition:
  - Known high-end chipsets such as `Snapdragon 8 Gen 3` or `Dimensity 9300` map to high scores.
  - If a benchmark number is available, that can override the estimate.

### 5. Final score

- Function: `computeFinalScore(...)`
- Formula:
  - 35% performance
  - 30% camera
  - 20% battery
  - 15% value
- Simple meaning:
  - The app treats overall quality mostly as a blend of speed, camera quality, endurance, and price efficiency.

## G. Phone reference logic

The project has two different "detail" concepts:

- The normal phone record in the database or fallback catalog.
- A richer `PhoneReference` document used for detailed display and card summaries.

### How `getPhoneReferenceBySlug()` works

1. Load the phone record by slug.
2. Check in-memory cache first.
3. If there is a saved `PhoneSource` reference record in the database and it still looks valid, use it.
4. If there is no good cached reference:
   - If not running on Vercel, try live GSM Arena search + Playwright detail-page scraping.
   - If that fails, try the GSM Arena BD HTML parser.
   - If that also fails, build a local reference from whatever fields the phone record already has.

### Why this matters

- The app wants better device pages than the basic database fields alone can provide.
- But external scraping can fail, so the local reference fallback guarantees that a detail page can still be rendered.

### Smart quality check

The file also contains `shouldRefreshReference()`, which tries to reject weak references such as:

- Search-result URLs instead of true detail pages.
- Placeholder-like image URLs.
- Summaries that are almost empty.

## H. Enrichment pipeline logic

This is the most backend-heavy system in the repository.

### Purpose

The seed catalog starts with only basic fields like brand, model, price, segment, baseline performance score, baseline camera score, and battery capacity. The enrichment pipeline tries to fill in more details such as display, chipset, RAM, storage, charging, and better summary text.

### Step-by-step enrichment job flow

1. A phone is queued for enrichment.
   - Either because bootstrap found it stale/incomplete.
   - Or because the user manually clicked "Reload specs".

2. `runEnrichmentJob(jobId)` loads:
   - The job.
   - The related phone.
   - The seed record stored in `rawSeed`.

3. The pipeline builds source candidates using `buildTrustedSourceCandidates()`:
   - GSM Arena search
   - Kimovil search
   - NanoReview search

4. For each source candidate:
   - If a cached extraction already exists in `PhoneSource`, reuse it.
   - Otherwise fetch cleaned source text with `fetchCleanMarkdown()`.
   - Then call `extractWithBestProvider()` to turn that text into structured JSON.

5. If extraction succeeds:
   - `normalizeExtractedPhone()` cleans the raw values.
   - It recomputes scores using the extracted values plus seed baselines.
   - Prisma updates the `Phone` row.
   - Prisma upserts a `PhoneSource` record.
   - Prisma marks the enrichment job as `completed`.

6. If all providers or sources fail:
   - `applyFallback()` restores simpler values derived from the seed record.
   - The job is marked as `fallback`.

### Why the pipeline is robust

- It does not assume one source will always work.
- It does not assume one AI provider will always work.
- It caches successful extractions to avoid repeating expensive work.
- It still leaves the app usable when enrichment fails.

## I. Database model logic

The schema is small but well-focused.

### `Phone`

- The main catalog item.
- Stores:
  - identity fields like slug, brand, model
  - shopping/category fields like segment and price
  - derived scores
  - enriched technical specs
  - enrichment state
  - seed payload and raw extracted payload

### `PhoneSource`

- Stores source-side evidence or cached extraction info for a phone.
- Tracks which source kind was used, the URL, cached markdown, raw extraction payload, and fetch time.

### `EnrichmentJob`

- Tracks background work for a phone.
- Stores job status, provider used, source kind, attempts, errors, and timestamps.

## J. Theme logic

The theme system is simple and direct.

1. On the client, `useThemeValue()` checks local storage.
2. If nothing is stored, it uses the browser's preferred color scheme.
3. It writes the choice to `document.documentElement.dataset.theme`.
4. CSS variables in `app/globals.css` switch color values based on `html[data-theme="dark"]` or `html[data-theme="light"]`.

This keeps theme handling lightweight and avoids needing a heavy theming library.

# 6. Data Flow (VERY IMPORTANT)

## A. App startup and data readiness

User opens app  
`app/layout.tsx`  
`BootstrapProvider` sends `POST /api/bootstrap`  
`ensureApplicationBootstrapped()`  
`upsertSeedCatalog()` if needed  
`queueStalePhonesForEnrichment()`  
Database ready, or safe fallback mode if database is unavailable

## B. Gallery / Dashboard initial load

User opens `/gallery` or `/dashboard`  
Server page calls `ensureApplicationBootstrapped()`  
Server page calls `listPhones()`  
`phones.ts` chooses Prisma query or fallback catalog  
Serialized phone data passed into React components  
UI renders phone cards

## C. Filtered catalog browsing

User changes filters  
`MatchmakerDashboard` state updates  
Search is deferred and debounced  
Browser calls `/api/phones?search=...&brand=...`  
`app/api/phones/route.ts` parses filters  
`listPhones()` returns matching records  
React state updates  
UI grid refreshes

## D. Recommendation flow

User enters budget/use case  
Clicks "Find matches"  
Browser sends `POST /api/recommend`  
Rate limit check  
`recommendPhones()` validates input with Zod  
`listPhones()` loads candidates  
Weights are adjusted by use case  
Personalized score is computed for each phone  
Top matches returned  
Recommendation cards appear in the Dashboard

## E. Comparison flow

User checks "Compare" on phone cards  
Selected IDs stored in Dashboard state  
Clicks "Compare selected"  
Browser sends `POST /api/compare`  
`comparePhones()` loads chosen phones  
Leaders are chosen for each metric  
JSON response returned  
Compare panel renders score leaders and phone summaries

## F. Card reference preview flow

User scrolls near a phone card  
`usePhoneReference()` detects visibility with `IntersectionObserver`  
Browser calls `/api/phones/[slug]/reference`  
`getPhoneReferenceBySlug()` checks cache / DB / live scrape / HTML fallback / local fallback  
Reference JSON returned  
Card updates with image and short spec lines

## G. Full phone detail flow

User clicks "View full specs"  
Server renders `/phones/[slug]`  
`getPhoneBySlug(slug)` loads base record  
`getPhoneReferenceBySlug(slug)` loads best available reference  
Marketplace links are built  
Hero section, summary metrics, and spec table render  
User sees a deeper phone page

## H. Enrichment flow

Bootstrap or user requests enrichment  
`/api/enrich` queues jobs  
Optional immediate batch processing starts  
`runEnrichmentJob()` loads one phone  
Source candidate URL chosen  
`fetchCleanMarkdown()` fetches text  
`extractWithBestProvider()` asks AI for structured specs  
`normalizeExtractedPhone()` cleans values and recomputes scores  
Prisma updates `Phone`, `PhoneSource`, and `EnrichmentJob`  
Future catalog views show richer data

## I. Fallback flow when infrastructure is missing

No database or Prisma runtime failure  
`phones.ts` routes to `catalog-fallback.ts`  
Seed data becomes in-memory `Phone` objects  
Gallery and Dashboard still work  
Reference pages still try GSM Arena BD or local synthesized references  
App stays usable instead of breaking

# 7. Technologies Used

- Next.js 15 App Router
  - Used to build both pages and API routes in one framework.
  - Good for a full-stack React app with server rendering and route-based file structure.

- React 19
  - Used for UI components and client-side state.
  - Powers interactive features like Dashboard filtering, recommendations, compare selection, and theme switching.

- TypeScript
  - Used for safer data structures and clearer contracts between frontend and backend.
  - Especially useful here because the app moves structured phone data through many layers.

- Prisma
  - Used as the database access layer.
  - Makes it easier to define the schema and query/update phones, sources, and enrichment jobs.

- PostgreSQL and SQLite support
  - PostgreSQL is the primary schema target in `prisma/schema.prisma`.
  - SQLite is also supported via `prisma/schema.sqlite.prisma` and `scripts/init_sqlite_dev.py`.
  - This gives the project flexibility for local setup and experimentation.

- Zod
  - Used for input validation and environment validation.
  - Keeps API inputs and environment configuration from being overly loose.

- Playwright
  - Used on the backend for live GSM Arena scraping.
  - Helpful because some phone reference pages need real browser behavior rather than simple HTML fetches.

- Framer Motion
  - Used for small hero animation effects on the Home page.
  - Adds polish to the public-facing frontend.

- Lucide React
  - Used for icons throughout the UI.
  - Makes buttons, cards, and navigation easier to scan.

- date-fns
  - Used for date calculations, especially enrichment staleness checks.

- Google Fonts (`Manrope` and `Space Grotesk`)
  - Used for visual identity and typography.
  - `Space Grotesk` is used for display headings, and `Manrope` for body text.

- Firecrawl-compatible fetching
  - If configured, Firecrawl is used to scrape/clean source content into markdown-like text.
  - If not configured, the app falls back to direct fetch + HTML stripping.

- OpenAI, Anthropic, and Ollama
  - Used as pluggable extraction providers for turning source text into structured phone specs.
  - The project is designed so any one of them can be used if configured.

- clsx
  - Included for class-name composition through `cn.ts`.
  - In the current tracked code, the helper exists but is not yet used by other files.

- ESLint with Next rules
  - Used for code quality checks.

# 8. Simplified Explanation (Layman Mode)

Imagine this project as a smart phone-shopping assistant with three jobs:

1. Keep a notebook of phones.
2. Help you sort and compare them quickly.
3. Send a research assistant to fetch extra details when the notebook is missing information.

Here is the beginner-friendly version:

- The seed catalog in `lib/data/seed-phones.ts` is like the app's starter notebook.
  - It already knows the names, prices, rough phone tiers, and a few basic scores.

- The database is like a filing cabinet.
  - If the filing cabinet is available, the app stores phones there and keeps improving them over time.
  - If the cabinet is missing, the app still has the notebook, so it can keep working.

- The Dashboard is like a control panel.
  - You type what you want, set a budget, choose a brand, and ask the app to narrow the list.

- The recommendation system is like a teacher weighting subjects differently.
  - If you care about gaming, "performance" gets a bigger grade weight.
  - If you care about photography, "camera" gets a bigger grade weight.
  - The app then ranks phones based on what matters most to you.

- The compare feature is like putting 2 to 4 phones on a table and checking who wins each category.
  - Which one is fastest?
  - Which one has the best camera score?
  - Which one lasts longer?
  - Which one gives better value for the price?

- The phone detail page is like a printed fact sheet.
  - It shows a bigger summary, key numbers, and organized spec sections.

- The enrichment system is like a research assistant working in the background.
  - It visits trusted websites.
  - It pulls text from those websites.
  - It asks an AI extractor to turn the messy text into neat fields like chipset, RAM, display, and charging.
  - Then it updates the filing cabinet so future users see better phone data.

- The fallback system is like having backup notes.
  - If the filing cabinet breaks, the notebook still works.
  - If the research assistant fails, the app still shows a simpler version of the phone.

So, in plain language, this project is a full-stack "phone chooser" website that tries to stay useful even when parts of its data pipeline are incomplete or unavailable.

# 9. Key Takeaways

- The app is a full-stack phone catalog and decision-support tool built with Next.js, React, TypeScript, Prisma, and a layered fallback strategy.
- The Dashboard is the main working screen: it filters phones, requests recommendations, manages compare selection, and triggers spec refreshes.
- The phone data starts from a built-in seed catalog, can be stored in a database, and can be improved over time by an enrichment pipeline.
- The app separates quick catalog browsing from deeper reference viewing: cards show lightweight summaries, while `/phones/[slug]` shows the full spec-style detail page.
- The project is intentionally resilient: database failures, scraping failures, and missing AI providers do not fully break the user experience because the codebase includes multiple fallback paths.
