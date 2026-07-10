"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CatalogItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/pricing";

type Props = {
  label: string;
  items: CatalogItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function OptionPicker({ label, items, selectedId, onSelect }: Props) {
  return (
    <section aria-labelledby={`${label}-heading`} className="space-y-3">
      <h2
        id={`${label}-heading`}
        className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/50"
      >
        {label}
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const active = item.id === selectedId;
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(item.id)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/10 bg-card hover:border-foreground/30",
              )}
            >
              <span
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-inset",
                  active
                    ? "bg-background/90 ring-background/30"
                    : "bg-foreground/[0.04] ring-foreground/10",
                )}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </span>
              <span className="text-sm font-semibold leading-tight">
                {item.name}
              </span>
              <span
                className={cn(
                  "text-xs",
                  active ? "text-background/70" : "text-foreground/50",
                )}
              >
                {formatIDR(item.price)}/mo
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
