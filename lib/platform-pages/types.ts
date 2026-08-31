export type PlatformSource = { label: string; href: string }

export type PlatformFaq = { question: string; answer: string }

export type PlatformSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type PlatformLandingContent = {
  app: "Tinder" | "Hinge" | "Bumble"
  path: string
  eyebrow: string
  title: string
  description: string
  answer: string
  reviewed: string
  heroBullets: string[]
  problemIntro: string
  problems: Array<{ title: string; body: string }>
  solutionIntro: string
  differentiators: Array<{ title: string; body: string }>
  lineup: Array<{ slot: string; role: string; explanation: string; shootSlug?: string }>
  sections: PlatformSection[]
  exampleSlugs: string[]
  policy: string[]
  sources: PlatformSource[]
  faqs: PlatformFaq[]
  guidePath: string
  guideLabel: string
}

export type PlatformGuideContent = {
  app: "Tinder" | "Hinge" | "Bumble"
  path: string
  eyebrow: string
  title: string
  description: string
  answer: string
  reviewed: string
  quickFacts: Array<[string, string]>
  sections: PlatformSection[]
  checklist: string[]
  sources: PlatformSource[]
  faqs: PlatformFaq[]
  productPath: string
  productLabel: string
}
