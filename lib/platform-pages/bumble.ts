import type { PlatformGuideContent, PlatformLandingContent } from "./types"

const bumbleSources = [
  { label: "Bumble: Uploading profile photos and videos", href: "https://support.bumble.com/hc/en-us/articles/28523708029341-Uploading-profile-photos-and-videos" },
  { label: "Bumble: Photo Verification", href: "https://bumble.com/en/help/how-can-i-verify-my-profile" },
  { label: "Bumble: Inauthentic profiles", href: "https://bumble.com/guidelines/inauthentic-profiles" },
]

export const bumbleLanding: PlatformLandingContent = {
  app: "Bumble",
  path: "/dating-photos/bumble",
  eyebrow: "AI Bumble photo product for men",
  title: "AI Bumble photos for a varied profile that still looks like you",
  description: "Create 60 realistic AI Bumble photos across 15 coherent photoshoots from 4–6 selfies. Includes 15 Photo Retakes and delivery within 30 minutes for $39.",
  answer: "UnrealShot turns 4–6 current selfies into 15 coherent four-photo shoots for men building a Bumble profile. Each generated idea becomes four connected photos with consistent surroundings and styling, while the complete delivery varies its setting, clothing, activity, light and mood. You receive 60 photos plus 15 individual Photo Retakes within 30 minutes for a one-time $39 payment.",
  reviewed: "August 31, 2026",
  heroBullets: ["15 generated photoshoots · 60 total photos", "Four connected photos from every idea", "Your selfies and real interests guide the delivery", "15 Photo Retakes · 30-minute delivery · $39"],
  problemIntro: "A Bumble profile needs enough current photos to show more than one angle of your appearance and life. That becomes difficult when your camera roll contains one good selfie, old group photos and several images that no longer look like the same current person.",
  problems: [
    { title: "One strong selfie has to carry the profile", body: "A single portrait can show your face, but it cannot provide the changing surroundings, body language and visual context that make a fuller profile feel natural." },
    { title: "The available photos no longer look consistent", body: "Different years, haircuts, facial hair and image quality can make a real camera roll feel disconnected. Current reference selfies give the new delivery one recognizable starting point." },
    { title: "Generic AI photos look separately prompted", body: "Independent one-off images can shift the face, body, styling and visual finish. UnrealShot builds each idea as a connected four-photo shoot and carries your reference likeness throughout the delivery." },
  ],
  solutionIntro: "UnrealShot creates a broad pool of Bumble-ready dating photos from a small set of current references. Your delivery includes 15 different photoshoot ideas with visual variety, while four connected photos from every idea make each individual setting feel coherent and complete.",
  differentiators: [
    { title: "Fifteen ideas create more than portrait variety", body: "The delivery can change environment, wardrobe, activity, composition, light and mood. Your results are created from your references and intake rather than copied from the examples displayed on the site." },
    { title: "Every photoshoot stays visually connected", body: "Four photos retain one setting, outfit and lighting direction while posture, expression and camera distance change. The sequence feels like moments from one short session." },
    { title: "Your real interests expand the possibilities", body: "Truthful intake answers provide creative context for the generation. One interest can inspire many different environments, actions and visual moods instead of producing one predetermined image." },
    { title: "Photo Retakes improve individual results", body: "Fifteen individual Photo Retakes are included for photos where you like the central idea and want another version of the likeness, expression or composition." },
  ],
  deliveryPoints: [
    { title: "15 photoshoot ideas created for your delivery", body: "Each delivery explores different combinations of environment, styling, activity, light and mood. The possible creative direction is broader than the output examples currently displayed." },
    { title: "Four connected photos from every idea", body: "Each photoshoot creates four variations of the same visual moment. Consistent surroundings and styling preserve the story while composition and expression change." },
    { title: "Current likeness across the delivery", body: "Your recent selfies guide all 60 photos, helping varied concepts continue to look like one recognizable current person rather than disconnected AI identities." },
  ],
  sections: [
    { heading: "Four connected photos make every idea more useful", paragraphs: ["UnrealShot develops each generated idea as a short photoshoot instead of stopping at one image. The setting, outfit and lighting stay connected while four different moments provide useful changes in composition, posture and expression.", "That gives you meaningful alternatives without losing what made the original idea work. Across 15 photoshoots created for your delivery, the result is both consistency within each idea and broad visual variety across the complete set."] },
    { heading: "Creative direction grounded in your real life", paragraphs: ["Your intake gives UnrealShot truthful context about the style and interests that fit you. The same genuine interest can inspire different environments, actions, clothing and moods, giving every delivery room to feel personal and varied.", "UnrealShot currently avoids alcohol, dogs, bicycles and team sports. Outside those exclusions, the final ideas are created for your delivery, with the examples on this site showing only some possible directions."] },
    { heading: "Built around likeness, coherence and variety", paragraphs: ["Your recent selfies guide recognizable appearance while the intake gives each delivery truthful creative direction. UnrealShot then creates 15 varied ideas with changes in setting, clothing, camera distance and expression.", "Four related frames keep each shoot coherent, and 15 individual Photo Retakes give you a direct way to improve an otherwise strong image when likeness, expression or composition misses."] },
    { heading: "From reference selfies to 60 finished dating photos", paragraphs: ["Upload 4–6 recent solo selfies from varied angles and answer three questions about the intended look and genuine interests that fit you. UnrealShot uses that information to guide likeness and creative direction across 15 different photoshoot ideas.", "Each idea becomes four connected photos, creating 60 results delivered within 30 minutes. The $39 one-time package also includes 15 individual Photo Retakes."], bullets: ["4–6 current reference selfies", "15 generated photoshoots", "Four connected photos per shoot", "60 total photos", "15 individual Photo Retakes", "$39 once · no subscription"] },
  ],
  exampleSlugs: ["outdoor-coffee", "home-cooking", "rooftop", "gym-training"],
  policy: [
    "Bumble says profiles can contain up to six photos and videos and recommends four to six. Its guidance emphasizes a visible face, bright light, varied interests and avoiding heavy filters or overly edited photos.",
    "Bumble Photo Verification compares a prompted selfie with profile photos using automated and human review. Its support guidance recommends removing hats, sunglasses and filters when the selfie does not match.",
    "Bumble prohibits fake or misleading profiles and artificial or enhanced photos used deceptively. Use only results that accurately represent your current appearance and real life.",
  ],
  sources: bumbleSources,
  faqs: [
    { question: "What are AI Bumble photos?", answer: "They are generated photo options guided by your reference selfies and intake. UnrealShot creates varied ideas for the delivery and supplies four related frames from each idea." },
    { question: "How many photos can you use on Bumble?", answer: "Bumble’s current support guidance says you can upload up to six photos and videos and that four to six work best." },
    { question: "How are my Bumble photoshoot ideas created?", answer: "Your current selfies and three intake answers guide the delivery. UnrealShot generates 15 different photoshoot ideas from that context, so the examples on this site show possible outputs rather than the limits of what can be created." },
    { question: "How does UnrealShot keep Bumble photos recognizable?", answer: "Your 4–6 current selfies guide likeness throughout generation. Compare the delivered frames with how you look today, keep the accurate results and use a Photo Retake when an otherwise strong image misses an important detail." },
    { question: "How do my interests affect the Bumble photos?", answer: "Your genuine interests give the generation creative context and can inspire different activities, environments and moods. UnrealShot currently avoids alcohol, dogs, bicycles and team sports." },
    { question: "Can I improve an individual Bumble photo?", answer: "Yes. The package includes 15 individual Photo Retakes for photos where you want another version of the likeness, expression or composition." },
  ],
  guidePath: "/guides/bumble-photos",
  guideLabel: "Read the complete Bumble photo guide",
}

