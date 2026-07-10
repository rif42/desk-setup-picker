# AGENTS.md — Workspace Designer (Desent Solutions Challenge)

Project: interactive "design your dream workspace, then rent it" tool for **monis.rent** (office-equipment rental for digital nomads / startups in Bali). Goal is a **cool, visual, fun, user-centric** experience — not a product catalog / spreadsheet. Polished MVP over half-finished scope. Time budget: **4–8 h**.

## Locked tech stack (do not substitute)

These three are mandatory per the challenge brief. Everything else is a free choice.

- **Next.js** — framework. Use the **App Router** (`app/`). Lean on the platform:
  - Server Components by default; `"use client"` only for interactive islands (canvas, drag, pickers).
  - `next/image` for all product / scene imagery (configure `images.remotePatterns` for `monis.rent` assets).
  - `next/font` for type, `metadata` for SEO/OG.
  - Route Handlers (`app/api/*/route.ts`) only if a backend stub is genuinely needed (e.g. checkout POST); prefer client-only for the MVP.
- **Tailwind CSS** — all styling. Tailwind **v4** is configured via `@tailwindcss/postcss`; design tokens live in `app/globals.css` under `@theme` / `:root` (no `tailwind.config` by default). No plain CSS files / CSS Modules / styled-components beyond `globals.css`. Component variants via `clsx` + `tailwind-merge` (`cn()` helper).
- **Vercel** — deployment target. Keep the app Vercel-deployable (no Node-only APIs in the edge, no persistent local FS, env via `NEXT_PUBLIC_*` for client).

TypeScript is expected (Next default). Keep strict.

## Hard requirements = acceptance criteria

Each MUST be demonstrable in the deployed app. Treat as the definition of done.

1. Desk selectable from **≥ 2 options**.
2. Chair selectable from **≥ 2 options**.
3. Accessories addable to the workspace — **monitors, lamps, plants, etc.** (multiple, add/remove).
4. **Workspace preview updates visually live** as items are added/changed (the centerpiece — must feel responsive and alive).
5. A **summary / "checkout" view** showing the selected setup.
6. App **deployed to a public Vercel URL**.
7. Code on **GitHub** with `desent-bot` added as a collaborator (Read access).

Submission extras (required to finish, not optional polish): **Live URL**, **GitHub repo**, and a short **README write-up** (approach, tech choices, what you'd improve with more time).

## Product / design principles

- User is a freelancer who just landed in Bali and needs a workspace fast. Optimize for **speed, clarity, delight**.
- Visual-first: the scene/preview is the hero. Selection UI (picker/dock) should feed the scene instantly.
- Free interpretation of the provided sketch is encouraged — build it better, not literal.
- Motion matters but must serve comprehension (springy add/remove, layout transitions), not decoration for its own sake.

## Recommended (optional) libraries — use only if they earn their place

All explicitly allowed by the brief ("everything else is up to you"). Default picks that map well to the must-haves:

- State: **Zustand** (lightweight workspace store: selected desk/chair, accessory list, totals).
- Animation: **framer-motion** (layout transitions, enter/exit for accessories, checkout reveal).
- Drag & drop (if building a free-arrange canvas): **@dnd-kit/core**.
- UI primitives: **shadcn/ui** (Radix + Tailwind) for buttons, dialogs (checkout), toggles — copy-in, no lock-in.
- Icons: **lucide-react**.
- Pricing/totals: a tiny pure function module; keep currency config (IDR) in one place.

Do not add a backend, DB, or auth for the MVP. Checkout can be a confirmed-summary + stubbed submit.

## Conventions

- App Router structure: `app/` (routes, layout, page), `components/` (UI), `components/workspace/` (feature components), `lib/` (store, catalog data, pricing, utils), `public/` (static assets).
- Catalog as typed data (`lib/catalog.ts`): desks, chairs, accessories with id, name, price, image, category.
- One source of truth for the workspace state; preview, picker, and checkout all read from it.
- Keep client components small and at the leaf; pass serializable data from server components where possible.
- Accessibility: keyboard-operable pickers, labeled controls, focusable checkout dialog, reduced-motion respect for animations.
- No secrets in client; no committed `.env*`.

## Commands

```bash
npm run dev      # local dev (Next.js)
npm run build    # production build — must pass before deploy
npm run start    # run production build locally
npm run lint     # eslint (next/core-web-vitals)
```

Add a `typecheck` script (`tsc --noEmit`) and keep it green.

## Definition of done (merge = ready to submit)

- All 7 hard requirements above verified against the live Vercel URL, not just localhost.
- `npm run build` and lint/typecheck pass.
- README contains the approach / tech-choices / "with more time" write-up and the live URL.
- `desent-bot` invited as collaborator (Read).
- No placeholder content in the hero flow; imagery loads via `next/image`.

## Out of scope (YAGNI for this challenge)

Real payments, accounts/auth, persistence/database, admin/CMS, i18n, analytics beyond basics. If a feature doesn't make the workspace feel more fun, visual, or rentable, cut it.
