"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CatalogItem } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Props = {
  desk?: CatalogItem;
  chair?: CatalogItem;
  accessories: CatalogItem[];
};

export function WorkspacePreview({ desk, chair, accessories }: Props) {
  const reduce = useReducedMotion();
  const spring = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 28 };

  return (
    <div
      aria-label="Workspace preview"
      className="relative flex min-h-[26rem] w-full items-end justify-center overflow-hidden rounded-[2rem] border border-foreground/10 bg-gradient-to-b from-sky-100 via-emerald-50 to-stone-100 p-6 shadow-inner dark:from-sky-950/40 dark:via-emerald-950/30 dark:to-stone-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-6 h-40 rounded-full bg-white/50 blur-3xl dark:bg-white/5"
      />

      {/* chair */}
      <AnimatePresence mode="popLayout">
        {chair && (
          <motion.div
            key={chair.id}
            layout
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
            transition={spring}
            className={cn(
              "absolute bottom-14 z-10 grid size-20 place-items-center rounded-3xl shadow-xl",
              chair.tint,
            )}
            aria-label={`Chair: ${chair.name}`}
          >
            <chair.icon className="size-9 text-white" aria-hidden />
          </motion.div>
        )}
      </AnimatePresence>

      {/* desk + accessories */}
      <div className="relative z-20 flex w-full max-w-md flex-col items-center">
        <div className="mb-3 flex h-24 items-end justify-center gap-3">
          <AnimatePresence mode="popLayout">
            {accessories.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={reduce ? false : { opacity: 0, y: -18, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.8 }
                }
                transition={spring}
                className={cn(
                  "grid size-14 place-items-center rounded-2xl shadow-lg",
                  item.tint,
                )}
                aria-label={item.name}
              >
                <item.icon className="size-7 text-white" aria-hidden />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="popLayout">
          {desk && (
            <motion.div
              key={desk.id}
              layout
              initial={reduce ? false : { opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scaleX: 0.7 }}
              transition={spring}
              className={cn(
                "flex h-16 w-full items-center justify-center gap-2 rounded-2xl shadow-xl",
                desk.tint,
              )}
              aria-label={`Desk: ${desk.name}`}
            >
              <desk.icon className="size-6 text-white/90" aria-hidden />
              <span className="text-sm font-bold text-white">{desk.name}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-1 h-3 w-4/5 rounded-full bg-foreground/10 blur-sm" />
      </div>
    </div>
  );
}
