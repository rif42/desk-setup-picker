# Workspace Items Plan

Living document for workspace presets, item specs, pricing, and catalog usage.

> Source of truth for the **item list = real products photographed in `public/`**
> (original Strapi-hashed exports from monis.rent). The catalog must mirror these
> real items. Prices below are **IDR/month estimates** for MVP layout only — confirm
> against the live monis.rent rate card before launch (live scraping was explicitly
> skipped for this pass).

## Docs findings: item limits

The challenge docs define **minimums**, not hard maximums:

- Desk: minimum 2 selectable options.
- Chair: minimum 2 selectable options.
- Accessories: multiple add/remove options such as monitors, lamps, plants, etc.

The real item set available in `public/` defines the practical maximums:

| Category | Available options | Selection rule | Max per setup |
| --- | ---: | --- | ---: |
| Desk | 3 | Exactly one | 1 |
| Chair | 3 | Exactly one | 1 |
| Accessories | 5 unique items | Optional add/remove | 5 total, one of each |

Product rule: presets should stay readable. Users may add any combination of the 5
accessories manually, but preset defaults use **3–4 accessories** so the scene does
not feel crowded. Each accessory is unique (max 1 of each).

## Master item list (real products)

IDs are the canonical contract. Webp filenames are `<id>.webp` in `public/`.

### Desks

| ID | Item | Source file → webp | Tagline | IDR/mo |
| --- | --- | --- | --- | ---: |
| `desk-standing-electric` | Electric Standing Desk | `desk_titel_new_3db151d44c.avif` → `desk-standing-electric.webp` | Electric sit/stand, black top, silver columns | 550,000 |
| `desk-adjustable` | Adjustable Desk | `Mechanical_Adjustable_Desk_front_new_a83b8077b0.avif` → `desk-adjustable.webp` | Height-adjustable, white top, black frame | 400,000 |
| `desk-compact` | Compact Desk | `GUEST_fb212454-4de7-43f3-b9c2-ed569ddb2c02.avif` → `desk-compact.webp` | Small fixed table, fits a villa corner | 200,000 |

### Chairs

| ID | Item | Source file → webp | Tagline | IDR/mo |
| --- | --- | --- | --- | ---: |
| `chair-ergo-mesh` | Fantech Ergo Mesh | `fantech_oca259s_chair_6_b632a0c529.avif` → `chair-ergo-mesh.webp` | High-back mesh, headrest, armrests | 350,000 |
| `chair-mia` | Mia Side Chair | `Mia-Basic-Medium3.jpg` → `chair-mia.webp` | Sculptural black shell, metal legs | 150,000 |
| `chair-task-basic` | Basic Task Chair | `50533_1.jpg` → `chair-task-basic.webp` | Armless grey fabric, rolls easy | 120,000 |

### Accessories

| ID | Item | Source file → webp | Tagline | IDR/mo |
| --- | --- | --- | --- | ---: |
| `acc-monitor-34-gaming` | 34" 4K Gaming Monitor | `34_4_K_Gaming_Monitor_7_3f6b2ba627.avif` → `acc-monitor-34-gaming.webp` | Ultrawide immersion, code + docs | 400,000 |
| `acc-monitor-27-4k` | 27" 4K A27U Monitor | `27_4_K_A27_U_Multitasking_Monitor_1_ce29d15357.avif` → `acc-monitor-27-4k.webp` | Crisp 4K multitasking screen | 300,000 |
| `acc-keyboard-mx` | Logitech MX Keys | `Logitech_MX_keys_1_9977480ae1.avif` → `acc-keyboard-mx.webp` | Low-profile wireless keyboard | 120,000 |
| `acc-mouse-mx-master` | Logitech MX Master 3S | `Logitech_S3_6_4cf1e523b8.avif` → `acc-mouse-mx-master.webp` | Ergo wireless mouse, quiet clicks | 110,000 |
| `acc-laptop-stand` | Aluminium Laptop Stand | `Laptop_stand_back_new2_91df29c3c8.avif` → `acc-laptop-stand.webp` | Raises screen to eye level | 60,000 |

Notes on identity (resolved by viewing the images):

