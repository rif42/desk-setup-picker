# Dream Workspace — monis.rent

Design your dream Bali workspace, then rent it. Visual-first configurator for office-equipment rental — not a product catalog.

- **Live:** _(TBD — add Vercel URL after deploy)_
- **Repo:** _(TBD — add GitHub URL; invite `desent-bot` as Read collaborator)_

## Approach & thinking

**TL;DR:** image compositing beat 3D for this scope.

**Audience.** User is a freelancer who just landed in Bali and needs a setup fast — someone with decent money, which means their devices aren't all potatoes. That kills the hardware tax (even on heavy Next.js) and frees budget for expensive-but-worth-it visuals.

**Constraint.** 8 hours. Anything that can't ship in that window gets cut.

| Option | Verdict | Why |
|---|---|---|
| Three.js item models | cut | accurate lighting + detailed viewing, but no way to finish in 8h |
| On-spot photos → video render | cut | maximum immersion, but capture cost is $$$ |
| Static photos | cut | rigid angles/sizes, not swappable |
| **Image compositing** | **picked** | decent quality **and** swappable **and** cheap |

**Pipeline.** Render the final scene with all components in one shot → use an LLM to extract the components one by one (`env-<filename>` in `/public`) → stitch everything back together in the website. Swapping stays fast because each image is only 10–50kb, the browser caches them, and it looks decent without loading a heavy 3D model + custom lighting. Best of both worlds: image quality, but flexible enough to swap.

**Honesty.** I used an LLM chatbot to generate and edit the images, and it shows — yucky tinting, uneven lighting, weird shadows, chopped backgrounds (some I did manually). In a real scenario I'd use dedicated image tools like Adobe or ComfyUI for faster, more accurate generation.

**With more time.** Multiple office/background settings to sell the beauty of Bali (and open partnerships with top-tier cafes) — scrapped because consistent lighting across comps was too expensive for the window. A proper image pipeline (ComfyUI/Adobe). Mobile scaling — theoretically fine, but out of the requirements, so I didn't do it.

## Tech stack

Locked per the brief: **Next.js** (App Router), **Tailwind CSS v4**, deploy on **Vercel**. See `AGENTS.md` for conventions and acceptance criteria.

---

<sub>Thank you for making this test — the job market should follow this kind of test. I also built [apu.ac.id](https://apu.ac.id); I think I nailed the design and narrative there, worth a look.</sub>

## Getting Started (create-next-app)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
