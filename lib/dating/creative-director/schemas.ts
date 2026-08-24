import { z } from "zod";

import { EXCLUDABLE_TAGS, INTEREST_IDS } from "@/lib/dating/types";

export const DATING_CREATIVE_MODEL = "gemini-3.7-flash" as const;
export const DATING_CREATIVE_THINKING_LEVEL = "low" as const;
export const PORTFOLIO_SYSTEM_VERSION = "dating-portfolio-director-v1" as const;
export const SHOOT_WRITER_SYSTEM_VERSION = "dating-shoot-writer-v6" as const;

const conciseText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

export const customerCreativeInputSchema = z.object({
  interests: z.array(z.enum(INTEREST_IDS)).min(1).max(6),
  exclusions: z.array(z.enum(EXCLUDABLE_TAGS)).max(EXCLUDABLE_TAGS.length),
}).strict();

export const photographicProvenanceSchema = z.object({
  occasion: conciseText(8, 240),
  whyHeIsThere: conciseText(12, 320),
  photographerRelationship: conciseText(8, 180),
  whyThePhotoWasTaken: conciseText(12, 320),
  socialContext: conciseText(8, 240),
}).strict();

export const sceneBibleSchema = z.object({
  location: conciseText(10, 280),
  shootingZone: conciseText(10, 280),
  immutableFacts: z.array(conciseText(5, 180)).min(2).max(6),
  portableProps: z.array(conciseText(2, 120)).max(2),
  outfit: conciseText(20, 360),
  wardrobeContinuity: conciseText(20, 360),
  light: conciseText(10, 280),
  cameraFreedom: conciseText(15, 320),
}).strict();

export const datingShootIntentSchema = z.object({
  candidateId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  title: conciseText(3, 80),
  representedInterests: z.array(z.enum(INTEREST_IDS)).max(3),
  canonicalSummary: conciseText(30, 700),
  noveltyFingerprint: conciseText(20, 500),
  provenance: photographicProvenanceSchema,
  sceneBible: sceneBibleSchema,
  creativeDirection: z.object({
    desirableMoment: conciseText(15, 360),
    datingValue: conciseText(12, 300),
    visualMood: conciseText(8, 240),
    fourFramePossibility: conciseText(25, 500),
    profileUse: conciseText(12, 300),
    formatGuidance: conciseText(12, 240),
  }).strict(),
  qualityProof: z.object({
    provenanceTest: conciseText(20, 400),
    datingDesirabilityTest: conciseText(20, 400),
    nonStagingTest: conciseText(20, 400),
    wardrobeLogic: conciseText(20, 400),
    continuityRiskAndPrevention: conciseText(25, 500),
    fourFrameDistinctness: conciseText(25, 500),
  }).strict(),
}).strict();

export const portfolioCandidateSchema = z.object({
  portfolioRationale: conciseText(20, 700),
  shoots: z.array(datingShootIntentSchema).min(1).max(40),
}).strict();

export const shootFrameSchema = z.object({
  frameId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80),
  roleLabel: conciseText(3, 80),
  moment: conciseText(15, 400),
  composition: conciseText(15, 400),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  isAnchor: z.boolean(),
  isProfileCandidate: z.boolean(),
  visibleSceneFacts: z.array(conciseText(5, 180)).min(1).max(6),
  visiblePortableProps: z.array(conciseText(2, 120)).max(2),
  prompt: conciseText(220, 4_500),
}).strict();

export const datingShootOutputSchema = z.object({
  scene: z.object({
    title: conciseText(3, 80),
    location: conciseText(10, 280),
    occasion: conciseText(8, 240),
    photographerProvenance: conciseText(15, 400),
    outfit: conciseText(20, 360),
    light: conciseText(10, 280),
    rationale: conciseText(20, 600),
  }).strict(),
  frames: z.array(shootFrameSchema).length(4),
}).strict();

