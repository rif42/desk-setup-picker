# Live Builder Plan — Preview & Selection Dock

Entry beat for everything after the room reveal: the workspace is settled and usable, and the user shapes it live. Parked until the opening (`PLAN-narrative.md`) is solid.

Context:
- Arrival / closed-door handoff / room reveal live in `PLAN-narrative.md`.
- Persona chips live in `PLAN-persona.md`.
- Other post-reveal flow (summary/checkout, design direction, loading strategy) stays in `PLAN-narrative-later.md`.
- Shared design direction (premium calm + tropical warmth, springy motion) is defined in `PLAN-narrative-later.md` and applies here.
- **Selection logic / presets / IDs / prices live in the main document `PLAN-workspace-items.md`** — this view consumes that contract; do not redefine it here.

## Entry + layout (this view)

**Entry:** after the user picks a persona chip (`PLAN-persona.md`), they land here. The chosen persona preset pre-fills the desk, chair, and accessories per `PLAN-workspace-items.md`; the user can then edit freely.

Three zones:

1. **Leftmost dock — Selection dock.** Gear picker (desk / chair / accessories). Feeds the scene instantly.
2. **Centerpiece — Live scene.** The hero. Composites the selected gear into one workspace (see rendering below).
3. **Rightmost dock — Selected items + total.** Lists the currently selected desk/chair/accessories and the running **total price (IDR/mo)**.

The desk (and every other slot) populates from the gear selection, using the rules in `PLAN-workspace-items.md`: desk = exactly one, chair = exactly one, accessories = optional add/remove, one of each, up to 5.

## Centerpiece rendering (environment layers)

For **each selected item**, render its environment image `env-<id>.webp` from `public/`, stacked with **absolute positioning** so the layers composite into a single scene. Selecting `chair-mia` shows `env-chair-mia.webp`; selecting `desk-compact` shows `env-desk-compact.webp`; etc. No per-item hardcoding beyond the `env-` prefix convention — the layer key is always `env-<id>`.

Example: with `chair-mia` + `desk-compact` + `acc-monitor-27-4k` selected, the centerpiece shows `env-chair-mia`, `env-desk-compact`, and `env-acc-monitor-27-4k` layered (absolute) over the scene.

Available `env-` assets in `public/` (one per real item, 11 total): `env-desk-standing-electric`, `env-desk-adjustable`, `env-desk-compact`, `env-chair-ergo-mesh`, `env-chair-mia`, `env-chair-task-basic`, `env-acc-monitor-34-gaming`, `env-acc-monitor-27-4k`, `env-acc-keyboard-mx`, `env-acc-mouse-mx-master`, `env-acc-laptop-stand`.

> ID note: the brief's example `acc-monitor-27` maps to the canonical ID `acc-monitor-27-4k` (file `env-acc-monitor-27-4k.webp`). Use the canonical IDs from `PLAN-workspace-items.md`.

## Flow (this page)

1. **Live builder**
   - Picker/dock feeds the scene instantly.
   - Desk, chair, monitors, lamps, plants, and accessories update the preview live.
   - Add/remove should feel springy and responsive.

2. **Preview is the hero**
   - The scene/preview is the centerpiece; selection UI feeds it.
   - Workspace preview updates visually live as items are added/changed.

3. **Selection dock**
   - Desk selectable from at least 2 options (current catalog has 3).
   - Chair selectable from at least 2 options (current catalog has 3).
   - Accessories addable/removable (current catalog has 5): monitors, lamps, plants, etc.

## Acceptance mapping (builder-owned)

- Desk selectable from at least 2 options: current catalog has 3.
- Chair selectable from at least 2 options: current catalog has 3.
- Accessories addable/removable: current catalog has 5.
- Workspace preview updates live.

## Page structure (builder portion)

Follows the reveal (`PLAN-narrative.md`); precedes the summary/checkout entry (`PLAN-narrative-later.md`).

1. Live workspace preview.
2. Selection dock for desk, chair, accessories.

## Open questions

- Do we preload all catalog images up front or only the hero/default scene first?

## Changelog

- 2026-07-10: Split live-builder beat out of `PLAN-narrative-later.md` into its own parking file (preview + selection dock, builder-owned acceptance, catalog-preload question).
- 2026-07-10: Spec'd the post-persona view — entry from persona chips (preset pre-fills from `PLAN-workspace-items.md`), three-zone layout (left selection dock, centerpiece live scene, right selected-items + total IDR/mo), and `env-<id>.webp` centerpiece layers composited via absolute positioning. Noted `acc-monitor-27` → `acc-monitor-27-4k` canonical-ID mapping.
