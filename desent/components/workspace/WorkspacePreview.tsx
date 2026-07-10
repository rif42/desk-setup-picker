"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { CatalogItem } from "@/lib/catalog";

type Props = {
  desk?: CatalogItem;
  chair?: CatalogItem;
  accessories: CatalogItem[];
};

type Layer = {
  item: CatalogItem;
  z: number;
  priority: boolean;
};

const SIZES = "(min-width: 1024px) 40vw, 100vw";
const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };

// Front -> back stacking, derived from id/category (never array order).
function zFor(item: CatalogItem): number {
  if (item.category === "chair") return 60;
  if (item.category === "desk") return 10;
  // accessories
  if (item.id === "acc-laptop-stand") return 50;
  if (item.id.startsWith("acc-monitor")) return 40;
  if (item.id === "acc-keyboard-mx") return 30;
  if (item.id === "acc-mouse-mx-master") return 20;
  return 35; // safe fallback for any future accessory slot
}

export function WorkspacePreview({ desk, chair, accessories }: Props) {
  const [errored, setErrored] = useState<ReadonlySet<string>>(() => new Set());

  const markErrored = (id: string) =>
    setErrored((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  // Backdrop office.webp is owned by the parent (PersonaBackground); this
  // container stays transparent so the room shows through behind the layers.
  const layers: Layer[] = [
    ...(desk ? [{ item: desk, z: zFor(desk), priority: true }] : []),
    ...accessories.map((item) => ({
      item,
      z: zFor(item),
      priority: false,
    })),
    ...(chair ? [{ item: chair, z: zFor(chair), priority: false }] : []),
  ].filter((layer) => !errored.has(layer.item.id));

  const selectedNames = [
    desk?.name,
    chair?.name,
    ...accessories.map((item) => item.name),
  ].filter((name): name is string => Boolean(name));

  return (
    <div
      aria-label="Workspace preview"
      className="relative aspect-[4/3] w-full overflow-hidden"
    >
      {/* Accessible summary of the current setup (layers below are decorative). */}
      <ul className="sr-only">
        {selectedNames.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <AnimatePresence>
        {layers.map(({ item, z, priority }) => (
          <motion.div
            key={item.id}
            aria-hidden
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={SPRING}
            style={{ zIndex: z }}
            className="absolute inset-0"
          >
            <Image
              src={item.envImage}
              alt=""
              fill
              priority={priority}
              sizes={SIZES}
              className="object-contain"
              onError={() => markErrored(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
