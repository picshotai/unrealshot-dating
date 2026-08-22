import type { PricingSnapshot, PromptLabUsage } from "./cost";
import type { PromptLabPlan } from "./planner";
import type {
  PromptLabFeedback,
  PromptLabInput,
  PromptLabStatus,
  RecentScene,
} from "./schemas";

export type PromptLabRun = {
  id: string;
  userId: string;
  clientRequestId: string;
  parentRunId: string | null;
  status: PromptLabStatus;
  model: string;
  thinkingLevel: string;
  promptSystemVersion: string;
  referenceShootId: string;
  referenceEvidence: string;
  input: { request: PromptLabInput; plan: PromptLabPlan };
  output: unknown;
  validationErrors: string[];
  sceneDensity: string[];
  usage: PromptLabUsage;
  estimatedCostUsd: number;
  pricingSnapshot: PricingSnapshot;
  feedback: PromptLabFeedback;
  apiError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StartPromptLabRun = Omit<
  PromptLabRun,
  "id" | "output" | "validationErrors" | "sceneDensity" | "usage" |
  "estimatedCostUsd" | "apiError" | "createdAt" | "updatedAt"
>;

export type FinishPromptLabRun = Pick<
  PromptLabRun,
  "status" | "output" | "validationErrors" | "sceneDensity" | "usage" |
  "estimatedCostUsd" | "pricingSnapshot" | "apiError"
>;

export interface PromptLabRepository {
  findByRequest(userId: string, clientRequestId: string): Promise<PromptLabRun | null>;
  findById(userId: string, id: string): Promise<PromptLabRun | null>;
  recentScenes(userId: string, limit: number): Promise<RecentScene[]>;
  start(run: StartPromptLabRun): Promise<{ run: PromptLabRun; inserted: boolean }>;
  finish(userId: string, id: string, patch: FinishPromptLabRun): Promise<PromptLabRun>;
}

