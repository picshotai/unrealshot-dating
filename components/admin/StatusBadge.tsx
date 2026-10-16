import { cn } from "@/lib/utils";
import { LIFECYCLE_LABELS, type LifecycleStage } from "@/lib/admin/types";

const TONES = {
  good: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  bad: "border-red-500/30 bg-red-500/10 text-red-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  muted: "border-border bg-muted/40 text-muted-foreground",
} as const;

type Tone = keyof typeof TONES;

const STATUS_TONES: Record<string, Tone> = {
  completed: "good",
  ready: "good",
  sent: "good",
  refunded: "info",
  customer: "good",
  shoot_ready: "good",
  pending: "warn",
  abandoned: "warn",
  requested: "warn",
  queued: "info",
  developing: "info",
  shoot_in_progress: "info",
  checkout_abandoned: "warn",
  failed: "bad",
  partial_failed: "bad",
  failed_components_present: "bad",
  shoot_failed: "bad",
};

export function StatusBadge({ status, label, className }: { status: string; label?: string; className?: string }) {
  const tone = STATUS_TONES[status] ?? "muted";
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", TONES[tone], className)}>
      {label ?? status.replace(/_/g, " ")}
    </span>
  );
}

export function StageBadge({ stage }: { stage: LifecycleStage }) {
  return <StatusBadge status={stage} label={LIFECYCLE_LABELS[stage]} />;
}
