export type ActivityPainPoint = {
  number: string
  title: string
  problem: string
  fix: string
}

export type ActivityCategory = {
  title: string
  vibe: string
  whyItWorks: string
  photoTip: string
  shootSlug: string
  promptPairing: string
}

export type ActivityPhotoRule = {
  rule: string
  headline: string
  explanation: string
  doExample: string
  dontExample: string
}

export type PlatformActivityStrategy = {
  app: string
  idealSlot: string
  strategy: string
  promptAdvice: string
}

export type ActivityFaq = {
  question: string
  answer: string
}

export const activityPageData = {
  path: "/dating-photos/activity",
  eyebrow: "Dating Profile Lifestyle & Activity Guide",
  title: "Activity & Hobby Dating Photos for Men That Actually Spark Conversations",
  description: "Learn how to choose and shoot believable activity photos for Tinder, Hinge, and Bumble. Discover the 5 best hobby categories, framing rules, and common mistakes to avoid.",
  answer: "An activity photo gives potential matches an instant visual conversation starter and proves you have a vibrant, rounded life. The best activity photos show genuine interests—like cooking, fitness, coffee, or city exploration—captured in natural lighting with an unobstructed face, avoiding staged mirror selfies or obscured action shots.",
  
  heroBullets: [
    "5 high-converting hobby categories for men",
    "How to showcase fitness without cringey gym selfies",
    "Pairing lifestyle photos with Hinge & Bumble prompts",
    "15 coherent AI lifestyle shoots generated in 30 minutes",
  ],

  stats: [
    ["Conversation Starters", "4x more openers on Hinge"],
    ["Optimal Lineup Balance", "1–2 activity shots in 6 photos"],
    ["Face Visibility", "Eyes & smile must stay clear"],
    ["Delivery Turnaround", "60 photos in 30 minutes"],
  ],

  painPoints: [
    {
      number: "01",
      title: "The Obscured Face Trap",
      problem: "Skiing with goggles, motorcycle helmets, or distant mountain climbing shots where you are just a 10-pixel silhouette.",
      fix: "The activity should provide setting and context, but your facial features and expression must remain recognizable.",
    },
    {
      number: "02",
      title: "The Aggressive Mirror Flex",
      problem: "Overly posed bathroom or locker-room gym selfies with harsh fluorescent overhead light and intense grimacing.",
      fix: "Capture natural, mid-workout moments in a daylight-filled space—resting between sets or adjusting gear—looking relaxed rather than performative.",
    },
    {
      number: "03",
      title: "The Manufactured Persona",
      problem: "Posing with rented supercars, champagne bottles, or hobbies you don't actually do just to project status.",
      fix: "Stick strictly to things you actually enjoy and could comfortably discuss for 30 minutes on a first date.",
    },
  ] as ActivityPainPoint[],

  categories: [
    {
      title: "Home Cooking & Culinary Craft",
      vibe: "Warm, capable, domestic competence",
      whyItWorks: "Cooking is universally attractive and conveys warmth, creativity, and self-sufficiency. It gives your match an effortless opening line about favorite recipes or date-night meals.",
      photoTip: "Capture a casual mid-prep moment at a kitchen counter with natural window lighting rather than posing stiffly holding a completed plate.",
      shootSlug: "home-cooking",
      promptPairing: "Pairs perfectly with Hinge's 'The secret to getting along with me' or 'My specialty dish'.",
    },
    {
      title: "Active Lifestyle & Fitness",
      vibe: "Discipline, energy, healthy routine",
      whyItWorks: "Demonstrates physical vitality and commitment to wellbeing without needing an aggressive shirtless mirror picture. Shows you take care of yourself.",
      photoTip: "Use daylight gyms, outdoor running paths, or bouldering walls. Keep expressions natural or smiling rather than straining under heavy weight.",
      shootSlug: "gym-training",
      promptPairing: "Great for Bumble's 'Active' badge or Hinge's 'Sunday routine' prompt.",
    },
    {
      title: "Café Culture & Reading",
      vibe: "Approachable, conversational, relaxed",
      whyItWorks: "A neighborhood café terrace or cozy bookstore corner signals intellectual curiosity, calmness, and low-pressure date potential.",
      photoTip: "Sit at a table in open shade, holding a warm cup or glancing away from a book with a slight, natural reaction.",
      shootSlug: "outdoor-coffee",
      promptPairing: "Pairs seamlessly with 'Best spot in town' or 'Together we could find the best coffee'.",
    },
    {
      title: "Urban Exploration & Street Life",
      vibe: "Curiosity, style, modern vitality",
      whyItWorks: "Shows you enjoy exploring your city, visiting markets, architecture, or galleries. Naturally displays full-length posture, height, and street style.",
      photoTip: "Walk down a textured pedestrian street with natural movement and casual layering (overshirt, knit, or clean jacket).",
      shootSlug: "city-walk",
      promptPairing: "Ideal for 'A quick rant about' or 'Let's debate: best neighborhood'.",
    },
    {
      title: "Coastal & Nature Walks",
      vibe: "Adventurous, open, grounded",
      whyItWorks: "Brings fresh air and scenery into your lineup. Signals you enjoy the outdoors and weekend getaways without requiring extreme mountaineering gear.",
      photoTip: "Shoot during golden hour or bright overcast daylight along a scenic coastal path or trail, with wind-blown natural movement.",
      shootSlug: "coastal-travel",
      promptPairing: "Pairs well with 'All I ask is that you' or 'My simple pleasures'.",
    },
  ] as ActivityCategory[],

  rules: [
    {
      rule: "01",
      headline: "The Subject is Always You, Not the Activity",
      explanation: "The hobby is the backdrop that provides flavor and conversation material; you are still the focus. Avoid photos where the equipment, scenic vista, or sports car takes up 90% of the frame while you are an afterthought.",
      doExample: "A half-body shot of you prepping ingredients at a counter with a visible, relaxed smile.",
      dontExample: "A wide-angle shot of a pizza oven where your back is turned and your face cannot be seen.",
    },
    {
      rule: "02",
      headline: "Action Over Posing (The 70/30 Candid Rule)",
      explanation: "Great activity photos capture you in motion or in a moment of pause during an activity. Staring dead-center into the lens with two hands on a prop often feels like a stock photo.",
      doExample: "Looking slightly off-camera while laughing, adjusting headphones, or tying running shoes.",
      dontExample: "Holding a guitar like a prop while staring unblinkingly at the lens.",
    },
    {
      rule: "03",
      headline: "Match Your Photos to Your Stated Interests",
      explanation: "Dating apps algorithmically reward consistency between your photo tags, prompt answers, and actual visual evidence. When your photos confirm your written bio, trust levels surge.",
      doExample: "Mentioning you love trying new brunch spots and having an outdoor coffee terrace photo.",
      dontExample: "Saying you love nature while all six photos are taken in dark nightclubs or indoor bedrooms.",
    },
    {
      rule: "04",
      headline: "Lighting Dictates Realism",
      explanation: "Avoid harsh flash or dim yellow indoor light. Natural open shade, soft morning daylight, or warm ambient restaurant lighting keeps photos looking professional yet friend-taken.",
      doExample: "Diffused window light casting soft shadows across your face.",
      dontExample: "Direct flash in a dark room casting harsh glare and greasy skin reflections.",
    },
  ] as ActivityPhotoRule[],

  platformStrategies: [
    {
      app: "Hinge",
      idealSlot: "Photo #2, #3, or #5",
      strategy: "On Hinge, every photo can be paired with a caption or audio snippet. Position your activity photo immediately above or below a prompt that references your lifestyle (e.g., cooking or weekend routines) to give matches an effortless way to leave a comment.",
      promptAdvice: "Use the 'My happy place is...' or 'Together we could...' prompts right next to your hobby photo.",
    },
    {
      app: "Tinder",
      idealSlot: "Photo #3 or #4",
      strategy: "Tinder is fast-paced. Your opener must be a crystal-clear portrait, followed by a full-length photo. Place your activity shot in the middle slots to prove active lifestyle, build, and conversational depth before the profile closes.",
      promptAdvice: "Ensure your Spotify top artists and lifestyle tags align with the mood of your activity photo.",
    },
    {
      app: "Bumble",
      idealSlot: "Photo #2 or #4",
      strategy: "Because women message first on Bumble, providing easy 'message hooks' is critical. An intriguing hobby photo (like pour-over coffee, cooking, or trail walking) gives her something specific and comfortable to write about in her opening message.",
      promptAdvice: "Link your Bumble lifestyle badges (e.g., Cooking, Fitness, Travel) to visual evidence in your photos.",
    },
  ] as PlatformActivityStrategy[],

  faqs: [
    {
      question: "What are the best hobby photos for men on dating apps?",
      answer: "The top-performing hobby photos are accessible, social, and warm: home cooking, café/coffee culture, natural fitness (running, training floor), city exploration/arts, and scenic travel. Avoid hobbies with negative associations or low face visibility, such as gaming screens, hunting/fishing trophies, or car engine bays.",
    },
    {
      question: "Are gym photos bad to use on Tinder, Hinge, or Bumble?",
      answer: "Bathroom and locker-room mirror selfies are universally disliked because they look posed and self-absorbed. However, a naturally lit training photo—such as resting between sets on a gym floor or running outdoors—works very well if fitness is a genuine part of your routine. Keep it to one photo maximum in your lineup.",
    },
    {
      question: "How do I get natural activity photos if I don't have someone to take them?",
      answer: "You have three options: 1) Set a phone tripod with a 10-second timer or burst mode in natural light. 2) Ask a friend during an actual outing (e.g. coffee or a walk). 3) Use UnrealShot AI to turn 4–6 reference selfies into 15 varied lifestyle shoots (like home cooking, outdoor coffee, gym training, and city walks) within 30 minutes.",
    },
    {
      question: "How many activity photos should be in a 6-photo dating lineup?",
      answer: "One to two activity photos is the sweet spot. Your profile needs a clear solo portrait opener, a full-length body shot, 1–2 genuine activity photos, a dressed-up or social context shot, and an everyday candid. Having more than two activity shots can make the profile feel cluttered or one-dimensional.",
    },
    {
      question: "Should I include group sports or solo hobbies?",
      answer: "Solo or small-context hobbies work best. Group sports often make it difficult for potential matches to identify which person you are. If you participate in team sports, use a solo photo of you on the sidelines or in gear rather than a crowded team huddle.",
    },
    {
      question: "How does UnrealShot generate authentic activity shoots without looking fake?",
      answer: "UnrealShot uses reference-guided likeness to maintain your facial features while generating 15 distinct shoots with 4 related frames each (close, half-body, full-length, candid). The lighting, clothing, and environment are designed around believable everyday settings (like home kitchens, modern gyms, and outdoor cafes) with friend-taken camera angles.",
    },
    {
      question: "What hobbies should men avoid on dating profiles?",
      answer: "Avoid photos holding dead fish or game, photos where your face is completely concealed by helmets/goggles, pictures of your car without you in it, nightclub partying with red-eye flash, and messy room backgrounds.",
    },
    {
      question: "How do activity photos improve dating app match rates?",
      answer: "Activity photos increase match quality and conversation rates because they provide context for your personality. On apps like Hinge, photos showing a specific activity receive over 4x more incoming comments than generic selfies because they make starting a conversation frictionless.",
    },
  ] as ActivityFaq[],
}
