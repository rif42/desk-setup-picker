"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { preloadOpeningAssets } from "@/lib/opening-preload";
import { DEFAULT_PRESET_ID, type PresetId } from "@/lib/presets";
import { PersonaBackground } from "@/components/persona/PersonaBackground";
import { PersonaChips } from "@/components/persona/PersonaChips";
import { ArrivalHero } from "./ArrivalHero";
import { RevealedRoom } from "./RevealedRoom";
import { SlidingDoor } from "./SlidingDoor";
import type { OpeningPhase } from "./types";

const REVEAL_DELAY_MS = 700;
const PRELOAD_TIMEOUT_MS = 1200;
const PERSONA_HOLD_MS = 800;

export function OpeningExperience() {
  const [phase, setPhase] = useState<OpeningPhase>("arrival");
  const [persona, setPersona] = useState<PresetId>(DEFAULT_PRESET_ID);
  const revealTimerRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const enterLockRef = useRef(false);
  const roomRef = useRef<HTMLDivElement | null>(null);

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      clearRevealTimer();
      clearHoldTimer();
    };
  }, [clearRevealTimer, clearHoldTimer]);

  useEffect(() => {
    if (phase === "done" || phase === "persona") {
      roomRef.current?.focus();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;

    clearHoldTimer();
    holdTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase("persona");
      holdTimerRef.current = null;
    }, PERSONA_HOLD_MS);

    return clearHoldTimer;
  }, [phase, clearHoldTimer]);

  const handleEnter = useCallback(async () => {
    if (phase !== "arrival" || enterLockRef.current) return;

    enterLockRef.current = true;
    setPhase("preparing");
    await preloadOpeningAssets(["/doors.webp", "/office.webp"], PRELOAD_TIMEOUT_MS);

    if (!mountedRef.current) return;

    setPhase("revealing");
    clearRevealTimer();
    revealTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase((current) => (current === "revealing" ? "done" : current));
      revealTimerRef.current = null;
    }, REVEAL_DELAY_MS);
  }, [clearRevealTimer, phase]);

  const roomMounted =
    phase === "revealing" || phase === "done" || phase === "persona";
  const roomBlurred = phase === "persona";
  const previewVisible = phase === "done";
  const chipsVisible = phase === "persona";
  const heroInteractive = phase === "arrival";
  const heroFaded = phase === "revealing";
  const heroVisible = phase !== "done" && phase !== "persona";
  const doorLayerClass = phase === "arrival" ? "z-20" : "z-40";

  return (
    <div
      role="region"
      aria-label="Workspace opening experience"
      aria-busy={phase === "preparing"}
      className="relative min-h-[100svh] overflow-hidden bg-background"
    >
      {roomMounted && (
        <div
          ref={roomRef}
          tabIndex={-1}
          aria-label="Revealed workspace"
          className="absolute inset-0 z-0 outline-none"
        >
          <PersonaBackground reveal={roomMounted} blur={roomBlurred} />

          <div className="relative z-10 grid h-full place-items-center p-4 sm:p-6 lg:p-8">
            {previewVisible && <RevealedRoom reveal />}
            {chipsVisible && (
              <PersonaChips
                value={persona}
                visible={chipsVisible}
                onChange={setPersona}
              />
            )}
          </div>
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
