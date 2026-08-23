import { z } from "zod";

import { EXCLUDABLE_TAGS, INTEREST_IDS } from "@/lib/dating/types";

export const PROMPT_LAB_MODEL = "gemini-3.7-flash" as const;
export const PROMPT_LAB_THINKING_LEVEL = "low" as const;
export const PROMPT_SYSTEM_VERSION = "dating-scene-v5" as const;

export const SHOOT_KINDS = ["portrait", "home", "outdoors", "social", "activity"] as const;
export const LIGHT_FAMILIES = ["window", "open-door", "overcast", "flash"] as const;
export const DATING_SIGNALS = ["warmth", "competence", "adventure", "social-ease"] as const;
export const DRESS_STYLES = ["casual", "sharp", "street"] as const;
export const RUN_STATUSES = ["running", "passed", "failed_validation", "api_error"] as const;
export const REVIEW_DECISIONS = ["unreviewed", "keep", "revise", "reject"] as const;
export const PROMPT_LAB_FRAMINGS = ["close", "medium", "threeQuarter", "expression"] as const;
export const ISSUE_TAGS = [
  "location",
  "dating-value",
  "pose",
  "outfit",
  "lighting",
  "consistency",
  "identity-risk",
  "props",
  "technical",
  "other",
] as const;

const optionalTrimmed = (maximum: number) =>
  z.string().trim().max(maximum).optional().transform((value) => value || undefined);

export const promptLabInputSchema = z.object({
  clientRequestId: z.string().uuid(),
  interests: z.array(z.enum(INTEREST_IDS)).min(1).max(6),
  dress: z.enum(DRESS_STYLES),
  exclusions: z.array(z.enum(EXCLUDABLE_TAGS)).max(EXCLUDABLE_TAGS.length).default([]),
  sceneDirection: optionalTrimmed(500),
  kind: z.union([z.literal("auto"), z.enum(SHOOT_KINDS)]).default("auto"),
  light: z.union([z.literal("auto"), z.enum(LIGHT_FAMILIES)]).default("auto"),
  parentRunId: z.string().uuid().optional(),
  revisionInstructions: optionalTrimmed(1_000),
}).strict().superRefine((value, context) => {
  if (value.parentRunId && !value.revisionInstructions) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["revisionInstructions"],
      message: "Tell the model what to fix when creating a revision.",
    });
  }
});

const frameNoteSchema = z.string().trim().max(2_000);

export const promptLabFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5).nullable().default(null),
  decision: z.enum(REVIEW_DECISIONS).default("unreviewed"),
  issueTags: z.array(z.enum(ISSUE_TAGS)).max(ISSUE_TAGS.length).default([]),
  notes: z.string().trim().max(4_000).default(""),
  frameNotes: z.object({
    close: frameNoteSchema.default(""),
    medium: frameNoteSchema.default(""),
    threeQuarter: frameNoteSchema.default(""),
    expression: frameNoteSchema.default(""),
  }).strict().default({ close: "", medium: "", threeQuarter: "", expression: "" }),
}).strict();

export const EMPTY_FEEDBACK: PromptLabFeedback = {
  rating: null,
  decision: "unreviewed",
  issueTags: [],
  notes: "",
  frameNotes: { close: "", medium: "", threeQuarter: "", expression: "" },
};

export const promptLabFrameSchema = z.object({
  framing: z.enum(PROMPT_LAB_FRAMINGS),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  prompt: z.string().trim().min(300).max(4_500),
}).strict();

export const promptLabOutputSchema = z.object({
  scene: z.object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(3).max(80),
    conceptFamily: z.string().trim().min(3).max(80),
    settingFamily: z.string().trim().min(3).max(80),
    datingSignal: z.enum(DATING_SIGNALS),
    location: z.string().trim().min(10).max(300),
    activity: z.string().trim().min(5).max(240),
    activityReason: z.string().trim().min(10).max(300),
    outfit: z.string().trim().min(20).max(350).transform((value) => value.replace(/\.+$/, "")),
    wardrobeState: z.union([
      z.literal(""),
      z.string().trim().min(20).max(350),
    ]).default(""),
    light: z.string().trim().min(10).max(280),
    environment: z.union([
      z.literal(""),
      z.string().trim().min(30).max(600),
    ]).default(""),
    environmentAnchors: z.union([
      z.tuple([]),
      z.array(z.string().trim().min(5).max(160)).min(2).max(3),
    ]).default([]),
    lightFamily: z.enum(LIGHT_FAMILIES),
    kind: z.enum(SHOOT_KINDS),
    register: z.enum(DRESS_STYLES),
    props: z.array(z.string().trim().min(2).max(120)).max(2),
    rationale: z.string().trim().min(20).max(500),
  }).strict(),
  frames: z.array(promptLabFrameSchema).length(4),
}).strict();

export const GEMINI_OUTPUT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["scene", "frames"],
  properties: {
    scene: {
      type: "object",
      additionalProperties: false,
      required: [
        "id", "title", "conceptFamily", "settingFamily", "datingSignal", "location",
        "activity", "activityReason", "outfit", "wardrobeState", "light", "environment",
        "environmentAnchors", "lightFamily", "kind",
        "register", "props", "rationale",
      ],
      properties: {
        id: { type: "string" },
        title: { type: "string" },
        conceptFamily: { type: "string" },
        settingFamily: { type: "string" },
        datingSignal: { type: "string", enum: DATING_SIGNALS },
        location: { type: "string" },
        activity: { type: "string" },
        activityReason: { type: "string" },
        outfit: { type: "string" },
        wardrobeState: { type: "string" },
        light: { type: "string" },
        environment: { type: "string" },
        environmentAnchors: {
          type: "array",
          minItems: 2,
          maxItems: 3,
          items: { type: "string" },
        },
        lightFamily: { type: "string", enum: LIGHT_FAMILIES },
        kind: { type: "string", enum: SHOOT_KINDS },
        register: { type: "string", enum: DRESS_STYLES },
        props: { type: "array", maxItems: 2, items: { type: "string" } },
        rationale: { type: "string" },
      },
    },
    frames: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["framing", "width", "height", "prompt"],
        properties: {
          framing: { type: "string", enum: PROMPT_LAB_FRAMINGS },
          width: { type: "integer" },
          height: { type: "integer" },
          prompt: { type: "string" },
        },
      },
    },
  },
} as const;

export type PromptLabInput = z.infer<typeof promptLabInputSchema>;
export type PromptLabFeedback = z.infer<typeof promptLabFeedbackSchema>;
export type PromptLabOutput = z.infer<typeof promptLabOutputSchema>;
export type PromptLabStatus = typeof RUN_STATUSES[number];
export type PromptLabKind = typeof SHOOT_KINDS[number];
export type PromptLabLight = typeof LIGHT_FAMILIES[number];

export type RecentScene = {
  id: string;
  title: string;
  conceptFamily: string;
  settingFamily: string;
  location: string;
  activity: string;
  lightFamily: PromptLabLight;
  kind: PromptLabKind;
};
