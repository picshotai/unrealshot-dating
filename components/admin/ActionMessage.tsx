import { cn } from "@/lib/utils";
import type { ActionResult } from "@/lib/admin/types";

export default function ActionMessage({ result }: { result: ActionResult }) {
  if (!result) return null;
  return (
    <p role="status" className={cn("text-sm", result.ok ? "text-emerald-400" : "text-red-400")}>
      {result.message}
    </p>
  );
}
