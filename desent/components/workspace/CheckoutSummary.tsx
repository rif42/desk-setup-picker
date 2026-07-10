"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CatalogItem } from "@/lib/catalog";
import { formatIDR } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";

type Props = {
  items: CatalogItem[];
  total: number;
  onReset: () => void;
};

export function CheckoutSummary({ items, total, onReset }: Props) {
  return (
    <aside className="flex h-full flex-col rounded-[2rem] border border-foreground/10 bg-card p-6 shadow-sm">
      <h2 className="text-lg font-bold">Your setup</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Monthly rental · delivered in Bali
      </p>

      <ul className="mt-5 flex-1 space-y-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex items-center justify-between gap-3 rounded-xl bg-foreground/5 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-foreground/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                </span>
                {item.name}
              </span>
              <span className="tabular-nums text-foreground/70">
                {formatIDR(item.price)}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-5 border-t border-foreground/10 pt-4">
        <div className="flex items-end justify-between">
          <span className="text-sm text-foreground/60">Total / month</span>
          <span className="text-2xl font-extrabold tabular-nums">
            {formatIDR(total)}
          </span>
        </div>

        <Button
          className="mt-4 w-full"
          onClick={() => console.info("checkout: later")}
        >
          Checkout
        </Button>
        <Button variant="ghost" className="mt-1 w-full" onClick={onReset}>
          Start over
        </Button>
      </div>
    </aside>
  );
}
