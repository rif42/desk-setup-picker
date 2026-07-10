"use client";

import {
  AnimatePresence,
  motion,
  type Transition,
} from "framer-motion";
import type { OpeningPhase } from "./types";

type Props = {
  phase: OpeningPhase;
};

// Locked door copy — kept in a JS string so the ellipsis glyph stays exact.
const PREPARING = "Setting up your desk…";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Soft edge vignette that frames the centered door / room.
const VIGNETTE =
  "radial-gradient(78% 72% at 50% 46%, transparent 38%, rgba(28,25,23,0) 58%, rgba(28,25,23,0.5) 100%)";

// Warm light spill pooling around the doorway (token-driven, dark-mode aware).
const LIGHT_SPILL =
  "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 58%, transparent), color-mix(in srgb, var(--accent) 14%, transparent) 46%, transparent 74%)";

type DoorState = {
  vignette: number;
  glow: { opacity: number; scale: number };
  ring: { opacity: number; scale: number };
  breathe: boolean;
};

function stateFor(phase: OpeningPhase): DoorState {
  switch (phase) {
    case "arrival":
      return {
        vignette: 0.3,
        glow: { opacity: 0.25, scale: 0.9 },
        ring: { opacity: 0, scale: 0.7 },
        breathe: false,
      };
    case "preparing":
      return {
        vignette: 0.5,
        glow: { opacity: 0.62, scale: 1 },
        ring: { opacity: 0.45, scale: 0.95 },
        breathe: true,
      };
    case "revealing":
      return {
        vignette: 0.18,
        glow: { opacity: 0.95, scale: 1.55 },
        ring: { opacity: 0, scale: 1.75 },
        breathe: false,
      };
    case "done":
      return {
        vignette: 0.34,
        glow: { opacity: 0.32, scale: 1.3 },
        ring: { opacity: 0, scale: 1.5 },
        breathe: false,
      };
  }
}

export function SlidingDoor({ phase }: Props) {
  const state = stateFor(phase);
  const isPreparing = phase === "preparing";

  const move: Transition = { duration: 0.85, ease: EASE };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Framing vignette — clears during reveal so the room opens up. */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ background: VIGNETTE }}
        animate={{ opacity: state.vignette }}
        transition={move}
      />

      {/* Warm light spill around the centered door; blooms + zooms on reveal. */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[min(82vh,48rem)] w-[min(82vh,48rem)] -translate-x-1/2 -translate-y-1/2"
        style={{ background: LIGHT_SPILL }}
        animate={{
          opacity: state.breathe
            ? [state.glow.opacity * 0.7, state.glow.opacity, state.glow.opacity * 0.7]
            : state.glow.opacity,
          scale: state.glow.scale,
        }}
        transition={
          state.breathe
            ? {
                opacity: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.85, ease: EASE },
              }
            : move
        }
      />

      {/* Expanding portal ring — suggests the door swinging open on reveal. */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/45"
        animate={{ opacity: state.ring.opacity, scale: state.ring.scale }}
        transition={move}
      />

      {/* Preparing status — exposed politely; decorative pieces stay aria-hidden. */}
      <div
        role="status"
        aria-live="polite"
        className="absolute inset-x-0 bottom-16 flex justify-center"
      >
        <AnimatePresence>
          {isPreparing && (
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-card/85 px-4 py-2 text-sm font-medium text-foreground/85 shadow-sm backdrop-blur-md"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                aria-hidden
                className="h-2 w-2 rounded-full bg-accent"
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1, 0.85] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              />
              {PREPARING}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
