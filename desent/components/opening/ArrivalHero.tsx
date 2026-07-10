"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  onEnter: () => void;
  disabled?: boolean;
  ariaDisabled?: boolean;
};

// Locked opening copy — rendered from JS strings so glyphs stay exact.
const KICKER = "monis.rent · Bali";
const PRIMARY = "Welcome to Bali. Let's set up your workspace.";
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

export function ArrivalHero({
  onEnter,
  disabled = false,
  ariaDisabled = false,
}: Props) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.08,
      },
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

  return (
    <section className="relative min-h-[100svh] overflow-hidden text-foreground">
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

      {/* Readability scrims — local halos + faint edge vignette, never a flat card. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: EDGE_VIGNETTE }} />
        <div
          className="absolute -left-24 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 sm:left-[4%] lg:left-[6%]"
          style={{ background: TEXT_HALO }}
        />
        <div
          className="absolute -right-24 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 sm:right-[4%] lg:right-[6%]"
          style={{ background: TEXT_HALO }}
        />
      </div>

      {/* Content: primary + CTA left of the door, secondary right of the door. */}
      <motion.div
        className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-7xl grid-cols-1 items-start gap-10 px-6 py-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,34rem)_minmax(0,1fr)] lg:items-center lg:gap-6 lg:px-12"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Left of the door — kicker, message, primary CTA. */}
        <div className="order-1 max-w-md text-left lg:justify-self-end lg:pr-6">
          <motion.p
            variants={item}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/55"
          >
            {KICKER}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl"
          >
            {PRIMARY}
          </motion.h1>

          <motion.div variants={item} className="mt-8">
            <Button
              onClick={onEnter}
              disabled={disabled}
              aria-disabled={ariaDisabled || disabled}
              className="group h-12 px-8 text-base shadow-lg shadow-foreground/15"
            >
              {CTA}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
              />
            </Button>
          </motion.div>
        </div>

        {/* Center column — left empty so the real door (and dog) stay visible. */}
        <div aria-hidden className="hidden lg:block" />

        {/* Right of the door — secondary line. */}
        <motion.div
          variants={item}
          className="order-2 max-w-sm text-left lg:justify-self-start lg:pl-6"
        >
          <p className="text-pretty text-base leading-relaxed text-foreground/82 sm:text-lg">
            {SECONDARY}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