export const bumbleGuide: PlatformGuideContent = {
  app: "Bumble",
  path: "/guides/bumble-photos",
  eyebrow: "Bumble photo guide for men",
  title: "Bumble photos for men: a practical four-to-six-photo lineup",
  description: "A detailed Bumble photo guide covering its current photo guidance, opener selection, Best Photo, activity images, AI-photo boundaries and verification.",
  answer: "A strong Bumble lineup uses four to six distinct photos or videos: begin with a clear current face, then add full-length appearance, a genuine interest, a relaxed expression and another real-life setting. Bumble itself recommends bright, well-lit images, visible faces and different aspects of your life. Avoid heavy filters, repeated selfies and any generated image that changes who you are.",
  reviewed: "August 31, 2026",
  quickFacts: [["Available media", "Up to 6 photos/videos"], ["Bumble recommendation", "4–6"], ["Opener", "Clear, current face"], ["Best Photo", "Can reorder the first image"]],
  sections: [
    { heading: "Begin with an unmistakable current face", paragraphs: ["Use a solo image with bright, ordinary light, visible eyes and an expression that looks natural for you. Keep your face large enough to read on a phone without turning the image into an ID-photo crop.", "Bumble explicitly advises members to use clear, well-lit photos where the face is visible and to avoid heavy filters or over-editing. Treat that as the baseline before considering wardrobe, location or activity." ] },
    { heading: "Build four core roles before filling six slots", paragraphs: ["Start with four jobs: opener, full-length view, genuine activity and relaxed context. These establish who you are, how you look, something you do and how you appear outside a posed portrait.", "If you have fifth and sixth positions, add a different wardrobe or setting and one recent camera-roll photo or video. Do not turn extra capacity into repeated selfies. Bumble supports up to six media items and says four to six work best."], bullets: ["1. Clear solo opener", "2. Full-length everyday style", "3. Genuine hobby or routine", "4. Relaxed candid", "5. Smart-casual or different environment", "6. Recent real photo or video"] },
    { heading: "How Bumble’s Best Photo changes ordering decisions", paragraphs: ["Bumble says its Best Photo setting checks your photos and can put the most popular one first. If you use it, remember that the first image may change from your manually chosen sequence.", "Every likely opener candidate should therefore identify you clearly. Best Photo is a Bumble feature—not evidence that an outside generator can predict or optimize its result. Review your profile periodically to see how the selected first image fits the rest of the lineup." ] },
    { heading: "Use interests to add information, not performance", paragraphs: ["An activity photo should reveal a real part of life: cooking, training, hiking, books, art, travel or another genuine routine. It does not need to be extreme. Familiar details often give a clearer sense of compatibility than an aspirational luxury scene.", "If a pet, friend or place appears, it should belong to your actual life. Bumble’s own examples say a pet photo should feature your pet. Do not generate borrowed social proof or invent relationships for the image." ] },
    { heading: "Balance solo clarity with social context", paragraphs: ["A real group image can show social context, but it should appear after someone can already identify you. Avoid an opener that requires guessing, blurred faces or an aggressive crop that leaves fragments of other people.", "UnrealShot currently creates one-person scenes and does not fabricate friends. Use an authentic camera-roll photo when you want social evidence, and get permission before publishing recognizable people." ] },
    { heading: "Using AI Bumble photos without creating a fake profile", paragraphs: ["Generated photos can fill missing roles, but only accurate frames belong in the final profile. Compare face shape, hair, facial hair, age, skin texture, body and expression with recent real photos. Remove anything that produces a more flattering but different identity.", "Bumble’s inauthentic-profile guidelines prohibit artificial or enhanced photos used deceptively. Keep real current media in the lineup, choose only true activities and never use AI imagery to impersonate someone or misstate your life." ] },
    { heading: "Photo Verification is a separate app decision", paragraphs: ["Bumble’s verification flow asks for a prompted selfie and uses automated and human review to compare it with profile photos. Its troubleshooting guidance recommends visible faces, clear lighting, no filters and no obstruction when a selfie does not match.", "The process belongs entirely to Bumble. A photo service cannot promise acceptance. If any profile image no longer resembles you, replace it before attempting or maintaining verification." ] },
    { heading: "Common Bumble photo mistakes", paragraphs: ["The most common structural mistake is a gallery of close selfies with no full-length or activity context. Other issues include old appearances, sunglasses in the opener, every photo using the same clothes, several staged luxury scenes and a social image where identification is difficult.", "Label each image by its role, remove duplicates and review the remaining set at phone size. Accuracy comes before polish."], bullets: ["Filtered or obscured opener", "No full-length image", "Several near-identical face crops", "Borrowed pet or invented hobby", "No current real photo or video", "Inconsistent AI likeness", "Every image in one wardrobe or setting"] },
    { heading: "Use photos and videos for different jobs", paragraphs: ["Bumble counts photos and videos within the same set of up to six media items. A short real video can document movement, voice-adjacent personality and an actual environment in a way a generated still cannot. Keep it stable, audible where relevant and short enough that the central moment is immediately clear.", "Do not add video merely to create format variety. A blurry concert clip or distant sports recording may reveal less than a clear photo. Choose the medium that communicates the role most accurately, and keep a clear still opener even when later video adds useful life context."] },
    { heading: "Know when the lineup needs updating", paragraphs: ["Update profile media after a meaningful change in hair, facial hair, body, glasses or other defining appearance. Also replace activity images when the interest is no longer part of your life. Accuracy is a continuing responsibility rather than a one-time check at upload.", "Review the profile after changing its first image or enabling Best Photo. Confirm that the selected opener still introduces the later sequence coherently. Archive outdated generated and camera-roll candidates so they do not accidentally return during a future refresh."] },
    { heading: "Final Bumble lineup audit", paragraphs: ["Look at the sequence without reading your bio. It should still communicate one recognizable current person, ordinary style range and at least one specific interest. Then read the bio and prompts to confirm nothing contradicts the images.", "Update the set when your appearance changes. A technically excellent photo becomes inaccurate if it represents a haircut, beard, body or age that no longer matches." ] },
  ],
  checklist: ["My opener is solo and current", "My face is visible without filters or obstruction", "I use four to six distinct roles where available", "One image shows full-length appearance", "Activities and pets are genuinely mine", "Best Photo candidates can all work as openers", "At least one item is recent real media", "Generated frames match my current appearance", "No scene misstates status, travel or relationships", "I reviewed Bumble’s current guidelines and verification rules"],
  sources: bumbleSources,
  faqs: [
    { question: "How many photos should men use on Bumble?", answer: "Bumble allows up to six photos and videos and currently recommends four to six. Use distinct roles rather than filling slots with repeated selfies." },
    { question: "What should the first Bumble photo be?", answer: "Choose a recent solo image with bright light, visible eyes, a clear full face and a natural expression." },
    { question: "What is Bumble Best Photo?", answer: "Bumble says Best Photo can check your photos and put the most popular one first. It is an in-app feature; UnrealShot does not access or predict its data." },
    { question: "Can men use AI-generated photos on Bumble?", answer: "Only use images that accurately represent your current appearance and real life. Bumble prohibits artificial or enhanced photos used deceptively, so review its current rules and keep recent real media." },
    { question: "Should you include a group photo on Bumble?", answer: "A real social image can add context later in the profile, but it should not create identification confusion. Lead with a solo photo and get permission from visible friends." },
  ],
  productPath: "/dating-photos/bumble",
  productLabel: "Create a complete AI Bumble photo lineup",
}
