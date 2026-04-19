# Project Map

## Quick Orientation

This repository is a Next.js App Router application for phone browsing, comparison, and account-based favorites.

- Repository codename: `Dialed`
- Current UI brand: `DeviceIQ`

## 1. Routing Layer

### `app/`

Defines all website routes and API routes.

Main page routes:

- `app/page.tsx` — landing page
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/services/page.tsx`
- `app/dashboard/page.tsx`
- `app/compare/page.tsx`
- `app/favorites/page.tsx`
- `app/login/page.tsx`
- `app/signup/page.tsx`
- `app/phones/[slug]/page.tsx`

Support route files:

- `app/layout.tsx` — global application shell
- `app/error.tsx` — route error boundary
- `app/dashboard/loading.tsx` — dashboard loading state
- `app/phones/[slug]/loading.tsx` — phone detail loading state
- `app/gallery/page.tsx` — redirect to `/dashboard`

### `app/api/`

Server route handlers.

- `auth/` — NextAuth route + signup route
- `bootstrap/` — warm-up/bootstrap logic
- `compare/` — compare endpoint
- `enrich/` — enrichment workflow endpoint
- `favorites/` — save/remove/list favorites
- `phones/` — phone listing + reference endpoint
- `recommend/` — recommendation endpoint

## 2. UI Components

### `components/auth/`

Authentication-specific UI.

- `auth-form.tsx`
- `auth-config-notice.tsx`
- `AuthForm.module.css`

### `components/dashboard/`

Main browsing interface.

- `matchmaker-dashboard.tsx`
- `MatchmakerDashboard.module.css`

### `components/marketing/`

Shared public-site shell and presentation components.

- `brand-lockup.tsx`
- `cursor-aura.tsx`
- `header-auth-controls.tsx`
- `hero-section.tsx`
- `mobile-tabbar.tsx`
- `site-footer.tsx`
- `site-header.tsx`
- `theme-toggle.tsx`

Matching CSS modules live beside each component where needed.

### `components/navigation/`

- `instant-nav-link.tsx`
- `InstantNavLink.module.css`

### `components/phones/`

Reusable phone UI.

- `device-card.tsx`
- `favorite-button.tsx`
- `DeviceCard.module.css`
- `FavoriteButton.module.css`

### `components/providers/`

App-wide client providers.

- `app-providers.tsx`
- `bootstrap-provider.tsx`
- `favorites-provider.tsx`
- `theme-provider.tsx`

## 3. Styling System

### Shared foundation

- `app/globals.css`

What stays here:

- tokens and theme variables
- resets
- shared layout utilities
- shared buttons, inputs, chips, pills, metrics
- skeleton/loading primitives
- shared responsive utility rules

### Route-owned CSS modules

- `app/page.module.css`
- `app/compare/page.module.css`
- `app/favorites/page.module.css`
- `app/services/page.module.css`
- `app/dashboard/loading.module.css`
- `app/phones/[slug]/page.module.css`

### Component-owned CSS modules

Examples:

- `components/marketing/SiteHeader.module.css`
- `components/dashboard/MatchmakerDashboard.module.css`
- `components/phones/DeviceCard.module.css`

## 4. Services and Logic

### `lib/services/`

Main business logic.

Important files:

- `phones.ts` — catalog listing and fallback logic
- `favorites.ts` — favorites data access
- `comparison.ts` — compare-page data shaping
- `comparison-history.ts` — per-user recent comparisons
- `gsmarena-reference.ts` — spec/reference fetching
- `bootstrap.ts` — startup bootstrap logic
- `runtime-safety.ts` — safe fallback helpers

### `lib/utils/`

Smaller helpers such as:

- formatting
- filter option definitions
- phone display / marketplace helpers

### `lib/data/`

Static application data such as:

- seed catalog
- image manifest

### `lib/theme/`

Theme preset handling and Monkeytype-based palette definitions.

## 5. Data Layer

### `prisma/`

Database schema and migrations.

Important file:

- `prisma/schema.prisma`

Important models:

- `Phone`
- `User`
- `Favorite`
- `ComparisonSnapshot`
- `Account`
- `Session`
- `VerificationToken`
- `PhoneSource`
- `EnrichmentJob`

## 6. Static and Scripts

### `public/`

Static assets served directly by Next.js.

Important subfolder:

- `public/phone-images/` — locally cached phone images

### `scripts/`

Developer helper scripts such as Prisma/client or image caching helpers.

## 7. Documentation

### Repo root

- `PROJECT_EXPLANATION.md` — high-level explanation of the current build

### `docs/`

- `PROJECT_MAP.md` — this quick structure guide
- `WEBSITE_DEFENSE_PACKAGE.md` — defense notes and presentation manuscript

## 8. Cleanup Note

Blank route-level `page.module.css` placeholders were removed.

That means if a CSS module still exists beside a route or component, it should now have a real purpose:

- route-specific styles
- component-specific styles
- loading-state-specific styles

## 9. Best Entry Points For Study

If you only have a few minutes to understand the project, start with:

1. `app/layout.tsx`
2. `app/globals.css`
3. `app/dashboard/page.tsx`
4. `components/dashboard/matchmaker-dashboard.tsx`
5. `components/phones/device-card.tsx`
6. `app/compare/page.tsx`
7. `prisma/schema.prisma`
