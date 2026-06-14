# Infinite Us

An 18+ immersive couples relationship platform — a living card game and relationship engine where couples do real, meaningful work together.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/web run dev` — run the web frontend (port 22333)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — typecheck lib packages (run after DB schema changes)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js, TypeScript 5.9
- Web: React 19 + Vite 7, Tailwind CSS 4, Zustand, Wouter, Framer Motion, Shadcn/ui
- API: Express 5, Socket.io (planned)
- DB: PostgreSQL + Drizzle ORM (9 tables)
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- AI portrait: Pollinations.ai (URL-based, no API key)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (couples, sessions, growth_scores, mirror_results, bonds, bond_memberships, drifted_cards, journeys, rooms)
- `artifacts/api-server/src/routes/` — Express route handlers (couples, sessions, growth, mirror, bonds, rooms, journey, blend, leaderboard, admin)
- `artifacts/web/src/` — React SPA (pages, features, store, components)
- `artifacts/web/src/store/appStore.ts` — Zustand store (localStorage-backed state)
- `artifacts/web/src/features/cards/cards.ts` — card data (9 types, 3 depths)

## Architecture decisions

- App-first localStorage state via Zustand persist — works offline, syncs to DB when coupleId available
- Pollinations.ai for AI couple portraits — URL-based, completely free, no API key required
- Drizzle ORM with `drizzle-kit push` for schema — no migration files during development
- Dark-mode only UI — background #0f0f12, primary accent #e879a0 (rose)
- Bottom navigation for mobile-first layout

## Product

- **Landing** (`/`) — animated entry with brand tagline
- **Setup** (`/setup`) — couple profile creation (names, anniversary, avatar)
- **Dashboard** (`/dashboard`) — main hub with score, streak, quick actions
- **Play** (`/play`) — solo card game with swipe gestures, 9 card types, 3 depth levels
- **Live** (`/live`) — real-time 2-player game via 6-char room code
- **Mirror** (`/mirror`) — Love Language + Conflict Style assessments
- **Archive** (`/archive`) — session history with mood, score, cards
- **Growth** (`/growth`) — score history chart, streak, momentum (rising/steady/cooling)
- **Bonds** (`/bonds`) — community groups with collective leaderboard
- **Journey** (`/journey`) — seasonal relationship programs (Foundations, Deepening, Adventure, Renewal)
- **Leaderboard** (`/leaderboard`) — global couple rankings
- **Blend** (`/blend`) — AI couple portrait via Pollinations.ai
- **TV Mode** (`/watch/:code`) — read-only observer mode

## User preferences

_Populate as you build._

## Gotchas

- After changing `lib/db/src/schema/`, run `pnpm run typecheck:libs` before typechecking API server
- After changing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` then `pnpm run typecheck:libs`
- The API server bundles with esbuild — changes require restart of the API workflow
- Bond membership upsert uses `onConflictDoNothing()` — if couple already in group, returns empty membership object; handle on client