- `Logitech_S3_*.avif` is the **Logitech MX Master 3S** mouse, mapped to `acc-mouse-mx-master`.
- `GUEST_*.avif` is a **small black compact desk/table**, mapped to `desk-compact`.
- `office.jpg` is a rendered **home-office scene** (hero/background), not a rentable item. It is used by `components/opening/RevealedRoom.tsx` and preloaded in `components/opening/OpeningExperience.tsx`; shipped as `office.webp` with both `src` updated.

Previously listed but removed in the latest `public/` cull: `acc-monitor-studio`
(27" 5K Studio Display), `acc-light-bar` (Monitor Light Bar), `acc-lamp-xiaomi`
(Xiaomi Mi LED Desk Lamp). Accessory set is now fixed at 5.

## Persona presets

Use personas as complete starting setups, not gates.

### Coder

Intent: deep-focus remote engineering setup, dual-screen.

| Slot | Catalog ID | Item | Reason |
| --- | --- | --- | --- |
| Desk | `desk-standing-electric` | Electric Standing Desk | Sit/stand comfort and enough surface for dual screens. |
| Chair | `chair-ergo-mesh` | Fantech Ergo Mesh | Long sessions need headrest + lumbar support. |
| Accessory | `acc-monitor-27-4k` | 27" 4K A27U Monitor | Main crisp coding screen. |
| Accessory | `acc-monitor-34-gaming` | 34" 4K Gaming Monitor | Ultrawide for docs/browser/terminal alongside code. |
| Accessory | `acc-keyboard-mx` | Logitech MX Keys | Daily-driver typing. |
| Accessory | `acc-mouse-mx-master` | Logitech MX Master 3S | Precise, quiet, all-day mouse. |

- Accessories count: 4
- Total item count: 6
- Total monthly price: IDR 1,830,000

### Designer

Intent: visual, calm, spacious canvas setup.

| Slot | Catalog ID | Item | Reason |
| --- | --- | --- | --- |
| Desk | `desk-adjustable` | Adjustable Desk | Clean white surface, adjustable for sketching/standing. |
| Chair | `chair-mia` | Mia Side Chair | Sculptural, light, studio-friendly. |
| Accessory | `acc-monitor-34-gaming` | 34" 4K Gaming Monitor | Big ultrawide canvas for timelines and layouts. |
| Accessory | `acc-mouse-mx-master` | Logitech MX Master 3S | Precise pointer for design tools. |
| Accessory | `acc-laptop-stand` | Aluminium Laptop Stand | Eye-level laptop as a second reference screen. |

- Accessories count: 3
- Total item count: 5
- Total monthly price: IDR 1,120,000

### Business

Intent: fast, clean, professional setup for calls, docs, and planning.

| Slot | Catalog ID | Item | Reason |
| --- | --- | --- | --- |
| Desk | `desk-compact` | Compact Desk | Fits a villa corner, lightweight/fast. |
| Chair | `chair-task-basic` | Basic Task Chair | Simple, comfy, low-friction, good value. |
| Accessory | `acc-monitor-27-4k` | 27" 4K A27U Monitor | Better for spreadsheets, decks, multitasking. |
| Accessory | `acc-keyboard-mx` | Logitech MX Keys | Reliable typing for docs and email. |
| Accessory | `acc-mouse-mx-master` | Logitech MX Master 3S | Comfortable all-day navigation. |

- Accessories count: 3
- Total item count: 5
- Total monthly price: IDR 850,000

## Final item tally

### Per preset

| Preset | Desk | Chair | Accessories | Total items | Monthly price |
| --- | --- | --- | --- | ---: | ---: |
| Coder | Electric Standing Desk | Fantech Ergo Mesh | 27" 4K, 34" Gaming, MX Keys, MX Master 3S | 6 | IDR 1,830,000 |
| Designer | Adjustable Desk | Mia Side Chair | 34" Gaming, MX Master 3S, Laptop Stand | 5 | IDR 1,120,000 |
| Business | Compact Desk | Basic Task Chair | 27" 4K, MX Keys, MX Master 3S | 5 | IDR 850,000 |

Combined preset total: **16 item selections**, **IDR 3,800,000/mo** across all three presets.

### Catalog usage across presets

| Category | Item | ID | Used by |
| --- | --- | --- | --- |
| Desk | Electric Standing Desk | `desk-standing-electric` | Coder |
| Desk | Adjustable Desk | `desk-adjustable` | Designer |
| Desk | Compact Desk | `desk-compact` | Business |
| Chair | Fantech Ergo Mesh | `chair-ergo-mesh` | Coder |
| Chair | Mia Side Chair | `chair-mia` | Designer |
| Chair | Basic Task Chair | `chair-task-basic` | Business |
| Accessory | 27" 4K A27U Monitor | `acc-monitor-27-4k` | Coder, Business |
| Accessory | 34" 4K Gaming Monitor | `acc-monitor-34-gaming` | Coder, Designer |
| Accessory | Logitech MX Keys | `acc-keyboard-mx` | Coder, Business |
| Accessory | Logitech MX Master 3S | `acc-mouse-mx-master` | Coder, Designer |
| Accessory | Aluminium Laptop Stand | `acc-laptop-stand` | Designer |

Used catalog items: **11 of 11** (every real item appears in at least one preset).

## Implementation notes

Suggested catalog/preset data shape (aligns `lib/catalog.ts` to real items + images):

```ts
type Category = "desk" | "chair" | "accessory";

type CatalogItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;      // IDR per month
  category: Category;
  image: string;      // "/<id>.webp" served from public/
  tint: string;       // tailwind token class for the preview scene
};

type PresetId = "coder" | "designer" | "business";

type WorkspacePreset = {
  id: PresetId;
  label: string;
  deskId: string;
  chairId: string;
  accessoryIds: string[];
};
```

Suggested preset values:

```ts
const presets: WorkspacePreset[] = [
  {
    id: "coder",
    label: "Coder",
    deskId: "desk-standing-electric",
    chairId: "chair-ergo-mesh",
    accessoryIds: [
      "acc-monitor-27-4k",
      "acc-monitor-34-gaming",
      "acc-keyboard-mx",
      "acc-mouse-mx-master",
    ],
  },
  {
    id: "designer",
    label: "Designer",
    deskId: "desk-adjustable",
    chairId: "chair-mia",
    accessoryIds: ["acc-monitor-34-gaming", "acc-mouse-mx-master", "acc-laptop-stand"],
  },
  {
    id: "business",
    label: "Business",
    deskId: "desk-compact",
    chairId: "chair-task-basic",
    accessoryIds: ["acc-monitor-27-4k", "acc-keyboard-mx", "acc-mouse-mx-master"],
  },
];
```

Wiring checklist (next task, not done here):

- Replace placeholder desks/chairs/accessories in `lib/catalog.ts` with the 11 real
  items above; add an `image: "/<id>.webp"` field per item; keep `icon`/`tint` as fallbacks.
- Swap preview/checkout rendering from lucide icons to `next/image` using `item.image`.
- Confirm IDR prices against the live monis.rent rate card (this plan uses estimates).

## Open questions

- With only 2 monitors (27" 4K, 34" gaming), is the screen choice clear enough, or should
  a smaller/budget monitor return for the Business value tier?
- No dedicated lamp/light accessory remains — fine for MVP, or re-add one for the
  "late-night / calls" mood?
- Prices: confirm real IDR/month per item; the 34" gaming vs 27" 4K ordering may
  shift once real rates are known.

## Changelog

- 2026-07-10: Split workspace-items plan into separate file. Locked presets, item counts, prices, accessory limits, and catalog usage.
- 2026-07-10: Replaced fictional placeholder items with the **real monis.rent products photographed in `public/`**. Defined canonical IDs, webp filename map (`<id>.webp`), estimated IDR prices, rewrote Coder/Designer/Business presets on real items, recomputed totals, and documented the `office.jpg` scene usage. Live prices deferred (scraping skipped this pass).
- 2026-07-10: Trimmed accessories to **5** after `public/` cull — dropped `acc-monitor-studio`, `acc-light-bar`, `acc-lamp-xiaomi`. Rebuilt Designer/Business presets on the remaining 5 accessories (Coder unchanged), recomputed totals (IDR 1,830,000 / 1,120,000 / 850,000; combined IDR 3,800,000), and updated usage to 11/11 items.
