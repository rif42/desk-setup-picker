"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  onEnter: () => void;
  disabled?: boolean;
  // Forwarded to the CTA as `aria-disabled` so the button stays focusable while
  // signalling non-interactivity during the reveal (set by the orchestrator).
  ariaDisabled?: boolean;
};

// Locked opening copy — rendered from JS strings so glyphs stay exact.
const PRIMARY = "Welcome to Bali.";
const PRIMARY2 = "Let's set up your workspace.";
const SECONDARY =
  "Plenty of desks, chairs, monitors, lamps, and accessories — you'll find a comfortable setup. Takes under 2 minutes.";
const CTA = "Enter your room";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Soft, feathered light halo — keeps text legible over the bright photo without
// reading as a flat card. Token-driven so it tracks light/dark mode.
const TEXT_HALO =
  "radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--card) 92%, transparent) 0%, color-mix(in srgb, var(--card) 58%, transparent) 44%, transparent 74%)";

// Barely-there edge vignette: lifts corner contrast a touch, leaves the door bright.
const EDGE_VIGNETTE =
  "radial-gradient(115% 88% at 50% 44%, transparent 52%, rgba(28,25,23,0.10) 100%)";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export function ArrivalHero({
  onEnter,
  disabled = false,
  ariaDisabled,
}: Props) {
  return (
    <section className="relative flex items-center min-h-[100svh] overflow-hidden text-foreground">
      {/* Full-bleed arrival photo — real closed door centered, porch + dog. */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/doors.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Faint edge vignette only — per-block halos ride behind each text block. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: EDGE_VIGNETTE }}
      />

      {/* Content: primary + CTA far left, secondary far right, door/dog clear center. */}
      <motion.div
        className="flex w-full justify-evenly gap-10"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Far left — kicker, primary message, main CTA. */}
        <div className="relative order-1 max-w-md text-left lg:justify-self-start flex flex-col justify-center">
          <motion.h1
            variants={item}
            className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl text-black text-center"
          >
            {PRIMARY}
          </motion.h1>
          <motion.h1
            variants={item}
            className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl text-black text-center"
          >
            {PRIMARY2}
          </motion.h1>
        </div>

        {/* Far right — secondary line, right-aligned on desktop. */}
        <motion.div
          variants={item}
          className="relative order-2 max-w-sm text-left lg:justify-self-end lg:text-right flex flex-col justify-center"
        >
          <p className="text-pretty text-base leading-relaxed sm:text-lg text-black">
            {SECONDARY}
          </p>
          <motion.div variants={item} className="mt-8">
            <Button
              onClick={onEnter}
              disabled={disabled}
              aria-disabled={ariaDisabled || undefined}
              className="group h-12 px-8 text-base shadow-lg shadow-foreground/15 cursor-pointer"
            >
              <ArrowLeft
                aria-hidden
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
              />
              {CTA}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
