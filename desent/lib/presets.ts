export type PresetId = "coder" | "designer" | "business";

export type WorkspacePreset = {
  id: PresetId;
  label: string;
  deskId: string;
  chairId: string;
  accessoryIds: string[];
};

export const presets: Record<PresetId, WorkspacePreset> = {
  coder: {
    id: "coder",
    label: "Coder",
    deskId: "desk-standing",
    chairId: "chair-ergo",
    accessoryIds: ["acc-monitor", "acc-monitor-2", "acc-lamp", "acc-headphones"],
  },
  designer: {
    id: "designer",
    label: "Designer",
    deskId: "desk-bali",
    chairId: "chair-ergo",
    accessoryIds: ["acc-monitor", "acc-lamp", "acc-plant"],
  },
  business: {
    id: "business",
    label: "Business",
    deskId: "desk-compact",
    chairId: "chair-task",
    accessoryIds: ["acc-monitor", "acc-lamp", "acc-headphones"],
  },
};

export const DEFAULT_PRESET_ID: PresetId = "coder";

export function getPreset(id: PresetId): WorkspacePreset {
  return presets[id];
}
