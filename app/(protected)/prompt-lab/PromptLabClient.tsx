"use client";

import { useCallback, useEffect, useState } from "react";
import { Beaker, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import type { PromptLabRun } from "@/lib/dating/prompt-lab/run-types";
import type { PromptLabFeedback, PromptLabInput } from "@/lib/dating/prompt-lab/schemas";

import { PromptLabForm } from "./PromptLabForm";
import { PromptLabHistory } from "./PromptLabHistory";
import { PromptLabResult } from "./PromptLabResult";

export function PromptLabClient() {
  const [runs, setRuns] = useState<PromptLabRun[]>([]);
  const [selected, setSelected] = useState<PromptLabRun | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = useCallback(async (before?: string) => {
    setHistoryLoading(true);
    try {
      const suffix = before ? `?limit=15&before=${encodeURIComponent(before)}` : "?limit=15";
      const response = await fetch(`/api/prompt-lab/runs${suffix}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load history.");
      setRuns((current) => before ? [...current, ...data.runs] : data.runs);
      setNextCursor(data.nextCursor);
      if (!before && !selected && data.runs[0]) setSelected(data.runs[0]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load prompt history.");
    } finally {
      setHistoryLoading(false);
    }
  }, [selected]);

  useEffect(() => { void loadHistory(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function generate(input: PromptLabInput) {
    setBusy(true);
    try {
      const response = await fetch("/api/prompt-lab/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Prompt generation failed.");
      const run = data.run as PromptLabRun;
      setRuns((current) => [run, ...current.filter((item) => item.id !== run.id)]);
      setSelected(run);
      if (run.status === "passed") toast.success("Mechanically Fal-ready candidate saved.");
      else if (run.status === "failed_validation") toast.warning("Candidate saved with exact validation failures.");
      else if (run.status === "api_error") toast.error(run.apiError || "Gemini returned an API error.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Prompt generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveFeedback(runId: string, feedback: PromptLabFeedback) {
    const response = await fetch(`/api/prompt-lab/runs/${runId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Unable to save review.");
      return;
    }
    const run = data.run as PromptLabRun;
    setRuns((current) => current.map((item) => item.id === run.id ? run : item));
    setSelected(run);
    toast.success("Review saved.");
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 pb-16">
      <header className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-400/10 via-card to-card p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-amber-400/15 p-3 text-amber-300"><Beaker /></div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Gemini dating-shoot prompt lab</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground md:text-base">Build one coherent, four-frame male dating shoot. This lab saves every attempt but does not create images, spend credits or touch production orders.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant="outline"><ShieldCheck /> One call per click</Badge>
          <Badge variant="outline">Gemini 3.7 Flash · thinking low</Badge>
          <Badge variant="outline">Mechanically checked, never image-approved</Badge>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <PromptLabForm busy={busy} onGenerate={generate} />
          {selected && <PromptLabResult run={selected} busy={busy} onSaveFeedback={saveFeedback} onRetry={generate} />}
        </div>
        <PromptLabHistory runs={runs} selectedId={selected?.id} nextCursor={nextCursor} loading={historyLoading} onSelect={setSelected} onMore={() => nextCursor && void loadHistory(nextCursor)} />
      </div>
    </main>
  );
}

