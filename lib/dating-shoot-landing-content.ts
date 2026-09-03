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

export type ShootLandingImage = {
  src: string
  alt: string
  caption: string
}

export type ShootLandingCopy = {
  seoTitle: string
  seoDescription: string
  eyebrow: string
  heroTitle: string
  heroAccent: string
  heroDescription: string
  gallery: [ShootLandingImage, ShootLandingImage, ...ShootLandingImage[]]
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
    seoDescription: "Create realistic AI gym dating photos that show an active routine without mirror selfies, awkward poses or a photographer. Get 60 photos for $39.",
    eyebrow: "AI gym dating photos for men",
    heroTitle: "Replace the mirror selfie with",
    heroAccent: "a gym photo that feels natural",
    heroDescription: "Show that training is genuinely part of your week without balancing a phone in the locker room or asking someone to photograph you. UnrealShot turns your current selfies and intake into varied dating-photo ideas, including active settings when fitness fits your life.",
    gallery: [
      { src: "/new-landing/training-floor-morning-2.png", alt: "AI-generated dating photo of a man beside a squat rack in a bright gym", caption: "A clear gym portrait keeps the person more important than the equipment." },
      { src: "/new-landing/training-floor-morning-1.png", alt: "AI-generated dating photo of a man resting with a towel on a daylight gym floor", caption: "A between-set moment communicates routine without using a mirror selfie." },
    ],
    painTitle: "Your current gym photos may be hiding the part worth showing",
    painDescription: "The useful message is that you are active and consistent. A phone covering your face, harsh changing-room light or a row of physique shots makes the photo about proving the workout instead of showing what being around you feels like.",
    pains: [
      { title: "The mirror selfie problem", body: "The phone blocks your posture, the background feels private, and the photo adds little beyond appearance." },
      { title: "Too much posing, not enough activity", body: "A flexed stationary portrait can look performative when the profile needs a believable moment between sets." },
      { title: "Fitness takes over the profile", body: "Several training photos repeat the same information and leave no room for everyday, social or dressed-up context." },
    ],
    showcaseTitle: "Show the routine without turning your profile into a fitness feed",
    showcaseDescription: "Gym settings are one possible direction within a much broader UnrealShot delivery. The strongest results make your face easy to see, give the body a natural action and let the environment support the story instead of dominating it.",
    benefitsTitle: "What the right gym photo does for your profile",
    benefits: [
      { title: "Makes a real routine visible", body: "Fitness becomes something a person can understand immediately, rather than another unsupported line in a prompt or bio." },
      { title: "Keeps your face in the photo", body: "Friend-taken camera angles remove the phone from the frame and keep expression, posture and the training environment readable together." },
      { title: "Adds energy without taking over", body: "An active image can bring movement to the profile while the rest of your delivery supplies everyday, social, outdoor and dressed-up variety." },
    ],
    selectionNote: "Tell UnrealShot that fitness is one of your real interests and it can influence the ideas created for your delivery. The system is not limited to one gym setup: the setting, action, clothing and framing can vary while staying grounded in the information you provide.",
    faqs: [
      { question: "Can UnrealShot create gym photos without the mirror-selfie look?", answer: "Yes. The generated photos use camera positions that create a friend-taken look, with your phone out of frame and the training environment providing context around you." },
      { question: "Will all 15 photoshoot ideas be gym photos?", answer: "No. Fitness can influence part of the delivery when it fits your intake, while the full set explores varied clothing, locations, activities, expressions and times of day." },
    ],
  },
  "outdoor-coffee": {
    seoTitle: "AI Coffee Shop Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI coffee shop dating photos with an approachable, friend-taken look. Get 15 varied photoshoots and 60 photos for $39.",
    eyebrow: "AI coffee shop dating photos",
    heroTitle: "Turn an ordinary coffee stop into",
    heroAccent: "an approachable dating photo",
    heroDescription: "A good coffee photo feels like someone caught you during a normal part of your day—not like you reserved a table for a photoshoot. UnrealShot creates this kind of everyday context from your selfies and intake, alongside many other ideas for a complete profile.",
    gallery: [
      { src: "/new-landing/2ba004de6cf9475b82150b7bd1ff4807.jpg", alt: "AI-generated dating photo of a man picking up coffee and bread in a daylight café", caption: "An everyday errand gives the image context without making the setting the whole story." },
      { src: "/new-landing/ed0d2abb04e84ccca0af74ac8c4b4838.jpg", alt: "AI-generated dating portrait of a man standing by a bright café window", caption: "Window light and relaxed clothing create a familiar, approachable mood." },
      { src: "/new-landing/7545cc16b7a94c059fb42bba5aa0ec03.jpg", alt: "AI-generated half-body dating photo of a man at a neighborhood bakery counter", caption: "The wider view shows everyday style while the face remains easy to read." },
    ],
    painTitle: "A plain selfie shows your face, but not what a moment with you feels like",
    painDescription: "Profiles full of tight selfies can feel repetitive even when every image is clear. The missing piece is often a relaxed, ordinary situation that gives your expression and clothing a believable reason to be in the frame.",
    pains: [
      { title: "Another face-only portrait", body: "A tight crop repeats identity without adding routine, clothing or a place someone can imagine sharing with you." },
      { title: "The cup becomes a prop", body: "Holding coffee directly at the camera can feel staged when the scene should look like a normal pause in your day." },
      { title: "Busy backgrounds steal attention", body: "Crowds, menus and signage can overwhelm a phone-sized profile photo and make your face harder to find." },
    ],
    showcaseTitle: "Make everyday life look easy to step into",
    showcaseDescription: "A café, bakery or outdoor coffee stop can create the low-pressure, friend-taken feeling many camera rolls are missing. UnrealShot can explore different everyday environments rather than repeating one prescribed café setup.",
    benefitsTitle: "Why an everyday coffee photo earns attention",
    benefits: [
      { title: "Feels immediately familiar", body: "A normal coffee stop is easy to understand at a glance, so the image can feel social and approachable without needing an explanation." },
      { title: "Gives casual clothes a reason", body: "Your everyday style reads naturally in a café or neighborhood setting instead of looking selected for a blank-wall portrait." },
      { title: "Adds warmth to a selfie-heavy profile", body: "Natural light, a small action and a relaxed expression create variety without inventing a dramatic hobby or destination." },
    ],
    selectionNote: "Your intake gives UnrealShot enough context to create everyday ideas that fit how you actually spend your time. A coffee-related direction may appear in different locations and moods; it is one possibility inside a delivery built to cover much more than one routine.",
    faqs: [
      { question: "Will every coffee idea show me holding a cup?", answer: "Not necessarily. The setting can be communicated through the counter, terrace, window light or the movement of arriving and leaving, so the result does not need to repeat one obvious prop." },
      { question: "Does choosing coffee mean I only receive café photos?", answer: "No. Your interests help shape the creative range, while the full delivery contains 15 varied photoshoot ideas across different settings, clothing, activities and moods." },
    ],
  },
  dinner: {
    seoTitle: "AI Dinner Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI dinner dating photos that show your current evening style without an old wedding crop or staged restaurant pose. 60 photos for $39.",
    eyebrow: "AI dinner dating photos for men",
    heroTitle: "Show how you look on a night out",
    heroAccent: "without recycling an old wedding photo",
    heroDescription: "Your profile should not jump from casual selfies to a formal photo taken years ago. UnrealShot can create current, smart-casual evening images with warm social context—then balance them with completely different ideas across the rest of your delivery.",
    gallery: [
      { src: "/new-landing/29ecda7f13764ee595abe3c9be049ddb.jpg", alt: "AI-generated evening dating portrait of a man beside a warmly lit rooftop restaurant", caption: "Warm venue light adds evening atmosphere while the face remains the focus." },
      { src: "/new-landing/jzimL01q4n-HYR3LGOpNd_edd9c15406384b23a4881168a98275d2.jpg", alt: "AI-generated half-body dating photo of a man in smart-casual clothes near a restaurant bar", caption: "A small natural action keeps the image from feeling like a formal event portrait." },
      { src: "/new-landing/9f8c395288d14566a2082aa1f97f1a8d.jpg", alt: "AI-generated full-length dating photo of a man seated at an outdoor evening venue", caption: "A wider evening image shows the complete outfit and relaxed body language." },
    ],
    painTitle: "Your camera roll probably skips the version of you who makes an effort",
    painDescription: "Many men have casual photos and one formal group shot from years ago, with nothing in between. That leaves a profile unable to show current evening style without relying on a cropped wedding picture, business headshot or staged table pose.",
    pains: [
      { title: "The outdated wedding photo", body: "It may show formal clothing, but an old haircut, cropped group and event lighting make current appearance uncertain." },
      { title: "The restaurant table pose", body: "Sitting squarely behind plates and glassware hides posture and makes the scene look arranged for the camera." },
      { title: "Trying to signal status", body: "Luxury cues, labels and dramatic venues can feel implausible when the useful message is simply that you clean up well." },
    ],
    showcaseTitle: "Add polish without turning the photo into a status display",
    showcaseDescription: "Dinner, terrace and warm evening settings can show a more intentional side of you without relying on luxury props or stiff posing. The visual direction can change with your intake; it is not tied to one restaurant or outfit.",
    benefitsTitle: "What an evening photo reveals that selfies cannot",
    benefits: [
      { title: "Your current evening style", body: "People can see how you look now when you dress with intention, instead of guessing from an old event photo or office portrait." },
      { title: "A warmer social mood", body: "Restaurant and terrace light gives the profile contrast beside daylight, activity and outdoor images without making the setting feel formal." },
      { title: "Confidence without a performance", body: "Relaxed movement and natural expressions communicate an evening out without leaning on labels, exclusivity or exaggerated luxury." },
    ],
    selectionNote: "Your answers can lead UnrealShot toward polished evening ideas when that genuinely suits your life. The system can vary the venue, clothing, crop and action, while the full delivery also explores daylight, casual, active and candid possibilities.",
    faqs: [
      { question: "Can the result look polished without feeling corporate?", answer: "Yes. Smart-casual clothing, warm venue light and relaxed body language create a different visual language from suits, office backgrounds and studio headshots." },
      { question: "Will my delivery contain only restaurant scenes?", answer: "No. An evening direction is one possible part of the range. Every order includes 15 varied photoshoot ideas designed to give your profile different settings, outfits, activities and moods." },
    ],
  },
  "city-walk": {
    seoTitle: "AI City Street Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI city dating photos that show everyday style and natural movement without stiff wall poses or asking a friend to follow you around.",
    eyebrow: "AI city street dating photos",
    heroTitle: "Get a natural full-length dating photo",
    heroAccent: "without the stiff wall pose",
    heroDescription: "Show your build, posture and everyday style in motion instead of using a fitting-room mirror or a distant travel crop. UnrealShot can create city-based ideas with a friend-taken feel, alongside many other settings shaped by your selfies and intake.",
    gallery: [
      { src: "/new-landing/98d351a9c32544b6a6cf67f849b3709d.jpg", alt: "AI-generated full-length dating photo of a man standing naturally above a city street", caption: "A wider frame shows everyday clothing and posture without a rigid wall pose." },
      { src: "/new-landing/3TZbYnm-kqNBZfoXDdx7W_f7197f805cd34f84b2252dcacd65ee49.jpg", alt: "AI-generated dating photo of a man in relaxed city clothing looking across an urban view", caption: "A natural pause gives the body something to do while the city stays secondary." },
      { src: "/new-landing/qypjwusLmXPBiDK6QDNwN_185eda5c96bc4c2ba32d238a42ba51a9.jpg", alt: "AI-generated candid dating photo of a man smiling in an everyday urban setting", caption: "An off-camera expression makes the result feel less arranged and more social." },
    ],
    painTitle: "Most full-length photos prove your height but lose your personality",
    painDescription: "A mirror, empty wall or distant vacation shot may technically show your whole body, yet still feel flat. The better result combines recognizable appearance, everyday clothing, posture and a reason for the moment to be happening.",
    pains: [
      { title: "The awkward standing pose", body: "Straight arms and a square stance make an ordinary outfit feel like a product listing rather than part of your day." },
      { title: "The distant travel photo", body: "Scenery dominates while your face becomes too small to recognize inside the app crop." },
      { title: "No movement or expression", body: "A static full-body frame adds proportions but can still leave the profile feeling flat and overly deliberate." },
    ],
    showcaseTitle: "Let movement do the work that posing cannot",
    showcaseDescription: "Walking, turning, waiting at a corner or reacting to something outside the frame can make a full-length image feel observed instead of staged. UnrealShot can explore many urban situations; the result is not limited to one street or one pose.",
    benefitsTitle: "What an urban full-length photo adds",
    benefits: [
      { title: "Shows more than a headshot", body: "A wider camera distance makes your build, posture and complete outfit visible while still keeping the person large enough for a phone screen." },
      { title: "Makes everyday clothes look intentional", body: "A jacket, knit or overshirt feels connected to a real outing rather than selected only for a mirror photo." },
      { title: "Introduces natural movement", body: "Walking and off-camera moments break the repeated face-forward posture that makes a profile feel like six versions of one selfie." },
    ],
    selectionNote: "UnrealShot creates the final photoshoot ideas from your references and answers. City life can influence those ideas when it reflects you, but the creative output can move across streets, cafés, architecture, parks and other believable situations rather than one fixed walk.",
    faqs: [
      { question: "Can UnrealShot create full-length photos from ordinary selfies?", answer: "Yes. Your 4–6 reference selfies guide your current appearance, while the generated photos can expand into wider compositions that show clothing, posture and environment." },
      { question: "Are the city photos limited to the settings shown here?", answer: "No. These images show the general value of an urban direction. Your 15 photoshoot ideas are generated from your own references and intake, so locations and actions can vary substantially." },
    ],
  },
  "coastal-travel": {
    seoTitle: "AI Coastal Travel Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI travel dating photos that keep you visible while adding outdoor scale, movement and personality. Get 60 dating photos for $39.",
    eyebrow: "AI coastal travel dating photos",
    heroTitle: "Bring travel energy to your profile",
    heroAccent: "without becoming a dot in the scenery",
    heroDescription: "Show curiosity, movement and time outdoors while keeping your current face and style easy to see. UnrealShot can create travel-oriented ideas when they fit your real interests, then surround them with more everyday settings across the full delivery.",
    gallery: [
      { src: "/new-landing/40fcfc106da3473496cb7bde4a9e9c61 (1).jpg", alt: "AI-generated dating portrait of a man in relaxed clothing near a coastal landscape", caption: "The landscape adds openness while the face and current appearance stay easy to read." },
      { src: "/new-landing/49f810cc6e4344b480aadb5df98f6d7d.jpg", alt: "AI-generated half-body dating photo of a man pausing above the coast", caption: "A natural pause lets the setting support the image instead of swallowing the person." },
      { src: "/new-landing/d8800712954d45639eb5caa2ab54f3e4.jpg", alt: "AI-generated full-length dating photo of a man in a bright coastal setting", caption: "A wider composition shows the complete travel outfit while preserving a readable expression." },
      { src: "/new-landing/fa9c4cc3f3a3413c8ae0e898869f1f49.jpg", alt: "AI-generated outdoor dating photo of a man beside open water with a day pack", caption: "An active outdoor setting can add genuine interest when travel belongs in your life." },
    ],
    painTitle: "Most travel photos remember the place and forget the profile",
    painDescription: "Wide landscapes, sunglasses and back-facing poses may work in a trip album, but they leave a dating profile unclear about who is actually in it. A stronger image preserves the scale of the setting while keeping your appearance readable.",
    pains: [
      { title: "You become a dot in the landscape", body: "A scenic wide shot may look good in an album but becomes unreadable inside a small dating-profile crop." },
      { title: "Every travel photo hides the face", body: "Hats, sunglasses and back-facing poses can create variety while adding no identity clarity." },
      { title: "The setting feels borrowed", body: "A destination selected only to look impressive can disconnect from your prompts, routine and actual interests." },
    ],
    showcaseTitle: "Keep the outdoor feeling and make yourself the subject",
    showcaseDescription: "Water, open space and relaxed movement can create visual energy without hiding your face. Coastal travel is one expression of this direction; UnrealShot can generate different outdoor ideas based on what genuinely fits your life.",
    benefitsTitle: "What a believable travel photo contributes",
    benefits: [
      { title: "A sense of life beyond the screen", body: "Open scenery and outdoor clothing introduce scale, movement and curiosity without requiring an extreme adventure story." },
      { title: "You remain recognizable", body: "Closer compositions keep your face clear, while wider options can show the setting and full outfit without reducing you to a tiny figure." },
      { title: "A real subject to talk about", body: "When travel, beaches or time outdoors genuinely matter to you, the photo gives the profile a specific part of your life to respond to." },
    ],
    selectionNote: "Tell UnrealShot which interests and environments actually fit you. Travel can influence part of the creative direction without defining the entire delivery; your other results can still show local routines, casual style, evenings and indoor moments.",
    faqs: [
      { question: "Can a travel photo keep my face clear?", answer: "Yes. UnrealShot can create closer and wider compositions, so the environment contributes atmosphere while your current appearance remains the focus." },
      { question: "Does selecting travel guarantee one exact destination?", answer: "Your interests guide the creative direction, but UnrealShot creates the final ideas for your delivery. The result is not a destination picker or a fixed catalog of named scenes." },
    ],
  },
  "home-cooking": {
    seoTitle: "AI Cooking Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI cooking dating photos that show warmth and a genuine home interest without staging a kitchen photoshoot. Get 60 photos for $39.",
    eyebrow: "AI cooking dating photos for men",
    heroTitle: "Show the warmer side of your life",
    heroAccent: "without staging a kitchen photoshoot",
    heroDescription: "If cooking is genuinely part of your life, it can give your profile more personality than another outdoor portrait. UnrealShot can turn that interest into relaxed, friend-taken dating-photo ideas—without asking you to set up a tripod, spotless kitchen or fake chef pose.",
    gallery: [
      { src: "/new-landing/cf26ce46ee2b4559b3074b6df276b578.jpg", alt: "AI-generated dating portrait of a man in a warm daylight kitchen", caption: "A home setting creates warmth while the close composition keeps the face clear." },
      { src: "/new-landing/519170ac2c004900af87f015bf5a1771.jpg", alt: "AI-generated half-body dating photo of a man beside a kitchen counter in window light", caption: "A wider view makes the home environment visible without turning it into a property photo." },
      { src: "/new-landing/5cc8c2fbbd9a4e8b92ebbe72530d367e.jpg", alt: "AI-generated candid dating photo of a man holding a mug in a lived-in kitchen", caption: "A small everyday action gives the hands a purpose and softens the pose." },
      { src: "/new-landing/4436e4eadfa843ab94ad12db98a8664b.jpg", alt: "AI-generated dating photo of a man smiling naturally beside a bright kitchen window", caption: "A relaxed expression makes the home setting feel personal rather than staged." },
    ],
    painTitle: "Cooking adds personality only when the moment feels lived in",
    painDescription: "A spotless showroom kitchen, costume-like apron or direct-to-camera utensil pose can make a genuine interest look manufactured. The value is not pretending to be a chef; it is showing a warm, specific part of ordinary life.",
    pains: [
      { title: "The staged chef impression", body: "Special clothing and exaggerated plating can imply expertise instead of showing the ordinary way you cook at home." },
      { title: "Hands and props take over", body: "Ingredients, utensils and counters can crowd the frame until your expression and identity become secondary." },
      { title: "The interest is not actually yours", body: "A cooking scene creates the wrong conversation if you selected it only because it seemed attractive." },
    ],
    showcaseTitle: "Make a home interest visible without overplaying it",
    showcaseDescription: "Kitchen light, relaxed clothing and small natural actions can create a warm change from street and travel photos. UnrealShot can explore different food and home-life ideas when they match your intake; it is not limited to the exact setting shown here.",
    benefitsTitle: "What a genuine cooking photo adds",
    benefits: [
      { title: "Substance behind an interest", body: "The image turns cooking, food or a quiet weekend routine into something visible instead of leaving it as another generic prompt answer." },
      { title: "Warmth through ordinary action", body: "Preparing something, checking a pan or holding a mug gives the hands a purpose and makes relaxed expressions feel earned." },
      { title: "A more personal environment", body: "A home setting adds a different emotional texture beside public, outdoor and dressed-up images elsewhere in the delivery." },
    ],
    selectionNote: "Cooking can influence your results when you include it among your genuine interests. UnrealShot decides the final creative execution, so the idea might involve preparation, coffee, groceries or another believable food-related moment rather than one repeated kitchen setup.",
    faqs: [
      { question: "Do I need to be a serious cook for this direction to fit?", answer: "No. The point is ordinary home life, not professional chef skill. If you genuinely cook for yourself, enjoy food or spend time in the kitchen, the interest can support a believable creative direction." },
      { question: "Will all four photos in an idea be the same pose?", answer: "No. Every photoshoot idea produces four connected photos, with changes in camera distance, expression and action so you have useful alternatives from the same visual story." },
    ],
  },
  rooftop: {
    seoTitle: "AI Rooftop Dating Photos for Men | UnrealShot",
    seoDescription: "Create realistic AI rooftop dating photos with natural city atmosphere and current evening style—without arranging a photographer or luxury venue.",
    eyebrow: "AI rooftop dating photos for men",
    heroTitle: "Add city atmosphere to your profile",
    heroAccent: "without arranging a rooftop photoshoot",
    heroDescription: "Show a more polished, evening side of yourself without booking a venue or asking a friend to take fifty awkward photos. UnrealShot can create rooftop and city-view ideas with relaxed body language, then balance them with very different settings across your delivery.",
    gallery: [
      { src: "/new-landing/3TZbYnm-kqNBZfoXDdx7W_f7197f805cd34f84b2252dcacd65ee49.jpg", alt: "AI-generated full-length dating photo of a man in relaxed clothes on a city rooftop", caption: "A natural stance and everyday outfit keep the rooftop setting believable." },
      { src: "/new-landing/98d351a9c32544b6a6cf67f849b3709d.jpg", alt: "AI-generated rooftop dating photo of a man holding a mug above a city view", caption: "A small action creates an observed moment instead of a fixed skyline pose." },
      { src: "/new-landing/qypjwusLmXPBiDK6QDNwN_185eda5c96bc4c2ba32d238a42ba51a9.jpg", alt: "AI-generated candid dating photo of a man smiling on a rooftop terrace", caption: "A relaxed expression adds warmth to the harder lines of the urban setting." },
      { src: "/new-landing/SHnKUu0hqzogDc12-W8eP_24713af628db4f8b95aba0dc06caf9a6.jpg", alt: "AI-generated full-length dating photo of a man carrying a bag on a city terrace", caption: "A wider environmental frame can show complete style and a sense of movement." },
    ],
    painTitle: "City views stop helping when the photo starts performing status",
    painDescription: "A rooftop can add useful atmosphere and evening contrast, but exaggerated luxury cues or a rigid personal-branding pose can make the setting feel like the subject. The photo works when it still looks like a believable moment from your life.",
    pains: [
      { title: "The skyline steals the frame", body: "A wide overlook can reduce you to scenery and add no useful detail about current appearance or expression." },
      { title: "The pose feels promotional", body: "Leaning against a rail with a fixed serious expression can resemble a personal-branding shoot rather than a dating photo." },
      { title: "The lifestyle looks implausible", body: "Exclusive venues and exaggerated styling can conflict with the rest of an otherwise ordinary, believable profile." },
    ],
    showcaseTitle: "Use the skyline as atmosphere, not as a personality",
    showcaseDescription: "A terrace, city view or golden-hour roof can give the profile a polished change of pace while natural posture and familiar clothing keep it grounded. UnrealShot can vary the city setting rather than producing one fixed rooftop formula.",
    benefitsTitle: "What a grounded rooftop photo adds",
    benefits: [
      { title: "A polished change of pace", body: "City light and a clean evening layer introduce contrast beside casual daylight, activity and at-home photos." },
      { title: "Confidence with movement", body: "Walking, turning and looking away from the camera make the result feel observed rather than arranged for a personal-branding shoot." },
      { title: "Urban context without the flex", body: "A believable terrace creates atmosphere while keeping the message focused on how you look and carry yourself." },
    ],
    selectionNote: "City and architecture interests can shape the ideas UnrealShot creates for you. Rooftops are only one possible expression: your delivery can explore terraces, streets, cafés and other believable urban contexts alongside non-city settings.",
    faqs: [
      { question: "Can rooftop photos feel natural rather than staged?", answer: "Yes. Everyday clothing, believable terraces, natural posture and small actions keep the city view in a supporting role instead of making the image feel like a status display." },
      { question: "Are rooftop settings the only city photos UnrealShot creates?", answer: "No. The creative ideas can cover many urban environments and actions when city life fits your intake. Your complete delivery also includes variety beyond one type of setting." },
    ],
  },
}

export function getShootLandingContent(slug: string) {
  return shootLandingContent[slug]
}
