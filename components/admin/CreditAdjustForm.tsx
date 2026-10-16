"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ActionMessage from "@/components/admin/ActionMessage";
import { NativeSelect } from "@/components/admin/NativeSelect";
import { adjustCreditsAction } from "@/app/(protected)/superpanel/actions";

export default function CreditAdjustForm({ userId, current }: { userId: string; current: number }) {
  const [state, formAction, pending] = useActionState(adjustCreditsAction, null);
  return (
    <form
      action={formAction}
      className="space-y-3"
      onSubmit={(e) => {
        const fd = new FormData(e.currentTarget);
        if (fd.get("mode") === "set" && !window.confirm(`Overwrite balance of ${current} with ${fd.get("amount")}?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="userId" value={userId} />
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <NativeSelect
          name="mode"
          defaultValue="add"
          aria-label="Adjustment"
          className="px-2"
        >
          <option value="add">Add</option>
          <option value="remove">Remove</option>
          <option value="set">Set to</option>
        </NativeSelect>
        <Input name="amount" type="number" min={0} step={1} placeholder="Credits" required aria-label="Amount" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`reason-${userId}`}>Reason (audit log)</Label>
        <Input id={`reason-${userId}`} name="reason" placeholder="e.g. goodwill after failed shoot" required maxLength={200} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm" disabled={pending}>{pending ? "Saving…" : "Apply"}</Button>
        <ActionMessage result={state} />
      </div>
    </form>
  );
}
