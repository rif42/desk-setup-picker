# Narrative Plan — Later Flow

Parking file for everything after the opening reveal. Details can come later.

Current focus lives in `PLAN-narrative.md`: **arrival -> closed-door handoff -> room reveal**.

## Parked flow

After room reveal:

1. **Persona tuning**
   - Ask lightly: “What kind of work are you doing?”
   - Show three chips only: **Coder**, **Designer**, **Business**.
   - Default starting room: **Coder**.
   - Selecting a persona swaps the full setup instantly: desk, chair, accessories.

2. **Live builder**
   - Picker/dock feeds the scene instantly.
   - Desk, chair, monitors, lamps, plants, and accessories update the preview live.
   - Add/remove should feel springy and responsive.

3. **Summary / checkout**
   - User reviews selected setup.
   - Checkout can be a confirmed summary plus stubbed submit for MVP.

## Parked design direction

Target taste: **premium calm + tropical warmth**, not backpacker cartoon or generic SaaS.

- Base palette: warm off-white, sand, soft charcoal.
- Accent: one Bali signal only — palm green, terracotta, or ocean teal.
- Scene: realistic room corner, soft daylight, depth, readable workspace.
- Typography: clean, modern, confident; avoid novelty fonts.
- Motion: springy add/remove, door reveal, layout transitions; respect `prefers-reduced-motion`.
- Copy: grounded, fast, friendly. No hype.

## Parked loading strategy

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

## Parked page structure

1. Hero / arrival section.
2. Closed-door CTA interaction.
3. Workspace reveal.
4. Persona chips: Coder, Designer, Business.
5. Live workspace preview.
6. Selection dock for desk, chair, accessories.
7. Summary / checkout entry.

## Parked acceptance mapping

- Desk selectable from at least 2 options: current catalog has 3.
- Chair selectable from at least 2 options: current catalog has 3.
- Accessories addable/removable: current catalog has 5.
- Workspace preview updates live.
- Summary/checkout view available.
- Deployable to Vercel.
- GitHub-ready code with README write-up.

## Parked open questions

- Should persona chips appear before or after the first reveal?
- Do we preload all catalog images up front or only the hero/default scene first?
- Should checkout be a modal/dialog or separate route?
- How much Bali imagery is enough before it becomes theme-park?

## Changelog

- 2026-07-10: Created parking file for post-reveal narrative flow, builder flow, design direction, acceptance mapping, and later decisions.
