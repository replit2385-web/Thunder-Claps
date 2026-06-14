---
name: Infinite Us project
description: Architecture and gotchas for the Infinite Us couples relationship platform
---

## Key architecture facts

- Web app: `artifacts/web` at preview path `/`, port 22333
- API server: `artifacts/api-server` at preview path `/api`, port 8080
- DB: Replit-managed PostgreSQL (already provisioned)
- 9 DB tables: couples, sessions, growth_scores, mirror_results, bonds, bond_memberships, drifted_cards, journeys, rooms

## Critical workflow after schema changes

After any `lib/db/src/schema/` change:
1. `pnpm run typecheck:libs` — rebuilds type declarations so API server sees new table exports
2. `pnpm --filter @workspace/db run push` — applies schema to DB
3. Restart API server workflow

After any `lib/api-spec/openapi.yaml` change:
1. `pnpm --filter @workspace/api-spec run codegen`
2. `pnpm run typecheck:libs`
3. Restart web workflow

**Why:** The API server imports `@workspace/db` — if TypeScript declarations aren't rebuilt, new table exports show as "no exported member" errors even though the source is correct.

## State management

- Zustand store with localStorage persist at `artifacts/web/src/store/appStore.ts`
- Couple ID stored locally; API calls enabled only when `couple.id` exists
- Sessions, growth score, mirror results all available locally (for offline) + synced to DB

## Card system

- 9 card types: dare, this-or-that, what-if, challenge, spicy, thunder, legacy, repair, nostalgia
- 3 depths: surface, current, deep
- Sample cards at `artifacts/web/src/features/cards/cards.ts`
- Each type has a distinct brand color

## Blend (AI portraits)

- Uses Pollinations.ai URL: `https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true`
- No API key required — completely free
- Random seed in URL to regenerate on demand
