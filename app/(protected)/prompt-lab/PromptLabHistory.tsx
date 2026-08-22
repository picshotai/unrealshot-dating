"use client";

import { ChevronDown, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PromptLabRun } from "@/lib/dating/prompt-lab/run-types";
import { promptLabOutputSchema } from "@/lib/dating/prompt-lab/schemas";
import { cn } from "@/lib/utils";

export function PromptLabHistory({ runs, selectedId, nextCursor, loading, onSelect, onMore }: {
  runs: PromptLabRun[];
  selectedId?: string;
  nextCursor: string | null;
  loading: boolean;
  onSelect: (run: PromptLabRun) => void;
  onMore: () => void;
}) {
  return (
    <Card className="h-fit lg:sticky lg:top-4">
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="size-4" /> Saved runs</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {runs.length === 0 && <p className="text-sm text-muted-foreground">Your generated attempts will appear here.</p>}
        {runs.map((run) => {
          const parsed = promptLabOutputSchema.safeParse(run.output);
          return (
            <button key={run.id} type="button" onClick={() => onSelect(run)}
              className={cn("w-full rounded-lg border p-3 text-left transition hover:bg-muted", selectedId === run.id ? "border-amber-400 bg-amber-400/5" : "border-border")}>
              <div className="flex items-start justify-between gap-2">
                <span className="line-clamp-2 text-sm font-medium">{parsed.success ? parsed.data.scene.title : run.status === "api_error" ? "API error" : "Invalid candidate"}</span>
                <Badge variant={run.status === "passed" ? "default" : run.status === "failed_validation" ? "secondary" : "destructive"} className="text-[10px]">{run.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(run.createdAt).toLocaleString()}</p>
              {run.parentRunId && <p className="mt-1 text-xs text-amber-300">Revision</p>}
            </button>
          );
        })}
        {nextCursor && <Button variant="ghost" className="w-full" disabled={loading} onClick={onMore}><ChevronDown />Load older runs</Button>}
      </CardContent>
    </Card>
  );
}

