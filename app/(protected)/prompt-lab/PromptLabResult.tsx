"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, Clipboard, Loader2, RotateCcw, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PromptLabRun } from "@/lib/dating/prompt-lab/run-types";
import {
  ISSUE_TAGS,
  promptLabOutputSchema,
  type PromptLabFeedback,
  type PromptLabInput,
} from "@/lib/dating/prompt-lab/schemas";
import { cn } from "@/lib/utils";

const statusCopy = {
  running: "Running",
  passed: "Mechanically Fal-ready",
  failed_validation: "Failed validation",
  api_error: "API error",
} as const;

export function PromptLabResult({ run, busy, onSaveFeedback, onRetry }: {
  run: PromptLabRun;
  busy: boolean;
  onSaveFeedback: (runId: string, feedback: PromptLabFeedback) => Promise<void>;
  onRetry: (input: PromptLabInput) => Promise<void>;
}) {
  const [feedback, setFeedback] = useState(run.feedback);
  const [revision, setRevision] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const parsed = promptLabOutputSchema.safeParse(run.output);

  useEffect(() => {
    setFeedback(run.feedback);
    setRevision("");
  }, [run.id, run.feedback]);

  async function copyPrompt(framing: string, prompt: string) {
    await navigator.clipboard.writeText(prompt);
    setCopied(framing);
    window.setTimeout(() => setCopied(null), 1_500);
  }

  async function save() {
    setSaving(true);
    try { await onSaveFeedback(run.id, feedback); } finally { setSaving(false); }
  }

  async function retry() {
    if (!revision.trim()) return;
    await onRetry({
      ...run.input.request,
      clientRequestId: crypto.randomUUID(),
      parentRunId: run.id,
      revisionInstructions: revision.trim(),
    });
  }

  return (
    <div className="space-y-4">
      <Card className={cn("border", run.status === "passed" ? "border-emerald-500/50" : run.status === "failed_validation" ? "border-amber-500/50" : "border-red-500/50")}>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>{parsed.success ? parsed.data.scene.title : "Saved generation attempt"}</CardTitle>
            <Badge variant={run.status === "passed" ? "default" : run.status === "failed_validation" ? "secondary" : "destructive"}>
              {run.status === "passed" ? <Check /> : <AlertTriangle />}{statusCopy[run.status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Reference: <span className="text-foreground">{run.referenceShootId}</span> ({run.referenceEvidence}) ·
            {" "}{run.model} · thinking {run.thinkingLevel}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Input tokens" value={run.usage.inputTokens.toLocaleString()} />
            <Metric label="Output tokens" value={run.usage.outputTokens.toLocaleString()} />
            <Metric label="Reasoning tokens" value={run.usage.reasoningTokens.toLocaleString()} />
            <Metric label="Estimated cost" value={`$${run.estimatedCostUsd.toFixed(6)}`} />
          </div>

          {run.apiError && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{run.apiError}</div>}

          {parsed.success ? (
            <>
              <div className="grid gap-3 rounded-xl bg-muted/40 p-4 text-sm md:grid-cols-2">
                <Detail label="Dating signal" value={parsed.data.scene.datingSignal} />
                <Detail label="Concept family" value={parsed.data.scene.conceptFamily} />
                <Detail label="Location" value={parsed.data.scene.location} />
                <Detail label="Activity" value={parsed.data.scene.activity} />
                <Detail label="Why he is doing it" value={parsed.data.scene.activityReason} />
                <Detail label="Light" value={`${parsed.data.scene.lightFamily} — ${parsed.data.scene.light}`} />
                <Detail label="Outfit" value={parsed.data.scene.outfit} />
                <Detail label="Props / density" value={`${parsed.data.scene.props.join(", ") || "none"} / ${run.sceneDensity.join(", ") || "none detected"}`} />
                <div className="md:col-span-2"><Detail label="Scene rationale" value={parsed.data.scene.rationale} /></div>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                {parsed.data.frames.map((frame) => (
                  <Card key={frame.framing} className="bg-background/50">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base capitalize">{frame.framing === "threeQuarter" ? "Three-quarter" : frame.framing}</CardTitle>
                        <p className="text-xs text-muted-foreground">{frame.width} × {frame.height}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => copyPrompt(frame.framing, frame.prompt)}>
                        {copied === frame.framing ? <Check /> : <Clipboard />}{copied === frame.framing ? "Copied" : "Copy"}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{frame.prompt}</p>
                      <div className="space-y-2">
                        <Label htmlFor={`note-${frame.framing}`}>Notes for this prompt</Label>
                        <Textarea id={`note-${frame.framing}`} rows={2} maxLength={2_000}
                          value={feedback.frameNotes[frame.framing]}
                          onChange={(event) => setFeedback((current) => ({
                            ...current,
                            frameNotes: { ...current.frameNotes, [frame.framing]: event.target.value },
                          }))} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : run.output !== null ? (
            <div className="space-y-2">
              <Label>Exact invalid candidate</Label>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-black/40 p-4 text-xs">{typeof run.output === "string" ? run.output : JSON.stringify(run.output, null, 2)}</pre>
            </div>
          ) : null}

          {run.validationErrors.length > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
              <p className="mb-2 text-sm font-medium text-amber-200">Exact validation problems</p>
              <ul className="space-y-1 text-sm text-amber-100/80">
                {run.validationErrors.map((problem, index) => <li key={`${problem}-${index}`}>• {problem}</li>)}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Human review</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Overall rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} type="button" onClick={() => setFeedback((current) => ({ ...current, rating }))}
                  className={cn("size-9 rounded-md border text-sm", feedback.rating === rating ? "border-amber-400 bg-amber-400/20" : "border-border")}>
                  {rating}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="block font-medium">Decision</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3" value={feedback.decision}
                onChange={(event) => setFeedback((current) => ({ ...current, decision: event.target.value as PromptLabFeedback["decision"] }))}>
                <option value="unreviewed">Unreviewed</option><option value="keep">Keep</option><option value="revise">Revise</option><option value="reject">Reject</option>
              </select>
            </label>
            <div className="space-y-2">
              <Label>Issue tags</Label>
              <div className="flex flex-wrap gap-2">
                {ISSUE_TAGS.map((tag) => {
                  const active = feedback.issueTags.includes(tag);
                  return <button key={tag} type="button" onClick={() => setFeedback((current) => ({ ...current, issueTags: active ? current.issueTags.filter((value) => value !== tag) : [...current.issueTags, tag] }))}
                    className={cn("rounded-full border px-2.5 py-1 text-xs", active ? "border-red-400 bg-red-400/10" : "border-border")}>{tag}</button>;
                })}
              </div>
            </div>
          </div>
          <div className="space-y-2"><Label htmlFor="overall-notes">Overall notes</Label><Textarea id="overall-notes" rows={3} maxLength={4_000} value={feedback.notes} onChange={(event) => setFeedback((current) => ({ ...current, notes: event.target.value }))} /></div>
          <Button variant="outline" disabled={saving} onClick={save}>{saving ? <Loader2 className="animate-spin" /> : <Save />}{saving ? "Saving…" : "Save review"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Manual revision</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">A retry creates a linked run and sends this correction, the saved review, previous candidate and validator failures in one new Gemini call. The original stays unchanged.</p>
          <Textarea rows={3} maxLength={1_000} placeholder="Say exactly what should change…" value={revision} onChange={(event) => setRevision(event.target.value)} />
          <Button disabled={busy || !revision.trim()} onClick={retry}>{busy ? <Loader2 className="animate-spin" /> : <RotateCcw />}{busy ? "Generating revision…" : "Retry with fixes"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-muted/40 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 leading-6">{value}</p></div>;
}

