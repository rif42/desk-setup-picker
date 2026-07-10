"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  onEnter: () => void;
  disabled?: boolean;
};

// Locked opening copy — rendered from JS strings so glyphs stay exact.
const KICKER = "monis.rent · Bali";
const PRIMARY = "Welcome to Bali. Let's set up your workspace.";
const SECONDARY =
  "Plenty of desks, chairs, monitors, lamps, and accessories — you'll find a comfortable setup. Takes under 2 minutes.";
const CTA = "Enter your room";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ArrivalHero({ onEnter, disabled = false }: Props) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.09,
        delayChildren: reduce ? 0 : 0.06,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.65, ease: EASE },
    },
  };

  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 py-20 text-center">
      {/* Soft atmospheric warmth — purely decorative. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 28%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
        }}
        animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={
          reduce ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <motion.div
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={item}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/45"
        >
          {KICKER}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {PRIMARY}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-foreground/68 sm:text-lg"
        >
          {SECONDARY}
        </motion.p>

        <motion.div variants={item} className="mt-9">
          <Button
            onClick={onEnter}
            disabled={disabled}
            className="group h-12 px-8 text-base shadow-md shadow-foreground/10"
          >
            {CTA}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5"
            />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
