"use client";

import { motion } from "framer-motion";
import { presets, type PresetId } from "@/lib/presets";
import { cn } from "@/lib/utils";

const CHIPS = Object.values(presets) as { id: PresetId; label: string }[];

type PersonaChipsProps = {
  value: PresetId | null;
  visible: boolean;
  onSelect: (id: PresetId) => void;
};

export function PersonaChips({ value, visible, onSelect }: PersonaChipsProps) {
  return (
    <motion.div
      role="radiogroup"
      aria-label="What kind of work are you doing?"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        "flex flex-wrap items-center justify-center gap-3",
        visible ? "" : "pointer-events-none",
      )}
    >
      {CHIPS.map((chip, index) => {
        const active = chip.id === value;

        return (
          <motion.button
            key={chip.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(chip.id)}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: visible ? 0.08 * index : 0,
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70",
              active
                ? "border-accent/70 bg-card/95 text-foreground shadow-lg"
                : "border-foreground/15 bg-card/45 text-foreground/85 hover:border-accent/50 hover:bg-card/70",
            )}
          >
            {chip.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
