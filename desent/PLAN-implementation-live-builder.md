# Live Builder Implementation Plan

Implementation plan for `PLAN-live-builder.md`. Builds on the existing `builder` phase that already mounts `WorkspaceDesigner` over the sharp `office.webp` room (`components/opening/OpeningExperience.tsx:114-118`). No new route. No new dependencies (zustand + framer-motion already in use; assets are local `public/` so `next/image` needs no `remotePatterns`).

## Integration decision (resolved): refactor in place, hydrate on entry

Reuse the current builder mount. Add store hydration at the persona→builder boundary and refactor the workspace components to the three-zone plan.

Consequences:
- No `app/builder` route, no loader, no `router.push`. Everything stays in the opening client tree.
- `office.webp` is already the persistent sharp backdrop in the builder phase — `WorkspacePreview` must be **transparent** (no own gradient/background) so the room shows through behind the `env-` layers.
- Hydration lives in `OpeningExperience`: entering `builder` calls `applyPreset(persona ?? DEFAULT_PRESET_ID)`; picking a chip calls `applyPreset(id)`. Covers both "chips start empty → default Coder scene" and "chip pick → swap images".

## Target behavior

1. Persona chips start with **no selection** (current). User picks a chip → `handlePersonaSelect` sets persona, `applyPreset(id)`, phase `builder`. Scene shows that preset; default/hard fallback is **Coder**.
2. Three-zone layout: left selection dock, center live scene, right basket (selected + IDR total). Desktop only.
3. Center scene composites `office.webp` backdrop + absolute `env-<id>.webp` layers per selected item, fixed z-order, springy enter/exit. 0 accessories = backdrop + desk + chair only.
4. Pickers/basket render `/<id>.webp` cutouts via `next/image`. Scene renders `/env-<id>.webp` via `next/image`.
5. Accessory cap 5 (one of each); at cap, unselected adds disable.
6. Basket "Checkout" button is a stub that starts the later checkout flow (out of scope here); keep reset ("Start over").
7. Animations always play; reduced-motion gating disabled.

## Current code touchpoints

- `components/opening/OpeningExperience.tsx:68-71` `handlePersonaSelect` sets persona + phase but does **not** hydrate the store. Add `applyPreset`. `:114-118` mounts `WorkspaceDesigner`.
- `lib/catalog.ts:15-23` `CatalogItem` has no `image`; `:25-131` placeholder IDs/names + lucide icons.
- `lib/presets.ts:11-33` placeholder IDs.
- `lib/store.ts:16-38` placeholder defaults; `toggleAccessory` (`:26-31`) has no cap; no `applyPreset`.
- `components/workspace/WorkspaceDesigner.tsx:15` is `lg:grid-cols-[1.1fr_0.9fr]` with pickers under the preview → refactor to three zones.
- `components/workspace/WorkspacePreview.tsx` renders lucide icons + tint chips on its own gradient bg → rewrite to composited scene, transparent.
- `components/workspace/OptionPicker.tsx:42`, `AccessoryPicker.tsx:41`, `CheckoutSummary.tsx:38` render `item.icon` → swap to `next/image` `/<id>.webp`.
- `lib/pricing.ts` `formatIDR` — reuse as-is.
- `next.config.ts` — no change (local assets).

## Frozen contracts

Canonical IDs, prices, presets = `PLAN-workspace-items.md`. Do not redefine elsewhere.

### `lib/catalog.ts` (extend)

```ts
export type CatalogItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;          // IDR/mo
  category: "desk" | "chair" | "accessory";
  image: string;          // "/<id>.webp" (picker/basket cutout)
  envImage: string;       // "/env-<id>.webp" (scene layer)
  icon: LucideIcon;       // fallback only
  tint: string;           // fallback only
};
```

`image`/`envImage` derived by convention (`/<id>.webp`, `/env-<id>.webp`); store them on each item to keep call sites simple.

### `lib/store.ts` (extend)

```ts
type WorkspaceState = {
  deskId: string;
  chairId: string;
  accessoryIds: string[];     // max 5, one of each
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  toggleAccessory: (id: string) => void;  // no-op add when already 5
  applyPreset: (id: PresetId) => void;    // hydrates desk/chair/accessories
  reset: () => void;                       // → Coder preset
};
```

Defaults = Coder preset (canonical). `reset()` returns to Coder. `selectItems` unchanged in shape.

## Component contracts

### `components/workspace/WorkspacePreview.tsx` (rewrite)

```ts
type Props = {
  desk?: CatalogItem;
  chair?: CatalogItem;
  accessories: CatalogItem[];
};
```

