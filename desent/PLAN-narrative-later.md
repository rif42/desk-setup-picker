# Narrative Plan — Later Flow

Parking file for everything after the opening reveal. Details can come later.

Current focus lives in `PLAN-narrative.md`: **arrival -> closed-door handoff -> room reveal**.
Persona tuning split out into `PLAN-persona.md`.
Live builder (preview + selection dock) split out into `PLAN-live-builder.md`.

## Parked flow

After room reveal, the **live builder** runs (see `PLAN-live-builder.md`), then:

1. **Summary / checkout**
   - User reviews selected setup.
   - Checkout can be a confirmed summary plus stubbed submit for MVP.

## Parked design direction

Target taste: **premium calm + tropical warmth**, not backpacker cartoon or generic SaaS.

- Base palette: warm off-white, sand, soft charcoal.
- Accent: one Bali signal only — palm green, terracotta, or ocean teal.
- Scene: realistic room corner, soft daylight, depth, readable workspace.
- Typography: clean, modern, confident; avoid novelty fonts.
- Motion: springy add/remove, door reveal, layout transitions; animations always play and reduced-motion gating is intentionally disabled.
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
4. Live builder: live workspace preview + selection dock for desk, chair, accessories (see `PLAN-live-builder.md`).
5. Summary / checkout entry.

## Parked acceptance mapping

- Desk/chair/accessories selectable and preview updates live: see `PLAN-live-builder.md`.
- Summary/checkout view available.
- Deployable to Vercel.
- GitHub-ready code with README write-up.

## Parked open questions

- Catalog image preload strategy: see `PLAN-live-builder.md`.
- Should checkout be a modal/dialog or separate route?
- How much Bali imagery is enough before it becomes theme-park?

## Changelog

- 2026-07-10: Created parking file for post-reveal narrative flow, builder flow, design direction, acceptance mapping, and later decisions.
- 2026-07-10: Split persona-tuning beat out into `PLAN-persona.md`.
- 2026-07-10: Split live-builder beat out into `PLAN-live-builder.md`; builder-owned acceptance (desk/chair/accessories/live preview) and catalog-preload question moved with it.
