import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { platformGuides, platformLandings } from "../lib/platform-pages"

function collectText(value: unknown): string[] {
  if (typeof value === "string") return value.startsWith("http") ? [] : [value]
  if (Array.isArray(value)) return value.flatMap(collectText)
  if (value && typeof value === "object") return Object.values(value).flatMap(collectText)
  return []
}

function wordCount(value: unknown) {
  return collectText(value).join(" ").match(/[\p{L}\p{N}’'-]+/gu)?.length ?? 0
}

const landingPages = Object.values(platformLandings)
const guidePages = Object.values(platformGuides)
assert.equal(landingPages.length, 3)
assert.equal(guidePages.length, 3)

console.log(
  "Platform content depth:",
  [...landingPages, ...guidePages].map((page) => `${page.path}=${wordCount(page)}`).join(", "),
)

for (const page of landingPages) {
  assert.ok(wordCount(page) >= 1_000, `${page.path} is below 1,000 words`)
  assert.ok(page.problems.length >= 3, `${page.path} needs three problem statements`)
  assert.ok(page.differentiators.length >= 4, `${page.path} needs four product differentiators`)
  assert.ok(page.lineup.length >= 6, `${page.path} needs a complete lineup`)
  for (const item of page.lineup) {
    assert.doesNotMatch(item.explanation, /^(?:choose|add|use|show|start|finish)\b/i, `${page.path} delivery benefits must not read like scene-selection instructions`)
  }
  assert.ok(page.exampleSlugs.length >= 4, `${page.path} needs four product examples`)
  assert.ok(page.faqs.length >= 6, `${page.path} needs six visible FAQs`)
  assert.ok(page.sources.length >= 3, `${page.path} needs three first-party sources`)
  assert.equal(page.guidePath, `/guides/${page.app.toLowerCase()}-photos`)
  assert.match(`${page.answer} ${page.solutionIntro}`, /(?:not|do not|rather than).*(?:fixed|preset|catalog|select)/i, `${page.path} must explain that shoot ideas are not selectable presets`)
}

const landingCopy = collectText(landingPages).join(" ")
assert.doesNotMatch(landingCopy, /22 supported interests/i, "Platform landings must not frame interests as a finite shoot catalog")
assert.doesNotMatch(landingCopy, /algorithm|match-rate|not affiliated|verification outcome|cannot guarantee verification/i, "Platform landings must stay focused on product quality instead of defensive outcome language")
const landingTemplate = readFileSync("components/seo/PlatformLandingPage.tsx", "utf8")
assert.doesNotMatch(landingTemplate, /See this shoot type/i, "Profile roles must not link to fixed shoot types")
assert.doesNotMatch(landingTemplate, /A working lineup|Six different jobs/i, "Product delivery section must not use abstract guide-style framing")
assert.match(landingTemplate, /Inside your 60-photo delivery/i, "Product delivery section must clearly identify what it explains")
assert.match(landingTemplate, /Open a complete four-photo shoot/i, "Example grid must explain the complete four-frame evidence it links to")
assert.doesNotMatch(landingTemplate, /not affiliated|No match|verification outcome|Illustrative AI-generated result|See the range your dating-photo delivery can cover/i, "Platform template must not lead with defensive trust language")

for (const page of guidePages) {
  assert.ok(wordCount(page) >= 1_300, `${page.path} is below 1,300 words`)
  assert.ok(page.sections.length >= 8, `${page.path} needs at least eight distinct sections`)
  assert.ok(page.checklist.length >= 10, `${page.path} needs a ten-point checklist`)
  assert.ok(page.faqs.length >= 5, `${page.path} needs five visible FAQs`)
  assert.ok(page.sources.length >= 3, `${page.path} needs three first-party sources`)
  assert.equal(page.productPath, `/dating-photos/${page.app.toLowerCase()}`)
}

const allPages = [...landingPages, ...guidePages]
assert.equal(new Set(allPages.map((page) => page.path)).size, allPages.length, "Platform paths must be unique")
assert.equal(new Set(allPages.map((page) => page.title)).size, allPages.length, "Platform titles must be unique")
assert.equal(new Set(allPages.map((page) => page.description)).size, allPages.length, "Platform descriptions must be unique")

const copy = collectText(allPages).join(" ")
for (const forbidden of [/guaranteed matches/i, /optimized for .*algorithm/i, /undetectable ai/i, /guaranteed verification/i]) {
  assert.equal(forbidden.test(copy), false, `Forbidden platform claim found: ${forbidden}`)
}

console.log(
  "Platform page checks passed:",
  landingPages.map((page) => `${page.app} landing ${wordCount(page)} words`).join(", "),
  "|",
  guidePages.map((page) => `${page.app} guide ${wordCount(page)} words`).join(", "),
)
