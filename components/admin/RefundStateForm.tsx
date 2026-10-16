"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import ActionMessage from "@/components/admin/ActionMessage";
import { NativeSelect } from "@/components/admin/NativeSelect";
import { updateRefundStateAction } from "@/app/(protected)/superpanel/actions";

export default function RefundStateForm({ orderId, current }: { orderId: string; current: string }) {
  const [state, formAction, pending] = useActionState(updateRefundStateAction, null);
  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="orderId" value={orderId} />
      <NativeSelect
        name="refundState"
        defaultValue={current}
        aria-label="Refund state"
        className="h-8 px-2 text-xs"
      >
        <option value="none">No refund</option>
        <option value="requested">Refund requested</option>
        <option value="refunded">Refunded</option>
      </NativeSelect>
      <Button type="submit" size="sm" variant="outline" disabled={pending} className="h-8">
        Save
      </Button>
      <ActionMessage result={state} />
    </form>
  );
}
