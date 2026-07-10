"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { accessories } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/pricing";

const MAX_ACCESSORIES = 5;

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function AccessoryPicker({ selectedIds, onToggle }: Props) {
  const atCap = selectedIds.length >= MAX_ACCESSORIES;

  return (
    <section aria-labelledby="accessories-heading" className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2
          id="accessories-heading"
          className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50"
        >
          Accessories
        </h2>
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            atCap ? "text-foreground" : "text-foreground/50",
          )}
          aria-label={`${selectedIds.length} of ${MAX_ACCESSORIES} accessories selected`}
        >
          {selectedIds.length}/{MAX_ACCESSORIES}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {accessories.map((item) => {
          const active = selectedIds.includes(item.id);
          const cappedOut = atCap && !active;
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-pressed={active}
              aria-disabled={cappedOut}
              disabled={cappedOut}
              onClick={() => {
                if (cappedOut) return;
                onToggle(item.id);
              }}
              whileTap={cappedOut ? undefined : { scale: 0.96 }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
                active
                  ? "border-transparent bg-foreground text-background"
                  : "border-foreground/10 bg-card hover:border-foreground/30",
                cappedOut && "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "relative size-8 shrink-0 overflow-hidden rounded-md ring-1 ring-inset",
                  active
                    ? "bg-background/90 ring-background/30"
                    : "bg-foreground/[0.04] ring-foreground/10",
                )}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
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
