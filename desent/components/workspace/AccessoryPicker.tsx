"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { accessories } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/pricing";

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function AccessoryPicker({ selectedIds, onToggle }: Props) {
  return (
    <section aria-labelledby="accessories-heading" className="space-y-3">
      <h2
        id="accessories-heading"
        className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50"
      >
        Accessories
      </h2>
      <div className="flex flex-wrap gap-2">
        {accessories.map((item) => {
          const Icon = item.icon;
          const active = selectedIds.includes(item.id);
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(item.id)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
                active
                  ? "border-transparent bg-foreground text-background"
                  : "border-foreground/10 bg-card hover:border-foreground/30",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {item.name}
              <span
                className={cn(
                  "text-xs",
                  active ? "text-background/70" : "text-foreground/50",
                )}
              >
                {formatIDR(item.price)}
              </span>
              {active ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <Plus className="size-3.5" aria-hidden />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
