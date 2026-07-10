# Persona Implementation Plan

Implementation plan for the persona beat in `PLAN-persona.md`, integrated as a **post-reveal phase** of the existing opening (Option B):

**Room reveal (sharp `office.webp`) -> hold -> same room blurs -> persona chips (Coder / Designer / Business), Coder default + fallback.**

This wave is intentionally narrow: one persistent room background, one blur transition, three chips. No preset swap, no builder, no checkout, no persistence, no new route. Those stay parked in `PLAN-persona.md` (deferred) and `PLAN-narrative-later.md`.

## Integration decision (resolved): Option B — phase, not route

Persona is a new terminal phase of `OpeningExperience`, not a separate page. The room background stays mounted across the beat change, so the handoff is a **continuous sharp->blur + content swap** instead of a hard route cut. This is the better choice for hiding the seam.

Consequences:
- No `app/persona` route, no client loader, no `router.push`. Everything lives in the opening client tree.
- The room background must be **owned above** `RevealedRoom` so it persists from `revealing` -> `done` -> `persona` without unmounting.
- Standardize on `public/office.webp` for both the revealed room and the persona blur, so the transition is a true single-layer crossfade (not a `jpg`->`webp` swap).

## Target behavior

1. Opening reaches `done`: sharp `office.webp` room + Coder `WorkspacePreview` (existing behavior, asset switched to `office.webp`).
2. After a short hold, phase advances `done -> persona`.
3. The **same** room layer animates `filter: blur(0) -> blur(N)` (continuous). The revealed content (card frame + `WorkspacePreview`) fades out.
4. Three chips fade/stagger in over the blurred room: **Coder**, **Designer**, **Business**.
5. **Coder** is active by default. Skip / dismiss / no-choice leaves **Coder** (fallback inherent — selection is local, nothing persists).
6. Selecting a chip updates the active highlight only. Preset application is deferred.
7. Animations always play; reduced-motion gating intentionally disabled, consistent with the opening policy.

## Current code touchpoints

- `components/opening/OpeningExperience.tsx` owns `OpeningPhase` and the reveal layering. Add the `persona` phase and the persistent background here.
- `components/opening/types.ts:1` defines `OpeningPhase = "arrival" | "preparing" | "revealing" | "done"`. Extend with `"persona"`.
- `components/opening/RevealedRoom.tsx:37-53` currently owns the room image (`/office.jpg`) + card frame + `WorkspacePreview`. Refactor: move the image up to `OpeningExperience` (persistent), keep `RevealedRoom` responsible for the revealed content only, or fold it in.
- `lib/opening-preload.ts` preload list currently includes `/office.jpg`. Switch to `/office.webp`.
- `lib/presets.ts:2` exports `PresetId`, labels, and `DEFAULT_PRESET_ID = "coder"`. Reuse as the chip source — do not duplicate.
- `app/globals.css` holds tokens. Reuse; add a glass/chip helper only if needed, single owner.
- `public/office.jpg` becomes unused after the switch; removal is out of scope this wave (note only).

## Frozen contracts

Reuse `lib/presets.ts` as-is.

### `components/opening/types.ts` (extend)

```ts
export type OpeningPhase = "arrival" | "preparing" | "revealing" | "done" | "persona";
```

### `components/persona/types.ts`

```ts
import type { PresetId } from "@/lib/presets";

export type PersonaStep = "reveal" | "choose";
```

Chip list is sourced from `lib/presets.ts` (insertion order: coder, designer, business) — single source of truth.

## Component contracts

### `components/persona/PersonaBackground.tsx`

```ts
type PersonaBackgroundProps = {
  reveal: boolean;
  blur: boolean;
};
```

Responsibilities:
- Render `/office.webp` via `next/image` (`fill`, `priority`, sensible `sizes`).
- `reveal`: slow opacity fade-in (replaces the inline image currently inside `RevealedRoom`).
- `blur`: animate `filter`/`backdrop-filter` from sharp to blurred (continuous; this is the seam-hider). Add a slight `scale` to hide blur edges, plus a soft scrim for chip legibility.
- Purely presentational. No state. Animations always play.

Note: this becomes the **persistent room layer** mounted by `OpeningExperience` from `revealing` onward (`blur=false` during `revealing`/`done`, `blur=true` during `persona`).

