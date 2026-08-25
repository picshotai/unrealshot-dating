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
        <CardDescription>Owner-only. One click makes exactly one real portfolio-planner call. It creates no order, image, credit spend or retry.</CardDescription>
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
        {error && <p className="text-sm text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
}
