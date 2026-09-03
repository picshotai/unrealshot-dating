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
const limitingFraming = /one coherent scene|selectable preset|illustrative output|choose the .* frame|same .* stays consistent/i

for (const shoot of datingShoots) {
  const content = shootLandingContent[shoot.slug]
  assert.ok(content.seoTitle.length >= 35 && content.seoTitle.length <= 65, `${shoot.slug}: SEO title should be 35–65 characters`)
  assert.ok(content.seoDescription.length >= 110 && content.seoDescription.length <= 170, `${shoot.slug}: SEO description should be 110–170 characters`)
  assert.equal(content.pains.length, 3, `${shoot.slug}: needs three unique pain points`)
  assert.equal(content.benefits.length, 3, `${shoot.slug}: needs three product benefits`)
  assert.ok(content.faqs.length >= 2, `${shoot.slug}: needs scene-specific objections`)
  assert.ok(content.gallery.length >= 2, `${shoot.slug}: needs at least two relevant product images`)
  assert.ok(JSON.stringify(content).length >= 2500, `${shoot.slug}: commercial copy is too thin`)
  assert.equal(forbidden.test(JSON.stringify(content)), false, `${shoot.slug}: contains a forbidden product claim`)
  assert.equal(limitingFraming.test(JSON.stringify(content)), false, `${shoot.slug}: frames the product as a fixed or selectable scene`)
  for (const image of content.gallery) {
    assert.ok(image.alt.length >= 45, `${shoot.slug}: gallery image needs descriptive alt text`)
    assert.ok(image.caption.length >= 55, `${shoot.slug}: gallery image needs a useful caption`)
  }
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
const heroSource = readFileSync("components/seo/shoot-landing/ShootLandingHero.tsx", "utf8")
const shootPageSource = readFileSync("components/seo/ShootPage.tsx", "utf8")
assert.match(templateSource, /bg-\[#ff6f00\]/, "Commercial template must use the brand orange")
assert.match(templateSource, /Create my dating photos/, "Commercial template needs a direct product CTA")
assert.match(templateSource, /\$39/, "Commercial template must show the real package price")
assert.match(templateSource, /60 photos/, "Commercial template must explain the complete delivery")
assert.match(templateSource, /Photo Retakes/, "Commercial template must explain the correction path")
assert.doesNotMatch(heroSource, /bg-black|text-white sm:pb/, "Shoot hero must use the light landing-page treatment")
assert.doesNotMatch(heroSource, /shoot\.frames/, "Hero must not present the old mismatched frame registry")
assert.doesNotMatch(templateSource, /Illustrative AI-generated|illustrative results|one coherent scene/, "Public copy must not use defensive or false proof labels")
assert.doesNotMatch(shootPageSource, /<main className="pt-24">/, "The fixed navigation must overlay the hero instead of creating a separate strip")

console.log(`Shoot landing checks passed for ${datingShoots.length} commercial scene pages`)