### `components/persona/PersonaChips.tsx`

```ts
import type { PresetId } from "@/lib/presets";

type PersonaChipsProps = {
  value: PresetId;
  visible: boolean;
  onChange: (id: PresetId) => void;
};
```

Responsibilities:
- Render the three chips from `presets` as a keyboard-operable group (`role="radiogroup"`, chips `role="radio"` + `aria-checked`; arrow keys + Tab/Enter/Space).
- Default active = `DEFAULT_PRESET_ID` (Coder); clear active styling.
- Staggered entrance gated by `visible`.
- No persistence, no navigation, no side effects.

### `components/opening/OpeningExperience.tsx` (extend — absorbs the persona orchestration)

State additions:

```ts
const [phase, setPhase] = useState<OpeningPhase>("arrival");
const [persona, setPersona] = useState<PresetId>(DEFAULT_PRESET_ID); // "coder", local only
```

Flow:
- Existing `arrival -> preparing -> revealing -> done` unchanged.
- On `done`: start a short hold timer, then `setPhase("persona")`.
- Derived:
  - `roomMounted = phase === "revealing" || phase === "done" || phase === "persona"`.
  - `roomBlurred = phase === "persona"`.
  - `previewVisible = phase === "done"` (Coder `WorkspacePreview` / revealed content).
  - `chipsVisible = phase === "persona"`.
- `persona` initializes to `DEFAULT_PRESET_ID` and never requires input -> **Coder fallback satisfied by construction** for skip / no-choice / dismiss.
- Selecting a chip only updates `persona` (active highlight). No store writes, no navigation.

Timing (tune in designer lane):
- Hold after `done` before blur: ~600-900ms.
- Blur transition: ~700-1000ms, ease-out (continuous with the persistent layer).
- Chips appear once blur is ~settled; stagger ~80-120ms.
- Animations always play; no reduced-motion branch.

Cleanup: clear the `done -> persona` hold timer on unmount, alongside the existing reveal timer.

## Dependency graph

```text
Wave 0: contracts (extend OpeningPhase; add persona types; switch preload asset)
  |
  |--> Wave 1A: PersonaBackground (persistent room layer, blur)   [parallel, @designer]
  |--> Wave 1B: PersonaChips (interactive + visuals)              [parallel, @designer]
  |--> Wave 1C: globals glass/chip helper if needed               [parallel, single owner]
  |
  v
Wave 2: OpeningExperience integration (persistent bg mount, done->persona,
        preview/chips content swap, selection state, timer cleanup)
  |
  v
Wave 3: verify + review
```

Fewer lanes than the route variant: the seam goal folds orchestration + handoff into a single integration lane (Wave 2), because the persistent background and the content swap must be coordinated in one place.

## Parallel lanes

### Lane 0 — Contracts + asset switch

Owner: one @fixer.

Files:
- `components/opening/types.ts` (add `"persona"`)
- `components/persona/types.ts` (new)
- `lib/opening-preload.ts` call site / preload list: `/office.jpg` -> `/office.webp` (the list lives in `OpeningExperience.handleEnter`; update there in Lane 2 if preferred — note in handoff).

Done when:
- Types compile.
- Persona chip list sourced from `lib/presets.ts` (no duplicate IDs/labels).

### Lane 1A — Persistent background visual

Owner: @designer (blur feel is the whole point).

Files:
- `components/persona/PersonaBackground.tsx`
- `app/globals.css` only if a shared scrim/blur helper is needed (coordinate with Lane 1C).

Done when:
- `/office.webp` fills the viewport; slow fade-in on `reveal`.
- `blur` animates continuously sharp->blurred; slight scale hides edges; scrim keeps chips readable.
- No layout shift; `next/image` `sizes` set sensibly.
- Agree with Lane 2 on whether the revealed card frame fades out to full-bleed for persona (visual note).

### Lane 1B — Chips

Owner: @designer (interactive + visual).

Files:
- `components/persona/PersonaChips.tsx`

Depends on:
- Lane 0 types.

Done when:
- Three chips (Coder / Designer / Business) from presets.
- `radiogroup`/`radio` semantics; arrow keys + Tab/Enter/Space.
- Default active = Coder; clear active styling.
- Staggered entrance gated by `visible`.

