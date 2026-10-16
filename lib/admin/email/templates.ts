/**
 * Starting points for one-to-one founder emails from the super panel.
 * Bodies are plain text: blank lines split paragraphs, URLs become links,
 * **text** is bold. Placeholders: {{name}}, {{email}}, {{credits}}, {{app_url}}.
 */
export type AdminEmailTemplate = {
  key: string;
  label: string;
  subject: string;
  body: string;
};

export const ADMIN_EMAIL_TEMPLATES: AdminEmailTemplate[] = [
  {
    key: "blank",
    label: "Blank",
    subject: "",
    body: "Hey {{name}},\n\n\n\nHarvansh\nFounder, Unrealshot",
  },
  {
    key: "welcome",
    label: "Welcome / just signed up",
    subject: "quick hello from Unrealshot",
    body: [
      "Hey {{name}},",
      "I'm Harvansh, the founder of Unrealshot. I saw you just signed up and wanted to say thanks personally.",
      "If you're wondering how the dating photos will turn out for you, or anything feels unclear, just reply to this email. I read every reply myself.",
      "You can start your shoot here: {{app_url}}/dating-shoot",
      "Harvansh\nFounder, Unrealshot",
    ].join("\n\n"),
  },
  {
    key: "abandoned_checkout",
    label: "Abandoned checkout",
    subject: "anything stop you at checkout?",
    body: [
      "Hey {{name}},",
      "I noticed you got as far as checkout but didn't finish. Totally fine, but I'd love to know why. Was it the price, a question about the photos, or something not working?",
      "If something broke, reply and I'll sort it out personally. If you had a question, ask away.",
      "Here's the link if you want to pick up where you left off: {{app_url}}/buy-credits",
      "Harvansh\nFounder, Unrealshot",
    ].join("\n\n"),
  },
  {
    key: "purchase_thanks",
    label: "Thanks for purchasing",
    subject: "thank you for trying Unrealshot",
    body: [
      "Hey {{name}},",
      "Thank you for buying the dating photoshoot. As a solo founder this genuinely means a lot.",
      "A few tips for the best results: use clear, well-lit reference photos of just you, with a mix of angles and no sunglasses.",
      "If anything about your shoot isn't right, reply here and I'll make it right.",
      "Your dashboard: {{app_url}}/dating-shoot",
      "Harvansh\nFounder, Unrealshot",
    ].join("\n\n"),
  },
  {
    key: "paid_no_shoot",
    label: "Paid but hasn't started",
    subject: "your shoot is waiting",
    body: [
      "Hey {{name}},",
      "You have {{credits}} credits ready, but your dating photoshoot hasn't started yet. Did you get stuck on the reference photos or anything else?",
      "Reply and tell me where you got stuck, and I'll help you through it.",
      "Start here: {{app_url}}/dating-shoot",
      "Harvansh\nFounder, Unrealshot",
    ].join("\n\n"),
  },
  {
    key: "shoot_feedback",
    label: "Photos delivered – ask for feedback",
    subject: "how did your photos turn out?",
    body: [
      "Hey {{name}},",
      "Your dating photos were delivered. I'd love to hear honestly how they turned out. Which ones would you actually use, and which ones missed?",
      "Your feedback directly shapes what I fix next. Just hit reply.",
      "Harvansh\nFounder, Unrealshot",
    ].join("\n\n"),
  },
  {
    key: "shoot_failed",
    label: "Shoot failed – apology",
    subject: "sorry about your photoshoot",
    body: [
      "Hey {{name}},",
      "Your photoshoot ran into a problem on our side, and I'm sorry about that. Your credits are protected. A failed shoot does not use them up.",
      "I'm looking into what went wrong. Reply to this email and I'll personally make sure your next shoot goes through.",
      "Harvansh\nFounder, Unrealshot",
    ].join("\n\n"),
  },
];

export function findTemplate(key: string | null | undefined) {
  return ADMIN_EMAIL_TEMPLATES.find((t) => t.key === key) ?? ADMIN_EMAIL_TEMPLATES[0];
}
