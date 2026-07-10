# Live Builder Plan — Preview & Selection Dock

Entry beat for everything after the room reveal: the workspace is settled and usable, and the user shapes it live. Parked until the opening (`PLAN-narrative.md`) is solid.

Context:
- Arrival / closed-door handoff / room reveal live in `PLAN-narrative.md`.
- Persona chips live in `PLAN-persona.md`.
- Other post-reveal flow (summary/checkout, design direction, loading strategy) stays in `PLAN-narrative-later.md`.
- Shared design direction (premium calm + tropical warmth, springy motion) is defined in `PLAN-narrative-later.md` and applies here.
- **Selection logic / presets / IDs / prices live in the main document `PLAN-workspace-items.md`** — this view consumes that contract; do not redefine it here.

## Prerequisites (owned by this wave)

The contract in `PLAN-workspace-items.md` is currently markdown-only. Live code still uses placeholder IDs and icon-based rendering. Before/with the builder work, refactor existing code to match the contract and the real assets in `public/`:

- `lib/catalog.ts`: replace placeholder desks/chairs/accessories with the 11 canonical items; add `image: "/<id>.webp"` per item; keep `icon`/`tint` only as fallbacks.
- `lib/presets.ts`: repoint Coder/Designer/Business to canonical IDs per `PLAN-workspace-items.md`.
- `lib/store.ts`: defaults → canonical IDs; add `applyPreset(id)` to hydrate desk/chair/accessories from a preset; enforce accessory cap (max 5, one of each) inside `toggleAccessory`.
- `components/workspace/WorkspaceDesigner.tsx`: refactor to the three-zone layout below; do not build a parallel component.
- `components/workspace/WorkspacePreview.tsx`: replace lucide-icon/tint rendering with the composited `env-` scene below.
- Goal: existing data matches the pictures in `public/`; catalog IDs, preset IDs, store defaults, and `env-`/`<id>` filenames all agree.

## Entry + layout (this view)

**Entry:** after the persona beat, the user lands here. Persona chips start with **no selection**. Builder entry **always hydrates the Coder preset by default** for the initial scene; when the user picks a chip, the builder swaps to that persona's preset (`applyPreset`) and the scene reloads the matching images. After entry the user can edit freely.

Three zones (refactor of `WorkspaceDesigner`; desktop only — mobile is out of scope this wave):

1. **Leftmost dock — Selection dock.** Gear picker (desk / chair / accessories). Feeds the scene instantly. Picker thumbnails use the product cutout `/<id>.webp`.
2. **Centerpiece — Live scene.** The hero. Composites the selected gear into one workspace (see rendering below).
3. **Rightmost dock — Selected items + total (temporary basket).** Lists the currently selected desk/chair/accessories and the running **total price (IDR/mo)**. This is an in-builder basket/summary only; the real checkout begins when the user clicks **Checkout** (handled later, see `PLAN-narrative-later.md`).

The desk (and every other slot) populates from the gear selection, using the rules in `PLAN-workspace-items.md`: desk = exactly one, chair = exactly one, accessories = optional add/remove, one of each, up to 5.

## Centerpiece rendering (environment layers)

- Render with `next/image` (hard requirement); set sensible `sizes` and mark the hero `priority`.
- Base scene: the sharp `office.webp` room already mounted in the builder phase stays as the backdrop.
- For **each selected item**, render its environment image `env-<id>.webp` from `public/`, stacked with **absolute positioning** over the backdrop. The layers are full-scene and intentionally overlap; selecting `chair-mia` shows `env-chair-mia.webp`, `desk-compact` shows `env-desk-compact.webp`, etc. No per-item hardcoding beyond the `env-` prefix — the layer key is always `env-<id>`.
- **z-order (front → back):** `chair` → `acc-laptop-stand` → `acc-monitor-*` → `acc-keyboard-mx` → `acc-mouse-mx-master` → `desk` → `office.webp` backdrop. Suggested indices: chair 60, laptop stand 50, monitor 40, keyboard 30, mouse 20, desk 10, backdrop 0.
- **Empty accessories allowed:** with 0 accessories the scene still shows backdrop + desk + chair.
- **Missing layer:** if an `env-<id>.webp` fails to load, skip that layer (no hard fail, no broken-scene).

