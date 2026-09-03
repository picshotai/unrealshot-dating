export type PlatformSource = { label: string; href: string }

export type PlatformFaq = { question: string; answer: string }

export type PlatformPageCopy = {
  landing: {
    home: string
    datingPhotos: string
    createPhotos: string
    seeExamples: string
    sampleCaption: string
    profileProblem: string
    profileProblemHeading: string
    solution: string
    solutionHeading: string
    deliveryEyebrow: string
    deliveryHeading: string
    builtFor: string
    builtHeading: string
    examplesHeading: string
    examplesDescription: string
    generatedLabel: string
    exploreExample: string
    requirementsHeading: string
    primarySources: string
    sourcesChecked: string
    faqHeading: string
    ctaEyebrow: string
    ctaHeading: string
    ctaDescription: string
  }
  guide: {
    home: string
    guides: string
    writtenReviewed: string
    atAGlance: string
    inThisGuide: string
    productDetails: string
    checklistHeading: string
    faqHeading: string
    officialSources: string
    sourceDescription: string
    ctaHeading: string
    ctaDescription: string
  }
}

export type PlatformSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type PlatformLandingContent = {
  app: "Tinder" | "Hinge" | "Bumble"
  copy: PlatformPageCopy
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
  deliveryPoints: Array<{ title: string; body: string }>
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
  copy: PlatformPageCopy
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
