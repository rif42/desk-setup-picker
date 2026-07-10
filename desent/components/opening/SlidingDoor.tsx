"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import type { OpeningPhase } from "./types";

type Props = {
  phase: OpeningPhase;
};

// Locked door copy — kept in a JS string so the ellipsis glyph stays exact.
const PREPARING = "Setting up your desk…";

const SPRING: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.9,
};

// Warm light that spills from behind the frosted panels (token-driven, dark-mode aware).
const LIGHT_SPILL =
  "radial-gradient(58% 52% at 50% 44%, color-mix(in srgb, var(--accent) 52%, transparent), color-mix(in srgb, var(--accent) 14%, transparent) 48%, transparent 72%)";

const PANEL_SHEEN =
  "linear-gradient(100deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(0,0,0,0.04) 100%)";

function glowFor(phase: OpeningPhase) {
  switch (phase) {
    case "arrival":
      return { opacity: 0.35, scale: 1 };
    case "preparing":
      return { opacity: 0.6, scale: 1.03 };
    case "revealing":
      return { opacity: 0.9, scale: 1.16 };
    case "done":
      return { opacity: 0.5, scale: 1.08 };
  }
}

export function SlidingDoor({ phase }: Props) {
  const reduce = useReducedMotion();

  const isOpen = phase === "revealing" || phase === "done";
  const isDone = phase === "done";
  const isPreparing = phase === "preparing";

  const slide: Transition = reduce ? { duration: 0 } : SPRING;
  const fade: Transition = reduce ? { duration: 0 } : { duration: 0.5 };

  const glow = glowFor(phase);
  const panelTarget = isOpen ? "-102%" : "0%";

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Soft light spill from behind the door. */}
        <motion.div
          className="absolute inset-0"
          style={{ background: LIGHT_SPILL }}
          animate={{ opacity: glow.opacity, scale: glow.scale }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: "easeOut" }}
        />

        {/* Left frosted-glass panel. */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 border-r border-foreground/[0.06] bg-card/55 backdrop-blur-2xl"
          style={{ backgroundImage: PANEL_SHEEN }}
          animate={{ x: panelTarget, opacity: isDone ? 0 : 1 }}
          transition={{ x: slide, opacity: fade }}
        />

        {/* Right frosted-glass panel. */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 border-l border-foreground/[0.06] bg-card/55 backdrop-blur-2xl"
          style={{ backgroundImage: PANEL_SHEEN }}
          animate={{
            x: isOpen ? "102%" : "0%",
            opacity: isDone ? 0 : 1,
          }}
          transition={{ x: slide, opacity: fade }}
        />

        {/* Center seam / mullion — only while closed. */}
        <motion.div
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-foreground/10"
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.3 }}
        />
      </div>

      {/* Preparing status — exposed separately from the decorative door tree. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center"
      >
        <AnimatePresence>
          {isPreparing && (
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-card/80 px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-md"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 6 }}
              transition={reduce ? { duration: 0 } : { duration: 0.4 }}
            >
              <motion.span
                aria-hidden
                className="h-2 w-2 rounded-full bg-accent"
                animate={
                  reduce ? undefined : { opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }
                }
                transition={
                  reduce
                    ? undefined
                    : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                }
              />
              {PREPARING}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
