import type { PromptLabKind } from "@/lib/dating/prompt-lab/schemas";
import type { InterestId, StylePref } from "@/lib/dating/types";

const STYLE_INFLUENCE: Record<StylePref, string> = {
  casual: "Use a relaxed, clean silhouette and natural fabrics where the activity permits.",
  sharp: "Use refined fit, colour and materials where the activity permits; sharp never means officewear in a leisure or sport scene.",
  street: "Use a modern relaxed silhouette where the activity permits, while preserving the activity's required movement and footwear.",
};

const ACTIVITY_WARDROBE: Partial<Record<InterestId, string>> = {
  tennis: "Dress him as someone who is about to play: a fitted tennis polo or breathable performance top, tailored tennis shorts or tapered technical trousers, and proper court trainers. Exclude hoodies, cargo trousers, boots and fashion tailoring.",
  running: "Dress him for a relaxed run: a fitted performance tee or lightweight running layer, running shorts or tapered running trousers, and running shoes. Exclude lifestyle boots, heavy knits and fashion outerwear.",
  gym: "Dress him for a real training session: a fitted technical tee or training layer, tapered training trousers or athletic shorts, and training shoes. Exclude cargo trousers, boots, tailoring and bulky streetwear.",
  boxing: "Dress him for boxing practice: a fitted technical training top, boxing shorts or tapered training trousers, training shoes, and wraps only when the scene calls for them. Exclude coats, boots and tailoring.",
  climbing: "Dress him for indoor climbing: a breathable fitted tee, flexible climbing trousers and clean climbing or approach shoes. Exclude coats, boots, tailoring and restrictive layers.",
  golf: "Dress him for a relaxed round: a fitted polo or lightweight quarter-zip, tailored technical golf trousers and clean golf shoes. Exclude business suits and formal dress shoes.",
  sailing: "Dress him for a relaxed day sail: a fitted polo, light knit or technical wind layer, clean chinos or technical trousers, and deck shoes or low-profile trainers. Exclude business tailoring and heavy streetwear.",
  surfing: "Dress him for checking the water or returning from it: a clean fitted tee, light surf layer or practical overshirt, relaxed shorts or weather-appropriate trousers, and simple trainers or barefoot beach styling when credible.",
  hiking: "Dress him for an easy day hike: a fitted outdoor base layer, light weather layer, flexible hiking trousers and clean trail shoes. Exclude fashion tailoring and heavy urban footwear.",
  skiing: "Dress him for the snow route: a fitted ski layer, technical ski trousers, insulated ski jacket and credible snow footwear. Exclude city tailoring and casual canvas shoes.",
  football: "Dress him for a casual football game: a fitted training top, athletic shorts or tapered training trousers, and football or turf shoes. Exclude hoodies, cargo trousers, boots and fashion tailoring.",
  cycling: "Dress him for a relaxed ride: a fitted cycling or technical top, practical cycling shorts or tapered technical trousers, and cycling shoes or trainers. Exclude boots, tailoring and bulky fashion layers.",
};

export function resolveSceneWardrobe(args: {
  kind: PromptLabKind;
  representedInterest: InterestId | null;
  customerStyle: StylePref;
}): { register: StylePref; contract: string } {
  const register: StylePref =
    args.kind === "activity" || args.kind === "home"
      ? "casual"
      : args.kind === "outdoors" && args.customerStyle === "sharp"
        ? "casual"
        : args.customerStyle;

  const activityContract = args.representedInterest
    ? ACTIVITY_WARDROBE[args.representedInterest]
    : undefined;
  const base = args.kind === "activity"
    ? activityContract ??
      "Dress him for an attractive weekend walk: a well-fitted tee, knit or casual overshirt, clean tapered trousers and low-profile trainers. Exclude officewear, formal shoes and bulky fashion layers."
    : args.kind === "home"
      ? "Choose relaxed, polished home clothing that looks intentional enough for a dating profile: a clean knit, tee or overshirt with well-fitted casual trousers. Exclude sleepwear and office clothing."
      : "Choose understated, well-fitted clothing appropriate to the exact venue. Exclude visible logos, fake luxury and corporate uniform styling.";

  return {
    register,
    contract: `${base} ${STYLE_INFLUENCE[args.customerStyle]}`,
  };
}

const ACTIVITY_BASE = /\b(athletic|technical|performance|training|tennis|golf|cycling|ski|outdoor|breathable|polo|wind layer|trail)\b/i;
const ACTIVE_FOOTWEAR = /\b(trainers?|sneakers?|running shoes|court shoes|tennis shoes|golf shoes|trail shoes|approach shoes|cycling shoes|turf shoes|football boots|deck shoes|snow footwear)\b/i;
const ACTIVITY_MISMATCH = /\b(suit|blazer|tie|loafers|dress shoes|oxfords|turtleneck|wool overcoat|leather boots|cargo trousers|cargo pants)\b/i;
const COURT_MISMATCH = /\b(hoodie|sweatshirt|cargo trousers|cargo pants|boots|loafers|blazer|suit)\b/i;
const SPORT_INTERESTS = new Set<InterestId>([
  "tennis", "running", "gym", "boxing", "climbing", "golf", "sailing",
  "surfing", "hiking", "skiing", "football", "cycling",
]);

export function activityWardrobeProblems(args: {
  kind: PromptLabKind;
  representedInterest: InterestId | null;
  outfit: string;
}): string[] {
  if (
    args.kind !== "activity" ||
    !args.representedInterest ||
    !SPORT_INTERESTS.has(args.representedInterest)
  ) return [];
  const problems: string[] = [];
  if (!ACTIVITY_BASE.test(args.outfit)) {
    problems.push("activity outfit lacks a credible sport or movement-specific garment");
  }
  if (!ACTIVE_FOOTWEAR.test(args.outfit)) {
    problems.push("activity outfit lacks footwear appropriate to the named movement");
  }
  const mismatch = args.outfit.match(ACTIVITY_MISMATCH);
  if (mismatch) problems.push(`activity outfit contains incompatible ${mismatch[0]}`);
  if (args.representedInterest === "tennis") {
    const courtMismatch = args.outfit.match(COURT_MISMATCH);
    if (courtMismatch) {
      problems.push(`tennis-court outfit contains incompatible ${courtMismatch[0]}`);
    }
    if (!/\b(tennis|court|performance|technical|breathable|polo)\b/i.test(args.outfit)) {
      problems.push("tennis-court outfit must contain a tennis, court or performance-specific top");
    }
  }
  return problems;
}
