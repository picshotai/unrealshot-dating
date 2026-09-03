import type { PublishedPublicLocale } from "@/i18n/config"
import { datingShoots, type DatingShoot } from "./dating-shoot-content"
import { getShootLandingContent, type ShootLandingCopy, type ShootLandingFaq } from "./dating-shoot-landing-content"

export type ShootPageUiCopy = {
  heroBullets: [string, string, string, string]
  createPhotos: string
  seeExamples: string
  heroPanelLabel: string
  heroPanelDescription: (name: string) => string
  profileProblem: string
  whatChanges: string
  changesHeading: string
  changeBullets: [string, string, string, string]
  examplesEyebrow: string
  createdLabel: string
  deliveryNoteTitle: string
  deliveryNoteBody: string
  solvesEyebrow: string
  solvesDescription: string
  storyEyebrow: string
  storyHeading: string
  storyDescription: string
  storyFacts: [[string, string], [string, string], [string, string], [string, string]]
  detailsEyebrow: string
  detailsHeading: string
  detailsDescription: string
  detailsBullets: [string, string, string, string]
  detailsLink: string
  processEyebrow: string
  processHeading: string
  processDescription: string
  processSteps: [[string, string], [string, string], [string, string]]
  packageBadge: string
  packageHeading: string
  packageDescription: string
  packageBullets: [string, string, string, string, string, string]
  paymentEyebrow: string
  paymentSubtext: string
  startCta: string
  secureText: string
  moreEyebrow: string
  moreHeading: string
  moreDescription: string
  relatedLabel: string
  exploreRelated: string
  moreLink: string
  faqEyebrow: string
  faqTitle: (name: string) => string
  finalEyebrow: string
  finalHeading: string
  finalDescription: string
  finalCta: string
}

export type ShootTopic = {
  name: string
  keyword: string
  interest: string
  scene: string
  action: string
  clothing: string
  problem: string
  payoff: string
  balance: string
}

export type ShootLocalePack = {
  locale: Exclude<PublishedPublicLocale, "en">
  ui: ShootPageUiCopy
  topics: Record<string, ShootTopic>
  commonFaqs: ShootLandingFaq[]
  buildCopy: (base: ShootLandingCopy, topic: ShootTopic) => ShootLandingCopy
}

export type ShootCopyVoice = {
  seo: (topic: ShootTopic) => [string, string]
  hero: (topic: ShootTopic) => [string, string, string, string]
  pain: (topic: ShootTopic) => [string, string, [string, string][]]
  showcase: (topic: ShootTopic) => [string, string]
  benefits: (topic: ShootTopic) => [string, [string, string][]]
  selection: (topic: ShootTopic) => string
  gallery: (topic: ShootTopic, index: number) => [string, string]
  faqs: (topic: ShootTopic) => ShootLandingFaq[]
}

export type LocalizedShootPage = {
  shoot: DatingShoot
  copy: ShootLandingCopy
  ui: ShootPageUiCopy
  commonFaqs: ShootLandingFaq[]
}

export const commonShootFaqs: ShootLandingFaq[] = [
  { question: "Are the 15 photoshoots selected from a small fixed gallery?", answer: "No. UnrealShot creates 15 varied photoshoot ideas from your reference selfies and intake. The examples on these pages show part of the creative range, not the full set of ideas the product can produce." },
  { question: "What if one photo does not look enough like me?", answer: "Reference-guided generation can miss an individual likeness or composition. The package includes 15 individual Photo Retakes so you can retry specific weak frames." },
  { question: "How quickly are the dating photos delivered?", answer: "The complete package is delivered within 30 minutes after you finish the reference upload and intake process." },
]

