"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { preloadOpeningAssets } from "@/lib/opening-preload";
import { ArrivalHero } from "./ArrivalHero";
import { RevealedRoom } from "./RevealedRoom";
import { SlidingDoor } from "./SlidingDoor";
import type { OpeningPhase } from "./types";

const REVEAL_DELAY_MS = 700;
const REVEAL_DELAY_REDUCED_MS = 120;
const PRELOAD_TIMEOUT_MS = 1500;

export function OpeningExperience() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<OpeningPhase>("arrival");
  const revealTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const enterLockRef = useRef(false);
  const roomRef = useRef<HTMLDivElement | null>(null);

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      clearRevealTimer();
    };
  }, [clearRevealTimer]);

  useEffect(() => {
    if (phase === "done") {
      roomRef.current?.focus();
    }
  }, [phase]);

  const handleEnter = useCallback(async () => {
    if (phase !== "arrival" || enterLockRef.current) return;

    enterLockRef.current = true;
    setPhase("preparing");
    await preloadOpeningAssets(["/office.jpg"], PRELOAD_TIMEOUT_MS);

    if (!mountedRef.current) return;

    setPhase("revealing");
    clearRevealTimer();
    revealTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase((current) => (current === "revealing" ? "done" : current));
      revealTimerRef.current = null;
    }, reduce ? REVEAL_DELAY_REDUCED_MS : REVEAL_DELAY_MS);
  }, [clearRevealTimer, phase, reduce]);

  const isRevealed = phase === "revealing" || phase === "done";
  const heroActive = phase === "arrival";
  const heroVisible = phase !== "done";

  return (
    <div
      role="region"
      aria-label="Workspace opening experience"
      aria-busy={phase === "preparing"}
      className="relative min-h-[100svh] overflow-hidden bg-background"
    >
      {isRevealed && (
        <div
          ref={roomRef}
          tabIndex={-1}
          aria-label="Revealed workspace"
          className="absolute inset-0 z-0 grid place-items-center p-4 outline-none sm:p-6 lg:p-8"
        >
          <RevealedRoom reveal={isRevealed} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20">
        <SlidingDoor phase={phase} />
      </div>

      {heroVisible && (
        <motion.div
          aria-hidden={!heroActive}
          className={`relative z-30 ${heroActive ? "" : "pointer-events-none"}`}
          initial={false}
          animate={{ opacity: heroActive ? 1 : 0, y: heroActive ? 0 : -12 }}
          transition={
            reduce ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }
          }
        >
          <ArrivalHero onEnter={handleEnter} disabled={!heroActive} />
        </motion.div>
      )}
    </div>
  );
}