### Lane 1C — Tokens (only if needed)

Owner: one @designer (single writer to `app/globals.css`).

Files:
- `app/globals.css`

Done when:
- Any glass/chip helper is added once, named clearly, not duplicated by 1A/1B.
- Skip if 1A/1B can use existing utilities.

### Lane 2 — OpeningExperience integration

Owner: @fixer. Single writer to `OpeningExperience.tsx` + `RevealedRoom.tsx` for this wave.

Files:
- `components/opening/OpeningExperience.tsx`
- `components/opening/RevealedRoom.tsx` (move background up; content-only)

Depends on:
- Lane 0, Lane 1A, Lane 1B.

Done when:
- Persistent `PersonaBackground` mounted from `revealing` onward; `blur=false` in `revealing`/`done`, `blur=true` in `persona`.
- Revealed content (card + Coder `WorkspacePreview`) shows in `done`, fades out in `persona`.
- `done -> persona` hold timer added and cleaned up on unmount.
- `persona` selection defaults to `DEFAULT_PRESET_ID`; skip/no-choice leaves Coder.
- Preload list uses `/office.webp`.
- No regression to arrival/preparing/revealing; focus moves sensibly when chips appear; region labeled.

## Write ownership rules

- `components/opening/types.ts`: Lane 0 only.
- `components/persona/types.ts`: Lane 0 only.
- `components/persona/PersonaBackground.tsx`: Lane 1A only.
- `components/persona/PersonaChips.tsx`: Lane 1B only.
- `app/globals.css`: Lane 1C only (1A/1B must not also edit it).
- `components/opening/OpeningExperience.tsx`: Lane 2 only.
- `components/opening/RevealedRoom.tsx`: Lane 2 only (refactor to content-only).
- Do not edit `components/workspace/*`, `lib/presets.ts`, or `lib/store.ts` in this wave.
- No `app/persona` route, no `PersonaLoader` (Option A artifacts — not used).

## Out of scope for this wave

- Persona preset application (desk/chair/accessory swap).
- Live builder / picker dock.
- Checkout summary and any persistence of persona into it.
- Store integration for persona selection (stays local/ephemeral).
- Full-catalog preload.
- Removing the now-unused `public/office.jpg` (note only).
- Final persona art; `office.webp` is the asset.

## Verification

Run after Lane 2:

```bash
npm run typecheck
npm run lint
npm run build
```

Manual checks:
- Full flow: arrival -> enter -> revealed Coder room (sharp `office.webp`) -> short hold -> same room blurs -> chips fade/stagger in.
- No hard cut between reveal and persona (continuous blur on one layer).
- Coder active by default; skip/no-choice leaves Coder.
- Arrow keys / Tab / Enter / Space move and set the active chip.
- Opening arrival/preparing/revealing unchanged; no `office.jpg` references remain.
- Animations always play (no reduced-motion branch).

## Review routing

- Seamless blur feel, scrim, chip look/hierarchy, full-bleed-vs-card at persona: @designer.
- Phase extension, hold-timer cleanup, default/fallback logic, a11y (`radiogroup`), persistent-layer refactor, simplification: @oracle.
- Mechanical fixes after review: @fixer.

## Changelog

- 2026-07-10: Created parallelizable implementation plan for the persona beat (blurred `office.webp` reveal + chips, Coder default + fallback).
- 2026-07-10: Switched integration to Option B (phase, not route) to hide the seam via a persistent room layer and continuous sharp->blur. Standardized on `office.webp` for reveal + persona; folded orchestration into a single `OpeningExperience` integration lane; dropped the route/loader/handoff lanes.
- 2026-07-10: Implemented. Added `persona` to `OpeningPhase`; created `PersonaBackground` (persistent `office.webp` layer, `reveal` + continuous `blur`) and `PersonaChips` (radiogroup, Coder default/fallback, arrow-key support); refactored `RevealedRoom` to content-only; extended `OpeningExperience` with a `done -> persona` hold timer, local selection state, and the persistent background mount; added a `persona` case to `SlidingDoor`; switched preload to `/office.webp`. Skipped a separate `persona/types.ts` (YAGNI — `PresetId` is reused from `lib/presets.ts`). Verification green: `typecheck`, `lint`, `build`.
