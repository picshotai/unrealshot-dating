import { AlertTriangle, Loader2, Sparkles } from "lucide-react";

type PromptCounts = {
  reserved: number;
  generating: number;
  passed: number;
  replanning: number;
  total: number;
};

export function PortfolioProgressPanel({
  stageLabel,
  promptCounts,
  shootTarget,
  sample,
  blocked,
  paused,
  retrying,
  failed,
  creditReturned,
  failureMessage,
}: {
  stageLabel?: string;
  promptCounts?: PromptCounts;
  shootTarget: number;
  sample: { realShoots: number } | null;
  blocked: boolean;
  paused: boolean;
  retrying?: boolean;
  failed?: boolean;
  creditReturned?: boolean;
  failureMessage?: string;
}) {
  const ready = promptCounts?.passed ?? 0;
  const percent = Math.round(100 * ready / Math.max(1, shootTarget));
  const mockShoots = sample ? Math.max(0, shootTarget - sample.realShoots) : 0;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-6 py-8 sm:px-8">
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300">
          {failed || paused
            ? <AlertTriangle className="h-5 w-5" />
            : <Sparkles className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {failed || paused
              ? <AlertTriangle className="h-4 w-4 text-amber-400" />
              : <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />}
            <h3 className="text-base font-medium text-zinc-100">
              {stageLabel || "Preparing your dating portfolio"}
            </h3>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            {failed
              ? creditReturned
                ? failureMessage || "This order stopped before delivery, so its reserved pack was returned. You can retry the same shoot when you are ready."
                : failureMessage || "This order stopped before delivery. You can retry the same saved order."
              : blocked
              ? "The provider rejected its request configuration. No generation is active and automatic retries are paused. Deploy the fix, then use Retry setup."
              : paused
                ? "The previous attempt has ended. No generation is active right now. Retry setup can resume the saved order."
                : retrying
                  ? "The prompt provider returned a temporary error. Automatic retry is active; you do not need to click Retry setup or start another shoot."
                : "Shoot ideas and their four connected prompts are completed before image slots appear. This keeps every four-photo shoot together as one believable moment."}
          </p>

          {!failed && <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-amber-400 transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>}
          {!failed && <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
            <span>{ready} of {shootTarget} shoot prompts ready</span>
            {sample && (
              <span className="font-mono text-zinc-600">
                sample: {sample.realShoots} Fal shoots + {mockShoots} mock shoots
              </span>
            )}
          </div>}
        </div>
      </div>
    </div>
  );
}
