"use client";

import { motion } from "framer-motion";
import { byId, type CatalogItem } from "@/lib/catalog";
import { DEFAULT_PRESET_ID, getPreset } from "@/lib/presets";
import { WorkspacePreview } from "@/components/workspace/WorkspacePreview";

type RevealedRoomProps = {
  reveal: boolean;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function isCatalogItem(item: CatalogItem | undefined): item is CatalogItem {
  return item !== undefined;
}

export function RevealedRoom({ reveal }: RevealedRoomProps) {
  const preset = getPreset(DEFAULT_PRESET_ID);
  const desk = byId(preset.deskId);
  const chair = byId(preset.chairId);
  const accessories = preset.accessoryIds.map(byId).filter(isCatalogItem);

  return (
    <motion.div
      aria-hidden={!reveal}
      initial={false}
      animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="w-full"
    >
      {reveal && (
        <WorkspacePreview desk={desk} chair={chair} accessories={accessories} />
      )}
    </motion.div>
  );
}
