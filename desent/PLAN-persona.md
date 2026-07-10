# Persona Plan — Persona Tuning

Entry beat: user lands here, the room fades in behind a blur, then persona chips appear. Keep it minimal. The full persona preset (desk/chair/accessory swap) is deferred.

Context:
- Arrival / closed-door handoff / room reveal live in `PLAN-narrative.md`.
- Post-reveal flow (builder, checkout, design, loading) lives in `PLAN-narrative-later.md`.

## Flow (this page)

1. User navigates to the page.
2. Background slowly reveals: `public/office.webp`, blurred.
3. After the reveal, show three chips only: **Coder**, **Designer**, **Business**.
4. Default: **Coder** — also the fallback if the user skips, dismisses, or cannot choose.

That's it for now.

## Background

- Asset: `public/office.webp` — realistic room corner, desk by window, shelves, plant, ocean view.
- Treatment: blurred (`backdrop-filter` / `filter: blur`), slow fade-in on entry.
- Mood matches parked direction: premium calm + tropical warmth.

## Principles

- Light, optional, fast. Never block value behind persona selection.
- Reveal first, chips second — let the room breathe before asking anything.
- Persona is a starting preset, not a fence — user can still edit freely in the builder (later).

## Deferred (later, not this page)

- Persona preset behavior: selecting a persona swaps the full setup (desk, chair, accessories). Park until the live builder exists.
- Persona does **not** need to persist into the checkout summary.

## Resolved decisions

- Persona chips appear **after** the user comes in for the first time (post background reveal), not before.

## Changelog

- 2026-07-10: Split persona-tuning beat out of `PLAN-narrative-later.md` into its own parking file.
- 2026-07-10: Scoped this page down to blurred `office.webp` background reveal + chips only. Deferred persona preset swap and checkout persistence. Resolved chips timing (after first entry).
- 2026-07-10: Coder is the fallback for any skip / no-choice path.