- Transparent container, `position: relative`, fixed aspect (e.g. `aspect-[4/3]`), `overflow: hidden`. No own background/gradient.
- One `next/image` layer per selected item using `item.envImage`, absolute `inset-0`, `object-fit: contain`. z-index by slot:
  - chair 60, `acc-laptop-stand` 50, monitors (`acc-monitor-*`) 40, `acc-keyboard-mx` 30, `acc-mouse-mx-master` 20, desk 10. (Backdrop `office.webp` is owned by `PersonaBackground`, not here.)
- `AnimatePresence` enter/exit per layer keyed by `item.id`; springy. Missing image → skip layer (`onError` hide), no broken scene.
- `priority` on the desk layer (hero anchor); others lazy. Sensible `sizes`.

### `components/workspace/OptionPicker.tsx` / `AccessoryPicker.tsx` (image swap)

- Replace `item.icon` with `next/image` `item.image` (`/<id>.webp`) thumb, fixed box, `object-fit: contain`.
- Keep `aria-pressed`, active styling, `formatIDR`. `AccessoryPicker`: disable (and `aria-disabled`) unselected adds when `selectedIds.length >= 5`; show "5/5" hint.

### `components/workspace/CheckoutSummary.tsx` (→ basket)

- Rename in spirit to basket (keep filename to limit churn). List uses `next/image` `item.image` thumbs. Total via `formatIDR`.
- Replace "Rent this setup"/confirmed flow with a single **Checkout** button (stub: `onClick` no-op or `console.info`; real flow later). Keep "Start over" → `reset()`.

### `components/workspace/WorkspaceDesigner.tsx` (three-zone layout)

```ts
// lg:grid-cols-[280px_1fr_320px]; center holds WorkspacePreview; left docks pickers; right basket.
<div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(280px,320px)] lg:items-start">
  <div className="space-y-6">/* OptionPicker desk, OptionPicker chair, AccessoryPicker */</div>
  <WorkspacePreview ... />
  <div className="lg:sticky lg:top-6 lg:self-start"><CheckoutSummary ... /></div>
</div>
```

### `components/opening/OpeningExperience.tsx` (hydration)

- On `handlePersonaSelect(id)`: `setPersona(id); applyPreset(id); setPhase("builder");`
- Entering `builder` with no persona (fallback): `applyPreset(DEFAULT_PRESET_ID)`. Implement as the default value of `persona` for hydration only (UI chips still start unselected) — e.g. hydrate from `persona ?? DEFAULT_PRESET_ID` on the `persona → builder` transition.
- No change to arrival/preparing/revealing/persona beats or timers.

## Dependency graph

```text
Wave 0: Contracts + store (catalog + presets + applyPreset/cap/defaults)   [@fixer]
  |
  |--> Wave 1A: WorkspacePreview composited scene                         [@designer]
  |--> Wave 1B: OptionPicker/AccessoryPicker next/image + cap UX          [@designer]
  |--> Wave 1C: CheckoutSummary -> basket (next/image thumbs, Checkout)   [@fixer]
  |
  v
Wave 2: WorkspaceDesigner three-zone layout + OpeningExperience hydration [@fixer]
  |
  v
Wave 3: verify + review
```

Wave 1 lanes read catalog/store (no writes) and own distinct files → safe in parallel once Wave 0 lands. Lane 2 integrates.

## Parallel lanes

### Lane 0 — Contracts + store

Owner: one @fixer.

Files:
- `lib/catalog.ts` (11 canonical items; `image` + `envImage`; keep `icon`/`tint` fallbacks)
- `lib/presets.ts` (canonical IDs per `PLAN-workspace-items.md`)
- `lib/store.ts` (Coder defaults, `applyPreset`, `toggleAccessory` cap 5, `reset`→Coder)

Done when:
- `byId` resolves for every canonical ID used by presets.
- `applyPreset("coder"|"designer"|"business")` sets the exact desk/chair/accessories from the preset.
- `toggleAccessory` refuses a 6th; one-of-each inherent.
- Types compile; no placeholder IDs remain.

### Lane 1A — Composited scene

Owner: @designer (hero feel: compositing, z-order, motion).

Files:
- `components/workspace/WorkspacePreview.tsx`
- `app/globals.css` only if a shared scene helper is truly needed (sole writer this wave).

Depends on: Lane 0.

Done when:
- Transparent container; `office.webp` shows through behind layers.
- `next/image` per selected item (`envImage`), absolute, correct z-index, springy enter/exit.
- 0 accessories renders clean (backdrop + desk + chair).
- Missing layer fails safe (skip), no layout shift, `sizes` set, desk layer `priority`.

