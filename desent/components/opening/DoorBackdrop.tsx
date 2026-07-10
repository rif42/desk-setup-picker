"use client";

import Image from "next/image";
import { motion, type TargetAndTransition } from "framer-motion";
import type { OpeningPhase } from "./types";

type Props = {
  phase: OpeningPhase;
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Accelerating push — sells the "stepping into the door" feeling.
const EASE_IN: [number, number, number, number] = [0.55, 0, 0.9, 1];

function targetFor(phase: OpeningPhase): TargetAndTransition {
  switch (phase) {
    case "arrival":
      return { opacity: 1, scale: 1, filter: "brightness(1)" };
    case "preparing":
      return { opacity: 1, scale: 1.04, filter: "brightness(1.06)" };
    case "revealing":
      // Forward dolly into the doorway + warm bloom before handing off.
      return { opacity: 1, scale: 1.24, filter: "brightness(1.18)" };
    case "done":
    case "persona":
    case "builder":
      // Fade out so the room can reveal behind it.
      return { opacity: 0, scale: 1.24, filter: "brightness(1.18)" };
  }
}

export function DoorBackdrop({ phase }: Props) {
  const entering = phase === "revealing";

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={targetFor(phase)}
      transition={{
        duration: entering ? 1.3 : 0.8,
        ease: entering ? EASE_IN : EASE_OUT,
      }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <Image
        src="/doors.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </motion.div>
  );
}
