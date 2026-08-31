import type { WordPressPost } from "@/lib/wordpress-cms"

type EditorialArticle = {
  slug: string
  title: string
  description: string
  image: string
  sections: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>
  sources?: Array<{ label: string; href: string }>
  adjacent: { label: string; href: string }
}

export const editorialArticles: EditorialArticle[] = [
  {
    slug: "7-common-dating-profile-photo-mistakes-and-how-ai-fixes-them",
    title: "7 Common Dating Profile Photo Mistakes—and What AI Can Actually Fix",
    description: "The most common dating-photo problems are unclear identity, repetition, weak framing, outdated images, missing full-length context, invented interests and over-editing. AI can help with variety and composition, but it cannot make dishonest photos acceptable.",
    image: "/new-landing/8cf00013ec6f459f986d903e2c55b6bd.jpg",
    sections: [
      { heading: "1. Your face is hard to identify", paragraphs: ["A distant opener, sunglasses or a group photo makes the first task unnecessarily difficult. Start with a current solo image where the eyes, face shape and hair are easy to see. AI can produce a clearer crop, but you should reject any frame that changes defining features."] },
      { heading: "2. Every photo is the same kind of selfie", paragraphs: ["Repeated car or bedroom selfies confirm identity but reveal little range. A complete lineup should include a closer portrait, a full-length frame, a real-interest activity and a relaxed contextual image. UnrealShot’s four-frame shoots help create options; they should not all be used from one scene."] },
      { heading: "3. The profile has no full-length context", paragraphs: ["A natural standing or walking frame answers a basic question about posture and everyday style. It does not need to be a physique display. City-walk and coastal sequences work because the full-length frame is part of a believable action."] },
      { heading: "4. The images are old or over-edited", paragraphs: ["A technically attractive photo is still weak if it no longer represents you. Use recent reference selfies and compare age, build, hair and facial proportions before publishing a generated frame."] },
      { heading: "5–7. The scenes repeat, feel staged or invent a lifestyle", paragraphs: ["Five dressed-up restaurant photos look narrow; an implausible luxury setting can feel performative; and a fake hobby creates a real trust problem. Choose scenes tied to interests you actually have, mix ordinary and polished settings, and keep current camera-roll photos in the profile."], bullets: ["AI can help with crop, light, setting variety and alternate expressions.", "AI cannot verify that a scene is true to your life—you must do that.", "No photo set can guarantee matches, dates or verification."] },
    ],
    adjacent: { label: "Dating Profile Photo Order", href: "/blog/dating-profile-photo-order" },
  },
  {
    slug: "what-should-your-first-dating-profile-photo-be",
    title: "What Should Your First Dating Profile Photo Be?",
    description: "Your first dating profile photo should be a recent solo image with a recognizable face, natural expression, simple background and crop that still works on a small phone screen.",
    image: "/new-landing/2ba004de6cf9475b82150b7bd1ff4807.jpg",
    sections: [
      { heading: "Make recognition the first job", paragraphs: ["The opener is not where you need to prove every hobby or show the most dramatic location. It should let someone understand what you currently look like in a fraction of a second. Chest-up or close framing usually gives enough facial detail without feeling like an ID photo."] },
      { heading: "Use natural expression and ordinary light", paragraphs: ["A small, genuine smile or calm expression is easier to read than an exaggerated laugh. Window light, open shade or soft outdoor light preserves facial detail. Avoid heavy smoothing, colored nightclub light and background blur so strong that the image feels synthetic."] },
      { heading: "What not to lead with", paragraphs: ["Do not make a group photo, sunglasses frame, distant travel landscape or heavily edited image your first picture. A full-length frame is valuable, but it is usually clearer after the opener has established identity."] },
      { heading: "How to choose between generated openers", paragraphs: ["Compare each candidate to recent phone photos. Check facial proportions, hairline, skin texture and age. Then preview a square and vertical crop. A frame that looks good only at full size may fail when the interface trims it."], bullets: ["Keep your eyes and face away from the crop edge.", "Choose accuracy over cinematic drama.", "Retake a strong scene if likeness misses."] },
    ],
    adjacent: { label: "How Many Photos Should You Use?", href: "/blog/how-many-photos-should-you-use-on-a-dating-profile" },
  },
  {
    slug: "dating-profile-photo-order",
    title: "Dating Profile Photo Order: How to Build a Complete Lineup",
    description: "Order dating photos from clarity to context: a recognizable solo opener, full-length view, real-interest activity, relaxed candid, dressed-up moment and optional social or travel detail.",
    image: "/new-landing/9f8c395288d14566a2082aa1f97f1a8d.jpg",
    sections: [
      { heading: "A useful six-photo sequence", paragraphs: ["Think of order as a sequence of answered questions, not a secret ranking formula."], bullets: ["1. What do you look like now? Use a clear solo opener.", "2. What is your full silhouette and everyday style?", "3. What real interest could someone ask about?", "4. What do you look like relaxed and less camera-aware?", "5. How do you present for an evening or occasion?", "6. What social, travel or personal detail adds something new?"] },
      { heading: "Do not repeat the same shoot", paragraphs: ["Four coherent frames are useful because they let you choose. They are not an instruction to fill four slots with one outfit and location. Select the strongest accurate frame, then move to another scene."] },
      { heading: "Change the order when the photos demand it", paragraphs: ["If your clearest face appears in a half-body coffee image, it can lead. If a full-length frame is unusually strong and still easy to recognize, it may move earlier. The principle is stable: clarity first, then new information."] },
      { heading: "Check the lineup as a group", paragraphs: ["Look for repeated clothes, repeated facial expressions, two locations that tell the same story and a gap in current appearance. Mix AI-generated images with recent camera-roll photos and remove anything that makes a claim your real life cannot support."] },
    ],
    adjacent: { label: "Candid vs Posed Dating Photos", href: "/blog/candid-vs-posed-dating-photos-for-men" },
  },
  {
    slug: "how-many-photos-should-you-use-on-a-dating-profile",
    title: "How Many Photos Should You Use on a Dating Profile?",
    description: "Use enough dating photos to show your current face, full-length appearance, real interests and varied context without repetition—usually four to six strong images, depending on the app.",
    image: "/new-landing/49f810cc6e4344b480aadb5df98f6d7d.jpg",
    sections: [
      { heading: "Quality and coverage matter more than filling every slot", paragraphs: ["Four distinct, accurate images are more useful than six images that repeat the same selfie. Add a photo only when it answers a new visual question or makes the profile more truthful."] },
      { heading: "The minimum useful coverage", paragraphs: ["Cover a clear solo face, a full-length view, a real activity or interest and one relaxed or dressed-up context. If you have room, add a social or travel detail that is recent and easy to understand."] },
      { heading: "App requirements can change", paragraphs: ["Hinge currently describes a four-to-six-photo range in its photo-editing guidance. Tinder and Bumble interfaces and requirements may change, so check the app before rebuilding your profile. UnrealShot is not affiliated with any dating app."] },
      { heading: "Use 60 outputs as a selection pool", paragraphs: ["UnrealShot delivers 60 photos across 15 shoots so you can select a small, varied lineup. It is not sensible to publish every generated image. Choose accuracy first, avoid several frames from the same scene and retain recent real photos."] },
    ],
    sources: [{ label: "Hinge: Adding and Editing Photos", href: "https://help.hinge.co/hc/en-us/articles/36311675387155-Adding-and-Editing-Photos" }],
    adjacent: { label: "How to Mix AI and Camera-Roll Photos", href: "/blog/how-to-mix-ai-dating-photos-with-real-photos" },
  },
  {
    slug: "candid-vs-posed-dating-photos-for-men",
    title: "Candid vs Posed Dating Photos for Men",
    description: "Use both candid-looking and lightly posed dating photos: posed frames provide clarity, while candid frames add movement, expression and context. Neither should misrepresent how the image was made.",
    image: "/new-landing/b0e37df119704fc3a10d49b8eb3d3e05.jpg",
    sections: [
      { heading: "What ‘candid’ should mean", paragraphs: ["A candid-looking image uses an off-camera reaction, ongoing action or slightly imperfect framing. UnrealShot calls this a friend-taken look because it resembles casual photography; it does not claim that a real friend pressed the shutter."] },
      { heading: "Why lightly posed photos still matter", paragraphs: ["A controlled opener can make facial identity and eye contact much clearer. A full-length standing frame can show posture and clothing without pretending to capture a spontaneous event. Posing is a problem only when every image feels rigid or theatrical."] },
      { heading: "A useful balance", paragraphs: ["Lead with the clearest accurate face, then alternate visual energy. A walking city frame, cooking action or off-camera café reaction can follow a calmer opener. Add a dressed-up frame later rather than making the whole profile formal."] },
      { heading: "Signs a candid looks artificial", paragraphs: ["Overstated laughter, hands without a plausible task, motion that does not affect clothing or hair, and camera positions no nearby person could occupy all weaken the moment. Choose restrained expressions and settings with a clear action."] },
    ],
    adjacent: { label: "How to Tell When an AI Photo Looks Fake", href: "/blog/how-to-tell-when-an-ai-dating-photo-looks-fake" },
  },
  {
    slug: "how-to-mix-ai-dating-photos-with-real-photos",
    title: "How to Mix AI Dating Photos With Real Camera-Roll Photos",
    description: "Mix AI dating photos with recent camera-roll images by matching current appearance, choosing complementary roles and removing generated scenes that overstate your real lifestyle.",
    image: "/new-landing/ed0d2abb04e84ccca0af74ac8c4b4838.jpg",
    sections: [
      { heading: "Keep recent real photos as an accuracy anchor", paragraphs: ["At least one or two recent phone photos can ground the profile in your current appearance and actual life. They do not need perfect light. Their value is that they confirm age, build, hair and everyday context."] },
      { heading: "Use generated photos to fill specific gaps", paragraphs: ["If your camera roll has good travel and social photos but no clear opener, choose an accurate generated portrait. If it has several face selfies but no full-length or interest context, select those roles instead."] },
      { heading: "Match appearance, not image processing", paragraphs: ["The photos do not need identical color grading. They do need to look like the same current person. Reject a frame when it changes defining facial proportions, adds unrealistic muscle, removes age markers or invents a hairstyle."] },
      { heading: "Run the honesty check", paragraphs: ["Ask whether you could comfortably explain the setting, clothing and activity on a date. A cooking frame is appropriate if you cook; a coastal frame should not imply a trip you never took. Generated images should support accurate self-representation, not replace it."] },
    ],
    adjacent: { label: "How Reference Selfies Affect Likeness", href: "/blog/how-reference-selfies-affect-ai-dating-photo-likeness" },
  },
  {
    slug: "how-reference-selfies-affect-ai-dating-photo-likeness",
    title: "How Reference Selfies Affect AI Dating-Photo Likeness",
    description: "Clear, recent reference selfies from varied angles improve AI dating-photo likeness. Avoid filters, hidden facial features, group shots and sets of nearly identical images.",
    image: "/new-landing/cf26ce46ee2b4559b3074b6df276b578.jpg",
    sections: [
      { heading: "Reference quality is more important than studio quality", paragraphs: ["A normal phone selfie can be useful when the face is sharp, current and evenly visible. Expensive camera gear is unnecessary. Strong beauty filters and very shallow focus remove details that generation needs to preserve."] },
      { heading: "Use several angles and expressions", paragraphs: ["Include front, slight-left and slight-right views, plus neutral and modestly smiling expressions. Do not upload six burst photos from the same position. Variation helps clarify which facial details are stable."] },
      { heading: "Common reference problems", paragraphs: ["Sunglasses hide the eyes, hats hide the hairline, old photos conflict with current appearance and group shots introduce another identity. Extreme wide-angle selfies can also distort proportions."], bullets: ["Use only photos of yourself.", "Prefer recent unfiltered images.", "Keep the full face inside the frame.", "Include facial hair and hairstyle as they look now."] },
      { heading: "What reference guidance does not guarantee", paragraphs: ["UnrealShot uses references to guide likeness; it does not train a custom model. Individual frames can still miss face shape, age, body or expression. Compare every result with current photos and use a Photo Retake for misses."] },
    ],
    adjacent: { label: "How Realistic AI Dating Photos Work", href: "/realistic-ai-dating-photos" },
  },
  {
    slug: "ai-dating-photos-app-rules-and-photo-verification",
    title: "AI Dating Photos, App Rules and Photo Verification",
    description: "AI dating photos must represent you accurately. Dating apps prohibit deceptive profiles, control their own verification processes and can change policies; no generator can guarantee acceptance.",
    image: "/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg",
    sections: [
      { heading: "The practical rule is accurate self-representation", paragraphs: ["Do not use a generated image that materially changes your face, age, build or life. A plausible camera style is not permission to invent a trip, hobby, property or social situation."] },
      { heading: "Hinge and Bumble explicitly address misleading content", paragraphs: ["Hinge prohibits AI-generated content used to deceive or mislead. Bumble prohibits fake or misleading profiles and artificial or enhanced photos used deceptively. These are platform boundaries, not optional creative guidance."] },
      { heading: "Verification is controlled by the app", paragraphs: ["Tinder, Hinge and Bumble can change verification flows, request live checks and make their own decisions. UnrealShot does not guarantee verification, does not promise that photos are safe for every app and does not help circumvent policy."] },
      { heading: "A safe publishing checklist", paragraphs: ["Use recent references, compare every output, retain recent camera-roll photos and remove scenes that are not true to your life. Recheck official rules before changing your profile because policies evolve."], bullets: ["Reviewed August 31, 2026.", "UnrealShot is not affiliated with Tinder, Hinge or Bumble.", "Generated product examples on UnrealShot are labeled AI-generated."] },
    ],
    sources: [{ label: "Hinge Prohibited Content & Behavior", href: "https://help.hinge.co/hc/en-us/articles/42464295207187-Prohibited-Content-Behavior" }, { label: "Bumble Inauthentic Profiles Policy", href: "https://bumble.com/guidelines/inauthentic-profiles" }, { label: "Tinder Photo Verification", href: "https://www.help.tinder.com/hc/en-us/articles/4422771431309-Photo-Verification" }],
    adjacent: { label: "How to Mix AI and Real Photos", href: "/blog/how-to-mix-ai-dating-photos-with-real-photos" },
  },
  {
    slug: "how-to-tell-when-an-ai-dating-photo-looks-fake",
    title: "How to Tell When an AI Dating Photo Looks Fake",
    description: "Check AI dating photos for likeness drift, impossible hands and objects, inconsistent light, implausible camera position, invented context and excessive skin smoothing.",
    image: "/new-landing/758bff1bb9d64242badcae3db5b9da54.jpg",
    sections: [
      { heading: "Start with identity, not tiny artifacts", paragraphs: ["The most important failure is a photo that does not look like your current self. Compare face shape, eye spacing, nose, hairline, facial hair, age and body before zooming into background details."] },
      { heading: "Inspect hands, objects and contact points", paragraphs: ["Check fingers, cups, utensils, gym equipment, railings and clothing edges. Look where a hand grips an object or a foot meets the ground. Small structural errors can make an otherwise polished scene feel wrong."] },
      { heading: "Ask whether the light and camera could exist", paragraphs: ["Shadows should point consistently, reflections should match the scene and background blur should change gradually. The camera should appear to occupy a plausible position for a nearby person, which is central to a friend-taken look."] },
      { heading: "Check the four-frame sequence", paragraphs: ["Across a shoot, compare outfit details, setting, time of day and facial appearance. Coherence does not mean every pixel must match, but a jacket cannot silently change and evening light cannot become midday without explanation."] },
      { heading: "Retake or remove—do not rationalize", paragraphs: ["If a frame changes your identity, invents a lifestyle or contains a visible structural error, use a Photo Retake or leave it out. A dating profile needs only a few strong, accurate photos; it does not need every generated output."] },
    ],
    adjacent: { label: "Common Dating Photo Mistakes", href: "/blog/7-common-dating-profile-photo-mistakes-and-how-ai-fixes-them" },
  },
]

