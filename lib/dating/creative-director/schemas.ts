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

const portfolioTransportShootSchema = z.object({
  candidateId: z.string(),
  title: z.string(),
  representedInterests: z.array(z.enum(INTEREST_IDS)).max(3),
  canonicalSummary: z.string(),
  noveltyFingerprint: z.string(),
  provenanceOccasion: z.string(),
  provenanceWhyHeIsThere: z.string(),
  provenancePhotographerRelationship: z.string(),
  provenanceWhyThePhotoWasTaken: z.string(),
  provenanceSocialContext: z.string(),
  sceneLocation: z.string(),
  sceneShootingZone: z.string(),
  sceneImmutableFacts: z.array(z.string()).min(2).max(6),
  scenePortableProps: z.array(z.string()).max(2),
  sceneOutfit: z.string(),
  sceneWardrobeContinuity: z.string(),
  sceneLight: z.string(),
  sceneCameraFreedom: z.string(),
  creativeDesirableMoment: z.string(),
  creativeDatingValue: z.string(),
  creativeVisualMood: z.string(),
  creativeFourFramePossibility: z.string(),
  creativeProfileUse: z.string(),
  creativeFormatGuidance: z.string(),
  proofProvenance: z.string(),
  proofDatingDesirability: z.string(),
  proofNonStaging: z.string(),
  proofWardrobeLogic: z.string(),
  proofContinuityRiskAndPrevention: z.string(),
  proofFourFrameDistinctness: z.string(),
}).strict();

const portfolioTransportSchema = z.object({
  portfolioRationale: z.string(),
  shoots: z.array(portfolioTransportShootSchema).min(1).max(40),
}).strict();

const PORTFOLIO_STRING_FIELDS = [
  "candidateId", "title", "canonicalSummary", "noveltyFingerprint",
  "provenanceOccasion", "provenanceWhyHeIsThere",
  "provenancePhotographerRelationship", "provenanceWhyThePhotoWasTaken",
  "provenanceSocialContext", "sceneLocation", "sceneShootingZone",
  "sceneOutfit", "sceneWardrobeContinuity", "sceneLight", "sceneCameraFreedom",
  "creativeDesirableMoment", "creativeDatingValue", "creativeVisualMood",
  "creativeFourFramePossibility", "creativeProfileUse", "creativeFormatGuidance",
  "proofProvenance", "proofDatingDesirability", "proofNonStaging",
  "proofWardrobeLogic", "proofContinuityRiskAndPrevention",
  "proofFourFrameDistinctness",
] as const;

const PORTFOLIO_REQUIRED_FIELDS = [
  ...PORTFOLIO_STRING_FIELDS,
  "representedInterests", "sceneImmutableFacts", "scenePortableProps",
] as const;

/** A shallow provider contract avoids Gemini's deep-schema rejection limit. */
export function portfolioJsonSchema(candidateCount: number) {
  if (!Number.isInteger(candidateCount) || candidateCount < 1 || candidateCount > 40) {
    throw new Error("candidateCount must be an integer from 1 to 40.");
  }
  const stringProperties = Object.fromEntries(
    PORTFOLIO_STRING_FIELDS.map((field) => [field, { type: "string" }])
  );
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
            ...stringProperties,
            representedInterests: {
              type: "array", maxItems: 3,
              items: { type: "string", enum: INTEREST_IDS },
            },
            sceneImmutableFacts: {
              type: "array", minItems: 2, maxItems: 6, items: { type: "string" },
            },
            scenePortableProps: {
              type: "array", maxItems: 2, items: { type: "string" },
            },
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
        occasion: shoot.provenanceOccasion,
        whyHeIsThere: shoot.provenanceWhyHeIsThere,
        photographerRelationship: shoot.provenancePhotographerRelationship,
        whyThePhotoWasTaken: shoot.provenanceWhyThePhotoWasTaken,
        socialContext: shoot.provenanceSocialContext,
      },
      sceneBible: {
        location: shoot.sceneLocation,
        shootingZone: shoot.sceneShootingZone,
        immutableFacts: shoot.sceneImmutableFacts,
        portableProps: shoot.scenePortableProps,
        outfit: shoot.sceneOutfit,
        wardrobeContinuity: shoot.sceneWardrobeContinuity,
        light: shoot.sceneLight,
        cameraFreedom: shoot.sceneCameraFreedom,
      },
      creativeDirection: {
        desirableMoment: shoot.creativeDesirableMoment,
        datingValue: shoot.creativeDatingValue,
        visualMood: shoot.creativeVisualMood,
        fourFramePossibility: shoot.creativeFourFramePossibility,
        profileUse: shoot.creativeProfileUse,
        formatGuidance: shoot.creativeFormatGuidance,
      },
      qualityProof: {
        provenanceTest: shoot.proofProvenance,
        datingDesirabilityTest: shoot.proofDatingDesirability,
        nonStagingTest: shoot.proofNonStaging,
        wardrobeLogic: shoot.proofWardrobeLogic,
        continuityRiskAndPrevention: shoot.proofContinuityRiskAndPrevention,
        fourFrameDistinctness: shoot.proofFourFrameDistinctness,
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
      provenanceOccasion: shoot.provenance.occasion,
      provenanceWhyHeIsThere: shoot.provenance.whyHeIsThere,
      provenancePhotographerRelationship: shoot.provenance.photographerRelationship,
      provenanceWhyThePhotoWasTaken: shoot.provenance.whyThePhotoWasTaken,
      provenanceSocialContext: shoot.provenance.socialContext,
      sceneLocation: shoot.sceneBible.location,
      sceneShootingZone: shoot.sceneBible.shootingZone,
      sceneImmutableFacts: shoot.sceneBible.immutableFacts,
      scenePortableProps: shoot.sceneBible.portableProps,
      sceneOutfit: shoot.sceneBible.outfit,
      sceneWardrobeContinuity: shoot.sceneBible.wardrobeContinuity,
      sceneLight: shoot.sceneBible.light,
      sceneCameraFreedom: shoot.sceneBible.cameraFreedom,
      creativeDesirableMoment: shoot.creativeDirection.desirableMoment,
      creativeDatingValue: shoot.creativeDirection.datingValue,
      creativeVisualMood: shoot.creativeDirection.visualMood,
      creativeFourFramePossibility: shoot.creativeDirection.fourFramePossibility,
      creativeProfileUse: shoot.creativeDirection.profileUse,
      creativeFormatGuidance: shoot.creativeDirection.formatGuidance,
      proofProvenance: shoot.qualityProof.provenanceTest,
      proofDatingDesirability: shoot.qualityProof.datingDesirabilityTest,
      proofNonStaging: shoot.qualityProof.nonStagingTest,
      proofWardrobeLogic: shoot.qualityProof.wardrobeLogic,
      proofContinuityRiskAndPrevention: shoot.qualityProof.continuityRiskAndPrevention,
      proofFourFrameDistinctness: shoot.qualityProof.fourFrameDistinctness,
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
