import { z } from "zod";

import { EXCLUDABLE_TAGS, INTEREST_IDS } from "@/lib/dating/types";

export const DATING_CREATIVE_MODEL = "gemini-3.7-flash" as const;
export const DATING_CREATIVE_THINKING_LEVEL = "low" as const;
export const PORTFOLIO_SYSTEM_VERSION = "dating-portfolio-director-v2" as const;
export const SHOOT_WRITER_SYSTEM_VERSION = "dating-shoot-writer-v6" as const;

const conciseText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);
const diagnosticText = (minimum: number) => z.string().trim().min(minimum);

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
    provenanceTest: diagnosticText(20),
    datingDesirabilityTest: diagnosticText(20),
    nonStagingTest: diagnosticText(20),
    wardrobeLogic: diagnosticText(20),
    continuityRiskAndPrevention: diagnosticText(25),
    fourFrameDistinctness: diagnosticText(25),
  }).strict(),
}).strict();

export const portfolioCandidateSchema = z.object({
  portfolioRationale: diagnosticText(20),
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

const portfolioTransportShootSchema = z.object({
  candidateId: z.string(),
  title: z.string(),
  representedInterests: z.array(z.enum(INTEREST_IDS)).max(3),
  canonicalSummary: z.string(),
  noveltyFingerprint: z.string(),
  provenance: z.tuple([
    z.string(), z.string(), z.string(), z.string(), z.string(),
  ]),
  scene: z.tuple([
    z.string(), z.string(), z.string(), z.string(), z.string(), z.string(),
  ]),
  immutableFacts: z.array(z.string()).min(2).max(6),
  portableProps: z.array(z.string()).max(2),
  creativeDirection: z.tuple([
    z.string(), z.string(), z.string(), z.string(), z.string(), z.string(),
  ]),
  qualityProof: z.tuple([
    z.string(), z.string(), z.string(), z.string(), z.string(), z.string(),
  ]),
}).strict();

const portfolioTransportSchema = z.object({
  portfolioRationale: z.string(),
  shoots: z.array(portfolioTransportShootSchema).min(1).max(40),
}).strict();

const PORTFOLIO_REQUIRED_FIELDS = [
  "candidateId", "title", "representedInterests", "canonicalSummary",
  "noveltyFingerprint", "provenance", "scene", "immutableFacts",
  "portableProps", "creativeDirection", "qualityProof",
] as const;

function orderedTextArray(length: number, description: string) {
  return {
    type: "array",
    minItems: length,
    maxItems: length,
    items: { type: "string" },
    description,
  } as const;
}

/** A shallow provider contract avoids Gemini's deep-schema rejection limit. */
export function portfolioJsonSchema(candidateCount: number) {
  if (!Number.isInteger(candidateCount) || candidateCount < 1 || candidateCount > 40) {
    throw new Error("candidateCount must be an integer from 1 to 40.");
  }
  return {
    type: "object",
    additionalProperties: false,
    required: ["portfolioRationale", "shoots"],
    properties: {
      portfolioRationale: { type: "string" },
      shoots: {
        type: "array",
        minItems: candidateCount,
        maxItems: candidateCount,
        items: {
          type: "object",
          additionalProperties: false,
          required: PORTFOLIO_REQUIRED_FIELDS,
          properties: {
            candidateId: { type: "string" },
            title: { type: "string" },
            representedInterests: {
              type: "array", maxItems: 3,
              // Keep the provider schema below Gemini's undocumented
              // complexity threshold. The transport Zod schema still enforces
              // the complete INTEREST_IDS enum before any candidate is used.
              items: { type: "string" },
            },
            canonicalSummary: { type: "string" },
            noveltyFingerprint: { type: "string" },
            provenance: orderedTextArray(
              5,
              "Exact order: occasion; why he is there; photographer relationship; why the photo was taken; social context."
            ),
            scene: orderedTextArray(
              6,
              "Exact order: location; shooting zone; outfit; wardrobe continuity; light; camera freedom."
            ),
            immutableFacts: {
              type: "array", minItems: 2, maxItems: 6, items: { type: "string" },
            },
            portableProps: {
              type: "array", maxItems: 2, items: { type: "string" },
            },
            creativeDirection: orderedTextArray(
              6,
              "Exact order: desirable moment; dating value; visual mood; four-frame possibility; profile use; format guidance."
            ),
            qualityProof: orderedTextArray(
              6,
              "Exact order: provenance test; dating desirability test; non-staging test; wardrobe logic; continuity risk and prevention; four-frame distinctness."
            ),
          },
        },
      },
    },
  } as const;
}

/** Rehydrate the rich internal domain object without weakening its Zod rules. */
export function parsePortfolioTransport(value: unknown) {
  const parsed = portfolioTransportSchema.safeParse(value);
  if (!parsed.success) return parsed;
  return portfolioCandidateSchema.safeParse({
    portfolioRationale: parsed.data.portfolioRationale,
    shoots: parsed.data.shoots.map((shoot) => ({
      candidateId: shoot.candidateId,
      title: shoot.title,
      representedInterests: shoot.representedInterests,
      canonicalSummary: shoot.canonicalSummary,
      noveltyFingerprint: shoot.noveltyFingerprint,
      provenance: {
        occasion: shoot.provenance[0],
        whyHeIsThere: shoot.provenance[1],
        photographerRelationship: shoot.provenance[2],
        whyThePhotoWasTaken: shoot.provenance[3],
        socialContext: shoot.provenance[4],
      },
      sceneBible: {
        location: shoot.scene[0],
        shootingZone: shoot.scene[1],
        immutableFacts: shoot.immutableFacts,
        portableProps: shoot.portableProps,
        outfit: shoot.scene[2],
        wardrobeContinuity: shoot.scene[3],
        light: shoot.scene[4],
        cameraFreedom: shoot.scene[5],
      },
      creativeDirection: {
        desirableMoment: shoot.creativeDirection[0],
        datingValue: shoot.creativeDirection[1],
        visualMood: shoot.creativeDirection[2],
        fourFramePossibility: shoot.creativeDirection[3],
        profileUse: shoot.creativeDirection[4],
        formatGuidance: shoot.creativeDirection[5],
      },
      qualityProof: {
        provenanceTest: shoot.qualityProof[0],
        datingDesirabilityTest: shoot.qualityProof[1],
        nonStagingTest: shoot.qualityProof[2],
        wardrobeLogic: shoot.qualityProof[3],
        continuityRiskAndPrevention: shoot.qualityProof[4],
        fourFrameDistinctness: shoot.qualityProof[5],
      },
    })),
  });
}

export function portfolioCandidateToTransport(output: PortfolioCandidate) {
  return {
    portfolioRationale: output.portfolioRationale,
    shoots: output.shoots.map((shoot) => ({
      candidateId: shoot.candidateId,
      title: shoot.title,
      representedInterests: shoot.representedInterests,
      canonicalSummary: shoot.canonicalSummary,
      noveltyFingerprint: shoot.noveltyFingerprint,
      provenance: [
        shoot.provenance.occasion,
        shoot.provenance.whyHeIsThere,
        shoot.provenance.photographerRelationship,
        shoot.provenance.whyThePhotoWasTaken,
        shoot.provenance.socialContext,
      ],
      scene: [
        shoot.sceneBible.location,
        shoot.sceneBible.shootingZone,
        shoot.sceneBible.outfit,
        shoot.sceneBible.wardrobeContinuity,
        shoot.sceneBible.light,
        shoot.sceneBible.cameraFreedom,
      ],
      immutableFacts: shoot.sceneBible.immutableFacts,
      portableProps: shoot.sceneBible.portableProps,
      creativeDirection: [
        shoot.creativeDirection.desirableMoment,
        shoot.creativeDirection.datingValue,
        shoot.creativeDirection.visualMood,
        shoot.creativeDirection.fourFramePossibility,
        shoot.creativeDirection.profileUse,
        shoot.creativeDirection.formatGuidance,
      ],
      qualityProof: [
        shoot.qualityProof.provenanceTest,
        shoot.qualityProof.datingDesirabilityTest,
        shoot.qualityProof.nonStagingTest,
        shoot.qualityProof.wardrobeLogic,
        shoot.qualityProof.continuityRiskAndPrevention,
        shoot.qualityProof.fourFrameDistinctness,
      ],
    })),
  };
}

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