function articleHtml(article: EditorialArticle) {
  const sections = article.sections.map((section) => `<section><h2>${section.heading}</h2>${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${item}</li>`).join("")}</ul>` : ""}</section>`).join("")
  const sources = article.sources ? `<section><h2>Primary sources</h2><ul>${article.sources.map((source) => `<li><a href="${source.href}" rel="noreferrer">${source.label}</a></li>`).join("")}</ul></section>` : ""
  return `<p><strong>Direct answer:</strong> ${article.description}</p><p><strong>Written and reviewed by <a href="/about">Harvansh Chaudhary</a>.</strong> Last reviewed August 31, 2026.</p>${sections}${sources}<hr><p>Continue with the <a href="/dating-photos">dating profile photo pillar</a> and <a href="${article.adjacent.href}">${article.adjacent.label}</a>.</p>`
}

export function getEditorialArticle(slug: string): WordPressPost | undefined {
  const article = editorialArticles.find((item) => item.slug === slug)
  if (!article) return undefined
  return {
    id: `local:${article.slug}`,
    slug: article.slug,
    title: article.title,
    excerpt: article.description,
    content: articleHtml(article),
    date: "2026-08-31T00:00:00.000Z",
    modified: "2026-08-31T00:00:00.000Z",
    status: "publish",
    language: { code: "EN", locale: "en_US" },
    author: { node: { name: "Harvansh Chaudhary", avatar: { url: "" } } },
    featuredImage: { node: { sourceUrl: article.image, altText: `${article.title} — AI-generated UnrealShot dating photo example` } },
    categories: { nodes: [{ name: "Dating Photo Guides", slug: "dating-photo-guides" }] },
    translations: [],
  }
}

export const editorialPosts = editorialArticles.map((article) => getEditorialArticle(article.slug)!)
