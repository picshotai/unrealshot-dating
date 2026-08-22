"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DRESS_OPTIONS, EXCLUSION_CHIPS, INTEREST_CHIPS } from "@/lib/dating/interests";
import type { PromptLabInput } from "@/lib/dating/prompt-lab/schemas";
import type { ExcludableTag, InterestId, StylePref } from "@/lib/dating/types";
import { cn } from "@/lib/utils";

type Draft = Omit<PromptLabInput, "clientRequestId" | "parentRunId" | "revisionInstructions">;

const initialDraft: Draft = {
  interests: ["coffee"],
  dress: "casual",
  exclusions: [],
  kind: "auto",
  light: "auto",
};

export function PromptLabForm({ busy, onGenerate }: {
  busy: boolean;
  onGenerate: (input: PromptLabInput) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [error, setError] = useState<string | null>(null);

  function toggleInterest(id: InterestId) {
    setError(null);
    setDraft((current) => {
      const selected = current.interests.includes(id);
      if (!selected && current.interests.length >= 6) {
        setError("Choose up to six interests.");
        return current;
      }
      return {
        ...current,
        interests: selected ? current.interests.filter((value) => value !== id) : [...current.interests, id],
      };
    });
  }

  function toggleExclusion(id: ExcludableTag) {
    setDraft((current) => ({
      ...current,
      exclusions: current.exclusions.includes(id)
        ? current.exclusions.filter((value) => value !== id)
        : [...current.exclusions, id],
    }));
  }

  async function submit() {
    if (draft.interests.length < 1) {
      setError("Choose at least one interest.");
      return;
    }
    setError(null);
    await onGenerate({ ...draft, clientRequestId: crypto.randomUUID() });
  }

  return (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardTitle>Creative brief</CardTitle>
        <CardDescription>One click makes one Gemini call and one four-frame candidate.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-7">
        <section className="space-y-3">
          <Label>Interests <span className="text-muted-foreground">({draft.interests.length}/6)</span></Label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_CHIPS.map((chip) => {
              const active = draft.interests.includes(chip.id);
              return (
                <button key={chip.id} type="button" onClick={() => toggleInterest(chip.id)}
                  className={cn("rounded-full border px-3 py-1.5 text-sm transition", active ? "border-amber-400 bg-amber-400/15 text-amber-200" : "border-border hover:bg-muted")}
                  aria-pressed={active}>
                  {chip.emoji} {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <Label>Lead dress style</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {DRESS_OPTIONS.map((option) => (
              <button key={option.id} type="button"
                onClick={() => setDraft((current) => ({ ...current, dress: option.id as StylePref }))}
                className={cn("rounded-lg border p-3 text-left transition", draft.dress === option.id ? "border-amber-400 bg-amber-400/10" : "border-border hover:bg-muted")}
                aria-pressed={draft.dress === option.id}>
                <span className="block text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.hint}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <Label>Leave these out</Label>
          <div className="flex flex-wrap gap-2">
            {EXCLUSION_CHIPS.map((chip) => {
              const active = draft.exclusions.includes(chip.id);
              return (
                <button key={chip.id} type="button" onClick={() => toggleExclusion(chip.id)}
                  className={cn("rounded-full border px-3 py-1.5 text-sm transition", active ? "border-red-400 bg-red-400/10" : "border-border hover:bg-muted")}
                  aria-pressed={active}>
                  {chip.emoji} {chip.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <Label htmlFor="scene-direction">Optional scene direction</Label>
          <Textarea id="scene-direction" maxLength={500} rows={3}
            placeholder="Example: relaxed weekend morning near water. The system still applies every safety and dating-value rule."
            value={draft.sceneDirection ?? ""}
            onChange={(event) => setDraft((current) => ({ ...current, sceneDirection: event.target.value }))} />
        </section>

        <details className="rounded-lg border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium">Lab overrides</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="block text-muted-foreground">Shoot kind</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={draft.kind} onChange={(event) => setDraft((current) => ({ ...current, kind: event.target.value as Draft["kind"] }))}>
                <option value="auto">Automatic</option>
                {(["portrait", "home", "outdoors", "social", "activity"] as const).map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="block text-muted-foreground">Light</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3"
                value={draft.light} onChange={(event) => setDraft((current) => ({ ...current, light: event.target.value as Draft["light"] }))}>
                <option value="auto">Automatic</option>
                {(["window", "open-door", "overcast", "flash"] as const).map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>
        </details>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button className="w-full" size="lg" disabled={busy} onClick={submit}>
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {busy ? "Generating one shoot…" : "Generate one shoot"}
        </Button>
      </CardContent>
    </Card>
  );
}

