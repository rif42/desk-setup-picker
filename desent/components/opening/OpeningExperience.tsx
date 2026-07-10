"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { preloadOpeningAssets } from "@/lib/opening-preload";
import { type PresetId } from "@/lib/presets";
import { cn } from "@/lib/utils";
import { PersonaBackground } from "@/components/persona/PersonaBackground";
import { PersonaChips } from "@/components/persona/PersonaChips";
import { WorkspaceDesigner } from "@/components/workspace/WorkspaceDesigner";
import { ArrivalHero } from "./ArrivalHero";
import { DoorBackdrop } from "./DoorBackdrop";
import { SlidingDoor } from "./SlidingDoor";
import type { OpeningPhase } from "./types";

const PRELOAD_TIMEOUT_MS = 1200;
const ENTERING_MS = 1300;

export function OpeningExperience() {
  const [phase, setPhase] = useState<OpeningPhase>("arrival");
  const [persona, setPersona] = useState<PresetId | null>(null);
  const enteringTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const enterLockRef = useRef(false);
  const roomRef = useRef<HTMLDivElement | null>(null);

  const clearEnteringTimer = useCallback(() => {
    if (enteringTimerRef.current !== null) {
      window.clearTimeout(enteringTimerRef.current);
      enteringTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      clearEnteringTimer();
    };
  }, [clearEnteringTimer]);

  useEffect(() => {
    if (phase === "persona") {
      roomRef.current?.focus();
    }
  }, [phase]);

  const handleEnter = useCallback(async () => {
    if (phase !== "arrival" || enterLockRef.current) return;

    enterLockRef.current = true;
    setPhase("preparing");
    await preloadOpeningAssets(["/doors.webp", "/office.webp"], PRELOAD_TIMEOUT_MS);

    if (!mountedRef.current) return;

    // Entering-the-door transition, then settle on the blurred room + chips.
    setPhase("revealing");
    clearEnteringTimer();
    enteringTimerRef.current = window.setTimeout(() => {
      if (!mountedRef.current) return;
      setPhase("persona");
      enteringTimerRef.current = null;
    }, ENTERING_MS);
  }, [clearEnteringTimer, phase]);

  const handlePersonaSelect = useCallback((id: PresetId) => {
    setPersona(id);
    setPhase("builder");
  }, []);

  const roomMounted =
    phase === "revealing" || phase === "persona" || phase === "builder";
  const roomRevealed = phase === "persona" || phase === "builder";
  const roomBlurred = phase === "persona";
  const chipsVisible = phase === "persona";
  const builderVisible = phase === "builder";
  const heroInteractive = phase === "arrival";
  const heroVisible = phase === "arrival" || phase === "preparing";
  const heroFaded = phase === "preparing";
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
          <PersonaBackground reveal={roomRevealed} blur={roomBlurred} />

          <div
            className={cn(
              "relative z-10 h-full p-4 sm:p-6 lg:p-8",
              chipsVisible && "grid place-items-center",
              builderVisible && "overflow-y-auto",
            )}
          >
            {chipsVisible && (
              <PersonaChips
                value={persona}
                visible={chipsVisible}
                onSelect={handlePersonaSelect}
              />
            )}
            {builderVisible && (
              <div className="mx-auto w-full max-w-6xl py-4 sm:py-6">
                <WorkspaceDesigner />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-10">
        <DoorBackdrop phase={phase} />
      </div>

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
