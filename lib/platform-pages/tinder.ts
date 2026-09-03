import type { PlatformGuideContent, PlatformLandingContent } from "./types"
import { getPlatformPageCopy } from "./copy"

const tinderSources = [
  { label: "Tinder: Photo Verification", href: "https://www.help.tinder.com/hc/en-us/articles/360034941812-Photo-Verification" },
  { label: "Tinder: Face-photo requirements and hidden profiles", href: "https://www.help.tinder.com/hc/en-us/articles/26151863213837-My-profile-is-hidden" },
  { label: "Tinder Community Guidelines", href: "https://policies.tinder.com/community-guidelines/intl/en/" },
]

export const tinderLanding: PlatformLandingContent = {
  app: "Tinder",
  copy: getPlatformPageCopy("en", "Tinder"),
  path: "/dating-photos/tinder",
  eyebrow: "AI Tinder photo product for men",
  title: "AI Tinder photos that build a complete, believable lineup",
  description: "Create 60 realistic AI Tinder photos across 15 coherent photoshoots from 4–6 selfies. Includes 15 Photo Retakes and delivery within 30 minutes for $39.",
  answer: "UnrealShot turns 4–6 current selfies into 15 coherent four-photo shoots for men building a Tinder profile. Each photoshoot idea is created for your delivery, with connected photos that keep the setting, outfit and lighting consistent while the camera distance and expression change. You receive 60 photos, 15 individual Photo Retakes and delivery within 30 minutes for a one-time $39 payment.",
  reviewed: "August 31, 2026",
  heroBullets: [
    "15 complete shoots and 60 photos",
    "Four related frames per shoot",
    "15 individual Photo Retakes included",
    "Delivered within 30 minutes · $39 once",
  ],
  problemIntro: "Most men already have plenty of pictures. The problem is that the usable ones often come from the same angle, the same room or completely different stages of life. That makes it hard to build a Tinder profile that feels current, natural and visually complete.",
  problems: [
    { title: "Your best recent photo is still a selfie", body: "A clear selfie can show your face, but it rarely gives you the natural setting, body language and camera distance of a photo taken during a real moment." },
    { title: "The rest of your camera roll feels repetitive", body: "Small changes in angle do not create meaningful variety. A stronger photo pool includes different environments, clothing, energy and composition while still looking like the same current person." },
    { title: "Other AI photos change from image to image", body: "When the face, body, clothing and visual finish shift unpredictably, the result feels assembled. UnrealShot creates connected photos within each shoot so one idea looks like one believable moment." },
  ],
  solutionIntro: "UnrealShot creates a complete pool of Tinder-ready dating photos from a small set of current references. Your delivery includes 15 different photoshoot ideas with broad visual variety, while four connected photos from every idea give you natural alternatives from the same moment.",
  differentiators: [
    { title: "Every photoshoot tells one visual story", body: "The photos inside a shoot retain the same environment, clothing and light. Differences in framing, posture and expression feel like moments from the same session instead of unrelated generations." },
    { title: "Fifteen ideas create genuine visual range", body: "Setting, wardrobe, activity, camera distance and mood can change across the delivery. The examples on this site show previous creative directions; your order receives ideas generated from your own references and intake." },
    { title: "Your real life informs the direction", body: "Your answers give UnrealShot useful context about the look and interests that fit you. That context can inspire many different environments and activities rather than mapping one answer to one predetermined scene." },
    { title: "Current selfies keep the focus on you", body: "Your 4–6 recent reference photos guide recognizable facial features throughout the delivery. Fifteen individual Photo Retakes are included for photos you want to improve further." },
  ],
  deliveryPoints: [
    { title: "15 photoshoot ideas created for your delivery", body: "Each delivery explores different combinations of setting, styling, activity, light and mood. The creative possibilities are broader than the examples currently displayed on the site." },
    { title: "Four connected photos from every idea", body: "Each photoshoot produces four natural variations of the same moment. The visual story stays coherent while framing, posture and expression give you meaningful alternatives." },
    { title: "Likeness guided across the full delivery", body: "Your recent selfies remain the visual reference throughout all 60 photos, helping the complete set look recognizably like one current person: you." },
  ],
  sections: [
    {
      heading: "A Tinder profile feels stronger when the photos belong together",
      paragraphs: [
        "People see the profile as one person, not as a collection of independent image files. Large changes in face, age, build or visual finish create uncertainty even when every photo looks polished on its own. UnrealShot uses your current references throughout the delivery so the wider variety still feels connected to you.",
        "Coherence also happens inside every generated photoshoot. Four photos share the same setting, clothing and light, giving you alternatives from one believable moment rather than forcing a single generated image to carry the entire idea.",
      ],
    },
    {
      heading: "Built around recognizable likeness and useful variety",
      paragraphs: [
        "UnrealShot focuses on the qualities visible in the photos themselves. Your current selfies guide likeness, four related frames preserve continuity inside each shoot, and 15 varied ideas expand the settings, wardrobe, camera distance and expressions available in one delivery.",
        "The standard is simple: the result should still look recognizably like you today. The included Photo Retakes let you improve an otherwise strong photo when an important detail, expression or composition needs another pass.",
      ],
    },
    {
      heading: "From reference selfies to 60 finished dating photos",
      paragraphs: [
        "Upload 4–6 recent selfies that show your face clearly from more than one angle, then answer three short questions about the look and genuine interests that fit you. UnrealShot uses that information to create 15 different photoshoot ideas and four connected photos from each one.",
        "The full set of 60 photos arrives within 30 minutes. Your $39 package also includes 15 individual Photo Retakes, so a photo with the right idea can be regenerated without restarting the complete delivery.",
      ],
      bullets: ["One-time price: $39", "No subscription", "15 coherent shoots", "60 total photos", "15 individual Photo Retakes"],
    },
  ],
  exampleSlugs: ["outdoor-coffee", "city-walk", "gym-training", "dinner"],
  policy: [
    "Tinder says a clear face photo is required in many regions and may hide a profile when it cannot detect one. Its guidance asks for a well-lit, unobscured full face.",
    "Tinder Photo Verification compares a short video selfie with profile photos. New photos can be subject to continued verification and may affect verification status.",
    "Use frames that accurately resemble your current appearance and keep your profile consistent with Tinder’s current photo and identity guidance.",
  ],
  sources: tinderSources,
  faqs: [
    { question: "What are AI Tinder photos?", answer: "They are generated profile-photo options created from reference selfies. UnrealShot creates varied shoot ideas for your delivery, then produces four related frames from each idea so you can compare crops and expressions." },
    { question: "How are my Tinder photoshoot ideas created?", answer: "Your current selfies and three intake answers guide the delivery. UnrealShot generates 15 different photoshoot ideas from that context, so the examples on this site show possible results rather than the limits of what can be created." },
    { question: "How many Tinder photos does UnrealShot create?", answer: "One $39 package includes 15 shoots with four related frames each, for 60 photos total. It also includes 15 individual Photo Retakes." },
    { question: "How does UnrealShot keep Tinder photos looking like me?", answer: "Your 4–6 current selfies guide likeness across the generation. Review the delivered frames against how you look today and use an included Photo Retake when an otherwise strong image misses an important detail." },
    { question: "What keeps the four photos in a shoot connected?", answer: "The four frames retain the same setting, outfit and lighting direction while changing camera distance, posture and expression. They read as one short photoshoot rather than unrelated prompts." },
    { question: "Can I improve an individual Tinder photo?", answer: "Yes. The package includes 15 individual Photo Retakes for photos where you want another version of the likeness, expression or composition." },
    { question: "What references should I upload?", answer: "Upload 4–6 recent solo selfies with a visible face, varied angles and ordinary lighting. Avoid old photos, heavy filters, sunglasses and multiple near-identical crops." },
  ],
  guidePath: "/guides/tinder-photos",
  guideLabel: "Read the complete Tinder photo guide",
}

