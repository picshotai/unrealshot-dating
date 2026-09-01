import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { datingShoots } from "../lib/dating-shoot-content"
import { shootLandingContent } from "../lib/dating-shoot-landing-content"

const expectedSlugs = datingShoots.map((shoot) => shoot.slug).sort()
const contentSlugs = Object.keys(shootLandingContent).sort()
assert.deepEqual(contentSlugs, expectedSlugs, "Every published shoot must have one commercial landing-page definition")

const titles = new Set<string>()
const descriptions = new Set<string>()
const heroTitles = new Set<string>()
const forbidden = /algorithm optimization|guaranteed matches|guaranteed dates|verification success|undetectable|custom model training|high-converting/i

for (const shoot of datingShoots) {
  const content = shootLandingContent[shoot.slug]
  assert.ok(content.seoTitle.length >= 35 && content.seoTitle.length <= 65, `${shoot.slug}: SEO title should be 35–65 characters`)
  assert.ok(content.seoDescription.length >= 110 && content.seoDescription.length <= 170, `${shoot.slug}: SEO description should be 110–170 characters`)
  assert.equal(content.pains.length, 3, `${shoot.slug}: needs three unique pain points`)
  assert.equal(content.benefits.length, 3, `${shoot.slug}: needs three product benefits`)
  assert.ok(content.faqs.length >= 2, `${shoot.slug}: needs scene-specific objections`)
  assert.equal(forbidden.test(JSON.stringify(content)), false, `${shoot.slug}: contains a forbidden product claim`)
  assert.equal(titles.has(content.seoTitle), false, `${shoot.slug}: duplicate SEO title`)
  assert.equal(descriptions.has(content.seoDescription), false, `${shoot.slug}: duplicate SEO description`)
  assert.equal(heroTitles.has(content.heroTitle), false, `${shoot.slug}: duplicate hero framing`)
  titles.add(content.seoTitle)
  descriptions.add(content.seoDescription)
  heroTitles.add(content.heroTitle)
}

const templateFiles = [
  "components/seo/ShootPage.tsx",
  "components/seo/shoot-landing/ShootLandingHero.tsx",
  "components/seo/shoot-landing/ShootPainSolution.tsx",
  "components/seo/shoot-landing/ShootResultsShowcase.tsx",
  "components/seo/shoot-landing/ShootConversionSections.tsx",
]
const templateSource = templateFiles.map((path) => readFileSync(path, "utf8")).join("\n")
assert.match(templateSource, /bg-\[#ff6f00\]/, "Commercial template must use the brand orange")
assert.match(templateSource, /Create my dating photos/, "Commercial template needs a direct product CTA")
assert.match(templateSource, /\$39/, "Commercial template must show the real package price")
assert.match(templateSource, /60 photos/, "Commercial template must explain the complete delivery")
assert.match(templateSource, /Photo Retakes/, "Commercial template must explain the correction path")

console.log(`Shoot landing checks passed for ${datingShoots.length} commercial scene pages`)
