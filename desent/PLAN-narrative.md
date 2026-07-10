# Narrative Plan — Opening Focus

Scope is narrowed to the first three beats only:

**Arrival -> closed-door handoff -> room reveal.**

Everything after the reveal is parked in `PLAN-narrative-later.md`.

## Locked opening copy

- Primary message: **“Welcome to Bali. Let's set up your workspace.”**
- Secondary line: **“Plenty of desks, chairs, monitors, lamps, and accessories — you'll find a comfortable setup. Takes under 2 minutes.”**
- Primary CTA: **“Enter your room”**
- Loading microcopy: **“Setting up your desk…”**
- Reduced-motion fallback: short fade/settle, no long door travel.

Note: polished grammar from “Lets setup” to “Let's set up”.

## Resolved opening questions

- **Door style:** use a stylized sliding studio door / frosted-glass panel system over a warm room scene. Avoid a literal cartoon apartment door.
- **Threshold metaphor:** sliding studio door with soft light spill from inside. It signals “your room is ready” without feeling like a game loading screen.
- **Opening copy:** locked above.
- **Preload list for default room:** trigger on **Enter your room** click.
  - Room/hero background scene.
  - Default Coder preset assets from `PLAN-workspace-items.md`: `desk-standing`, `chair-ergo`, `acc-monitor`, `acc-monitor-2`, `acc-lamp`, `acc-headphones`.
  - Reveal animation client chunk.
  - Workspace preview shell / critical interactive state.
  - Do not preload the full catalog before reveal. Prefetch Designer/Business preset assets after reveal during idle time.

## Focus flow

1. **Arrival**
   - Show locked primary message, secondary line, and **Enter your room** CTA.
   - Visual: warm, calm, premium Bali workspace threshold with the closed sliding studio door.
   - Goal: immediate clarity. The user understands this is a fast workspace setup, not a catalog.

2. **Closed-door handoff**
   - The user clicks **Enter your room**.
   - Sliding door becomes the consent moment: user asks to enter, we prepare the room.
   - Real preload starts here using the default-room preload list above.
   - Keep it short: target 0.6-1.5s. Open immediately if assets are ready sooner.
   - If waiting is needed, show “Setting up your desk…” with subtle light spill/door movement.
   - No blank spinner. No fake cinematic delay.

3. **Room reveal**
   - Sliding door opens into a believable workspace using the default Coder setup from `PLAN-workspace-items.md`.
   - Room shell appears first, then desk, chair, and accessories fade/spring in.
   - Motion ends on a settled, usable workspace.
   - The reveal should feel like: “Good. I can start now.”

## Constraints for this phase

- Do not show persona chips yet.
- Do not show the full picker dock yet.
- Do not show checkout yet.
- Opening must mask real loading or stay short enough to feel instant.
- Motion must support comprehension: arrive -> unlock -> reveal.
- Respect `prefers-reduced-motion`.

## Remaining decisions

- Final art/asset filenames for room background and sliding door.
- Whether sliding door panels are CSS/SVG overlay or baked into the room image.

## Changelog

- 2026-07-10: Narrowed narrative plan to opening focus only: arrival -> closed-door handoff -> room reveal. Moved later flow details to `PLAN-narrative-later.md`.
- 2026-07-10: Locked opening copy with breadth+comfort secondary line. Resolved door style, threshold metaphor, timing, and default-room preload list.
- 2026-07-10: Opening implemented in code as `OpeningExperience`; home now runs arrival -> closed-door handoff -> room reveal. Verification green: typecheck, lint, build.
