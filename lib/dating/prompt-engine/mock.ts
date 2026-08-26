import {
  type CreativeEmbeddingCall,
  type CreativeModelCall,
  type CustomerCreativeInput,
  type DatingShootIntent,
  portfolioCandidateToTransport,
} from "@/lib/dating/creative-director";

const usage = { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 };

/** Retained only for legacy tests; the v3 production pipeline never calls it. */
export const mockCreativeEmbeddingCall: CreativeEmbeddingCall = async (texts) => ({
  vectors: texts.map((text, index) => {
    const vector = Array.from({ length: 768 }, () => 0);
    vector[(index * 31 + text.length) % vector.length] = 1;
    return vector;
  }),
  billableCharacters: 0,
});

export function mockProductionModelCall(brief: DatingShootIntent): CreativeModelCall {
  return async () => ({
    text: JSON.stringify({
      title: brief.title,
      frames: [
        {
          frameId: "friend-notices-him",
          roleLabel: "Caught by a friend",
          moment: `His companion notices him during ${brief.centralMoment}.`,
          cameraDistance: "chest-up",
          width: 1728,
          height: 2304,
          isAnchor: true,
          isProfileCandidate: true,
          capturePrompt: `During ${brief.occasion}, his companion catches a chest-up photograph just after ${brief.centralMoment}; the turn of his shoulders follows the interruption instead of a pose, his mouth is relaxed and his face is clear. ${brief.light} falls naturally across real skin texture while ${brief.location} remains softly legible nearby. A 3:4 candid dating photograph with credible anatomy and unretouched fabric.`,
        },
        {
          frameId: "absorbed-in-the-moment",
          roleLabel: "In the moment",
          moment: `He returns his attention to ${brief.whyHeIsThere}.`,
          cameraDistance: "waist-up",
          width: 1728,
          height: 2304,
          isAnchor: false,
          isProfileCandidate: false,
          capturePrompt: `He has returned to ${brief.whyHeIsThere}, so his weight and gaze follow the real action rather than the camera. The companion photographs from a few steps to the side at waist-up distance; the changed angle is caused by moving around him, not rebuilding the scene. Preserve natural skin, fabric tension and ${brief.light}. A 3:4 observational photograph.`,
        },
        {
          frameId: "quiet-transition",
          roleLabel: "Between moments",
          moment: "A quiet transition opens a second point of view.",
          cameraDistance: "three-quarter",
          width: 1728,
          height: 2304,
          isAnchor: false,
          isProfileCandidate: false,
          capturePrompt: `In a quiet transition inside ${brief.shootingZone}, he shifts naturally before the next part of the occasion and the photographer steps back to include more of his body. His posture follows that movement and his expression stays neutral, with no clothing adjustment or performance for the lens. Keep the existing light and grounded textures. A 3:4 three-quarter candid photograph.`,
        },
        {
          frameId: "brief-reconnection",
          roleLabel: "Back to the companion",
          moment: "He reconnects briefly with the person taking the photograph.",
          cameraDistance: "close",
          width: 1728,
          height: 2304,
          isAnchor: false,
          isProfileCandidate: true,
          capturePrompt: `A comment from ${brief.photographerRelationship} brings his attention back for a brief close photograph, giving a different human beat without forcing laughter. His eyes respond first while his shoulders remain connected to what he was doing. Let ${brief.light} retain pores, fine hair and the real weave of ${brief.outfit}. A 3:4 close dating photograph.`,
        },
      ],
    }),
    usage,
    interactionId: null,
  });
}

export function mockPortfolioModelCall(input: CustomerCreativeInput): CreativeModelCall {
  return async (request) => {
    const match = request.contents.match(/Create exactly (\d+) original shoot concepts/);
    const count = Number(match?.[1] ?? 1);
    const mockSceneSignatures = [
      "corner cafe window morning newspaper pause",
      "apartment kitchen rain evening recipe tasting",
      "riverside footbridge overcast friend conversation",
      "neighborhood bookshop aisle afternoon discovery",
      "courtyard bench sunbreaks waiting for friends",
      "late tram platform city lights shared journey",
      "community tennis fence golden hour water break",
      "museum stair landing skylight quiet observation",
      "market flower stall weekend choosing a bunch",
      "record shop listening station tungsten browsing",
      "coastal overlook windbreak travel companion pause",
      "small dinner terrace dusk arriving before friends",
      "home sofa lamplight answering a familiar message",
      "park dog path morning stopping at the gate",
      "hotel arcade direct flash leaving a social night",
    ];
    const shoots = Array.from({ length: count }, (_, index) => {
      const interest = input.interests[index % input.interests.length];
      const number = index + 1;
      return {
        candidateId: `mock-life-moment-${number}`,
        title: `Real life moment ${number}`,
        representedInterests: index < input.interests.length ? [interest] : [],
        noveltyFingerprint: `${mockSceneSignatures[index % mockSceneSignatures.length]} ${interest} observational companion photograph`,
        occasion: `a relaxed personal outing number ${number}`,
        whyHeIsThere: `he is genuinely spending time on ${interest} as part of his normal week`,
        photographerRelationship: "a close friend sharing the occasion",
        whyPhotoTaken: "the friend noticed an attractive unforced moment worth remembering",
        centralMoment: `a believable lived ${interest} moment number ${number}`,
        location: `a contemporary neighborhood place number ${number}`,
        shootingZone: `one compact zone beside the main path number ${number}`,
        outfit: `a muted context-appropriate outfit chosen for ${interest}, with practical footwear and no visible logos`,
        light: `soft natural daylight specific to outing number ${number}`,
        continuityEssentials: [
          "the same complete outfit and fastening state",
          "the same nearby background geometry",
        ],
        datingValue: "shows an approachable real life and a specific conversation opening",
        fourFrameOpportunity: "the companion can photograph participation, a transition and two interpersonal reactions without changing the occasion",
      };
    });
    return {
      text: JSON.stringify(portfolioCandidateToTransport({ shoots })),
      usage,
      interactionId: null,
    };
  };
}
