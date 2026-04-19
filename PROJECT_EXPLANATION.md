# Project Explanation

## 1. What This Project Is

This repository contains a Next.js App Router web application for smartphone discovery and comparison.

- Repository / project codename: `Dialed`
- Current visible UI brand: `DeviceIQ`
- Primary purpose: help users browse phones, filter the catalog, compare two devices clearly, and optionally save favorites to an account

The website is built as a full-stack application:

- The frontend handles the user interface, navigation, responsive layouts, and theme system.
- The backend handles catalog queries, authentication, favorites, comparison history, and reference/spec retrieval.
- Prisma connects the application to the database.

## 2. Current Product Direction

The current build is intentionally simpler than earlier versions.

- `Dashboard` is now the main public browsing surface.
- `Gallery` no longer works as a separate discovery experience and redirects to `/dashboard`.
- `Compare` is now a dedicated page instead of checkbox-based comparison inside the dashboard.
- `Favorites` are account-based and only available after login.
- Signing in is optional for browsing.

This means the product flow is now:

1. Open the public website
2. Browse phones through the dashboard
3. Open a phone detail page for full specs
4. Use the dedicated compare page for side-by-side decisions
5. Sign in only when you want favorites and comparison history

## 3. Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- CSS Modules
- Shared global CSS foundation in `app/globals.css`
- Framer Motion for selected motion/presentation effects
- Lucide React for icons

### Backend

- Next.js route handlers in `app/api`
- NextAuth with credentials provider
- Prisma ORM
- Supabase / PostgreSQL-compatible Prisma schema

### Data / Infrastructure

- Prisma schema in `prisma/schema.prisma`
- Seed and fallback catalog data in `lib/data`
- Local-first image caching under `public/phone-images`
- Reference/spec services in `lib/services`

## 4. Frontend Architecture

## 4.1 App Router structure

The application uses the Next.js App Router, so every route is represented by folders inside `app/`.

Main route pages:

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

Support files:

- `app/layout.tsx` — shared shell for the whole site
- `app/error.tsx` — route-level error boundary
- `app/dashboard/loading.tsx` — dashboard loading state
- `app/phones/[slug]/loading.tsx` — phone detail loading state

## 4.2 Shared shell

`app/layout.tsx` is the outer application shell.

It is responsible for:

- loading the site fonts
- importing `app/globals.css`
- mounting the global providers
- rendering the sticky site header
- rendering the page content inside `<main>`
- rendering the site footer
- rendering the mobile tab bar
- rendering the floating theme settings launcher

Because of this, every route automatically shares the same visual shell and navigation pattern.

## 4.3 Component organization

The main UI components live under `components/`.

- `components/marketing/` contains the shared public-site shell and landing-page pieces
- `components/dashboard/` contains the main browsing interface
- `components/phones/` contains reusable phone presentation components
- `components/auth/` contains login/signup UI
- `components/providers/` contains app-wide state/context wrappers
- `components/navigation/` contains the instant navigation helper used for heavier routes

This separation makes the code easier to understand:

- pages decide what should appear
- components decide how it is rendered
- services decide how the data is fetched or processed

## 5. CSS Architecture

## 5.1 Why `globals.css` still exists

`app/globals.css` is no longer treated as a page stylesheet.

Its current role is to hold only shared foundation styles such as:

- CSS design tokens and theme variables
- reset styles
- shared layout primitives
- shared typography utilities
- shared buttons, fields, chips, pills, metrics, and skeleton states
- shared responsive rules for global primitives

It is the design system foundation, not the place where every route dumps all of its custom CSS.

## 5.2 Route and component CSS modules

Route-specific or component-specific styles now live beside the file that owns them.

Examples:

- `app/page.tsx` → `app/page.module.css`
- `app/compare/page.tsx` → `app/compare/page.module.css`
- `components/phones/device-card.tsx` → `components/phones/DeviceCard.module.css`
- `components/marketing/site-header.tsx` → `components/marketing/SiteHeader.module.css`

This structure makes the styling easier to study because:

- you do not need to search a huge global stylesheet for route-specific rules
- the ownership of styles is obvious
- mobile/tablet adjustments stay close to the component they affect

## 5.3 Blank module cleanup

Earlier refactoring created several placeholder `page.module.css` files that did not own real styles.

Those no-op files were removed.

Examples of routes that no longer keep blank CSS files:

- `about`
- `contact`
- `dashboard`
- `gallery`
- `login`
- `signup`
- `error`
- `layout`
- `phones/[slug]/loading`

That cleanup reduced folder clutter and made the remaining CSS module files more meaningful.

## 6. Main User-Facing Flows

## 6.1 Home page

The home page introduces the product and encourages users to browse or compare.

Important frontend traits:

- hero section with strong typography and motion
- visual storytelling blocks
- preview cards that explain the product behavior
- direct CTA into `/dashboard`

## 6.2 Dashboard

The dashboard is the main discovery surface.

