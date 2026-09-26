export type ShootFrame = {
  role: string
  src: string
  alt: string
  caption: string
}

export type DatingShoot = {
  slug: string
  name: string
  title: string
  description: string
  answer: string
  interest: string
  location: string
  clothing: string
  lighting: string
  action: string
  profileFit: string
  pairing: string
  appName: "Tinder" | "Hinge" | "Bumble"
  appUse: string
  relatedSlug: string
  frames: [ShootFrame, ShootFrame, ShootFrame, ShootFrame]
}

export const datingShoots: DatingShoot[] = [
  {
    slug: "gym-training", name: "Gym training", title: "Gym training dating photo shoot", description: "A coherent four-frame gym shoot for men who genuinely train, with natural daylight and between-set moments.", interest: "Fitness", location: "A bright, modern training floor with uncluttered equipment", clothing: "A fitted, ordinary training top and neutral gym clothes", lighting: "Soft daylight mixed with practical indoor light", action: "Resting between sets, adjusting equipment and moving naturally through the space", profileFit: "Use the close frame after a simpler opener or the half-body frame as the main activity image.", pairing: "Pair it with an outdoor coffee or dressed-up dinner photo so fitness does not become the whole profile.", appName: "Hinge", appUse: "On Hinge, this shoot can support a prompt about training, routine or wellbeing. Use it only if fitness is genuinely part of your week.", relatedSlug: "outdoor-coffee", answer: "A gym shoot contributes energy, routine and a clear real-life interest without relying on a mirror selfie. These four frames keep the same training environment and clothing while changing crop and expression. It suits men who actually exercise and works best as one activity image inside a more varied dating profile.",
    frames: [
      { role: "Close / opener", src: "/pages/dating_gym_photo.webp", alt: "AI-generated dating profile photo of the same man between sets in a daylight gym, close frame from a four-photo UnrealShot shoot", caption: "The close frame keeps the equipment secondary so expression and current appearance remain easy to read." },
      { role: "Half-body", src: "/pages/dating_gym_photo2.webp", alt: "AI-generated half-body dating photo of the same man resting beside gym equipment in soft morning light", caption: "A half-body view shows training context without turning the image into a physique-only photo." },
      { role: "Full-length", src: "/pages/dating_gym_photo3.webp", alt: "AI-generated full-length dating photo of the same man on a modern gym floor in simple training clothes", caption: "The wide frame adds posture, clothing and enough environment to make the activity believable." },
      { role: "Candid / expression", src: "/pages/dating_gym_photo4.webp", alt: "AI-generated candid dating photo of the same man smiling naturally during a gym training session", caption: "The final frame adds warmth and breaks from the more focused expressions common in fitness photos." },
    ],
  },
  {
    slug: "outdoor-coffee", name: "Outdoor coffee", title: "Outdoor coffee dating photo shoot", description: "Four relaxed outdoor café frames that create an approachable everyday dating-profile moment.", interest: "Coffee", location: "A neighborhood café terrace with a walkable street behind it", clothing: "Clean casual layers in natural colors", lighting: "Open shade and late-morning daylight", action: "Arriving with coffee, pausing at a table and reacting to someone nearby", profileFit: "The close or candid frame can work early in a lineup because the setting is familiar and the face stays clear.", pairing: "Pair it with a full-length city walk or a more intentional dinner photo for contrast.", appName: "Bumble", appUse: "On Bumble, use the close frame as an approachable solo opener or the candid as a conversational everyday moment. Keep a recent camera-roll photo elsewhere in the profile.", relatedSlug: "city-walk", answer: "An outdoor coffee shoot adds an easy, low-pressure picture of everyday life. The four frames share one café setting and outfit, moving from a clear portrait to wider context and a natural reaction. It is useful for men who genuinely enjoy cafés and want an approachable image rather than another posed portrait.",
    frames: [
      { role: "Close / opener", src: "/pages/outdoor_coffee_closeup.webp", alt: "AI-generated close dating profile photo of the same man at an outdoor café table in soft daylight", caption: "A simple café background gives the opener context without competing with the face." },
      { role: "Half-body", src: "/pages/outdoor_coffee_half_body.webp", alt: "AI-generated half-body dating photo of the same man holding coffee on a neighborhood café terrace", caption: "The cup and relaxed seating make the action legible while keeping the pose ordinary." },
      { role: "Full-length", src: "/pages/outdoor_coffee_full_body.webp", alt: "AI-generated full-length dating photo of the same man beside an outdoor café on a walkable street", caption: "The wider frame shows everyday style and turns the café into part of a plausible routine." },
      { role: "Candid / expression", src: "/pages/outdoor_coffee_expression.webp", alt: "AI-generated candid dating photo of the same man laughing during an outdoor coffee break", caption: "A reaction away from the camera creates the relaxed friend-taken look this shoot is meant to provide." },
    ],
  },
  {
    slug: "dinner", name: "Dinner", title: "Dinner dating photo shoot", description: "A polished but believable four-frame dinner shoot for showing evening style and a warmer social setting.", interest: "Food and restaurants", location: "A warmly lit restaurant with a simple table setting", clothing: "A dark overshirt or smart-casual evening layer", lighting: "Warm practical light balanced with soft window or ambient light", action: "Settling at the table, reading the room and sharing a relaxed expression", profileFit: "Use one dinner frame in the middle of the lineup to show how you present in an evening setting.", pairing: "Pair it with daylight activity and outdoor images so the profile does not feel staged or overly formal.", appName: "Tinder", appUse: "On Tinder, a dinner frame can add a dressed-up change of pace after a clear opener and full-length daylight photo. Avoid using multiple near-identical table shots.", relatedSlug: "rooftop", answer: "A dinner shoot shows evening style and how you might look in a social date setting. Its warm light and smart-casual clothing add polish, while the four related crops keep the result grounded in one believable meal. It belongs beside more casual daylight photos, not as an entire profile of restaurant portraits.",
    frames: [
      { role: "Close / opener", src: "/pages/dinner_closeup.webp", alt: "AI-generated close dating photo of the same man at a warmly lit restaurant table in smart-casual clothing", caption: "The close frame uses warm ambient light while keeping the table and restaurant context subtle." },
      { role: "Half-body", src: "/pages/dinner_candid_half_body.webp", alt: "AI-generated half-body dating profile photo of the same man seated for dinner in a relaxed evening setting", caption: "The half-body view shows evening style and natural hand placement without a rigid formal pose." },
      { role: "Full-length", src: "/pages/dinner_candid_full_body.webp", alt: "AI-generated full-length dating photo of the same man arriving at a softly lit restaurant", caption: "An arrival frame gives the shoot movement and shows the complete smart-casual outfit." },
      { role: "Candid / expression", src: "/pages/dinner_candid_expression.webp", alt: "AI-generated candid dating photo of the same man smiling across a restaurant table during dinner", caption: "The off-camera expression makes the scene feel shared rather than like a solitary formal portrait." },
    ],
  },
  {
    slug: "city-walk", name: "City walk", title: "City walk dating photo shoot", description: "A mobile four-frame city shoot that shows everyday style, posture and a natural urban setting.", interest: "Cities and architecture", location: "A pedestrian city street with textured architecture and light foot traffic", clothing: "An everyday jacket, knit or overshirt with clean trousers", lighting: "Directional late-afternoon daylight", action: "Walking, pausing at a corner and noticing something out of frame", profileFit: "The full-length frame is especially useful in slot two or three when your opener is a closer portrait.", pairing: "Pair it with a home-cooking or gym photo that reveals a more specific interest.", appName: "Tinder", appUse: "On Tinder, the wide walking frame adds silhouette and style after a face-forward opener. Check the crop so your head and feet are not awkwardly trimmed.", relatedSlug: "outdoor-coffee", answer: "A city-walk shoot adds movement, full-length context and everyday clothing to a profile. Instead of four poses against unrelated backgrounds, it follows one short walk through the same street and light. It works well for men who spend time exploring their city and need a natural alternative to static portraits.",
    frames: [
      { role: "Close / opener", src: "/pages/city_walk_closeup.webp", alt: "AI-generated close dating profile photo of the same man on a city street in late-afternoon light", caption: "The street texture is visible, but the close crop still lets the face do the main work." },
      { role: "Half-body", src: "/pages/city_walk_candid.webp", alt: "AI-generated half-body dating photo of the same man pausing beside urban architecture during a city walk", caption: "This frame shows everyday layers and relaxed posture against a believable street backdrop." },
      { role: "Full-length", src: "/pages/city_walk_mid_action.webp", alt: "AI-generated full-length dating photo of the same man walking along a pedestrian city street", caption: "The full-length role supplies silhouette and movement that a portrait-only lineup is missing." },
      { role: "Candid / expression", src: "/pages/city_walk_looking_back.webp", alt: "AI-generated candid dating photo of the same man smiling naturally while pausing on a city walk", caption: "The off-camera reaction gives the sequence a small narrative and a less posed final frame." },
    ],
  },
  {
    slug: "coastal-travel", name: "Coastal travel", title: "Coastal travel dating photo shoot", description: "A four-frame coastal travel sequence with open scenery, relaxed clothing and honest trip context.", interest: "Travel and beaches", location: "A breezy coastal path and overlook with visible water", clothing: "Relaxed travel layers suited to the location", lighting: "Bright, softened coastal daylight", action: "Walking the path, stopping at the view and reacting to the wind or scenery", profileFit: "Use one frame later in the lineup as travel context after your face and full-length appearance are already clear.", pairing: "Pair it with an ordinary local scene such as coffee or cooking so the profile stays grounded.", appName: "Hinge", appUse: "On Hinge, a coastal frame can support a real travel story or prompt. Do not imply you visited a place you have never been; choose the shoot only when the setting reflects your life.", relatedSlug: "outdoor-coffee", answer: "A coastal-travel shoot brings open space, movement and a sense of curiosity to a dating profile. The four frames stay on one believable walk rather than inventing several destinations. Choose it only when beaches or coastal travel are genuinely part of your life, and balance it with an ordinary local photo.",
    frames: [
      { role: "Close / opener", src: "/pages/coastal_walk_closeup.webp", alt: "AI-generated close dating photo of the same man on a breezy coastal path in bright natural light", caption: "Soft coastal light creates a clear portrait while a small amount of scenery locates the moment." },
      { role: "Half-body", src: "/pages/coastal_walk_mid_action.webp", alt: "AI-generated half-body dating profile photo of the same man walking along a coastal path glancing back", caption: "The overlook and travel layers add context without turning the frame into a distant landscape photo." },
      { role: "Full-length", src: "/pages/coastal_walks_full_body.webp", alt: "AI-generated full-length dating photo of the same man walking beside the coast with water in the background", caption: "The wide view shows movement and the scale of the setting while keeping the subject identifiable." },
      { role: "Candid / expression", src: "/pages/coastal_walk_candid.webp", alt: "AI-generated candid dating photo of the same man smiling into the wind during a coastal walk", caption: "A wind-reactive expression makes the final frame feel specific to the location rather than generically posed." },
    ],
  },
  {
    slug: "home-cooking", name: "Home cooking", title: "Home cooking dating photo shoot", description: "A warm four-frame kitchen shoot that turns a genuine cooking interest into an easy conversation starter.", interest: "Cooking", location: "A lived-in home kitchen with a clear preparation area", clothing: "Relaxed home clothes with sleeves suited to cooking", lighting: "Window daylight with warm kitchen practicals", action: "Preparing ingredients, checking a pan and reacting naturally between steps", profileFit: "Use the candid or half-body frame as a middle-profile activity photo where it can add personality.", pairing: "Pair it with a city-walk or rooftop frame to balance home life with an outside setting.", appName: "Hinge", appUse: "On Hinge, this shoot works best beside a truthful food or Sunday-routine prompt. It gives someone a specific detail to ask about without inventing chef-level ability.", relatedSlug: "dinner", answer: "A home-cooking shoot contributes warmth, competence and a specific conversation starter. Four related frames follow one simple preparation moment in the same kitchen and clothing. It suits men who actually cook, and it should look lived-in and relaxed—not like a chef advertisement or a claim of expertise you do not have.",
    frames: [
      { role: "Close / opener", src: "/pages/kitchen_shot_cooking.webp", alt: "AI-generated close dating profile photo of the same man in a warm home kitchen while preparing food", caption: "The close frame keeps the face clear while small kitchen details establish a real activity." },
      { role: "Half-body", src: "/pages/kitchen_shot_chopping.webp", alt: "AI-generated half-body dating photo of the same man preparing ingredients at a home kitchen counter", caption: "Visible hands and ingredients make the activity readable without an exaggerated chef pose." },
      { role: "Full-length", src: "/pages/kitchen_shot_moving_out.webp", alt: "AI-generated full-length dating photo of the same man grabbing fresh ingredients from the refrigerator", caption: "The wider domestic frame shows relaxed home clothing and everyday kitchen movement." },
      { role: "Candid / expression", src: "/pages/kitchen_shot_food_testing.webp", alt: "AI-generated candid dating photo of the same man tasting food from a spoon in a home kitchen", caption: "The final expression turns a task into a warm moment and makes the shoot easier to respond to." },
    ],
  },
  {
    slug: "rooftop", name: "Rooftop", title: "Rooftop dating photo shoot", description: "A confident four-frame rooftop sequence with clean evening style and believable city light.", interest: "Cities and architecture", location: "An accessible city rooftop or terrace with a simple skyline", clothing: "A clean jacket or overshirt for an evening out", lighting: "Golden-hour daylight moving toward soft city ambience", action: "Walking the terrace, leaning briefly at the edge and looking across the skyline", profileFit: "Use one rooftop frame as a polished later-slot image, not as the only evidence of your everyday life.", pairing: "Pair it with outdoor coffee or home cooking to add a more ordinary, approachable setting.", appName: "Bumble", appUse: "On Bumble, use the half-body or candid frame as the dressed-up contrast in a varied lineup. Avoid captions that imply exclusive access or a lifestyle the location does not represent.", relatedSlug: "dinner", answer: "A rooftop shoot adds evening confidence, cleaner styling and a recognizable city backdrop. The sequence changes distance and expression while preserving one terrace, outfit and light transition. It works as a polished contrast to ordinary daytime photos, provided the setting feels plausible for your real city life rather than aspirational fiction.",
    frames: [
      { role: "Close / opener", src: "/pages/rooftop.webp", alt: "AI-generated close dating profile photo of the same man on a city rooftop terrace with evening skyline lights", caption: "The close frame uses warm evening city bokeh as atmosphere while keeping facial details clear and natural." },
      { role: "Half-body", src: "/pages/rooftop2.webp", alt: "AI-generated half-body dating photo of the same man watering plants on a rooftop garden at golden hour", caption: "A rooftop garden activity at sunset adds genuine personality without an exaggerated model pose." },
      { role: "Full-length", src: "/pages/rooftop4.webp", alt: "AI-generated full-length dating photo of the same man relaxing on a rooftop terrace sofa with city view", caption: "The wider terrace perspective showcases casual evening attire, posture, and a believable city ambiance." },
      { role: "Candid / expression", src: "/pages/rooftop3.webp", alt: "AI-generated candid dating photo of the same man seated at a rooftop terrace table under ambient lights", caption: "An off-camera smile seated under string lights completes the sequence with an approachable social feeling." },
    ],
  },
]

export function getDatingShoot(slug: string) {
  return datingShoots.find((shoot) => shoot.slug === slug)
}