export const tinderGuide: PlatformGuideContent = {
  app: "Tinder",
  copy: getPlatformPageCopy("en", "Tinder"),
  path: "/guides/tinder-photos",
  eyebrow: "Tinder photo guide for men",
  title: "Tinder photos for men: how to build a clear, varied lineup",
  description: "A researched Tinder photo guide for men covering the opener, photo order, crops, common mistakes, AI-photo use and current verification requirements.",
  answer: "A useful Tinder lineup starts with a recent solo photo where your face is immediately clear, then adds full-length, activity, dressed-up and candid context. Every later photo should answer a new question instead of repeating the opener. Keep the set accurate to your current appearance, check every crop on a phone and mix carefully selected AI photos with recent camera-roll evidence.",
  reviewed: "August 31, 2026",
  quickFacts: [["First-photo job", "Immediate recognition"], ["Core variety", "Face, body, activity, context"], ["Face requirement", "At least one in many regions"], ["Verification", "Video selfie compared with profile photos"]],
  sections: [
    { heading: "The first Tinder photo has one primary job", paragraphs: ["Your opener should make identification effortless. Use a solo image with a current haircut and facial hair, visible eyes, clean light and enough space around the head to survive an interface crop. A close or chest-up frame usually communicates faster than a distant landscape photo.", "Do not ask the opener to prove every part of your personality. Its first responsibility is clarity. Lifestyle, clothing range and interests belong in supporting slots where the viewer already knows whom they are looking at."], bullets: ["One clearly visible person", "No sunglasses or phone covering the face", "Current appearance", "Simple background hierarchy", "Natural, readable expression"] },
    { heading: "A six-role Tinder photo order", paragraphs: ["A practical sequence begins with a clear opener, then adds full-length context, a genuine activity, dressed-up contrast, a relaxed expression and recent real-life evidence. Each position should add information the earlier photos did not show.", "If you have fewer strong photos, use fewer distinct roles rather than filling the profile with weak near-duplicates. If you have more available slots, add information—not another crop from the same minute."], bullets: ["1. Clear solo opener", "2. Full-length everyday style", "3. Genuine activity", "4. Smart-casual or evening contrast", "5. Relaxed candid", "6. Recent real social, travel or ordinary-life photo"] },
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
    { question: "How should I decide the order of my Tinder photos?", answer: "Lead with the clearest current image of your face, then let each later photo add something new such as full-length context, a genuine interest, different clothing or a relaxed real-life moment." },
  ],
  productPath: "/dating-photos/tinder",
  productLabel: "Create a complete AI Tinder photo lineup",
}
