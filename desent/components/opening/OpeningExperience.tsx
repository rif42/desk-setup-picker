"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { preloadOpeningAssets } from "@/lib/opening-preload";
import { ArrivalHero } from "./ArrivalHero";
import { RevealedRoom } from "./RevealedRoom";
import { SlidingDoor } from "./SlidingDoor";
import type { OpeningPhase } from "./types";

const REVEAL_DELAY_MS = 700;
const PRELOAD_TIMEOUT_MS = 1200;

export function OpeningExperience() {
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
    await preloadOpeningAssets(["/doors.webp", "/office.jpg"], PRELOAD_TIMEOUT_MS);

    if (!mountedRef.current) return;

    setPhase("revealing");
    clearRevealTimer();
    revealTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase((current) => (current === "revealing" ? "done" : current));
      revealTimerRef.current = null;
    }, REVEAL_DELAY_MS);
  }, [clearRevealTimer, phase]);

  const isRevealed = phase === "revealing" || phase === "done";
  const heroInteractive = phase === "arrival";
  const heroFaded = phase === "revealing";
  const heroVisible = phase !== "done";
  const doorLayerClass = phase === "arrival" ? "z-20" : "z-40";

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

      <div className={`pointer-events-none absolute inset-0 ${doorLayerClass}`}>
        <SlidingDoor phase={phase} />
      </div>

      {heroVisible && (
        <motion.div
          aria-hidden={heroFaded}
          className={`relative z-30 ${heroInteractive ? "" : "pointer-events-none"}`}
          initial={false}
          animate={{ opacity: heroFaded ? 0 : 1, y: heroFaded ? -12 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ArrivalHero onEnter={handleEnter} ariaDisabled={!heroInteractive} />
        </motion.div>
      )}
    </div>
  );
}
