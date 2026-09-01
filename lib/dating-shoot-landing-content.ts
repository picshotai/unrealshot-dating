export type ShootLandingBenefit = {
  title: string
  body: string
}

export type ShootLandingPain = {
  title: string
  body: string
}

export type ShootLandingFaq = {
  question: string
  answer: string
}

export type ShootLandingCopy = {
  seoTitle: string
  seoDescription: string
  eyebrow: string
  heroTitle: string
  heroAccent: string
  heroDescription: string
  painTitle: string
  painDescription: string
  pains: [ShootLandingPain, ShootLandingPain, ShootLandingPain]
  showcaseTitle: string
  showcaseDescription: string
  benefitsTitle: string
  benefits: [ShootLandingBenefit, ShootLandingBenefit, ShootLandingBenefit]
  selectionNote: string
  faqs: ShootLandingFaq[]
}

export const shootLandingContent: Record<string, ShootLandingCopy> = {
  "gym-training": {
    seoTitle: "AI Gym Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI gym dating photos that show an active lifestyle without relying on mirror selfies. Four coherent frames inside your UnrealShot delivery.",
    eyebrow: "AI gym dating photos for men",
    heroTitle: "Show that fitness is part of your life—",
    heroAccent: "without using another mirror selfie",
    heroDescription: "Turn a genuine training routine into a natural dating-profile scene. UnrealShot creates clear, fully clothed gym photos with visible movement, readable expressions and four framing options from the same session.",
    painTitle: "Most gym photos communicate the wrong thing",
    painDescription: "A gym photo should add activity and routine to your profile. Bathroom mirrors, harsh locker-room light and repeated physique shots can make the image feel more focused on proving something than showing your life.",
    pains: [
      { title: "The mirror selfie problem", body: "The phone blocks your posture, the background feels private, and the photo adds little beyond appearance." },
      { title: "Too much posing, not enough activity", body: "A flexed stationary portrait can look performative when the profile needs a believable moment between sets." },
      { title: "Fitness takes over the profile", body: "Several training photos repeat the same information and leave no room for everyday, social or dressed-up context." },
    ],
    showcaseTitle: "Choose the gym frame that feels active, clear and approachable",
    showcaseDescription: "The same training floor, outfit and daylight continue across a close portrait, half-body rest moment, full-length view and relaxed expression. You choose one accurate frame for the profile; the rest are alternatives.",
    benefitsTitle: "What a useful gym photo adds to your lineup",
    benefits: [
      { title: "A real weekly interest", body: "Fitness becomes a visible part of your routine instead of an unsupported prompt or bio claim." },
      { title: "Movement without visual clutter", body: "Equipment stays in the background while your face, posture and training context remain easy to read." },
      { title: "Energy balanced with warmth", body: "Focused frames show activity; the candid option prevents the scene from feeling overly serious or physique-led." },
    ],
    selectionNote: "If your delivery includes a fitness-oriented idea, keep it only when training is genuinely part of your week. Use one accurate frame and balance it with different generated or camera-roll contexts.",
    faqs: [
      { question: "Will the gym photos look like mirror selfies?", answer: "No. The scene uses friend-taken camera positions on a training floor, with the phone out of frame and ordinary gym activity visible." },
      { question: "Should I use more than one gym photo?", answer: "Usually not. Select the most accurate frame, then use other scenes to show everyday style, interests and evening context." },
    ],
  },
  "outdoor-coffee": {
    seoTitle: "AI Coffee Shop Dating Photos for Men | UnrealShot",
    seoDescription: "Create approachable AI coffee shop dating photos with natural daylight, everyday clothing and candid framing across one coherent UnrealShot scene.",
    eyebrow: "AI coffee shop dating photos",
    heroTitle: "Look approachable in an everyday setting—",
    heroAccent: "not staged against a blank wall",
    heroDescription: "A coffee scene gives your profile a familiar, low-pressure moment where your face stays clear and your normal style has context. UnrealShot creates four related options from the same outdoor café visit.",
    painTitle: "Your clearest selfie may still say nothing about being around you",
    painDescription: "A close portrait can identify you, but a complete profile also needs an ordinary moment that feels easy to join. The wrong café image becomes a table pose; the right one feels relaxed and specific.",
    pains: [
      { title: "Another face-only portrait", body: "A tight crop repeats identity without adding routine, clothing or a place someone can imagine sharing with you." },
      { title: "The cup becomes a prop", body: "Holding coffee directly at the camera can feel staged when the scene should look like a normal pause in your day." },
      { title: "Busy backgrounds steal attention", body: "Crowds, menus and signage can overwhelm a phone-sized profile photo and make your face harder to find." },
    ],
    showcaseTitle: "See the same café moment from four useful distances",
    showcaseDescription: "Open shade, casual layers and one neighborhood terrace stay consistent while the camera moves from a clear portrait to wider context and a natural reaction.",
    benefitsTitle: "Why coffee photos work inside a varied profile",
    benefits: [
      { title: "An approachable early-slot option", body: "The setting feels familiar while the close frame keeps current appearance and expression easy to understand." },
      { title: "Everyday style with context", body: "Casual clothing reads more naturally at a café than in a posed studio or empty indoor background." },
      { title: "A low-pressure conversation cue", body: "The scene can support a genuine interest in cafés, neighborhoods or simple weekend routines without inventing a persona." },
    ],
    selectionNote: "If your delivery includes an everyday café-like idea, keep it only when that direction fits your real routine. Combine the strongest frame with different settings from the rest of your results.",
    faqs: [
      { question: "Can a coffee photo work as the first profile photo?", answer: "The close frame can work early when your face and eyes remain clear. Use the wider or candid frame later if the setting becomes more important than identification." },
      { question: "Will every frame show a coffee cup?", answer: "No. The four-frame scene varies crop and action so the café context feels natural rather than repeating the same prop pose." },
    ],
  },
  dinner: {
    seoTitle: "AI Dinner Dating Photos for Men | UnrealShot",
    seoDescription: "Create polished AI dinner dating photos with warm restaurant light, smart-casual clothing and relaxed expressions across one coherent UnrealShot scene.",
    eyebrow: "AI dinner dating photos for men",
    heroTitle: "Add a dressed-up dating photo—",
    heroAccent: "without looking like a corporate portrait",
    heroDescription: "Show how you look when you make an effort for an evening out. UnrealShot creates a warm restaurant scene with smart-casual styling, relaxed body language and four related framing choices.",
    painTitle: "Most men have no current photo between casual and formal",
    painDescription: "The camera roll often jumps from T-shirts and group photos to a wedding suit from years ago. A dating profile needs a current evening image that looks polished without becoming a business headshot or luxury performance.",
    pains: [
      { title: "The outdated wedding photo", body: "It may show formal clothing, but an old haircut, cropped group and event lighting make current appearance uncertain." },
      { title: "The restaurant table pose", body: "Sitting squarely behind plates and glassware hides posture and makes the scene look arranged for the camera." },
      { title: "Trying to signal status", body: "Luxury cues, labels and dramatic venues can feel implausible when the useful message is simply that you clean up well." },
    ],
    showcaseTitle: "See a polished evening look without losing warmth",
    showcaseDescription: "One restaurant, evening layer and warm lighting setup continue from the close portrait through the arrival, seated and candid frames. Select the option that looks most like you today.",
    benefitsTitle: "What the dinner scene adds that casual photos cannot",
    benefits: [
      { title: "A current dressed-up reference", body: "People can see your present haircut, facial hair and smart-casual style instead of relying on an old event photo." },
      { title: "Evening contrast", body: "Warm indoor light and darker clothing create visual range beside daylight coffee, activity and travel images." },
      { title: "A date-relevant setting", body: "The scene shows how you might appear during an ordinary evening out without implying wealth or exclusivity." },
    ],
    selectionNote: "If your delivery includes a polished evening idea, use one accurate frame as contrast and balance it with daylight, full-length and real-interest photos.",
    faqs: [
      { question: "Do dinner photos look overly formal?", answer: "The scene uses smart-casual clothing and relaxed restaurant actions rather than suits, studio posing or corporate lighting." },
      { question: "Where should a dinner photo appear in my profile?", answer: "It usually works after a clearer daylight opener and full-length image, where it adds evening contrast without carrying the whole profile." },
    ],
  },
  "city-walk": {
    seoTitle: "AI City Street Dating Photos for Men | UnrealShot",
    seoDescription: "Create natural AI city street dating photos with movement, everyday style and full-length framing across one coherent UnrealShot city walk.",
    eyebrow: "AI city street dating photos",
    heroTitle: "Get the full-length photo your profile needs—",
    heroAccent: "without standing stiffly for the camera",
    heroDescription: "A city walk adds posture, clothing and movement while keeping the setting familiar. UnrealShot follows one believable street moment through close, half-body, full-length and candid options.",
    painTitle: "Full-length photos fail when posing becomes the whole image",
    painDescription: "People want to understand your build and everyday style. A distant vacation crop, fitting-room mirror or rigid wall pose technically shows your body but rarely feels natural inside a dating profile.",
    pains: [
      { title: "The awkward standing pose", body: "Straight arms and a square stance make an ordinary outfit feel like a product listing rather than part of your day." },
      { title: "The distant travel photo", body: "Scenery dominates while your face becomes too small to recognize inside the app crop." },
      { title: "No movement or expression", body: "A static full-body frame adds proportions but can still leave the profile feeling flat and overly deliberate." },
    ],
    showcaseTitle: "Use movement to show build and style more naturally",
    showcaseDescription: "The street, outfit and late-afternoon light stay related while the camera changes distance and catches walking, pausing and reacting off-camera.",
    benefitsTitle: "Why a city walk is more useful than another portrait",
    benefits: [
      { title: "A natural full-length option", body: "Walking posture shows silhouette and clothing without asking you to perform a stiff head-to-toe pose." },
      { title: "Everyday style in context", body: "A jacket, knit or overshirt feels connected to a real outing rather than selected only for a photo session." },
      { title: "Range from one believable moment", body: "Close and candid alternatives give you flexibility when the full-length frame is not the strongest likeness." },
    ],
    selectionNote: "If your generated results include an urban walking idea, the full-length or half-body frame can add style and posture after a clear opener. Treat this page as an example, not a scene request.",
    faqs: [
      { question: "Is the city walk mainly a full-length shoot?", answer: "It includes a full-length walking frame, plus close, half-body and candid alternatives from the same street and outfit." },
      { question: "Will the city background look distracting?", answer: "The scene uses textured architecture and light foot traffic while keeping the subject large enough to read on a phone screen." },
    ],
  },
  "coastal-travel": {
    seoTitle: "AI Coastal Travel Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI coastal dating photos with open scenery, movement and clear framing across one coherent UnrealShot travel scene.",
    eyebrow: "AI coastal travel dating photos",
    heroTitle: "Bring outdoor energy to your profile—",
    heroAccent: "without disappearing into the scenery",
    heroDescription: "A coastal scene can show movement, curiosity and a genuine love of the water while keeping you—not the landscape—as the subject. UnrealShot creates four related options from one breezy coastal walk.",
    painTitle: "Travel photos often prove the destination but hide the person",
    painDescription: "Wide landscapes, sunglasses and tiny figures can document a trip without helping someone understand your current appearance. The useful version preserves the setting while keeping your face, outfit and expression readable.",
    pains: [
      { title: "You become a dot in the landscape", body: "A scenic wide shot may look good in an album but becomes unreadable inside a small dating-profile crop." },
      { title: "Every travel photo hides the face", body: "Hats, sunglasses and back-facing poses can create variety while adding no identity clarity." },
      { title: "The setting feels borrowed", body: "A destination selected only to look impressive can disconnect from your prompts, routine and actual interests." },
    ],
    showcaseTitle: "Keep the coast visible while making you the subject",
    showcaseDescription: "The path, relaxed travel layers and bright coastal light remain consistent while framing moves closer, wider and into a natural wind-reactive expression.",
    benefitsTitle: "What a grounded travel photo contributes",
    benefits: [
      { title: "Outdoor context without losing clarity", body: "Water and open space create atmosphere while the close and half-body frames keep your current appearance readable." },
      { title: "Movement instead of landmark posing", body: "Walking and reacting to the environment make the scene feel like part of a trip rather than proof of arrival." },
      { title: "A genuine conversation direction", body: "When coastal travel is part of your life, the image gives someone a specific interest or memory to ask about." },
    ],
    selectionNote: "If your delivery includes a coastal or travel-oriented idea, keep it only when that direction belongs in your real life. Balance it with ordinary local or camera-roll context.",
    faqs: [
      { question: "Will the landscape make me too small in the photo?", answer: "The shoot includes close and half-body frames that preserve coastal context without reducing you to a distant figure." },
      { question: "Should I use a coastal scene if I rarely travel?", answer: "No. Select it only when the setting reflects a genuine interest or experience you would be comfortable discussing." },
    ],
  },
  "home-cooking": {
    seoTitle: "AI Cooking Dating Photos for Men | UnrealShot",
    seoDescription: "Create warm AI cooking dating photos that show a genuine home interest with natural action, window light and four coherent UnrealShot frames.",
    eyebrow: "AI cooking dating photos for men",
    heroTitle: "Turn a real home interest into—",
    heroAccent: "an easy conversation starter",
    heroDescription: "If you genuinely cook, show it as a relaxed part of your life instead of writing another generic food prompt. UnrealShot creates one warm kitchen moment across four useful framing options.",
    painTitle: "A kitchen photo looks fake when the activity stops for the pose",
    painDescription: "Cooking can add warmth and personality, but spotless show kitchens, chef costumes and direct-to-camera utensil poses turn a believable interest into an advertisement.",
    pains: [
      { title: "The staged chef impression", body: "Special clothing and exaggerated plating can imply expertise instead of showing the ordinary way you cook at home." },
      { title: "Hands and props take over", body: "Ingredients, utensils and counters can crowd the frame until your expression and identity become secondary." },
      { title: "The interest is not actually yours", body: "A cooking scene creates the wrong conversation if you selected it only because it seemed attractive." },
    ],
    showcaseTitle: "See one cooking moment move from portrait to action",
    showcaseDescription: "The same lived-in kitchen, relaxed clothing and window light continue while you prepare ingredients, check the food and react naturally between steps.",
    benefitsTitle: "Why cooking can add more than another outdoor photo",
    benefits: [
      { title: "A specific real-life interest", body: "The image gives visible substance to a cooking, food or Sunday-routine prompt when those details are true for you." },
      { title: "Warmth through natural action", body: "Preparing food gives the hands a purpose and makes relaxed expressions feel connected to a real moment." },
      { title: "Indoor variety", body: "Window light and a home setting break up a lineup dominated by streets, trips and outdoor portraits." },
    ],
    selectionNote: "If your delivery includes a home-interest idea, keep it only when the activity is genuine. Use one strong frame and pair it with a different outdoor, full-length or dressed-up result.",
    faqs: [
      { question: "Do I need to be a serious cook for an idea like this to fit?", answer: "No. This example represents ordinary home cooking, not professional chef skill. If a generated idea shows cooking, it should still reflect something that genuinely belongs in your life." },
      { question: "Which cooking frame is most useful?", answer: "The half-body or candid option usually adds activity and expression without letting the kitchen context overwhelm your face." },
    ],
  },
  rooftop: {
    seoTitle: "AI Rooftop Dating Photos for Men | UnrealShot",
    seoDescription: "Create polished AI rooftop dating photos with golden-hour city light, smart-casual style and four coherent UnrealShot framing options.",
    eyebrow: "AI rooftop dating photos for men",
    heroTitle: "Add an evening photo with confidence—",
    heroAccent: "without pretending to live a luxury lifestyle",
    heroDescription: "A rooftop can add city light, cleaner styling and a polished change of pace. UnrealShot keeps the scene believable with an accessible terrace, ordinary evening layers and relaxed movement.",
    painTitle: "A polished photo backfires when the setting becomes a status claim",
    painDescription: "City views and evening clothes can create useful contrast, but dramatic luxury cues make the image feel like it is selling access instead of showing how you look on a normal night out.",
    pains: [
      { title: "The skyline steals the frame", body: "A wide overlook can reduce you to scenery and add no useful detail about current appearance or expression." },
      { title: "The pose feels promotional", body: "Leaning against a rail with a fixed serious expression can resemble a personal-branding shoot rather than a dating photo." },
      { title: "The lifestyle looks implausible", body: "Exclusive venues and exaggerated styling can conflict with the rest of an otherwise ordinary, believable profile." },
    ],
    showcaseTitle: "Use city light as atmosphere, not as the entire message",
    showcaseDescription: "The terrace, evening layer and golden-hour transition stay consistent across a clear portrait, half-body view, full-length walk and quieter candid expression.",
    benefitsTitle: "What a believable rooftop scene adds",
    benefits: [
      { title: "A polished visual contrast", body: "Evening light and a clean jacket add range beside coffee, cooking, training and daytime walking photos." },
      { title: "Confidence without stiffness", body: "Movement and looking-away options prevent the scene from becoming one rigid skyline portrait." },
      { title: "Recognizable city context", body: "The setting adds urban atmosphere while keeping wealth, access and exclusivity out of the message." },
    ],
    selectionNote: "If your delivery includes a polished city-evening idea, use one accurate frame later in the lineup and pair it with ordinary daytime or camera-roll context.",
    faqs: [
      { question: "Will a rooftop photo look like a luxury flex?", answer: "The scene uses an ordinary accessible terrace, restrained styling and relaxed action rather than exclusive venues or status props." },
      { question: "Is a rooftop photo suitable as the first image?", answer: "Usually it works better after a clear daylight opener. Use it later to add evening style and visual contrast." },
    ],
  },
}

export function getShootLandingContent(slug: string) {
  return shootLandingContent[slug]
}
