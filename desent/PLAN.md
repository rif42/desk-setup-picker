# Landing Page Narrative Plan

Living document for the monis.rent workspace-builder landing experience. Update this file as the narrative, design, and implementation decisions are refined.

## Current status

- Phase: narrative + landing-page direction.
- Decision: use a short “closed door / key handoff” opening to hide real asset loading and create arrival momentum.
- Constraint: opening must feel intentional, not like a loading spinner.

## Core narrative

**Promise:** You just landed in Bali. Your workspace is already taken care of. Open the door and start working.

The experience should sell relief, speed, and control. The user is not shopping a catalog first; they are stepping into a prepared room, then tuning it to how they work.

## Opening sequence

1. **Arrival beat**
   - Message: “Welcome to Bali. Your workspace is ready.”
   - Visual: warm, calm, premium scene with a closed door or room threshold.
   - Primary CTA: **Enter your room**.
   - Secondary line: “Takes under 2 minutes.”

2. **Key handoff**
   - Clicking **Enter your room** starts real preloading for hero scene, catalog imagery, and picker state.
   - Keep it short: target 0.6–1.5s, but open immediately if assets are ready sooner.
   - Use meaningful microcopy if waiting is needed: “Setting up your desk…” not a generic spinner.

3. **Door reveal**
   - Door opens into a believable workspace with a sensible default setup.
   - Room shell appears first, then items fade/spring in.
   - Motion must support comprehension: reveal, settle, invite interaction.

4. **Persona tuning**
   - Ask lightly after reveal: “What kind of work are you doing?”
   - Optional chips: Coder, Designer, Business, Gamer, Casual, Just set me up.
   - Default path: **Just set me up** for users who do not want to choose.

5. **Live builder**
   - Picker/dock feeds the scene instantly.
   - Desk, chair, monitors, lamps, plants, and accessories update the preview live.
   - Add/remove should feel springy and responsive.

## Persona presets

Use personas as starting presets, not gates.

- **Coder:** dual monitor, ergonomic chair, desk lamp, clean desk.
- **Designer:** color-accurate monitor, spacious desk, plant, warm light.
- **Business:** laptop stand, webcam, minimal professional setup.
- **Gamer:** high-refresh monitor, supportive chair, subtle RGB.
- **Casual:** laptop-friendly desk, cozy lamp, simple accessories.
- **Just set me up:** balanced default workspace.

## Design direction

Target taste: **premium calm + tropical warmth**, not backpacker cartoon or generic SaaS.

- Base palette: warm off-white, sand, soft charcoal.
- Accent: one Bali signal only — palm green, terracotta, or ocean teal.
- Scene: realistic room corner, soft daylight, depth, readable workspace.
- Typography: clean, modern, confident; avoid novelty fonts.
- Motion: springy add/remove, door reveal, layout transitions; respect `prefers-reduced-motion`.
- Copy: grounded, fast, friendly. No hype.

## Loading strategy

The closed-door opening is allowed only if it masks real work.

Do:
- Trigger preload on CTA click.
- Preload hero scene assets, picker/catalog imagery, and critical interactive state.
- Use progressive reveal: room shell first, then desk/chair/accessories.
- Fail safe: if loading is slow, show useful progress states and still arrive at a usable builder.

Do not:
- Add fake delay for drama.
- Block interaction behind a long cinematic.
- Use a blank spinner as the main loading pattern.
- Force persona selection before showing value.

## Page structure

1. Hero / arrival section.
2. Closed-door CTA interaction.
3. Workspace reveal.
4. Persona chips.
5. Live workspace preview.
6. Selection dock for desk, chair, accessories.
7. Summary / checkout entry.

## Acceptance mapping

This narrative supports the challenge requirements:

- Desk selectable from at least 2 options.
- Chair selectable from at least 2 options.
- Accessories addable/removable: monitors, lamps, plants, etc.
- Workspace preview updates live.
- Summary/checkout view available.
- Deployable to Vercel.
- GitHub-ready code with README write-up.

## Open questions

- Should the door be literal illustration, photo-real scene, or stylized 3D/CSS room?
- Should persona chips appear before or after the first reveal?
- Do we preload all catalog images up front or only the hero/default scene first?
- Should checkout be a modal/dialog or separate route?
- How much Bali imagery is enough before it becomes theme-park?

## Next decisions

- Lock opening copy.
- Lock default starter setup.
- Lock palette and type direction.
- Decide door visual style.
- Define asset preload list.

## Changelog

- 2026-07-10: Initial plan created. Approved direction: arrival → closed-door key handoff → room reveal → optional persona tuning → live builder.