Example: with `chair-mia` + `desk-compact` + `acc-monitor-27-4k` selected, the centerpiece shows `env-chair-mia`, `env-desk-compact`, and `env-acc-monitor-27-4k` layered (absolute, z-ordered above) over `office.webp`.

Available `env-` assets in `public/` (one per real item, 11 total): `env-desk-standing-electric`, `env-desk-adjustable`, `env-desk-compact`, `env-chair-ergo-mesh`, `env-chair-mia`, `env-chair-task-basic`, `env-acc-monitor-34-gaming`, `env-acc-monitor-27-4k`, `env-acc-keyboard-mx`, `env-acc-mouse-mx-master`, `env-acc-laptop-stand`.

> ID note: the brief's example `acc-monitor-27` maps to the canonical ID `acc-monitor-27-4k` (file `env-acc-monitor-27-4k.webp`). Use the canonical IDs from `PLAN-workspace-items.md`.

### Image-role map

| Surface | Asset | Filename |
| --- | --- | --- |
| Centerpiece scene layer | environment | `/env-<id>.webp` |
| Picker thumbnail / basket list | product cutout | `/<id>.webp` |

## Flow (this page)

1. **Live builder**
   - Picker/dock feeds the scene instantly.
   - Desk, chair, monitors, and accessories update the preview live.
   - Add/remove should feel springy and responsive.

2. **Preview is the hero**
   - The scene/preview is the centerpiece; selection UI feeds it.
   - Workspace preview updates visually live as items are added/changed.

3. **Selection dock**
   - Desk selectable from at least 2 options (current catalog has 3).
   - Chair selectable from at least 2 options (current catalog has 3).
   - Accessories addable/removable (current catalog has 5): monitors, keyboard, mouse, laptop stand.

## Policies

- **Motion:** animations always play; `prefers-reduced-motion` gating is intentionally disabled, consistent with the opening/persona.
- **Currency:** totals format as IDR via `lib/pricing.ts`.

## Acceptance mapping (builder-owned)

- Desk selectable from at least 2 options: current catalog has 3.
- Chair selectable from at least 2 options: current catalog has 3.
- Accessories addable/removable: current catalog has 5 (cap 5, one of each).
- Workspace preview updates live.
- Imagery renders via `next/image`.

## Page structure (builder portion)

Follows the reveal (`PLAN-narrative.md`); precedes the summary/checkout entry (`PLAN-narrative-later.md`).

1. Live workspace preview.
2. Selection dock for desk, chair, accessories.
3. Temporary basket (selected + total); **Checkout** button starts the later checkout flow.

## Open questions

- Do we preload all catalog images up front or only the hero/default scene first?

## Changelog

- 2026-07-10: Split live-builder beat out of `PLAN-narrative-later.md` into its own parking file (preview + selection dock, builder-owned acceptance, catalog-preload question).
- 2026-07-10: Spec'd the post-persona view — entry from persona chips (preset pre-fills from `PLAN-workspace-items.md`), three-zone layout (left selection dock, centerpiece live scene, right selected-items + total IDR/mo), and `env-<id>.webp` centerpiece layers composited via absolute positioning. Noted `acc-monitor-27` → `acc-monitor-27-4k` canonical-ID mapping.
- 2026-07-10: Gap-review pass. Added Prerequisites (catalog/preset/store + `WorkspaceDesigner`/`WorkspacePreview` refactor to canonical IDs + real assets). Entry now hydrates Coder by default and swaps on chip selection (chips start empty). Centerpiece: `next/image`, `office.webp` backdrop, full-scene overlapping `env-` layers with fixed z-order (chair → laptop stand → monitor → keyboard → mouse → desk → backdrop), 0-accessories allowed, missing-layer skip. Image-role map (`env-` = scene, `<id>` = picker/basket thumb). Right dock clarified as temporary basket; Checkout starts the later flow. Policies: reduced-motion off, IDR via `lib/pricing.ts`. Desktop only this wave.
