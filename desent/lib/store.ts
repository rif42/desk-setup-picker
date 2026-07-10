"use client";

import { create } from "zustand";
import { byId, chairs, desks, type CatalogItem } from "./catalog";

type WorkspaceState = {
  deskId: string;
  chairId: string;
  accessoryIds: string[];
  setDesk: (id: string) => void;
  setChair: (id: string) => void;
  toggleAccessory: (id: string) => void;
  reset: () => void;
};

const DEFAULT_DESK = desks[0].id;
const DEFAULT_CHAIR = chairs[0].id;
const DEFAULT_ACCESSORIES = ["acc-monitor", "acc-plant"];

export const useWorkspace = create<WorkspaceState>((set) => ({
  deskId: DEFAULT_DESK,
  chairId: DEFAULT_CHAIR,
  accessoryIds: DEFAULT_ACCESSORIES,
  setDesk: (id) => set({ deskId: id }),
  setChair: (id) => set({ chairId: id }),
  toggleAccessory: (id) =>
    set((s) => ({
      accessoryIds: s.accessoryIds.includes(id)
        ? s.accessoryIds.filter((x) => x !== id)
        : [...s.accessoryIds, id],
    })),
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
