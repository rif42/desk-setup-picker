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
    <div
      role="region"
      aria-label="Workspace designer"
      className="pointer-events-none fixed inset-0 z-10 flex items-stretch justify-between p-4 sm:p-6 lg:p-8"
    >
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <WorkspacePreview desk={desk} chair={chair} accessories={accessories} />
      </div>

      <div className="pointer-events-auto relative z-20 flex w-[280px] shrink-0 flex-col gap-6 overflow-y-auto overflow-x-hidden">
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

      <div className="pointer-events-auto relative z-20 flex w-[300px] shrink-0 flex-col overflow-y-auto">
        <CheckoutSummary items={items} total={total} onReset={state.reset} />
      </div>
    </div>
  );
}
