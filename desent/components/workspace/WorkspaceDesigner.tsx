"use client";

import { useWorkspace, selectItems } from "@/lib/store";
import { chairs, desks } from "@/lib/catalog";
import { WorkspacePreview } from "./WorkspacePreview";
import { OptionPicker } from "./OptionPicker";
import { AccessoryPicker } from "./AccessoryPicker";
import { CheckoutSummary } from "./CheckoutSummary";

export function WorkspaceDesigner() {
  const state = useWorkspace();
  const { desk, chair, accessories, items, total } = selectItems(state);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(280px,320px)] lg:items-start">
      <div className="space-y-6">
        <OptionPicker
          label="Pick a desk"
          items={desks}
          selectedId={state.deskId}
          onSelect={state.setDesk}
        />
        <OptionPicker
          label="Pick a chair"
          items={chairs}
          selectedId={state.chairId}
          onSelect={state.setChair}
        />
        <AccessoryPicker
          selectedIds={state.accessoryIds}
          onToggle={state.toggleAccessory}
        />
      </div>

      <WorkspacePreview desk={desk} chair={chair} accessories={accessories} />

      <div className="lg:sticky lg:top-6 lg:self-start">
        <CheckoutSummary items={items} total={total} onReset={state.reset} />
      </div>
    </div>
  );
}
