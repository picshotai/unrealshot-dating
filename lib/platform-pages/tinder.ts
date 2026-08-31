import type { PlatformGuideContent, PlatformLandingContent } from "./types"

const tinderSources = [
  { label: "Tinder: Photo Verification", href: "https://www.help.tinder.com/hc/en-us/articles/360034941812-Photo-Verification" },
  { label: "Tinder: Face-photo requirements and hidden profiles", href: "https://www.help.tinder.com/hc/en-us/articles/26151863213837-My-profile-is-hidden" },
  { label: "Tinder Community Guidelines", href: "https://policies.tinder.com/community-guidelines/intl/en/" },
]

export const tinderLanding: PlatformLandingContent = {
  app: "Tinder",
  path: "/dating-photos/tinder",
  eyebrow: "AI Tinder photo product for men",
  title: "AI Tinder photos that build a complete, believable lineup",
  description: "Create 60 realistic AI Tinder photos across 15 coherent shoots from 4–6 selfies. Four related frames per scene, 15 retakes and delivery within 30 minutes for $39.",
  answer: "UnrealShot turns 4–6 current selfies into 15 coherent four-photo shoots for men building a Tinder profile. Instead of giving you disconnected portraits, each shoot keeps one outfit, location and lighting story while changing crop, posture and expression. You receive 60 photos, 15 individual Photo Retakes and delivery within 30 minutes for a one-time $39 payment.",
  reviewed: "August 31, 2026",
  heroBullets: [
    "15 complete shoots and 60 photos",
    "Four related frames per shoot",
    "15 individual Photo Retakes included",
    "Delivered within 30 minutes · $39 once",
  ],
  problemIntro: "Most men do not have a shortage of image files. They have a shortage of distinct, usable photo roles. A camera roll can contain dozens of selfies while still failing to provide one clear opener, one convincing full-length photo and enough everyday context to make the profile feel complete.",
  problems: [
    { title: "The first photo is hard to read", body: "A distant travel photo, sunglasses, a group crop or a bathroom mirror can make someone work to identify you. Tinder now requires at least one detectable face photo in many regions, and its own guidance asks for a clear, well-lit, unobscured full face." },
    { title: "Every photo repeats the same information", body: "Six close selfies do not become a varied profile merely because the background changes. A useful lineup needs changes in distance, clothing, setting and activity while your current appearance remains recognizable." },
    { title: "Generic AI images feel assembled", body: "When every image has a different face, body, wardrobe and visual finish, the profile reads like a folder of separate prompts. UnrealShot’s four-frame unit keeps each scene internally coherent and gives you multiple crops from one believable moment." },
  ],
  solutionIntro: "UnrealShot is built around the missing lineup—not around a claim that one magic portrait can produce matches. The package creates enough coherent scenes to choose photos with different jobs, then gives you individual retakes when a useful scene contains one weak frame.",
  differentiators: [
    { title: "One scene becomes four useful choices", body: "Every shoot includes a close or opener frame, a half-body frame, a full-length frame and a candid or expressive frame. You can choose the crop that works best on your profile without generating an unrelated scene from scratch." },
    { title: "Fifteen shoots create real range", body: "The complete delivery covers everyday, dressed-up, activity, indoor and outdoor contexts. That breadth helps you avoid building a Tinder profile out of five versions of the same portrait." },
    { title: "Real interests select plausible scenes", body: "Choose from 22 supported interests. A selected interest influences a complete shoot, and any one interest is capped at two shoots so it cannot dominate your set. UnrealShot currently excludes alcohol, dogs, bicycles and team sports." },
    { title: "References guide likeness", body: "Your 4–6 recent selfies guide appearance across the generation. UnrealShot does not train a custom model and does not promise every frame will be perfect, which is why the package includes 15 individual Photo Retakes." },
  ],
  lineup: [
    { slot: "Photo 1", role: "Clear solo opener", explanation: "Choose a close or chest-up frame with visible eyes, ordinary light and no competing subject. It should look recognizably like you now before it tries to communicate lifestyle.", shootSlug: "outdoor-coffee" },
    { slot: "Photo 2", role: "Full-length context", explanation: "Add a wider image that shows your normal proportions and everyday style. A walking frame usually feels less rigid than standing square to the camera.", shootSlug: "city-walk" },
    { slot: "Photo 3", role: "Genuine activity", explanation: "Show one interest you actually practice. The purpose is to reveal something discussable, not to borrow an impressive hobby for the photograph.", shootSlug: "gym-training" },
    { slot: "Photo 4", role: "Dressed-up contrast", explanation: "Use a smart-casual evening image to add a different wardrobe and social setting. Keep it grounded by placing it after clearer daylight photos.", shootSlug: "dinner" },
    { slot: "Photo 5", role: "Relaxed expression", explanation: "A candid frame gives the lineup warmth and reduces the repeated posed-camera look. It should still be sharp enough that your expression reads on a phone." },
    { slot: "Photo 6", role: "Real camera-roll evidence", explanation: "Finish with a recent non-generated photo—a genuine trip, social moment or ordinary day—to keep the profile anchored in your real life." },
  ],
  sections: [
    {
      heading: "Why coherent shoots matter on a Tinder profile",
      paragraphs: [
        "A dating profile is read as one package. If the person in photo one looks noticeably older, younger or differently built in photo three, the issue is not whether either picture is attractive in isolation. The issue is that the set creates uncertainty. UnrealShot treats the shoot as the smallest unit: four photos share a place, outfit and lighting direction, then vary the framing and expression.",
        "You do not need to upload all four frames from the same shoot. Their first job is to give you a useful choice. The café close frame may become the opener while the city-walk full-length frame fills the second slot. The coherence system makes those choices easier to compare because each shoot contains consistent alternatives rather than four unrelated concepts.",
      ],
    },
    {
      heading: "Built for selection, not invented performance claims",
      paragraphs: [
        "UnrealShot does not scan Tinder, tailor images to a private ranking system or guarantee matches. Tinder does not publish a formula that a photo generator can reliably optimize against. The product solves the practical problem it can actually control: producing a broad set of realistic photo roles from limited reference material.",
        "The final selection still belongs to you. Remove any frame that changes a defining feature, suggests a life you do not live or looks more polished than the rest of your profile. Mix selected generated images with current phone photos so the final set remains an accurate representation rather than a manufactured character.",
      ],
    },
    {
      heading: "What you receive after uploading your selfies",
      paragraphs: [
        "Start with 4–6 recent, unfiltered selfies that show your face from more than one angle. Answer three short intake questions about the look you want and interests that are genuinely yours. UnrealShot then returns 15 shoots with four related frames each—60 images in total—within 30 minutes.",
        "If a strong scene contains a weak likeness, expression or composition, use one of the 15 included Photo Retakes on that individual frame. Retakes are there because reference-guided image generation can miss. They are not presented as a promise of perfect likeness in every output.",
      ],
      bullets: ["One-time price: $39", "No subscription", "15 coherent shoots", "60 total photos", "15 individual Photo Retakes"],
    },
  ],
  exampleSlugs: ["outdoor-coffee", "city-walk", "gym-training", "dinner"],
  policy: [
    "Tinder says a clear face photo is required in many regions and may hide a profile when it cannot detect one. Its guidance asks for a well-lit, unobscured full face.",
    "Tinder Photo Verification compares a short video selfie with profile photos. New photos can be subject to continued verification and may affect verification status.",
    "UnrealShot cannot guarantee verification or app acceptance. Use only frames that accurately resemble your current appearance and keep recent camera-roll photos in the final profile.",
  ],
  sources: tinderSources,
  faqs: [
    { question: "What are AI Tinder photos?", answer: "They are generated profile-photo options created from reference selfies. UnrealShot produces them as coherent four-frame shoots so each scene offers a close, half-body, full-length and candid choice rather than one isolated portrait." },
    { question: "How many Tinder photos does UnrealShot create?", answer: "One $39 package includes 15 shoots with four related frames each, for 60 photos total. It also includes 15 individual Photo Retakes." },
    { question: "Does UnrealShot optimize photos for Tinder’s algorithm?", answer: "No. UnrealShot does not access or claim to understand Tinder’s private ranking systems. It creates useful profile-photo roles and leaves selection and ordering to you." },
    { question: "Will AI photos pass Tinder Photo Verification?", answer: "There is no guarantee. Tinder controls verification and compares profile photos with a video selfie. Use only accurate images that clearly resemble you and consult Tinder’s current requirements." },
    { question: "Should every Tinder profile photo be AI-generated?", answer: "No. A stronger approach is to select only accurate generated frames and combine them with recent real camera-roll photos that document your current appearance and life." },
    { question: "What references should I upload?", answer: "Upload 4–6 recent solo selfies with a visible face, varied angles and ordinary lighting. Avoid old photos, heavy filters, sunglasses and multiple near-identical crops." },
  ],
  guidePath: "/guides/tinder-photos",
  guideLabel: "Read the complete Tinder photo guide",
}

