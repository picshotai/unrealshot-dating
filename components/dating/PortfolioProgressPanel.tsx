import {
  AlertTriangle,
  Check,
  Circle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PREPARATION_STEPS = [
  { label: "Directing", stages: ["planning", "writing_prompts"] },
  { label: "Creating", stages: ["rendering_anchors"] },
  { label: "Finishing", stages: ["rendering_photos", "ready"] },
] as const;

function getActiveStep(stage?: string) {
  const index = PREPARATION_STEPS.findIndex((step) =>
    (step.stages as readonly string[]).includes(stage ?? "")
  );

  return index === -1 ? 0 : index;
}

function getCustomerStatus(stage?: string, loading?: boolean) {
  if (loading) return "Opening your latest shoot";
  if (stage === "rendering_anchors") return "Bringing your first scenes to life";
  if (stage === "rendering_photos") return "Finishing your full collection";
  if (stage === "attention_required") return "Your shoot is taking a quick pause";
  return "Directing your new photo set";
}

function ContactSheetPreview({ activeStep }: { activeStep: number }) {
  return (
    <div
      className="relative mx-auto mt-7 h-[170px] w-full max-w-[520px] sm:h-[185px]"
      aria-hidden="true"
    >
      <div className="absolute inset-x-[9%] bottom-0 h-20 rounded-full bg-amber-400/[0.08] blur-3xl" />
      <div className="absolute inset-x-0 bottom-4 top-0 grid grid-cols-4 items-end gap-2.5 sm:gap-4">
        {[0, 1, 2, 3].map((index) => {
          const isLit = index <= activeStep;
          return (
            <div
              key={index}
              className={cn(
                "group relative h-[78%] overflow-hidden rounded-[16px] border bg-zinc-950 shadow-2xl sm:rounded-[22px]",
                index === 1 && "mb-5 h-[91%]",
                index === 2 && "mb-2 h-[84%]",
                isLit
                  ? "border-amber-300/25 shadow-amber-950/20"
                  : "border-white/[0.07]"
              )}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(245,158,11,0.13),transparent_33%),linear-gradient(155deg,rgba(255,255,255,0.07),transparent_42%)]" />
              <div
                className="absolute -inset-y-1/3 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.09] to-transparent motion-safe:animate-[pulse_2.8s_ease-in-out_infinite]"
                style={{
                  left: `${index * 15 - 20}%`,
                  animationDelay: `${index * 320}ms`,
                }}
              />
              <div className="absolute inset-x-[18%] top-[14%] aspect-square rounded-full border border-white/[0.08] bg-white/[0.025]" />
              <div className="absolute inset-x-[12%] bottom-[11%] h-[42%] rounded-t-[999px] border border-b-0 border-white/[0.07] bg-white/[0.02]" />
              <span className="absolute left-2.5 top-2.5 font-mono text-[9px] tracking-[0.18em] text-white/25 sm:left-3.5 sm:top-3.5">
                0{index + 1}
              </span>
              {isLit && (
                <span className="absolute bottom-3 right-3 size-1 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.8)] sm:bottom-4 sm:right-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PreparationTimeline({ activeStep }: { activeStep: number }) {
  return (
    <div className="mx-auto mt-6 w-full max-w-xl" aria-label="Shoot preparation progress">
      <div className="relative grid grid-cols-3">
        <div className="absolute left-[16.67%] right-[16.67%] top-2 h-px bg-white/10" />
        <div
          className="absolute left-[16.67%] top-2 h-px bg-amber-300/60 transition-[width] duration-700"
          style={{ width: `${activeStep * 33.33}%` }}
        />
        {PREPARATION_STEPS.map((step, index) => {
          const complete = index < activeStep;
          const current = index === activeStep;

          return (
            <div key={step.label} className="relative flex flex-col items-center gap-2.5">
              <span
                className={cn(
                  "relative z-10 grid size-4 place-items-center rounded-full border bg-[#080808] transition-colors duration-500",
                  complete && "border-amber-300 bg-amber-300 text-black",
                  current && "border-amber-300 text-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.35)]",
                  !complete && !current && "border-zinc-700 text-zinc-700"
                )}
              >
                {complete ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : current ? (
                  <Circle className="size-1.5 fill-current" />
                ) : null}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.16em] sm:text-[11px]",
                  index <= activeStep ? "text-zinc-300" : "text-zinc-600"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShootRecoveryState({
  creditReturned,
  failureMessage,
}: {
  creditReturned?: boolean;
  failureMessage?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[480px] items-center justify-center overflow-hidden px-5 py-16 text-center">
      <div className="absolute left-1/2 top-1/2 -z-10 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/[0.05] blur-3xl" />
      <div className="max-w-lg">
        <span className="mx-auto grid size-11 place-items-center rounded-full border border-amber-400/20 bg-amber-400/[0.08] text-amber-300">
          <AlertTriangle className="size-5" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Your shoot needs another take
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
          {failureMessage ||
            "Something interrupted this shoot before the photos were ready. Your setup is saved, so you can retry without starting over."}
        </p>
        {creditReturned && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-300">
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
  loading = false,
  blocked,
  paused,
  retrying,
  failed,
  creditReturned,
  failureMessage,
}: {
  stage?: string;
  progressPercent?: number;
  loading?: boolean;
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

  const activeStep = getActiveStep(stage);
  const safeProgress = Math.max(2, Math.min(99, Math.round(progressPercent)));
  const customerStatus = retrying
    ? "Taking a moment, then continuing automatically"
    : getCustomerStatus(stage, loading);

  return (
    <section
      className="relative isolate min-h-[500px] overflow-hidden px-5 pb-10 pt-7 text-center sm:px-8 sm:pb-12 sm:pt-9"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="absolute inset-x-[12%] top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-24 -z-20 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.065),transparent_68%)]" />

      <div className="mx-auto max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 backdrop-blur-sm">
          <Sparkles className="size-3 text-amber-300" />
          Shoot in progress
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Your new profile is taking shape.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-zinc-500 sm:text-base">
          Your first photos will appear here automatically as soon as they’re ready.
        </p>
      </div>

      <ContactSheetPreview activeStep={activeStep} />
      <PreparationTimeline activeStep={activeStep} />

      <div className="mx-auto mt-6 flex w-full max-w-xl items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-200 transition-[width] duration-700 ease-out"
            style={{ width: `${loading ? 8 : safeProgress}%` }}
          />
        </div>
        <span className="w-9 text-right font-mono text-[10px] tabular-nums text-zinc-500">
          {loading ? "···" : `${safeProgress}%`}
        </span>
      </div>
      <p className="mt-3 text-xs text-zinc-600">{customerStatus}</p>
    </section>
  );
}
