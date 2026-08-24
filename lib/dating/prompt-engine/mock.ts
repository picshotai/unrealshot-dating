import {
  ANCHOR_REFERENCE_SENTENCE,
  IDENTITY_SENTENCE,
  type CreativeModelCall,
  type CreativeEmbeddingCall,
  type CustomerCreativeInput,
  type DatingShootIntent,
} from "@/lib/dating/creative-director";

const usage = { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, totalTokens: 0 };

export const mockCreativeEmbeddingCall: CreativeEmbeddingCall = async (texts) => ({
  vectors: texts.map((text, index) => {
    const vector = Array.from({ length: 768 }, () => 0);
    vector[(index * 31 + text.length) % vector.length] = 1;
    return vector;
  }),
  billableCharacters: 0,
});

export function mockProductionModelCall(brief: DatingShootIntent): CreativeModelCall {
  return async () => {
    const facts = brief.sceneBible.immutableFacts;
    const prop = brief.sceneBible.portableProps[0];
    const shared = `${IDENTITY_SENTENCE} At ${brief.sceneBible.location}, remain inside ${brief.sceneBible.shootingZone}. He is wearing ${brief.sceneBible.outfit}. ${brief.sceneBible.wardrobeContinuity} ${brief.sceneBible.light}`;
    const frames = [
      {
        frameId: "arrival-context",
        roleLabel: "The arrival",
        moment: `He arrives naturally into ${brief.provenance.occasion} while the photographer notices the setting around him.`,
        composition: "A relaxed environmental portrait with enough space to establish the occasion without diminishing him.",
        isAnchor: true,
        isProfileCandidate: true,
      },
      {
        frameId: "mid-occasion",
        roleLabel: "In the moment",
        moment: `He becomes absorbed in the real reason he came: ${brief.provenance.whyHeIsThere}`,
        composition: "An observational portrait made from a naturally closer position as the occasion unfolds.",
        isAnchor: false,
        isProfileCandidate: false,
      },
      {
        frameId: "friend-noticed",
        roleLabel: "Caught by a friend",
        moment: `He briefly notices ${brief.provenance.photographerRelationship} without stopping the activity for a formal pose.`,
        composition: "A clear face-led portrait whose crop follows the spontaneous interaction rather than a preset distance.",
        isAnchor: false,
        isProfileCandidate: true,
      },
      {
        frameId: "leaving-beat",
        roleLabel: "Between moments",
        moment: `A quieter transition occurs after ${brief.creativeDirection.desirableMoment}, still inside the same occasion.`,
        composition: "An asymmetrical candid that preserves the established background while changing the human beat.",
        isAnchor: false,
        isProfileCandidate: false,
      },
    ].map((frame, index) => {
      const visibleFacts = frame.isAnchor ? [...facts] : [facts[index % facts.length]];
      const visibleProps = frame.isAnchor
        ? [...brief.sceneBible.portableProps]
        : prop && index === 1 ? [prop] : [];
      const anchorClause = frame.isAnchor ? "" : ` ${ANCHOR_REFERENCE_SENTENCE}`;
      const factsClause = visibleFacts.map((fact) => ` The visible fixed scene fact is: ${fact}.`).join("");
      const propClause = visibleProps.map((item) => ` The visible portable object is ${item}.`).join("");
      return {
        ...frame,
        width: 1728,
        height: 2304,
        visibleSceneFacts: visibleFacts,
        visiblePortableProps: visibleProps,
        prompt: `${shared}${anchorClause}${factsClause}${propClause} ${frame.moment} ${frame.composition} Make this a 3:4 realistic dating-profile photograph with natural skin texture, unretouched fabric, credible anatomy and no commercial catalogue staging.`,
      };
    });
    return {
      text: JSON.stringify({
        scene: {
          title: brief.title,
          location: brief.sceneBible.location,
          occasion: brief.provenance.occasion,
          photographerProvenance: `${brief.provenance.photographerRelationship} took these photographs because ${brief.provenance.whyThePhotoWasTaken}`,
          outfit: brief.sceneBible.outfit,
          light: brief.sceneBible.light,
          rationale: brief.creativeDirection.datingValue,
        },
        frames,
      }),
      usage,
    };
  };
}

export function mockPortfolioModelCall(input: CustomerCreativeInput): CreativeModelCall {
  return async (request) => {
    const match = request.contents.match(/Create exactly (\d+) candidate/);
    const count = Number(match?.[1] ?? 1);
    const shoots = Array.from({ length: count }, (_, index) => {
      const interest = input.interests[index % input.interests.length];
      const number = index + 1;
      return {
        candidateId: `mock-life-moment-${number}`,
        title: `Real life moment ${number}`,
        representedInterests: index < input.interests.length ? [interest] : [],
        canonicalSummary: `A distinct everyday occasion number ${number} showing ${interest} through a believable companion photograph in a unique neighborhood setting.`,
        noveltyFingerprint: `occasion${number} neighborhood${number} zone${number} friend${number} lived${number} ${interest}${number} daylight${number} treatment${number}`,
        provenance: {
          occasion: `a relaxed personal outing number ${number}`,
          whyHeIsThere: `he is genuinely spending time on ${interest} as part of his normal week`,
          photographerRelationship: "a close friend sharing the outing",
          whyThePhotoWasTaken: "the friend noticed a naturally attractive moment and wanted to remember it",
          socialContext: "an unforced part of an ordinary but desirable social life",
        },
        sceneBible: {
          location: `a contemporary neighborhood place number ${number}`,
          shootingZone: `one compact open-air zone beside the main path number ${number}`,
          immutableFacts: [`the pale stone edge number ${number}`, `the leafy background opening number ${number}`],
          portableProps: [],
          outfit: `a context-appropriate muted outfit selected specifically for the ${interest} occasion number ${number}, with clean practical footwear and no visible logos`,
          wardrobeContinuity: "Every layer, sleeve position, fastening, hem, shoe and accessory remains unchanged, with intact continuous fabric and no tears.",
          light: `soft natural daylight from open sky during outing number ${number}`,
          cameraFreedom: "the friend can move a few steps within the same zone without changing or rebuilding the background",
        },
        creativeDirection: {
          desirableMoment: `a believable lived ${interest} moment rather than a staged photoshoot`,
          datingValue: "shows an appealing real life, approachability and context without status theatre",
          visualMood: `natural contemporary warmth with variation number ${number}`,
          fourFramePossibility: "arrival, participation and interpersonal reactions can each occur naturally without adding objects or changing the place",
          profileUse: "includes at least one clear face-led dating photograph plus contextual evidence of a real life",
          formatGuidance: "3:4 should remain the default because the subject and nearby context fit comfortably together",
        },
        qualityProof: {
          provenanceTest: "A close friend is already sharing this outing and has a credible reason to notice and photograph him.",
          datingDesirabilityTest: "The scene reveals an approachable active life and gives a match a specific subject for conversation.",
          nonStagingTest: "His presence and action exist before the camera appears, so no prop or pose exists only for photography.",
          wardrobeLogic: `The practical muted outfit is chosen from the real demands of ${interest}, the weather and the location.`,
          continuityRiskAndPrevention: "Both fixed landmarks exist from the anchor onward, while later frames change only subject action and camera position.",
          fourFrameDistinctness: "Arrival, absorbed participation, brief friend interaction and a transition beat provide four causally different moments.",
        },
      };
    });
    return { text: JSON.stringify({ portfolioRationale: "Mock portfolio for zero-provider pipeline verification.", shoots }), usage };
  };
}
