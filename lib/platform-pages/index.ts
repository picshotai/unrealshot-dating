import { tinderGuide, tinderLanding } from "./tinder"
import { hingeGuide, hingeLanding } from "./hinge"
import { bumbleGuide, bumbleLanding } from "./bumble"
import type { PlatformGuideContent, PlatformLandingContent } from "./types"

export const platformLandings: Record<string, PlatformLandingContent> = {
  [tinderLanding.path]: tinderLanding,
  [hingeLanding.path]: hingeLanding,
  [bumbleLanding.path]: bumbleLanding,
}

export const platformGuides: Record<string, PlatformGuideContent> = {
  [tinderGuide.path]: tinderGuide,
  [hingeGuide.path]: hingeGuide,
  [bumbleGuide.path]: bumbleGuide,
}

export type { PlatformGuideContent, PlatformLandingContent } from "./types"
