export type ContentSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type AuthorityPageContent = {
  path: string
  eyebrow: string
  title: string
  description: string
  answer: string
  facts?: Array<[string, string]>
  sections: ContentSection[]
  sources?: Array<{ label: string; href: string }>
  reviewed?: string
  related: Array<{ label: string; href: string }>
}

const authorityPageCandidates: Record<string, AuthorityPageContent> = {
  "/how-it-works": {
    path: "/how-it-works",
    eyebrow: "The UnrealShot process",
    title: "How UnrealShot creates AI dating photos",
    description: "See how 4–6 selfies and three honest choices become 15 coherent four-photo dating shoots in about 30 minutes.",
    answer: "Upload 4–6 clear reference selfies, answer three questions about your preferred look and real interests, then receive 15 coherent shoots with four related frames each. UnrealShot uses your references to guide generation; it does not train a custom model. Delivery is guaranteed within 30 minutes.",
    facts: [["Input", "4–6 reference selfies"], ["Intake", "3 questions"], ["Output", "15 shoots / 60 photos"], ["Retakes", "15 individual photos"], ["Delivery", "Within 30 minutes"], ["Price", "$39 once"]],
    sections: [
      { heading: "1. Start with useful reference selfies", paragraphs: ["Use recent, unfiltered photos where your face is visible from more than one angle. Different expressions and ordinary lighting give the system more useful reference information than six nearly identical selfies."], bullets: ["Only you should appear in the reference photos.", "Avoid sunglasses, heavy filters, extreme crops and very old photos.", "A reference can be casual; it does not need studio lighting."] },
      { heading: "2. Answer three practical questions", paragraphs: ["The intake asks for your style direction, the kind of dating profile you are building and interests you actually have. Those answers guide the creative direction; they do not select named presets from a fixed shoot library. UnrealShot generates the final ideas for your delivery and does not claim to tailor photos to a dating-app algorithm."], bullets: ["Share only interests you would be comfortable discussing on a date.", "The final shoot ideas are generated rather than selected by name.", "Alcohol, dogs, bicycles and team sports are currently avoided."] },
      { heading: "3. Receive complete shoots, not disconnected pictures", paragraphs: ["Every shoot contains a close or opener frame, a half-body frame, a full-length frame and a candid or expressive frame. The outfit, place, lighting and visual story remain related across those four photos, so you can choose one strong frame or use multiple images without them feeling randomly assembled."] },
      { heading: "Retakes, privacy and honest limitations", paragraphs: ["The package includes 15 individual Photo Retakes. Use them when a frame misses your likeness, expression or preferred composition. Reference-guided generation can still produce a weak frame, and no service can promise perfect likeness in every output. UnrealShot does not guarantee matches, dates, app verification or acceptance by every platform."], bullets: ["Generated examples are labeled as AI-generated.", "Use photos to represent yourself accurately.", "See the Privacy Policy for current storage and deletion terms."] },
    ],
    related: [{ label: "See complete examples", href: "/dating-photos/examples" }, { label: "How realism works", href: "/realistic-ai-dating-photos" }, { label: "View pricing", href: "/pricing" }],
  },
  "/realistic-ai-dating-photos": {
    path: "/realistic-ai-dating-photos",
    eyebrow: "Realism methodology",
    title: "What makes an AI dating photo look realistic?",
    description: "Learn how coherent four-frame shoots, reference-guided likeness and ordinary camera choices create an authentic friend-taken look.",
    answer: "A realistic AI dating photo should look like a plausible moment in your life: recognizable face, ordinary camera distance, natural posture, believable light and a setting that fits your real interests. UnrealShot builds four related frames around one anchored scene so the result feels like a small photo session, not four unrelated generations.",
    facts: [["Method", "Reference-guided generation"], ["Unit", "4 related frames"], ["Consistency", "Place, outfit and light"], ["Look", "Candid and friend-taken"], ["People", "One-person scenes"], ["Correction", "15 Photo Retakes"]],
    sections: [
      { heading: "The first frame anchors the visual story", paragraphs: ["A shoot begins with a clear scene and appearance direction. The following frames vary crop, posture and expression while keeping the location, wardrobe and lighting logic coherent. This reduces the visual whiplash created by isolated prompts."] },
      { heading: "The friend-taken look is a camera language", paragraphs: ["The phrase means the image resembles a relaxed photo someone nearby could have taken. It does not mean a real friend took the picture. Eye-level viewpoints, modest background blur, imperfectly centered framing and actions that fit the setting usually feel more authentic than glossy studio poses."] },
      { heading: "Likeness depends on references", paragraphs: ["Clear, recent references from several angles help preserve recognizable features. Hair, facial hair, age, skin texture and face shape should remain plausible, but an individual frame can still miss. UnrealShot does not train a custom model and does not promise perfect likeness in every image."], bullets: ["Compare the whole face, not just one feature.", "Reject frames that change age, build or facial proportions.", "Use a Photo Retake when the scene is good but the likeness is not."] },
      { heading: "Realism is not about hiding AI", paragraphs: ["UnrealShot examples are labeled AI-generated. The goal is accurate, natural self-presentation—not bypassing app rules or making images ‘undetectable.’ Mix generated photos with current camera-roll photos and remove anything that suggests a hobby, trip or lifestyle that is not yours."] },
    ],
    related: [{ label: "How it works", href: "/how-it-works" }, { label: "Browse four-frame examples", href: "/dating-photos/examples" }, { label: "Build a complete lineup", href: "/dating-photos" }],
  },
  "/dating-photos/activity": {
    path: "/dating-photos/activity",
    eyebrow: "Real-interest photos",
    title: "Let your real interests guide varied AI dating-photo ideas",
    description: "Tell UnrealShot what genuinely belongs in your life so it can generate varied activity-photo ideas without using a fixed catalog of selectable shoot presets.",
    answer: "Activity photos work when they reveal something true and give someone an easy detail to respond to. Your intake interests guide UnrealShot’s creative direction, but they are not selectable presets and do not let you order an exact scene. The final ideas are generated for your delivery, with four related frames from each idea.",
    facts: [["Interests", "Creative-direction inputs"], ["Exact scenes", "Generated, not selected"], ["Frames per idea", "4 related options"], ["Current exclusions", "Alcohol, dogs, bicycles, team sports"]],
    sections: [
      { heading: "Your interests guide the creative direction", paragraphs: ["Your answers provide truthful signals about the activities and environments that may fit your life. UnrealShot uses those signals while creating the delivery, but an interest is not the name of one predetermined background, pose or outfit."] },
      { heading: "One interest can lead to many different creative ideas", paragraphs: ["A fitness signal could influence different indoor, outdoor, active or recovery-oriented concepts. A food interest could influence everyday, social or home-oriented ideas. The examples on this site demonstrate possibilities; they do not define the limits of what can be generated."] },
      { heading: "Why exact scenes are not selected or guaranteed", paragraphs: ["UnrealShot generates the final set as a varied delivery rather than asking you to assemble it from a catalog. You receive 15 shoot ideas with four related frames from each, then choose the accurate photos that work for your profile."] },
      { heading: "What UnrealShot currently avoids", paragraphs: ["The current system avoids alcohol, dogs, bicycles and team sports because those elements introduce identity, safety or realism problems it does not handle consistently enough. An excluded element is not silently replaced with a false claim about your life."] },
    ],
    related: [{ label: "Build a complete dating-photo lineup", href: "/dating-photos" }, { label: "See an illustrative generated concept", href: "/dating-photos/shoots/home-cooking" }, { label: "See possible UnrealShot results", href: "/dating-photos/examples" }],
  },
  "/dating-photos/tinder": {
    path: "/dating-photos/tinder",
    eyebrow: "App photo guide",
    title: "Dating photos for a clear, honest Tinder profile",
    description: "Build a varied Tinder photo lineup with a recognizable opener, useful crops and authentic activity photos—without algorithm claims.",
    answer: "For Tinder, lead with a recent solo photo where your face is immediately recognizable, then add full-length, activity and dressed-up context. Keep important details away from crop edges and use only photos that represent your current appearance and real life. UnrealShot is not affiliated with Tinder and does not optimize for its algorithm.",
    reviewed: "August 31, 2026",
    facts: [["Best opener", "Clear solo face photo"], ["Useful variety", "Face, full-length, activity, context"], ["Generated images", "Use honestly"], ["Affiliation", "None"]],
    sections: [
      { heading: "A practical Tinder photo order", paragraphs: ["Start with the easiest image to understand. Follow it with visual range rather than near-duplicates."], bullets: ["1. Clear close or chest-up solo opener", "2. Full-length photo with simple posture", "3. Real-interest activity photo", "4. Dressed-up dinner or city photo", "5. Relaxed candid or travel context"] },
      { heading: "Plan for crops and small screens", paragraphs: ["Keep your face and main action near the center, but avoid an unnaturally tight passport crop. A photo should still make sense when a phone interface trims part of the background."] },
      { heading: "Verification and accurate representation", paragraphs: ["Tinder’s current safety and verification information should be checked before publishing. Photo verification is Tinder’s decision; UnrealShot cannot guarantee approval. Do not use a generated frame that materially changes your age, body, face or lifestyle."], bullets: ["Use current reference selfies.", "Mix in recent camera-roll photos.", "Replace any frame that overstates where you have been or what you do."] },
    ],
    sources: [{ label: "Tinder Photo Verification", href: "https://www.help.tinder.com/hc/en-us/articles/4422771431309-Photo-Verification" }, { label: "Tinder Community Guidelines", href: "https://policies.tinder.com/community-guidelines/intl/en/" }],
    related: [{ label: "Dating photo pillar", href: "/dating-photos" }, { label: "City walk example", href: "/dating-photos/shoots/city-walk" }, { label: "AI photos and app rules", href: "/blog/ai-dating-photos-app-rules-and-photo-verification" }],
  },
  "/dating-photos/hinge": {
    path: "/dating-photos/hinge",
    eyebrow: "App photo guide",
    title: "Dating photos that work with a thoughtful Hinge profile",
    description: "Choose clear, varied Hinge photos that complement your prompts and represent your real appearance and interests.",
    answer: "A Hinge photo lineup should make your written prompts easier to believe and respond to. Use a recognizable solo opener, a full-length frame, one or two real-interest photos and relaxed context. Hinge currently supports profiles with four to six photos, depending on profile setup. UnrealShot is not affiliated with Hinge.",
    reviewed: "August 31, 2026",
    facts: [["Current photo range", "4–6 photos"], ["Best opener", "Recognizable solo portrait"], ["Role of activities", "Support real prompt answers"], ["Affiliation", "None"]],
    sections: [
      { heading: "Make photos and prompts tell the same story", paragraphs: ["If a prompt mentions Sunday cooking, a generated image reflecting a genuine home interest can add context and an easy opening question. If an output suggests something you never do, do not use it. The useful connection is between a real detail and a visible moment—not a manufactured persona."] },
      { heading: "A balanced Hinge lineup", paragraphs: ["Use the available slots to answer different visual questions."], bullets: ["What do you look like now?", "What is your full silhouette and everyday style?", "What do you genuinely enjoy doing?", "How do you look in a relaxed or dressed-up setting?", "What detail could someone ask you about?"] },
      { heading: "AI photos, misleading content and verification", paragraphs: ["Hinge prohibits AI-generated content used to deceive or mislead. Treat that as a firm boundary: keep your appearance and interests accurate, label examples when presenting them as product demonstrations, and never assume a generated photo will pass verification. UnrealShot offers no verification guarantee."] },
    ],
    sources: [{ label: "Hinge: Adding and Editing Photos", href: "https://help.hinge.co/hc/en-us/articles/36311675387155-Adding-and-Editing-Photos" }, { label: "Hinge Prohibited Content & Behavior", href: "https://help.hinge.co/hc/en-us/articles/42464295207187-Prohibited-Content-Behavior" }],
    related: [{ label: "Dating photo pillar", href: "/dating-photos" }, { label: "Home cooking example", href: "/dating-photos/shoots/home-cooking" }, { label: "How activity shoots work", href: "/dating-photos/activity" }],
  },
  "/dating-photos/bumble": {
    path: "/dating-photos/bumble",
    eyebrow: "App photo guide",
    title: "Authentic dating photos for a Bumble profile",
    description: "Plan a clear Bumble photo lineup while respecting authenticity, accurate representation and verification rules.",
    answer: "For Bumble, use a clear solo opener that shows your current face, then add full-length, activity and everyday context. Generated or enhanced photos must not be used deceptively. UnrealShot is not affiliated with Bumble, cannot guarantee verification and does not claim to optimize photos for Bumble’s algorithm.",
    reviewed: "August 31, 2026",
    facts: [["Priority", "Clear current appearance"], ["Useful range", "Portrait, full-length, activity, context"], ["Deceptive edits", "Do not use"], ["Affiliation", "None"]],
    sections: [
      { heading: "Start with clarity, then add personality", paragraphs: ["Your first image should not make someone search a group photo for you. Follow it with frames that add new information: your build, your normal style, a real interest and a relaxed expression."] },
      { heading: "Use activity scenes as evidence, not decoration", paragraphs: ["A coffee, cooking, gym or travel image should connect to something genuinely true about you. Avoid selecting a scene merely because it looks impressive. Accurate details make later conversations easier and keep the profile coherent."] },
      { heading: "Authenticity and verification boundaries", paragraphs: ["Bumble prohibits fake or misleading profiles and artificial or enhanced photos used deceptively. Use recent references, reject changes to defining features and retain recent camera-roll photos. Bumble controls its verification process; no photo generator can promise a successful result."] },
    ],
    sources: [{ label: "Bumble Inauthentic Profiles Policy", href: "https://bumble.com/guidelines/inauthentic-profiles" }, { label: "Bumble Community Guidelines", href: "https://bumble.com/guidelines" }],
    related: [{ label: "Dating photo pillar", href: "/dating-photos" }, { label: "Outdoor coffee example", href: "/dating-photos/shoots/outdoor-coffee" }, { label: "Realism methodology", href: "/realistic-ai-dating-photos" }],
  },
  "/contact": {
    path: "/contact",
    eyebrow: "Support",
    title: "Contact UnrealShot",
    description: "Contact UnrealShot about an order, Photo Retake, privacy request or product question.",
    answer: "Email UnrealShot at support@unrealshot.com for order help, Photo Retakes, privacy questions or product support. Include the email used for your order and a short description of the issue; do not email sensitive identity documents or payment-card details.",
    facts: [["Support email", "support@unrealshot.com"], ["Typical response", "Within 24 hours"], ["Product", "AI dating photography for men"], ["Operator", "UnrealShot"], ["Founder", "Harvansh Chaudhary"]],
    sections: [
      { heading: "What to include", paragraphs: ["Tell us which order or image needs attention and what outcome you expected. For a Photo Retake, identify the exact frame and whether the issue is likeness, expression, composition or scene accuracy."] },
      { heading: "Privacy and billing requests", paragraphs: ["For a privacy request, use the same email address associated with your account so ownership can be checked safely. Refund eligibility is explained in the Refund Policy. Never send passwords, full card numbers or identity documents by email."] },
      { heading: "About the operator", paragraphs: ["UnrealShot is an independent AI dating-photography product founded by Harvansh Chaudhary. It is not affiliated with Tinder, Hinge or Bumble."] },
    ],
    related: [{ label: "Privacy Policy", href: "/privacy-policy" }, { label: "Refund Policy", href: "/refund-policy" }, { label: "How It Works", href: "/how-it-works" }],
  },
}

const platformLandingPaths = new Set([
  "/dating-photos/tinder",
  "/dating-photos/hinge",
  "/dating-photos/bumble",
])

export const authorityPages = Object.fromEntries(
  Object.entries(authorityPageCandidates).filter(([path]) => !platformLandingPaths.has(path)),
) as Record<string, AuthorityPageContent>