### Lane 1B — Pickers to images + cap UX

Owner: @designer (selection UI look/active states).

Files:
- `components/workspace/OptionPicker.tsx`
- `components/workspace/AccessoryPicker.tsx`

Depends on: Lane 0.

Done when:
- Thumbs via `next/image` `item.image`; active states intact; keyboard/focus intact.
- Accessory add disabled at 5 with `aria-disabled` + small "5/5" hint; remove always works.

### Lane 1C — Basket

Owner: @fixer.

Files:
- `components/workspace/CheckoutSummary.tsx`

Depends on: Lane 0.

Done when:
- List rows use `next/image` `item.image` thumbs; total via `formatIDR`.
- "Checkout" stub button present; "Start over" calls `reset()`.
- No "Rent/confirmed" flow remains.

### Lane 2 — Layout + entry hydration

Owner: @fixer. Single writer to `WorkspaceDesigner.tsx` + `OpeningExperience.tsx`.

Files:
- `components/workspace/WorkspaceDesigner.tsx`
- `components/opening/OpeningExperience.tsx`

Depends on: Lane 0, 1A, 1B, 1C.

Done when:
- Three-zone grid desktop; pickers left, scene center, basket right (sticky).
- `handlePersonaSelect` → `applyPreset(id)`; `persona→builder` fallback hydrates Coder.
- No regression to arrival/preparing/revealing/persona; chips still start unselected.
- Focus/region labels sane after layout change.

## Write ownership rules

- `lib/catalog.ts`, `lib/presets.ts`, `lib/store.ts`: Lane 0 only.
- `components/workspace/WorkspacePreview.tsx`: Lane 1A only.
- `components/workspace/OptionPicker.tsx`, `components/workspace/AccessoryPicker.tsx`: Lane 1B only.
- `components/workspace/CheckoutSummary.tsx`: Lane 1C only.
- `components/workspace/WorkspaceDesigner.tsx`, `components/opening/OpeningExperience.tsx`: Lane 2 only.
- `app/globals.css`: no edits this wave; if unavoidable, Lane 1A sole writer.
- Do not touch `lib/opening-preload.ts`, `components/opening/types.ts`, `components/persona/*`, `DoorBackdrop`, `SlidingDoor`.

## Out of scope for this wave

- Real checkout flow/dialog/route (Checkout is a stub that starts it later).
- Catalog image preload strategy (open question in `PLAN-live-builder.md`).
- Mobile/responsive three-zone behavior (desktop only).
- `next.config.ts` `remotePatterns` (local assets only).
- reduced-motion (disabled by policy).

## Verification

Run after Lane 2:

```bash
npm run typecheck
npm run lint
npm run build
```

Manual checks:
- arrival → enter → blurred room + chips (unselected) → pick Coder/Designer/Business → builder: scene shows that preset, correct `env-` layers over `office.webp`, z-order chair>stand>monitor>keyboard>mouse>desk.
- Pick a different persona later (if reachable) → scene swaps via `applyPreset`.
- Swap desk/chair → scene updates live; add/remove accessories → springy, cap blocks a 6th with disabled UX + "5/5" hint; 0 accessories shows backdrop + desk + chair.
- All product/scene imagery via `next/image`; no lucide icons left in preview/pickers/basket (icons remain only as catalog fallbacks).
- Basket lists selection + IDR total; "Checkout" stub present; "Start over" resets to Coder.
- No placeholder IDs anywhere (`rg "desk-standing|chair-ergo|acc-monitor\b|acc-lamp|acc-plant|acc-headphones|desk-bali|chair-task|chair-lounge|acc-monitor-2"` returns empty).

## Review routing

- Scene compositing/z-order/motion feel, picker + basket visuals/hierarchy: @designer.
- Contract migration (IDs/prices/presets), `applyPreset`/cap/reset correctness, hydration fallback, layout grid, simplification/YAGNI: @oracle.
- Mechanical fixes after review: @fixer.

## Changelog

- 2026-07-10: Created parallelizable implementation plan for the live builder. Refactor-in-place on the existing `builder` phase; store hydration at persona→builder (default Coder fallback). Five lanes: Wave 0 contracts/store, Wave 1A scene (@designer), 1B pickers (@designer), 1C basket (@fixer), Wave 2 layout+hydration (@fixer), Wave 3 verify/review. z-order locked chair 60 → stand 50 → monitor 40 → keyboard 30 → mouse 20 → desk 10 over `office.webp`.
