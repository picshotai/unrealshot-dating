import type { SupabaseClient } from "@supabase/supabase-js";

import type { Json } from "@/types/supabase";

import type { FinishPromptLabRun, PromptLabRepository, PromptLabRun, StartPromptLabRun } from "./run-types";
import { recentSceneFromRun } from "./service";
import { EMPTY_FEEDBACK, promptLabFeedbackSchema, type PromptLabStatus } from "./schemas";
import type { RecentScene } from "./schemas";

type Row = Record<string, unknown>;

function asJson(value: unknown): Json {
  return value as Json;
}

export function mapPromptLabRow(row: Row): PromptLabRun {
  const input = row.input as PromptLabRun["input"];
  const pricing = row.pricing_snapshot as PromptLabRun["pricingSnapshot"];
  const feedback = promptLabFeedbackSchema.safeParse(row.feedback);
  return {
    id: String(row.id),
    userId: String(row.user_id),
    clientRequestId: String(row.client_request_id),
    parentRunId: row.parent_run_id ? String(row.parent_run_id) : null,
    status: row.status as PromptLabStatus,
    model: String(row.model),
    thinkingLevel: String(row.thinking_level),
    promptSystemVersion: String(row.prompt_system_version),
    referenceShootId: String(row.reference_shoot_id),
    referenceEvidence: String(row.reference_evidence),
    input,
    output: row.output ?? null,
    validationErrors: Array.isArray(row.validation_errors) ? row.validation_errors.map(String) : [],
    sceneDensity: Array.isArray(row.scene_density) ? row.scene_density.map(String) : [],
    usage: {
      inputTokens: Number(row.input_tokens ?? 0),
      outputTokens: Number(row.output_tokens ?? 0),
      reasoningTokens: Number(row.reasoning_tokens ?? 0),
      totalTokens: Number(row.total_tokens ?? 0),
    },
    estimatedCostUsd: Number(row.estimated_cost_usd ?? 0),
    pricingSnapshot: pricing,
    feedback: feedback.success ? feedback.data : EMPTY_FEEDBACK,
    apiError: row.api_error ? String(row.api_error) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class SupabasePromptLabRepository implements PromptLabRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findByRequest(userId: string, clientRequestId: string) {
    const { data, error } = await this.client.from("prompt_lab_runs").select("*")
      .eq("user_id", userId).eq("client_request_id", clientRequestId).maybeSingle();
    if (error) throw error;
    return data ? mapPromptLabRow(data as Row) : null;
  }

  async findById(userId: string, id: string) {
    const { data, error } = await this.client.from("prompt_lab_runs").select("*")
      .eq("user_id", userId).eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapPromptLabRow(data as Row) : null;
  }

  async recentScenes(userId: string, limit: number): Promise<RecentScene[]> {
    const { data, error } = await this.client.from("prompt_lab_runs").select("*")
      .eq("user_id", userId).in("status", ["passed", "failed_validation"])
      .order("created_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? [])
      .map((row) => recentSceneFromRun(mapPromptLabRow(row as Row)))
      .filter((scene): scene is RecentScene => scene !== null);
  }

  async start(run: StartPromptLabRun) {
    const now = new Date().toISOString();
    const payload = {
      user_id: run.userId,
      client_request_id: run.clientRequestId,
      parent_run_id: run.parentRunId,
      status: run.status,
      model: run.model,
      thinking_level: run.thinkingLevel,
      prompt_system_version: run.promptSystemVersion,
      reference_shoot_id: run.referenceShootId,
      reference_evidence: run.referenceEvidence,
      input: asJson(run.input),
      pricing_snapshot: asJson(run.pricingSnapshot),
      feedback: asJson(run.feedback),
      updated_at: now,
    };
    const { data, error } = await this.client.from("prompt_lab_runs").insert(payload).select("*").single();
    if (!error && data) return { run: mapPromptLabRow(data as Row), inserted: true };
    if ((error as { code?: string } | null)?.code === "23505") {
      const existing = await this.findByRequest(run.userId, run.clientRequestId);
      if (existing) return { run: existing, inserted: false };
    }
    throw error ?? new Error("Failed to start prompt lab run.");
  }

  async finish(userId: string, id: string, patch: FinishPromptLabRun) {
    const { data, error } = await this.client.from("prompt_lab_runs").update({
      status: patch.status,
      output: asJson(patch.output),
      validation_errors: asJson(patch.validationErrors),
      scene_density: asJson(patch.sceneDensity),
      input_tokens: patch.usage.inputTokens,
      output_tokens: patch.usage.outputTokens,
      reasoning_tokens: patch.usage.reasoningTokens,
      total_tokens: patch.usage.totalTokens,
      estimated_cost_usd: patch.estimatedCostUsd,
      pricing_snapshot: asJson(patch.pricingSnapshot),
      api_error: patch.apiError,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId).eq("id", id).select("*").single();
    if (error || !data) throw error ?? new Error("Failed to finish prompt lab run.");
    return mapPromptLabRow(data as Row);
  }
}
