# Opening Implementation Plan

Implementation plan for the opening focus in `PLAN-narrative.md`:

**Arrival -> closed-door handoff -> room reveal.**

This wave is intentionally narrow. It does not implement persona chips, picker changes, or checkout changes. Those stay parked in `PLAN-narrative-later.md` and `PLAN-workspace-items.md`.

## Target behavior

1. User lands on a warm Bali arrival screen with locked copy and one CTA.
2. User clicks **Enter your room**.
3. CTA starts real preloading and the closed sliding door becomes the loading/consent state.
4. When preload settles, or failsafe timeout hits, the sliding door opens.
5. Room reveals using the default Coder setup from `PLAN-workspace-items.md`.
6. Reduced-motion users get a short fade/settle instead of sliding motion.

## Implementation status

- Implemented: `OpeningExperience` now gates the home page with arrival -> preparing -> revealing -> done.
- Verified: `npm run typecheck`, `npm run lint`, and `npm run build` all pass.
- Review fixes applied: focus moves to the revealed room on `done`, hero is hidden/inert during handoff, door a11y tree was split into decorative panels + separate live status, preload simplification, and faster reveal timing.

## Current code touchpoints

- `app/page.tsx:5` currently renders the full `WorkspaceDesigner` immediately.
- `components/workspace/WorkspaceDesigner.tsx` currently combines preview + pickers + checkout.
- `components/workspace/WorkspacePreview.tsx` already animates desk/chair/accessories with `framer-motion`.
- `lib/catalog.ts` already contains the default Coder item IDs needed for reveal.
- `public/office.jpg` exists and can be used as the temporary room/hero background until final art arrives.

## Frozen contracts

Create these first so presentational lanes can parallelize safely.

### `lib/presets.ts`

```ts
export type PresetId = "coder" | "designer" | "business";

export type WorkspacePreset = {
  id: PresetId;
  label: string;
  deskId: string;
  chairId: string;
  accessoryIds: string[];
};

export const presets: Record<PresetId, WorkspacePreset> = {
  coder: {
    id: "coder",
    label: "Coder",
    deskId: "desk-standing",
    chairId: "chair-ergo",
    accessoryIds: ["acc-monitor", "acc-monitor-2", "acc-lamp", "acc-headphones"],
  },
  designer: {
    id: "designer",
    label: "Designer",
    deskId: "desk-bali",
    chairId: "chair-ergo",
    accessoryIds: ["acc-monitor", "acc-lamp", "acc-plant"],
  },
  business: {
    id: "business",
    label: "Business",
    deskId: "desk-compact",
    chairId: "chair-task",
    accessoryIds: ["acc-monitor", "acc-lamp", "acc-headphones"],
  },
};

export const DEFAULT_PRESET_ID: PresetId = "coder";

export function getPreset(id: PresetId): WorkspacePreset {
  return presets[id];
}
```

### `components/opening/types.ts`

```ts
export type OpeningPhase = "arrival" | "preparing" | "revealing" | "done";
```

### `lib/opening-preload.ts`

```ts
export async function preloadOpeningAssets(
  sources: string[],
  timeoutMs = 2500,
): Promise<void> {
  if (typeof window === "undefined" || sources.length === 0) return;

  const loadAll = Promise.allSettled(
    sources.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    ),
  );

  const timeout = new Promise<void>((resolve) => {
    window.setTimeout(resolve, timeoutMs);
  });

  await Promise.race([loadAll, timeout]);
}
```

## Component contracts

### `components/opening/ArrivalHero.tsx`

```ts
type ArrivalHeroProps = {
  onEnter: () => void;
  disabled?: boolean;
};
```

Responsibilities:
- Render locked arrival copy.
- Render **Enter your room** CTA.
- Keyboard-accessible button.
- No loading logic inside.

### `components/opening/SlidingDoor.tsx`

```ts
type SlidingDoorProps = {
  phase: OpeningPhase;
};
```

Responsibilities:
- Render door-transition overlay over `doors.webp`: vignette, warm light spill, portal ring.
- Show light spill from behind the door.
- When `phase === "preparing"`, show subtle preparing state: “Setting up your desk…”.
- When `phase === "revealing"`, play door-open animation.
- Animations always play; reduced-motion gating is intentionally disabled.

### `components/opening/RevealedRoom.tsx`

```ts
type RevealedRoomProps = {
  reveal: boolean;
};
```

Responsibilities:
- Render room shell/background.
- Resolve default Coder preset through `lib/presets.ts` + `lib/catalog.ts`.
- Reuse `WorkspacePreview` for desk/chair/accessory reveal animation.
- Keep picker and checkout out of this wave.

### `components/opening/OpeningExperience.tsx`

State machine:

```ts
const [phase, setPhase] = useState<OpeningPhase>("arrival");
```

Flow:
- `arrival`: show `ArrivalHero` + closed `SlidingDoor`.
- On CTA click: set `preparing`, call `preloadOpeningAssets([...])`.
- When preload resolves or timeout hits: set `revealing`.
- After reveal animation: set `done`.
- `done`: show `RevealedRoom reveal={true}`.

Timing:
- Preparing target: 0.6-1.5s, but open early if assets are ready.
- Door reveal animation: about 600-700ms.
- Reduced-motion gating removed: animations always play by request.

Preload list for this wave:
- `/doors.webp` arrival background.
- `/office.jpg` revealed-room background.
- Future default-preset image sources when catalog gains real images.
- No full-catalog preload before reveal.

