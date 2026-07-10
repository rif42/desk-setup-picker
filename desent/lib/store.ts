"use client";

import { create } from "zustand";
import { byId, isMonitorId, type CatalogItem } from "./catalog";
import { DEFAULT_PRESET_ID, getPreset, type PresetId } from "./presets";

const MAX_ACCESSORIES = 5;

const sanitizeAccessoryIds = (ids: string[]) => {
  let hasMonitor = false;
  const next: string[] = [];

  for (const id of ids) {
    if (isMonitorId(id)) {
      if (hasMonitor) continue;
      hasMonitor = true;
    }
    if (next.includes(id)) continue;
    next.push(id);
    if (next.length >= MAX_ACCESSORIES) break;
  }

  return next;
};

type WorkspaceState = {
  deskId: string;
  chairId: string;
  accessoryIds: string[];
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  toggleAccessory: (id: string) => void;
  applyPreset: (id: PresetId) => void;
  reset: () => void;
};

const defaultPreset = getPreset(DEFAULT_PRESET_ID);
const DEFAULT_DESK = defaultPreset.deskId;
const DEFAULT_CHAIR = defaultPreset.chairId;
const DEFAULT_ACCESSORIES = sanitizeAccessoryIds(defaultPreset.accessoryIds);

export const useWorkspace = create<WorkspaceState>((set) => ({
  deskId: DEFAULT_DESK,
  chairId: DEFAULT_CHAIR,
  accessoryIds: DEFAULT_ACCESSORIES,
  setDesk: (id) => set({ deskId: id }),
  setChair: (id) => set({ chairId: id }),
  toggleAccessory: (id) =>
    set((s) => {
      if (s.accessoryIds.includes(id)) {
        return { accessoryIds: s.accessoryIds.filter((x) => x !== id) };
      }
      if (isMonitorId(id)) {
        const withoutMonitor = s.accessoryIds.filter((x) => !isMonitorId(x));
        if (withoutMonitor.length >= MAX_ACCESSORIES) return s;
        return { accessoryIds: [...withoutMonitor, id] };
      }
      if (s.accessoryIds.length >= MAX_ACCESSORIES) {
        return s;
      }
      return { accessoryIds: [...s.accessoryIds, id] };
    }),
  applyPreset: (id) => {
    const preset = getPreset(id);
    set({
      deskId: preset.deskId,
      chairId: preset.chairId,
      accessoryIds: sanitizeAccessoryIds(preset.accessoryIds),
    });
  },
  reset: () =>
    set({
      deskId: DEFAULT_DESK,
      chairId: DEFAULT_CHAIR,
      accessoryIds: DEFAULT_ACCESSORIES,
    }),
}));

/** Resolved, priced selection derived from the store. */
export function selectItems(s: WorkspaceState) {
  const desk = byId(s.deskId);
  const chair = byId(s.chairId);
  const accs = s.accessoryIds
    .map(byId)
    .filter((x): x is CatalogItem => Boolean(x));
  const items = [desk, chair, ...accs].filter(
    (x): x is CatalogItem => Boolean(x),
  );
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return { desk, chair, accessories: accs, items, total };
}