export const tinderGuide: PlatformGuideContent = {
  app: "Tinder",
  path: "/guides/tinder-photos",
  eyebrow: "Tinder photo guide for men",
  title: "Tinder photos for men: how to build a clear, varied lineup",
  description: "A researched Tinder photo guide for men covering the opener, photo order, crops, common mistakes, AI-photo use and current verification requirements.",
  answer: "A useful Tinder lineup starts with a recent solo photo where your face is immediately clear, then adds full-length, activity, dressed-up and candid context. Every later photo should answer a new question instead of repeating the opener. Keep the set accurate to your current appearance, check every crop on a phone and mix carefully selected AI photos with recent camera-roll evidence.",
  reviewed: "August 31, 2026",
  quickFacts: [["First-photo job", "Immediate recognition"], ["Core variety", "Face, body, activity, context"], ["Face requirement", "At least one in many regions"], ["Verification", "Video selfie compared with profile photos"]],
  sections: [
    { heading: "The first Tinder photo has one primary job", paragraphs: ["Your opener should make identification effortless. Use a solo image with a current haircut and facial hair, visible eyes, clean light and enough space around the head to survive an interface crop. A close or chest-up frame usually communicates faster than a distant landscape photo.", "Do not ask the opener to prove every part of your personality. Its first responsibility is clarity. Lifestyle, clothing range and interests belong in supporting slots where the viewer already knows whom they are looking at."], bullets: ["One clearly visible person", "No sunglasses or phone covering the face", "Current appearance", "Simple background hierarchy", "Natural, readable expression"] },
    { heading: "A six-role Tinder photo order", paragraphs: ["There is no single official Tinder order that guarantees performance, and UnrealShot makes no algorithm claim. This sequence is a practical editorial framework: opener, full-length, activity, dressed-up contrast, relaxed expression and real-life evidence.", "If you have fewer strong photos, use fewer distinct roles rather than filling the profile with weak near-duplicates. If you have more available slots, add information—not another crop from the same minute."], bullets: ["1. Clear solo opener", "2. Full-length everyday style", "3. Genuine activity", "4. Smart-casual or evening contrast", "5. Relaxed candid", "6. Recent real social, travel or ordinary-life photo"] },
    { heading: "How to choose a full-length photo", paragraphs: ["A full-length photo answers a straightforward question about build, posture and style. It should not be a tiny figure inside a dramatic landscape. Keep your face identifiable and avoid awkward crops through the ankles, knees or top of the head.", "Walking, leaning naturally or pausing in a familiar place often works better than a rigid front-facing stance. The location should support the image without becoming the subject." ] },
    { heading: "Activity photos should be true before they are impressive", paragraphs: ["An activity image works because it gives someone a specific piece of your life to understand. Cooking, training, coffee, books or city walks are useful only when they are real enough that you could comfortably discuss them.", "Avoid props and settings that imply a false identity. One honest everyday interest is more coherent than a luxury scene, borrowed pet or invented adventure that the rest of the profile cannot support." ] },
    { heading: "Cropping and small-screen checks", paragraphs: ["Review every candidate at phone size. The main face and action should remain legible when the interface trims some background. Leave safe space around the subject, but do not use an excessively wide image merely to protect the crop.", "Watch for edge details that look accidental: half a hand, cut-off footwear, another person entering frame or a bright sign pulling attention from your face. A technically sharp image can still fail as a profile crop."], bullets: ["Preview square and portrait crops", "Keep eyes away from the top edge", "Do not place the key action at the far side", "Check that text and signs are not distorted", "Confirm the image remains sharp after upload"] },
    { heading: "How to mix AI Tinder photos with real photos", paragraphs: ["Use generated photos as gap-fillers for roles your camera roll genuinely lacks. A coherent city-walk full-length photo can solve a real lineup problem; replacing every spontaneous image with polished generations can create a different one.", "Compare each generated candidate with current phone photos. Reject it if face shape, age, hair, body or skin detail stops looking like you. Then keep at least one or two recent camera-roll images that anchor the profile in documented life." ] },
    { heading: "Tinder face-photo and verification requirements", paragraphs: ["Tinder says profiles can be hidden in many regions when they do not contain a detectable face photo. The company asks for a clear, well-lit full face without a mask, hand or phone obscuring it.", "Photo Verification uses a short video selfie and compares it with profile photos. Tinder lists an obscured face, poor lighting, a face that is not prominent and a mismatch between the video and profile photos among possible rejection reasons. Adding or deleting photos can affect verification status. This is why no AI-photo provider should promise verification." ] },
    { heading: "Common Tinder photo mistakes", paragraphs: ["The most common problem is redundancy: multiple selfies, multiple gym mirrors or several photos in the same outfit. Other problems include an opener with no visible eyes, a group photo before a solo photo, old images that no longer match and activity scenes that look staged.", "Fix the set at lineup level. Label each current photo by its job. If two photos have the same job, keep the clearer one. Then identify what is missing before taking or generating anything new."], bullets: ["Unclear or distant opener", "More than one near-identical selfie", "No full-length image", "Every photo in formal clothes", "Old or materially inaccurate appearance", "Heavy filters or inconsistent AI faces"] },
    { heading: "Technical quality checks before uploading", paragraphs: ["Inspect the original file rather than judging only a small preview. Look closely at eyes, teeth, ears, hands, clothing edges, reflections, background text and repeated objects. AI errors often hide in secondary details until the image is enlarged, while aggressive compression can make normal skin texture look artificial.", "Use a file with enough resolution for the app to crop without turning the face soft. Avoid repeated saving, screenshots of screenshots and unnecessary sharpening. After uploading, view the live profile from another device if possible; the crop and compression you see in your gallery may not match the published result."] },
    { heading: "When a phone photo is the better choice", paragraphs: ["Use a real phone photo whenever it documents something generated imagery cannot honestly supply: your actual friends, a specific trip, your pet, a recent event or a recognizable local routine. A technically imperfect real image can contribute more trust and specificity than a polished scene with no personal history.", "Generation is most useful for missing photographic roles, such as a clear alternative opener or full-length everyday frame. It should supplement evidence of your life, not erase it. If the generated option requires you to pretend a setting occurred, keep the phone photo or take a new one instead."] },
    { heading: "A final selection method", paragraphs: ["First remove every inaccurate image. Next remove technical failures: strange hands, text, reflections, shadows or perspective. Then sort the remaining photos by role and compare only within each role. Choose the clearest opener against other openers, not against a travel image with a different job.", "Finally, read the lineup as a stranger would. Does it show one current person in several believable parts of life? Is each image adding information? If an image needs a long explanation to feel plausible, it probably does not belong." ] },
  ],
  checklist: ["My face is unobscured in the opener", "The opener matches how I look now", "One photo shows my full length", "At least one activity is genuinely mine", "Clothing and settings change across the lineup", "No two photos perform exactly the same role", "AI frames match current camera-roll photos", "I checked every crop on a phone", "Nothing implies a false trip, pet, hobby or lifestyle", "I reviewed Tinder’s current verification guidance"],
  sources: tinderSources,
  faqs: [
    { question: "What should the first Tinder photo be?", answer: "Use a current solo close or chest-up image with visible eyes, ordinary light and a simple background. Recognition matters more than trying to show every part of your personality in one frame." },
    { question: "Should a Tinder profile include a full-body photo?", answer: "A full-length photo is useful because it adds information about build, posture and everyday style. Keep your face identifiable and avoid a distant landscape composition." },
    { question: "Are group photos useful on Tinder?", answer: "A real social image can add context later in the profile, but it should not make someone guess which person you are. Lead with a clear solo image and avoid confusing crops." },
    { question: "Can I use AI-generated Tinder photos?", answer: "Use only images that accurately represent your current appearance and real interests. Mix them with recent camera-roll photos, review Tinder’s policies and never assume verification is guaranteed." },
    { question: "Does photo order affect Tinder’s algorithm?", answer: "Tinder does not publish a complete ranking formula that supports such a claim. Photo order still affects how humans understand the profile, so lead with clarity and make each later image add new information." },
  ],
  productPath: "/dating-photos/tinder",
  productLabel: "Create a complete AI Tinder photo lineup",
}
