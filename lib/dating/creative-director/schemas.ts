import { z } from "zod";

import { EXCLUDABLE_TAGS, INTEREST_IDS } from "@/lib/dating/types";

export const DATING_CREATIVE_MODEL = "gemini-3.7-flash" as const;
export const DATING_CREATIVE_THINKING_LEVEL = "low" as const;
export const PORTFOLIO_SYSTEM_VERSION = "dating-portfolio-director-v3" as const;
export const SHOOT_WRITER_SYSTEM_VERSION = "dating-shoot-writer-v7" as const;

const text = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

export const customerCreativeInputSchema = z.object({
  interests: z.array(z.enum(INTEREST_IDS)).min(1).max(6),
  exclusions: z.array(z.enum(EXCLUDABLE_TAGS)).max(EXCLUDABLE_TAGS.length),
}).strict();

/** A brief explains why a real photographic occasion exists, not four poses. */
export const datingShootIntentSchema = z.object({
  candidateId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  title: text(3, 80),
  representedInterests: z.array(z.enum(INTEREST_IDS)).max(3),
  noveltyFingerprint: text(30, 600),
  occasion: text(8, 240),
  whyHeIsThere: text(10, 300),
  photographerRelationship: text(5, 180),
  whyPhotoTaken: text(10, 300),
  centralMoment: text(10, 320),
  location: text(8, 240),
  shootingZone: text(8, 220),
  outfit: text(15, 320),
  light: text(8, 240),
  continuityEssentials: z.array(text(3, 160)).min(1).max(3),
  datingValue: text(10, 300),
  fourFrameOpportunity: text(15, 420),
}).strict();

export const portfolioCandidateSchema = z.object({
  shoots: z.array(datingShootIntentSchema).min(1).max(30),
}).strict();

export const cameraDistanceSchema = z.enum([
  "close", "chest-up", "waist-up", "three-quarter", "full-body", "environmental",
]);

export const shootWriterFrameSchema = z.object({
  frameId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  roleLabel: text(3, 80),
  moment: text(8, 320),
  cameraDistance: cameraDistanceSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  isAnchor: z.boolean(),
  isProfileCandidate: z.boolean(),
  capturePrompt: z.string().trim().min(1).max(1_600),
}).strict();

/** Provider output: capture instructions only, without repeated boilerplate. */
export const shootWriterOutputSchema = z.object({
  title: text(3, 80),
  frames: z.array(shootWriterFrameSchema).length(4),
}).strict();

/** Persisted output consumed by photo materialization and Fal. */
export const datingShootOutputSchema = z.object({
  title: text(3, 80),
  frames: z.array(shootWriterFrameSchema.extend({
    prompt: z.string().trim().min(1).max(2_400),
  }).strict()).length(4),
}).strict();

const PORTFOLIO_FIELDS = [
  "candidateId", "title", "representedInterests", "noveltyFingerprint",
  "occasion", "whyHeIsThere", "photographerRelationship", "whyPhotoTaken",
  "centralMoment", "location", "shootingZone", "outfit", "light",
  "continuityEssentials", "datingValue", "fourFrameOpportunity",
] as const;

export function portfolioJsonSchema(candidateCount: number) {
  if (!Number.isInteger(candidateCount) || candidateCount < 1 || candidateCount > 30) {
    throw new Error("candidateCount must be an integer from 1 to 30.");
  }
  return {
    type: "object",
    additionalProperties: false,
    required: ["shoots"],
    properties: {
      shoots: {
        type: "array", minItems: candidateCount, maxItems: candidateCount,
        items: {
          type: "object", additionalProperties: false, required: PORTFOLIO_FIELDS,
          properties: {
            candidateId: { type: "string" },
            title: { type: "string" },
            representedInterests: { type: "array", maxItems: 3, items: { type: "string" } },
            noveltyFingerprint: { type: "string" },
            occasion: { type: "string" },
            whyHeIsThere: { type: "string" },
            photographerRelationship: { type: "string" },
            whyPhotoTaken: { type: "string" },
            centralMoment: { type: "string" },
            location: { type: "string" },
            shootingZone: { type: "string" },
            outfit: { type: "string" },
            light: { type: "string" },
            continuityEssentials: {
              type: "array", minItems: 1, maxItems: 3, items: { type: "string" },
            },
            datingValue: { type: "string" },
            fourFrameOpportunity: { type: "string" },
          },
        },
      },
    },
  } as const;
}

export function parsePortfolioTransport(value: unknown) {
  return portfolioCandidateSchema.safeParse(value);
}

export function portfolioCandidateToTransport(output: PortfolioCandidate) {
  return output;
}

export const SHOOT_OUTPUT_JSON_SCHEMA = {
  type: "object", additionalProperties: false, required: ["title", "frames"],
  properties: {
    title: { type: "string" },
    frames: {
      type: "array", minItems: 4, maxItems: 4,
      items: {
        type: "object", additionalProperties: false,
        required: [
          "frameId", "roleLabel", "moment", "cameraDistance", "width", "height",
          "isAnchor", "isProfileCandidate", "capturePrompt",
        ],
        properties: {
          frameId: { type: "string" }, roleLabel: { type: "string" },
          moment: { type: "string" },
          cameraDistance: {
            type: "string",
            enum: ["close", "chest-up", "waist-up", "three-quarter", "full-body", "environmental"],
          },
          width: { type: "integer" }, height: { type: "integer" },
          isAnchor: { type: "boolean" }, isProfileCandidate: { type: "boolean" },
          capturePrompt: { type: "string" },
        },
      },
    },
  },
} as const;

export function canonicalShootSummary(shoot: DatingShootIntent) {
  return [shoot.occasion, shoot.location, shoot.centralMoment, shoot.photographerRelationship].join(" | ");
}

export type CustomerCreativeInput = z.infer<typeof customerCreativeInputSchema>;
export type DatingShootIntent = z.infer<typeof datingShootIntentSchema>;
export type PortfolioCandidate = z.infer<typeof portfolioCandidateSchema>;
export type ShootWriterOutput = z.infer<typeof shootWriterOutputSchema>;
export type DatingShootOutput = z.infer<typeof datingShootOutputSchema>;
