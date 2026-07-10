# Narrative Plan — Opening Focus

Scope is narrowed to the first three beats only:

**Arrival -> closed-door handoff -> room reveal.**

Everything after the reveal is parked in `PLAN-narrative-later.md`.

## Locked opening copy

- Primary message: **“Welcome to Bali. Let's set up your workspace.”**
- Secondary line: **“Plenty of desks, chairs, monitors, lamps, and accessories — you'll find a comfortable setup. Takes under 2 minutes.”**
- Primary CTA: **“Enter your room”**
- Loading microcopy: **“Setting up your desk…”**
- Motion policy: animations always play; reduced-motion gating intentionally disabled by request.

Note: polished grammar from “Lets setup” to “Let's set up”.

## Resolved opening questions

- **Door style:** use the real closed-door photo `public/doors.webp` as the arrival background. The handoff transition uses warm light spill plus an expanding portal ring, not frosted panels or a cartoon door.
- **Threshold metaphor:** an actual porch door with glow/ring motion. It signals “your room is ready” without feeling like a game loading screen.
- **Arrival layout:** main CTA sits left of the centered door; subtitle sits right of the door. The center column stays clear so the door and dog remain visible.
- **Opening copy:** locked above.
- **Preload list for default room:** trigger on **Enter your room** click.
  - `/doors.webp` arrival background.
  - `/office.jpg` revealed-room background.
  - Default Coder preset assets from `PLAN-workspace-items.md`. Current code still uses the placeholder catalog IDs in `lib/catalog.ts` until the real-item catalog wiring task.
  - Reveal animation client chunk.
  - Workspace preview shell / critical interactive state.
  - Do not preload the full catalog before reveal. Prefetch Designer/Business preset assets after reveal during idle time.

## Focus flow

1. **Arrival**
   - Full-bleed `doors.webp` background: real closed door centered, porch, and dog.
   - Left of the door: kicker, primary message, and **Enter your room** CTA.
   - Right of the door: secondary line.
   - Goal: immediate clarity. The user understands this is a fast workspace setup, not a catalog.

2. **Closed-door handoff**
   - The user clicks **Enter your room**.
   - Sliding door becomes the consent moment: user asks to enter, we prepare the room.
   - Real preload starts here using the default-room preload list above.
   - Keep it short: target 0.6-1.5s. Open immediately if assets are ready sooner.
   - If waiting is needed, show “Setting up your desk…” with subtle light spill, a portal ring, and a status pill.
   - No blank spinner. No fake cinematic delay.

3. **Room reveal**
   - Door glow/ring transition reveals a believable workspace using the default Coder setup from `PLAN-workspace-items.md`.
   - Room shell appears first, then desk, chair, and accessories fade/spring in.
   - Motion ends on a settled, usable workspace.
   - The reveal should feel like: “Good. I can start now.”

## Constraints for this phase

- Do not show persona chips yet.
- Do not show the full picker dock yet.
- Do not show checkout yet.
- Opening must mask real loading or stay short enough to feel instant.
- Motion must support comprehension: arrive -> unlock -> reveal.
- Animations always play; `prefers-reduced-motion` gating is intentionally disabled.

## Remaining decisions

- Final revealed-room art: keep `office.jpg` or replace with a more Bali-specific workspace photo.
- Whether `doors.webp` should persist deeper into the reveal by moving the background layer behind the hero fade.
- Final open-door motion polish: current glow/ring versus a real open-door image sequence.

## Changelog

- 2026-07-10: Narrowed narrative plan to opening focus only: arrival -> closed-door handoff -> room reveal. Moved later flow details to `PLAN-narrative-later.md`.
- 2026-07-10: Locked opening copy with breadth+comfort secondary line. Resolved door style, threshold metaphor, timing, and default-room preload list.
- 2026-07-10: Opening implemented in code as `OpeningExperience`; home now runs arrival -> closed-door handoff -> room reveal. Verification green: typecheck, lint, build.
- 2026-07-10: Switched arrival background to `public/doors.webp`; locked layout with main CTA left of the door and subtitle right of the door; reworked door transition to light spill + portal ring; preload now covers `doors.webp` + `office.jpg`.
- 2026-07-10: Removed reduced-motion gating from opening animations; all opening motion now plays always by request. Re-verified green.
