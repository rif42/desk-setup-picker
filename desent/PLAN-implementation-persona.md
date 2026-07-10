# Persona Implementation Plan

Implementation plan for the persona beat in `PLAN-persona.md`:

**Navigate to page -> blurred `office.webp` slow-reveal -> persona chips (Coder / Designer / Business), Coder default + fallback.**

This wave is intentionally narrow: one page, one blurred background, three chips. No preset swap, no builder, no checkout, no persistence. Those stay parked in `PLAN-persona.md` (deferred) and `PLAN-narrative-later.md`.

## Target behavior

1. User navigates to the persona page.
2. `public/office.webp` slowly reveals, blurred, with a soft scrim for legibility.
3. After the background settles, three chips fade/stagger in: **Coder**, **Designer**, **Business**.
4. **Coder** is active by default. If the user skips, dismisses, or never chooses, the value stays **Coder** (fallback is inherent — nothing requires a choice and nothing persists).
5. Selecting a chip updates the active highlight only. Preset application is deferred (later wave).
6. Animations always play; reduced-motion gating intentionally disabled, consistent with the opening policy.

## Recommended integration decision (confirm before wiring)

The persona beat reads as "after the user comes in for the first time" and the repo already gates home with `OpeningExperience` (arrival -> preparing -> revealing -> done). Two ways to place this page:

- **(A) New route `app/persona/page.tsx` (recommended).** Self-contained, directly navigable, reviewable on its own URL, and matches "navigate to this page." Opening hands off via `router.push("/persona")` when it reaches `done`.
- **(B) New `persona` phase inside `OpeningExperience`.** Keeps one state machine but couples persona to opening and complicates the terminal reveal frame.

Plan defaults to **(A)**. The opening -> persona handoff is isolated as its own optional lane (Lane 4) so it can be confirmed, deferred, or shipped without blocking the page itself.

Caveat to confirm: opening currently ends on a fully revealed Coder room (`WorkspacePreview` over `/office.jpg`). Routing to `/persona` then reframes to a blurred `/office.webp` + chips. That seam is intentional per `PLAN-persona.md` (preset/full room comes later), but worth a visual check during review.

## Current code touchpoints

- `lib/presets.ts:2` already exports `PresetId = "coder" | "designer" | "business"`, preset labels, and `DEFAULT_PRESET_ID = "coder"`. Reuse — do not duplicate the chip list.
- `public/office.webp` exists and is the mandated background.
- `components/opening/OpeningLoader.tsx` is the established pattern for hydrating a framer-motion client tree (`next/dynamic(..., { ssr: false })`); mirror it for persona.
- `components/opening/RevealedRoom.tsx:37-53` is the reference for a slow `next/image` reveal + gradient scrim. Persona reuses the approach but adds blur and drops `WorkspacePreview`.
- `app/page.tsx:1-5` renders `OpeningLoader`. The persona route follows the same server->client-loader shape.
- `app/globals.css` holds tokens (`--background`, `--foreground`, `--card`, `--accent`). Reuse; add a glass/chip helper only if needed, single owner.

## Frozen contracts

Reuse `lib/presets.ts` as-is. Add only persona-local types.

### `components/persona/types.ts`

```ts
import type { PresetId } from "@/lib/presets";

export type PersonaStep = "reveal" | "choose";

export type PersonaChip = {
  id: PresetId;
  label: string;
};
```

Source the chip list from `lib/presets.ts` so labels/IDs stay in one place:

```ts
import { presets, DEFAULT_PRESET_ID } from "@/lib/presets";
const CHIPS = (Object.values(presets) as { id: PresetId; label: string }[]);
// order: coder, designer, business (insertion order of the presets record)
```

## Component contracts

### `components/persona/PersonaBackground.tsx`

```ts
type PersonaBackgroundProps = {
  reveal: boolean;
};
```

Responsibilities:
- Render `/office.webp` via `next/image` (`fill`, `priority`, sensible `sizes`).
- Blur the image (Tailwind `blur-*` + slight `scale` to hide blur edges), slow opacity fade-in when `reveal`.
- Add a soft scrim/gradient so chips stay readable.
- Purely presentational. No state. Animations always play.

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
- Render the three chips from the `presets` source as a keyboard-operable group (`role="radiogroup"`, each chip `role="radio"` + `aria-checked`; arrow-key + Tab/Enter/Space support).
- Active state is clearly differentiated; default active is `DEFAULT_PRESET_ID` (Coder).
- Entrance is staggered and only plays when `visible`.
- No persistence, no navigation, no side effects.

### `components/persona/PersonaExperience.tsx` (client orchestrator)

State machine (minimal):

```ts
const [step, setStep] = useState<PersonaStep>("reveal");
const [selected, setSelected] = useState<PresetId>(DEFAULT_PRESET_ID); // "coder"
```

Flow:
- On mount: `step = "reveal"` -> background fades in (blurred).
- After the background reveal delay: `step = "choose"` -> chips become `visible` and stagger in.
- `selected` initializes to `DEFAULT_PRESET_ID` and never requires input -> **Coder fallback is satisfied by construction** for skip / no-choice / dismiss.
- `onChange` only updates `selected` (active highlight). Preset application is deferred.

Timing (tune in designer lane):
- Background reveal: ~900-1200ms, ease-out.
- Chips appear: background duration + ~150ms; stagger ~80-120ms per chip.
- Animations always play; no reduced-motion branch.

### `components/persona/PersonaLoader.tsx`

Mirror `OpeningLoader.tsx`: `next/dynamic(() => import("./PersonaExperience"), { ssr: false })` to avoid framer-motion hydration mismatch.

## Dependency graph

