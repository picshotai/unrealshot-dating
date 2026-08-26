"use client";

import { useState } from "react";
import { Activity, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ProbeResult = {
  passed: boolean;
  interactionId: string | null;
  candidateTitle: string | null;
  estimatedCostUsd: number;
  problems: string[];
  warnings: string[];
  brief: Record<string, unknown> | null;
  references: { id: string; prompt: string }[];
  captureOutput: { frames?: Array<{ frameId: string; capturePrompt: string }> } | null;
  compiledOutput: { frames?: Array<{ frameId: string; prompt: string }> } | null;
  usage: { inputTokens: number; outputTokens: number; reasoningTokens: number; totalTokens: number };
};

export function ProductionProviderProbe() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ProbeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runProbe() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/prompt-lab/provider-check", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Production planner check failed.");
      setResult(data as ProbeResult);
    } catch (probeError) {
      setError(probeError instanceof Error ? probeError.message : "Production planner check failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" /> Production provider contract</CardTitle>
        <CardDescription>Owner-only. One planner call plus one four-frame writer call. It creates no order, Fal image, pack charge or retry.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" disabled={busy} onClick={runProbe}>
          {busy ? <Loader2 className="animate-spin" /> : <Activity />}
          {busy ? "Checking Gemini…" : "Check production planner"}
        </Button>
        {result && (
          <div className="flex items-start gap-2 text-sm">
            {result.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" /> : <XCircle className="mt-0.5 h-4 w-4 text-amber-400" />}
            <div>
              <p>{result.passed ? "Provider contract passed." : "Gemini responded, but validation failed."}</p>
              <p className="text-xs text-muted-foreground">{result.candidateTitle || "No candidate"} · ${result.estimatedCostUsd.toFixed(5)}</p>
              {result.problems.length > 0 && <p className="mt-1 text-xs text-amber-300">{result.problems[0]}</p>}
            </div>
          </div>
        )}
        {result?.brief && (
          <details className="rounded-lg border border-border/70 p-3 text-xs">
            <summary className="cursor-pointer font-medium">Lean planner brief</summary>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-muted-foreground">{JSON.stringify(result.brief, null, 2)}</pre>
          </details>
        )}
        {result && result.references.length > 0 && (
          <details className="rounded-lg border border-border/70 p-3 text-xs">
            <summary className="cursor-pointer font-medium">Selected authored craft fragments ({result.references.length})</summary>
            <div className="mt-3 space-y-3 text-muted-foreground">
              {result.references.map((reference) => <div key={reference.id}><p className="font-mono text-foreground">{reference.id}</p><p className="mt-1 whitespace-pre-wrap">{reference.prompt}</p></div>)}
            </div>
          </details>
        )}
        {result?.compiledOutput?.frames && (
          <div className="grid gap-3 md:grid-cols-2">
            {result.compiledOutput.frames.map((frame, index) => {
              const capture = result.captureOutput?.frames?.[index]?.capturePrompt ?? "";
              return <div key={frame.frameId} className="rounded-lg border border-border/70 p-3 text-xs">
                <p className="font-medium">{frame.frameId} · {capture.length} creative chars · {frame.prompt.length} compiled chars</p>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground"><strong className="text-foreground">Gemini:</strong> {capture}</p>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground"><strong className="text-foreground">Fal:</strong> {frame.prompt}</p>
              </div>;
            })}
          </div>
        )}
        {result && result.warnings.length > 0 && <p className="text-xs text-amber-300">Warning only: {result.warnings.join(" · ")}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}
