import { AlertTriangle, Check } from "lucide-react";

function getCustomerStatus(stage?: string) {
  if (stage === "rendering_anchors") return "Creating the first image from each shoot";
  if (stage === "rendering_photos") return "Completing the remaining photos";
  if (stage === "attention_required") return "Your shoot is paused";
  return "Preparing your shoot";
}

function ShootRecoveryState({
  creditReturned,
  failureMessage,
}: {
  creditReturned?: boolean;
  failureMessage?: string;
}) {
  return (
    <section className="flex min-h-[420px] items-center px-5 py-16">
      <div className="mx-auto w-full max-w-xl font-[family-name:var(--font-inter)]">
        <AlertTriangle className="size-5 text-amber-300" />
        <h2 className="mt-5 font-[family-name:var(--font-inter)] text-2xl font-medium tracking-[-0.025em] text-white sm:text-3xl">
          Your shoot needs another take
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-500">
          {failureMessage ||
            "Something interrupted this shoot before the photos were ready. Your setup is saved, so you can retry without starting over."}
        </p>
        {creditReturned && (
          <p className="mt-6 flex items-center gap-2 text-xs text-emerald-300">
            <Check className="size-3.5" />
            Your shoot pack was returned
          </p>
        )}
      </div>
    </section>
  );
}

export function PortfolioProgressPanel({
  stage,
  progressPercent = 0,
  blocked,
  paused,
  retrying,
  failed,
  creditReturned,
  failureMessage,
}: {
  stage?: string;
  progressPercent?: number;
  blocked: boolean;
  paused: boolean;
  retrying?: boolean;
  failed?: boolean;
  creditReturned?: boolean;
  failureMessage?: string;
}) {
  if (failed || blocked || (paused && !retrying)) {
    return (
      <ShootRecoveryState
        creditReturned={creditReturned}
        failureMessage={failureMessage}
      />
    );
  }

  const safeProgress = Math.max(2, Math.min(99, Math.round(progressPercent)));
  const customerStatus = retrying
    ? "Continuing automatically"
    : getCustomerStatus(stage);

  return (
    <section
      className="flex min-h-[420px] items-center px-5 py-16"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto w-full max-w-2xl font-[family-name:var(--font-inter)]">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              <span className="size-1.5 rounded-full bg-amber-300" />
              Shoot in progress
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-inter)] text-2xl font-medium tracking-[-0.025em] text-white sm:text-3xl">
              Creating your photos
            </h2>
            <p className="mt-2 text-sm text-zinc-500">{customerStatus}</p>
          </div>
          <p className="shrink-0 font-[family-name:var(--font-inter)] text-3xl font-light tabular-nums text-zinc-300 sm:text-4xl">
            {safeProgress}
            <span className="ml-0.5 text-base text-zinc-600">%</span>
          </p>
        </div>

        <div className="mt-8 h-px w-full bg-white/10">
          <div
            className="h-px bg-amber-300 transition-[width] duration-700 ease-out"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