## Dependency graph

```text
Wave 0: frozen contracts + lib foundation
  |
  |--> Wave 1A: ArrivalHero + SlidingDoor visuals        [parallel]
  |--> Wave 1B: RevealedRoom using default Coder preset  [parallel]
  |--> Wave 1C: globals/tokens for opening scene         [parallel, single owner]
  |
  v
Wave 2: OpeningExperience orchestrator
  |
  v
Wave 3: app/page.tsx integration
  |
  v
Wave 4: verify + review
```

## Parallel lanes

### Lane 0 — Foundation / contracts

Owner: one @fixer.

Files:
- `lib/presets.ts`
- `lib/opening-preload.ts`
- `components/opening/types.ts`

Done when:
- Contracts compile.
- Preset IDs match `lib/catalog.ts`.
- Preload util fails safe on error and timeout.

### Lane 1A — Arrival + door visuals

Owner: @designer, because this is user-visible and polish matters.

Files:
- `components/opening/ArrivalHero.tsx`
- `components/opening/SlidingDoor.tsx`
- `app/globals.css` only if new tokens are needed.

Done when:
- Locked copy from `PLAN-narrative.md` is used exactly.
- Sliding studio door feels premium, not cartoonish.
- Light spill reads as “room is ready”.
- Reduced-motion path is implemented.

### Lane 1B — Revealed room

Owner: @fixer.

Files:
- `components/opening/RevealedRoom.tsx`

Depends on:
- Lane 0 contracts.

Done when:
- Uses `DEFAULT_PRESET_ID`.
- Resolves desk/chair/accessories from catalog.
- Reuses `WorkspacePreview`.
- Does not render pickers or checkout.

### Lane 2 — Orchestrator

Owner: @fixer.

Files:
- `components/opening/OpeningExperience.tsx`

Depends on:
- Lane 0, Lane 1A, Lane 1B.

Done when:
- State machine matches `arrival -> preparing -> revealing -> done`.
- Preload starts only after CTA click.
- No fake loading delay.
- `aria-busy` / status text handled during preparing.

### Lane 3 — Page integration

Owner: @fixer.

Files:
- `app/page.tsx`

Depends on:
- Lane 2.

Done when:
- Home renders `OpeningExperience` first.
- Existing `WorkspaceDesigner` is preserved for later wave, not deleted.
- Metadata still works from `app/layout.tsx`.

## Write ownership rules

Avoid overlapping edits:

- `lib/*`: Lane 0 only.
- `components/opening/ArrivalHero.tsx`, `SlidingDoor.tsx`, `app/globals.css`: Lane 1A only.
- `components/opening/RevealedRoom.tsx`: Lane 1B only.
- `components/opening/OpeningExperience.tsx`: Lane 2 only.
- `app/page.tsx`: Lane 3 only.
- Do not edit `components/workspace/*` in this wave unless a later review proves it is required.

## Out of scope for this wave

- Persona chips.
- Picker dock.
- Checkout summary.
- Full catalog preload.
- Final door/room art assets.
- 3D table calibration from `PLAN.md`.
- Store integration for presets.

## Verification

Run after integration:

```bash
npm run typecheck
npm run lint
npm run build
```

Manual checks:
- Arrival copy matches locked copy.
- CTA is keyboard reachable and activates with Enter/Space.
- Network throttled: preparing state shows meaningful microcopy, not blank spinner.
- Fast network: door still opens quickly; no long artificial wait.
- Animations always play; reduced-motion fallback intentionally removed.
- Revealed room shows default Coder setup: standing desk, ergo chair, main monitor, second monitor, lamp, headphones.

## Review routing

- UI/visual review: @designer.
- State machine, preload safety, a11y, simplification review: @oracle.
- Mechanical fixes after review: @fixer.

## Changelog

- 2026-07-10: Created parallelizable implementation plan for opening focus only. Defined contracts, lanes, dependencies, ownership, and verification.
- 2026-07-10: Implemented opening wave. Added `lib/presets.ts`, `lib/opening-preload.ts`, and `components/opening/*`; integrated `OpeningExperience` into `app/page.tsx`; preserved `WorkspaceDesigner` for later builder wave.
- 2026-07-10: Verification green (`typecheck`, `lint`, `build`). Applied @designer/@oracle review fixes for focus management, handoff clarity, door a11y, preload cleanup, and reveal timing.
- 2026-07-10: Updated arrival to `public/doors.webp` with CTA left of the door and subtitle right of the door. Reworked `SlidingDoor` from frosted panels to light spill + portal ring, kept door visible through preparing, changed CTA to `aria-disabled` during handoff to preserve focus, and preloaded `/doors.webp` + `/office.jpg`. Re-verified green.
- 2026-07-10: Validation pass: raised door overlay above hero after click so preparing status/glow are visible, tightened desktop flanking so both copy blocks hug the centered door, and improved mobile stacking so copy clears the door/dog. Re-verified green.
- 2026-07-10: Fixed framer-motion hydration mismatch by adding client wrapper `components/opening/OpeningLoader.tsx` with `next/dynamic(..., { ssr: false })`; `app/page.tsx` now renders the loader. Re-verified green.
- 2026-07-10: Removed `useReducedMotion` / reduced-motion gating from opening and workspace motion components so animations always play by request. Docs updated. Re-verified green.
