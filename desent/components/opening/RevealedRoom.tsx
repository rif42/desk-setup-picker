"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { byId, type CatalogItem } from "@/lib/catalog";
import { DEFAULT_PRESET_ID, getPreset } from "@/lib/presets";
import { WorkspacePreview } from "@/components/workspace/WorkspacePreview";

type RevealedRoomProps = {
  reveal: boolean;
};

const SHELL_REVEAL_MS = 450;

function isCatalogItem(item: CatalogItem | undefined): item is CatalogItem {
  return item !== undefined;
}

export function RevealedRoom({ reveal }: RevealedRoomProps) {
  const reduce = useReducedMotion();
  const preset = getPreset(DEFAULT_PRESET_ID);
  const desk = byId(preset.deskId);
  const chair = byId(preset.chairId);
  const accessories = preset.accessoryIds.map(byId).filter(isCatalogItem);

  return (
    <motion.div
      aria-hidden={!reveal}
      initial={false}
      animate={
        reveal
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 18, scale: 0.985 }
      }
      transition={
        reduce
          ? { duration: 0 }
          : { duration: 0.72, ease: [0.22, 1, 0.36, 1] }
      }
      className="relative min-h-[32rem] w-full overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-stone-950 shadow-2xl"
    >
      <motion.div
        aria-hidden
        initial={false}
        animate={reveal ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 1.04 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.9, ease: "easeOut" }
        }
        className="absolute inset-0"
      >
        <Image
          src="/office.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 72rem, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/25 to-stone-950/10" />
      </motion.div>

      <div className="relative z-10 flex min-h-[32rem] items-center p-6 sm:p-8 lg:p-10">
        {reveal && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 0.5,
                    ease: "easeOut",
                    delay: SHELL_REVEAL_MS / 1000,
                  }
            }
            className="w-full"
          >
            <WorkspacePreview
              desk={desk}
              chair={chair}
              accessories={accessories}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