It is public, which means users do not need to sign in to open it.

It includes:

- collapsible filters
- server-provided initial phone data
- client-side filter refreshes through `/api/phones`
- paginated loading with 10 phones per batch
- device cards with compare and favorite actions
- mobile filter sheet for smaller screens

## 6.3 Compare

The compare page is now the dedicated structured comparison experience.

It includes:

- two-phone selector
- optional recent comparison history for logged-in users
- side-by-side hero area
- highlights for each phone
- score snapshot rows
- grouped spec comparison sections

The design is built for both desktop and mobile readability.

## 6.4 Favorites

Favorites are tied to the authenticated user.

Important behavior:

- guests can browse but cannot persist favorites
- when a guest tries to save a phone, they are redirected to login
- when the authenticated user changes, the client favorites cache is refreshed
- this prevents favorites from leaking across accounts on the same device

## 6.5 Phone detail page

The dynamic phone page at `app/phones/[slug]/page.tsx` shows the long-form specification view.

It combines:

- core phone record data
- cached preview/reference data
- marketplace links
- summary metrics
- grouped specs

This route also has its own loading state for smoother transitions.

## 7. Authentication and Account Handling

The app uses NextAuth with a credentials provider and Prisma-backed persistence.

Current auth behavior:

- users can sign up with email and password
- users can sign in with email and password
- sessions persist across refreshes
- the signup form does not redirect until a real session is confirmed
- protected features like favorites use the authenticated session user id

Key related files:

- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/signup/route.ts`
- `components/auth/auth-form.tsx`
- `components/providers/favorites-provider.tsx`

## 8. Backend and Data Flow

## 8.1 Catalog loading

The dashboard and related APIs use `lib/services/phones.ts`.

That service:

- reads phone filters
- queries Prisma when the database is available
- falls back safely when database/runtime issues occur
- returns phones, total count, and available brands

## 8.2 Favorites

Favorites use:

- `app/api/favorites/route.ts`
- `app/api/favorites/[phoneId]/route.ts`
- `lib/services/favorites.ts`

The API always works from the current authenticated user id, not from client-supplied account identity.

## 8.3 Comparison history

Comparison snapshots are stored per user and used to build recent-comparison shortcuts on the compare page.

Important files:

- `lib/services/comparison.ts`
- `lib/services/comparison-history.ts`
- `app/compare/page.tsx`

## 8.4 Database model

The main Prisma models currently include:

- `Phone`
- `User`
- `Favorite`
- `ComparisonSnapshot`
- `Account`
- `Session`
- `VerificationToken`
- `PhoneSource`
- `EnrichmentJob`

This means the project supports:

- a browsable phone catalog
- account-backed auth
- per-user favorites
- per-user comparison history
- source/reference caching
- enrichment workflow storage

## 9. Responsiveness Strategy

The project is explicitly mobile-aware.

The current CSS approach uses:

- mobile-friendly layouts as the base where appropriate
- route-specific CSS modules for page-specific adjustments
- shared utility rules in `globals.css`
- major breakpoints at small-phone and tablet ranges

Examples:

- the mobile tab bar replaces desktop navigation on small screens
- header auth controls collapse into a centered mobile sheet
- compare rows collapse into stacked cards on narrow screens
- dashboard filters move into a mobile sheet on smaller devices
- phone cards keep one organized structure across laptop, tablet, and phone

## 10. Why The Current Structure Is Better

Compared with the earlier version of the project, the current structure is easier to maintain because:

- route-specific CSS is closer to route-specific markup
- component-specific CSS is closer to component-specific logic
- blank or fake CSS modules were removed
- the public browsing flow is clearer
- the compare workflow is no longer mixed into the dashboard
- favorites are more clearly tied to authenticated user state

## 11. Files Worth Studying First

If someone wants to understand the project quickly, these are the best entry points:

### Frontend structure

- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/dashboard/page.tsx`
- `components/dashboard/matchmaker-dashboard.tsx`
- `components/phones/device-card.tsx`

### Styling

- `app/page.module.css`
- `app/compare/page.module.css`
- `app/services/page.module.css`
- `components/dashboard/MatchmakerDashboard.module.css`
- `components/phones/DeviceCard.module.css`
- `components/marketing/ThemeToggle.module.css`

### Backend / auth / data

- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/signup/route.ts`
- `app/api/favorites/route.ts`
- `lib/services/phones.ts`
- `lib/services/comparison.ts`
- `prisma/schema.prisma`

## 12. Final Summary

The current project is a cleaner, production-oriented phone discovery application with:

- a shared Next.js app shell
- a modular CSS structure
- a public dashboard
- a dedicated compare page
- account-based favorites
- Prisma-backed authentication
- responsive layouts across phone, tablet, and desktop

The most important structural improvement is that the styling system is now easier to understand:

- global CSS handles shared foundation
- modules handle owned route/component styling
- blank placeholder CSS files were removed

That makes the repository easier to defend, easier to maintain, and easier to study.
