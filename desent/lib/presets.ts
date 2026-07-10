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
    deskId: "desk-standing-electric",
    chairId: "chair-ergo-mesh",
    accessoryIds: [
      "acc-monitor-27-4k",
      "acc-keyboard-mx",
      "acc-mouse-mx-master",
      "acc-laptop-stand",
    ],
  },
  designer: {
    id: "designer",
    label: "Designer",
    deskId: "desk-adjustable",
    chairId: "chair-mia",
    accessoryIds: [
      "acc-monitor-34-gaming",
      "acc-mouse-mx-master",
      "acc-laptop-stand",
    ],
  },
  business: {
    id: "business",
    label: "Business",
    deskId: "desk-compact",
    chairId: "chair-task-basic",
    accessoryIds: ["acc-monitor-27-4k", "acc-keyboard-mx", "acc-mouse-mx-master"],
  },
};

export const DEFAULT_PRESET_ID: PresetId = "coder";

export function getPreset(id: PresetId): WorkspacePreset {
  return presets[id];
}
