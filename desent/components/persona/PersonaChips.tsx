"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { presets, type PresetId } from "@/lib/presets";
import { cn } from "@/lib/utils";

const CHIPS = Object.values(presets) as { id: PresetId; label: string }[];
const IDS = CHIPS.map((chip) => chip.id);

type PersonaChipsProps = {
  value: PresetId;
  visible: boolean;
  onChange: (id: PresetId) => void;
};

export function PersonaChips({ value, visible, onChange }: PersonaChipsProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const { key } = event;
    if (
      key !== "ArrowRight" &&
      key !== "ArrowLeft" &&
      key !== "ArrowDown" &&
      key !== "ArrowUp"
    ) {
      return;
    }

    event.preventDefault();
    const current = IDS.indexOf(value);
    const dir = key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
    const next = IDS[(current + dir + IDS.length) % IDS.length];
    onChange(next);
  }

  return (
    <motion.div
      role="radiogroup"
      aria-label="What kind of work are you doing?"
      onKeyDown={handleKeyDown}
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
            onClick={() => onChange(chip.id)}
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
                : "border-foreground/15 bg-card/45 text-foreground/80 hover:bg-card/70",
            )}
          >
            {active && (
              <Check className="h-4 w-4 text-accent" aria-hidden="true" />
            )}
            {chip.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