```text
Wave 0: contracts (reuse presets; add persona types)
  |
  |--> Wave 1A: PersonaBackground visuals            [parallel, @designer]
  |--> Wave 1B: PersonaChips interactive + visuals   [parallel, @designer]
  |--> Wave 1C: globals glass/chip helper if needed  [parallel, single owner]
  |
  v
Wave 2: PersonaExperience orchestrator
  |
  v
Wave 3: route wiring (app/persona/page.tsx + PersonaLoader)
  |
  v
Wave 4 (optional seam): opening -> /persona handoff   [confirm first]
  |
  v
Wave 5: verify + review
```

## Parallel lanes

### Lane 0 — Contracts

Owner: one @fixer.

Files:
- `components/persona/types.ts`

Done when:
- Types compile.
- Chip list is sourced from `lib/presets.ts` (no duplicate IDs/labels).

### Lane 1A — Background visual

Owner: @designer (user-visible, blur feel matters).

Files:
- `components/persona/PersonaBackground.tsx`
- `app/globals.css` only if a shared scrim/blur helper is needed (coordinate with Lane 1C).

Done when:
- `/office.webp` fills the viewport, blurred, slow fades in.
- Scrim keeps center content readable.
- No layout shift; `next/image` `sizes` set sensibly.

### Lane 1B — Chips

Owner: @designer (interactive + visual).

Files:
- `components/persona/PersonaChips.tsx`

Depends on:
- Lane 0 types.

Done when:
- Three chips (Coder / Designer / Business) from presets.
- `radiogroup`/`radio` semantics; arrow keys + Tab/Enter/Space work.
- Default active = Coder; clear active styling.
- Staggered entrance gated by `visible`.

### Lane 1C — Tokens (only if needed)

Owner: one @designer (single writer to `app/globals.css`).

Files:
- `app/globals.css`

Done when:
- Any glass/chip helper is added once, named clearly, and not duplicated by 1A/1B.
- Skip this lane if 1A/1B can use existing utilities.

### Lane 2 — Orchestrator

Owner: @fixer.

Files:
- `components/persona/PersonaExperience.tsx`

Depends on:
- Lane 0, Lane 1A, Lane 1B.

Done when:
- `reveal -> choose` step machine runs on mount.
- `selected` defaults to `DEFAULT_PRESET_ID`; skip/no-choice leaves Coder.
- No store writes, no navigation, no persistence this wave.
- `aria` region labeled; focus moves sensibly when chips appear.

### Lane 3 — Route wiring

Owner: @fixer.

Files:
- `components/persona/PersonaLoader.tsx`
- `app/persona/page.tsx`

Depends on:
- Lane 2.

Done when:
- `app/persona/page.tsx` (server) renders `PersonaLoader`.
- Loader uses `next/dynamic(..., { ssr: false })` like `OpeningLoader`.
- `/persona` is directly navigable and renders the full beat.

### Lane 4 — Opening handoff seam (optional, confirm first)

Owner: @fixer. Do not start until the integration decision (A vs B) is confirmed.

Files:
- `components/opening/OpeningExperience.tsx` (add `router.push("/persona")` on `done`) **or** a `done` callback prop — pick the least invasive.

Depends on:
- Lane 3.
- Confirmed decision to route on `done`.

Done when:
- Reaching opening `done` navigates to `/persona`.
- No regression to arrival/preparing/revealing behavior.
- Re-verified green.

Note: this is the only lane that touches `components/opening/*`. Keep it isolated so it cannot collide with any opening work.

## Write ownership rules

- `components/persona/types.ts`: Lane 0 only.
- `components/persona/PersonaBackground.tsx`: Lane 1A only.
- `components/persona/PersonaChips.tsx`: Lane 1B only.
- `app/globals.css`: Lane 1C only (single writer; 1A/1B must not also edit it).
- `components/persona/PersonaExperience.tsx`: Lane 2 only.
- `components/persona/PersonaLoader.tsx`, `app/persona/page.tsx`: Lane 3 only.
- `components/opening/OpeningExperience.tsx`: Lane 4 only (and only after confirmation).
- Do not edit `components/workspace/*`, `lib/presets.ts`, or `lib/store.ts` in this wave.

## Out of scope for this wave

- Persona preset application (desk/chair/accessory swap).
- Live builder / picker dock.
- Checkout summary and any persistence of persona into it.
- Store integration for persona selection (selection stays local/ephemeral).
- Full-catalog preload.
- Final persona art; `office.webp` is the asset.

## Verification

Run after integration (Lane 3, and again after Lane 4 if shipped):

```bash
npm run typecheck
npm run lint
npm run build
```

Manual checks:
- Navigate to `/persona`: blurred `office.webp` slow-reveals, then chips fade/stagger in.
- Coder is active by default with no interaction.
- Arrow keys / Tab / Enter / Space move and set the active chip.
- Skipping / doing nothing leaves Coder selected (fallback).
- Animations always play (no reduced-motion branch).
- If Lane 4 shipped: completing the opening routes to `/persona` with no opening regression.

## Review routing

- Background blur feel + chip look/hierarchy: @designer.
- Step machine, default/fallback logic, a11y (`radiogroup`), hydration pattern, simplification: @oracle.
- Mechanical fixes after review: @fixer.

## Changelog

- 2026-07-10: Created parallelizable implementation plan for the persona page only (blurred `office.webp` reveal + Coder/Designer/Business chips, Coder default + fallback). Reused `lib/presets.ts` as the chip source, mirrored the `OpeningLoader` hydration pattern, defined lanes/ownership/verification, and isolated the opening->persona handoff as an optional, confirm-first lane.