export const PORTFOLIO_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["portfolioRationale", "shoots"],
  properties: {
    portfolioRationale: { type: "string" },
    shoots: {
      type: "array",
      minItems: 1,
      maxItems: 40,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "candidateId", "title", "representedInterests", "canonicalSummary",
          "noveltyFingerprint", "provenance", "sceneBible", "creativeDirection",
          "qualityProof",
        ],
        properties: {
          candidateId: { type: "string" },
          title: { type: "string" },
          representedInterests: {
            type: "array",
            maxItems: 3,
            items: { type: "string", enum: INTEREST_IDS },
          },
          canonicalSummary: { type: "string" },
          noveltyFingerprint: { type: "string" },
          provenance: {
            type: "object",
            additionalProperties: false,
            required: [
              "occasion", "whyHeIsThere", "photographerRelationship",
              "whyThePhotoWasTaken", "socialContext",
            ],
            properties: {
              occasion: { type: "string" },
              whyHeIsThere: { type: "string" },
              photographerRelationship: { type: "string" },
              whyThePhotoWasTaken: { type: "string" },
              socialContext: { type: "string" },
            },
          },
          sceneBible: {
            type: "object",
            additionalProperties: false,
            required: [
              "location", "shootingZone", "immutableFacts", "portableProps",
              "outfit", "wardrobeContinuity", "light", "cameraFreedom",
            ],
            properties: {
              location: { type: "string" },
              shootingZone: { type: "string" },
              immutableFacts: {
                type: "array", minItems: 2, maxItems: 6, items: { type: "string" },
              },
              portableProps: {
                type: "array", maxItems: 2, items: { type: "string" },
              },
              outfit: { type: "string" },
              wardrobeContinuity: { type: "string" },
              light: { type: "string" },
              cameraFreedom: { type: "string" },
            },
          },
          creativeDirection: {
            type: "object",
            additionalProperties: false,
            required: [
              "desirableMoment", "datingValue", "visualMood", "fourFramePossibility",
              "profileUse", "formatGuidance",
            ],
            properties: {
              desirableMoment: { type: "string" },
              datingValue: { type: "string" },
              visualMood: { type: "string" },
              fourFramePossibility: { type: "string" },
              profileUse: { type: "string" },
              formatGuidance: { type: "string" },
            },
          },
          qualityProof: {
            type: "object",
            additionalProperties: false,
            required: [
              "provenanceTest", "datingDesirabilityTest", "nonStagingTest",
              "wardrobeLogic", "continuityRiskAndPrevention", "fourFrameDistinctness",
            ],
            properties: {
              provenanceTest: { type: "string" },
              datingDesirabilityTest: { type: "string" },
              nonStagingTest: { type: "string" },
              wardrobeLogic: { type: "string" },
              continuityRiskAndPrevention: { type: "string" },
              fourFrameDistinctness: { type: "string" },
            },
          },
        },
      },
    },
  },
} as const;

export const SHOOT_OUTPUT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["scene", "frames"],
  properties: {
    scene: {
      type: "object",
      additionalProperties: false,
      required: [
        "title", "location", "occasion", "photographerProvenance", "outfit",
        "light", "rationale",
      ],
      properties: {
        title: { type: "string" },
        location: { type: "string" },
        occasion: { type: "string" },
        photographerProvenance: { type: "string" },
        outfit: { type: "string" },
        light: { type: "string" },
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
        required: [
          "frameId", "roleLabel", "moment", "composition", "width", "height",
          "isAnchor", "isProfileCandidate", "visibleSceneFacts",
          "visiblePortableProps", "prompt",
        ],
        properties: {
          frameId: { type: "string" },
          roleLabel: { type: "string" },
          moment: { type: "string" },
          composition: { type: "string" },
          width: { type: "integer" },
          height: { type: "integer" },
          isAnchor: { type: "boolean" },
          isProfileCandidate: { type: "boolean" },
          visibleSceneFacts: {
            type: "array", minItems: 1, maxItems: 6, items: { type: "string" },
          },
          visiblePortableProps: {
            type: "array", maxItems: 2, items: { type: "string" },
          },
          prompt: { type: "string" },
        },
      },
    },
  },
} as const;

export type CustomerCreativeInput = z.infer<typeof customerCreativeInputSchema>;
export type DatingShootIntent = z.infer<typeof datingShootIntentSchema>;
export type PortfolioCandidate = z.infer<typeof portfolioCandidateSchema>;
export type DatingShootOutput = z.infer<typeof datingShootOutputSchema>;