export const englishShootUi: ShootPageUiCopy = {
  heroBullets: ["15 original photoshoot ideas", "Four connected photos per idea", "Delivered within 30 minutes", "$39 once · no subscription"],
  createPhotos: "Create my dating photos", seeExamples: "See photo examples", heroPanelLabel: "AI dating photos created with UnrealShot", heroPanelDescription: (name) => `${name} shows one part of the range your full delivery can cover.`,
  profileProblem: "The profile problem", whatChanges: "What UnrealShot changes", changesHeading: "Your camera roll no longer decides what your profile can show", changeBullets: ["4–6 current selfies guide your likeness", "Your intake adds real interests and preferences", "UnrealShot creates 15 varied photoshoot ideas", "Every idea includes four connected photos"],
  examplesEyebrow: "AI dating-photo examples", createdLabel: "Created with UnrealShot", deliveryNoteTitle: "Your delivery goes beyond the photos shown here.", deliveryNoteBody: "UnrealShot creates 15 original photoshoot ideas from your current selfies and intake, with four connected photos for every idea.",
  solvesEyebrow: "What this solves", solvesDescription: "The purpose is not to add more filler. It is to replace a weak or missing part of your camera roll with a photo that reveals something useful about you.",
  storyEyebrow: "One idea, four connected photos", storyHeading: "The first photo establishes the moment. The next three extend it.", storyDescription: "Instead of giving you four unrelated generations, each UnrealShot idea develops one visual story across useful changes in camera distance, action and expression.", storyFacts: [["Setting", "The location continues across the idea"], ["Clothing", "The outfit remains visually connected"], ["Light", "Time of day and light stay believable"], ["Variety", "Crop, action and expression give you options"]],
  detailsEyebrow: "Built from details about you", detailsHeading: "Your interests give every delivery a different starting point", detailsDescription: "Tell UnrealShot what genuinely belongs in your life and it can influence the ideas created for your delivery.", detailsBullets: ["4–6 current selfies guide your appearance", "Real interests influence the creative direction", "Your preferences add useful context", "15 varied ideas create range across the order"], detailsLink: "See how interests shape your photos",
  processEyebrow: "From selfies to finished photos", processHeading: "No photographer, scheduling or location setup", processDescription: "Complete one short intake from home. UnrealShot uses your references and real-interest choices to build a varied dating-photo delivery.", processSteps: [["Upload 4–6 current selfies", "Use clear solo photos from different angles so your current face, hair and facial hair are visible."], ["Tell us what fits your life", "Your interests and preferences give the creative system useful context for building ideas that feel personal rather than generic."], ["Receive your complete lineup", "Get 15 different shoots, 60 photos and 15 individual Photo Retakes within 30 minutes."]],
  packageBadge: "Complete dating photo package", packageHeading: "One order gives you a complete set—not one isolated image", packageDescription: "UnrealShot creates enough visual range to cover more than one side of your life. You receive indoor, outdoor, activity, casual, polished and candid possibilities shaped by the information you provide.", packageBullets: ["15 original photoshoot ideas", "Four connected photos per idea", "60 photos in total", "15 individual Photo Retakes", "Delivered within 30 minutes", "No subscription"],
  paymentEyebrow: "One-time payment", paymentSubtext: "Complete package · no recurring charge", startCta: "Start my dating shoot", secureText: "Secure checkout · delivery within 30 minutes",
  moreEyebrow: "More camera-roll problems UnrealShot can solve", moreHeading: "See more ways your delivery can create range", moreDescription: "Each page focuses on a different gap men commonly have in their existing photos. Together they show only part of what 15 original photoshoot ideas can cover.", relatedLabel: "AI dating photos created with UnrealShot", exploreRelated: "Explore this result", moreLink: "See more dating photo examples →",
  faqEyebrow: "Questions before you start", faqTitle: (name) => `${name} photo questions`, finalEyebrow: "Fill the gaps in your camera roll", finalHeading: "Create a complete dating-photo lineup", finalDescription: "15 different shoots · 60 photos · 15 Photo Retakes · delivered within 30 minutes · $39 once.", finalCta: "Create my dating photos",
}

function getEnglishPage(slug: string): LocalizedShootPage | undefined {
  const shoot = datingShoots.find((item) => item.slug === slug)
  const copy = shoot ? getShootLandingContent(slug) : undefined
  return shoot && copy ? { shoot, copy, ui: englishShootUi, commonFaqs: commonShootFaqs } : undefined
}

const packs: Partial<Record<Exclude<PublishedPublicLocale, "en">, ShootLocalePack>> = {}

export function buildLocalizedShootCopy(base: ShootLandingCopy, topic: ShootTopic, voice: ShootCopyVoice): ShootLandingCopy {
  const [seoTitle, seoDescription] = voice.seo(topic)
  const [eyebrow, heroTitle, heroAccent, heroDescription] = voice.hero(topic)
  const [painTitle, painDescription, painCards] = voice.pain(topic)
  const [showcaseTitle, showcaseDescription] = voice.showcase(topic)
  const [benefitsTitle, benefitCards] = voice.benefits(topic)
  const gallery = base.gallery.map((image, index) => {
    const [alt, caption] = voice.gallery(topic, index)
    return { ...image, alt, caption }
  }) as ShootLandingCopy["gallery"]

  return {
    ...base,
    seoTitle,
    seoDescription,
    eyebrow,
    heroTitle,
    heroAccent,
    heroDescription,
    gallery,
    painTitle,
    painDescription,
    pains: painCards.map(([title, body]) => ({ title, body })) as ShootLandingCopy["pains"],
    showcaseTitle,
    showcaseDescription,
    benefitsTitle,
    benefits: benefitCards.map(([title, body]) => ({ title, body })) as ShootLandingCopy["benefits"],
    selectionNote: voice.selection(topic),
    faqs: voice.faqs(topic),
  }
}

export function registerShootLocalePack(pack: ShootLocalePack) {
  packs[pack.locale] = pack
}

export function getLocalizedShootPage(slug: string, locale: PublishedPublicLocale): LocalizedShootPage | undefined {
  const base = getEnglishPage(slug)
  if (locale === "en" || !base) return base
  const pack = packs[locale]
  const topic = pack?.topics[slug]
  if (!pack || !topic) return base
  return { shoot: { ...base.shoot, name: topic.name }, copy: pack.buildCopy(base.copy, topic), ui: pack.ui, commonFaqs: pack.commonFaqs }
}

export function getLocalizedShootLandingContent(slug: string, locale: PublishedPublicLocale) {
  return getLocalizedShootPage(slug, locale)?.copy
}
