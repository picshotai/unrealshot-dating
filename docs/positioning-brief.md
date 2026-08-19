# Positioning Brief — Dating Shoot

**For:** the agent updating landing page copy
**Status of numbers in this doc:** every figure was read out of the shipping code on 2026-08-18 and is listed with its source file in section 10. Do not round them up. Do not invent new ones.

---

## 1. The one-sentence shift

**Stop selling an inventory of scenes. Start selling a finished dating profile where every photo is different.**

Everything below is downstream of that sentence.

---

## 2. Why the old framing was costing us

The current page says some version of **"3 vibes, 3 styles."** Kill it. Three problems:

1. **It invites division.** A buyer reads "3 × 3" and computes 9. He is paying for 100 photos. He now expects each look eleven times.
2. **It is internal jargon.** "Vibe" and "style" are our selection weights, not words a man uses about himself.
3. **It undersells by roughly 40×.** The library holds 3,510 distinct compiled shots. "9" is the smallest true-sounding number we could have picked.

The same mistake shows up in how our internal category names leaked out. We have five internal buckets that drive selection. **They must never appear on the landing page, in emails, or in the UI.** They are engineering labels; exposing them shrinks a 3,510-shot system down to five words and makes the product sound like a filter pack.

---

## 3. Why we do not copy the competitor's numbers

datephotos.ai sells on inventory counts — "40+ scene variations," "each scene has 3-4 different poses," "94+."

That framing has a hole in it, and we should not climb into the hole with them. **If your unit of counting is the scene, and you deliver more photos than you have scenes, you have just told the buyer he is getting repeats.** 40 scenes into 100 photos is two and a half photos per scene. He can do that arithmetic on the pricing page.

**Our unit of counting is the photo.** That is the whole strategic move. We do not say "we have N scenes." We say what is true of every single photo he receives — and it is the strongest claim in the category:

> **100 photos. No two in the same outfit. No two in the same light. 100 different places.**

That is not marketing rounding. It is enforced in code: the order fails to create rather than ship a delivery containing a duplicate. This is the gold. Lead with it everywhere.

---

## 4. Verified claims — this is the approved claim set

Use these freely. Each one is true of every delivery.

**Per delivery**

- 100 photos
- 100 distinct locations — no location repeats
- 100 distinct outfits — no outfit repeats
- 100 distinct lighting setups — no lighting repeats
- One person in every frame: him. No filler crowds, no background extras.
- Photos arrive in the crops dating apps actually use — tall portrait, wide, and full-height vertical
- 30 free re-shoots of any individual photo he does not love
- Up to 10 of the 100 are built around what he actually does, capped at 3 per interest so one hobby never takes over the profile
- He can exclude 4 kinds of content he does not want anywhere in his set: drinks in hand, dogs, bikes, team sport
- Setup needs 4–6 reference selfies

**Behind it (use for depth and credibility sections, not headlines)**

- 390 authored shots, each hand-written — not templated variations of a few
- 135 locations, 156 lighting setups, 1,170 distinct outfits in the library
- 3,510 distinct compiled shots the system can draw from
- Any one delivery reaches about 74% of the library's locations — two men who both buy get near-different sets, and so does the same man buying twice

**The honest superlative, if you want one:** every photo differs from every other photo on the three things a swiper actually registers in half a second — where he is, what he is wearing, how the light falls. Nobody in this category makes that promise, because nobody else counts in photos.

---

## 5. Replacing the five categories: the lineup

He is not buying five categories. He is buying a profile already sorted into the slots a dating app asks him to fill. The delivery is grouped and labelled like this — **use these exact words** when describing what he gets:

| Section | What it is for |
| --- | --- |
| **Your opener** | The first photo. The one that decides the swipe. |
| **Your full body** | The one every app and every user asks for. |
| **What you do** | Him doing the thing he actually does. |
| **Out in the world** | Him somewhere real, living a life. |
| **The rest** | Depth. The photos that make a profile read as a person. |

This framing does the psychological work the category names never could: it tells him the set is **already organised into decisions he was dreading making.** He does not get 100 files. He gets a profile with the slots filled.

Do not promise an exact photo count per section. The mix shifts with his answers.

---

## 6. What the app asks him — the page must set matching expectations

The intake asks exactly three things. Landing copy should promise nothing that contradicts them:

1. **"Which look should we lead with?"** — three photos of wardrobes, not the words casual/sharp/street.
2. **"What do you actually do?"** — 16 interests, multi-select, plus free text.
3. **"Anything to leave out?"** — the four exclusions.

**Critical nuance on question 1.** He picks what to *lead with*, not what he gets. Every shoot spans all three wardrobes — that range is the product, since 100 photos in one register reads flat. If landing copy implies "pick casual, get casual," we have written a broken promise into the funnel. Phrase it as: *every shoot covers the range; you choose where it leans.*

Everything else is automatic. That is a selling point — say so. He answers three questions; he does not build a shot list.

---

## 7. Objections to pre-empt

- **"Will it look like me?"** — 4–6 selfies; his identity is held to one person across all 100. Do not overclaim perfection; we accept minor drift on a small number of frames.
- **"Will it look AI?"** — The camera and lighting specifications are the point: real focal lengths, real light directions, phone-plausible framing. No filler people in frames, which is where AI photos usually give themselves away.
- **"Will they all look the same?"** — This is the objection we are strongest on. Answer with the per-photo guarantee, never with a scene count.
- **"What if I hate some?"** — 30 free re-shoots.

---

## 8. Do not claim any of these

Hard list. Several are things we cannot back, and a couple are things we deliberately removed.

- Any of the five internal category names
- "3 vibes, 3 styles" or any small combinatorial number
- Photos with friends, dates, groups, or people in the background — **we removed this on purpose.** The generated extras looked like mannequins and no man would post them. Never imply company in frame.
- Exact per-section photo counts ("exactly 20 of each")
- "Friend-taken," "shot by a friend," or any phrasing implying a second person held the camera
- Guaranteed match rates, date counts, or any dating-outcome promise
- Named comparisons to datephotos.ai or any competitor on the page
- Turnaround times or delivery-speed numbers — not verified; ask before writing any
- Prices — out of scope for this brief; take them from the live pricing source
- Anything about training a model on his face, LoRAs, or fine-tuning. That is not how this works.

---

## 9. Voice

Plain, specific, slightly blunt. He is a man who has been putting off dealing with his photos and is a little embarrassed about it. He does not want to be told he will "unlock his best self."

- Concrete over aspirational: "100 photos, no two the same" beats "unleash your best look."
- Numbers over adjectives. We have real numbers; adjectives read as cope.
- Never condescend about his current photos. Never imply he is failing at dating.
- Short sentences. No stacked superlatives. No emoji in headlines.

**Directions worth drafting against** (angles, not final copy — write better versions):

- **The arithmetic angle.** Everyone else counts scenes. We count photos. Here is why that matters.
- **The finished-profile angle.** You do not get a folder. You get your profile, sorted.
- **The three-questions angle.** Answer three things; we handle the other hundred decisions.
- **The no-repeats angle**, stated flatly and then proven with the guarantee.

---

## 10. Where to re-verify every number

If a claim is not in this brief, read it out of the code before writing it:

| Claim | Source |
| --- | --- |
| 100 photos, credits, exclusions | `lib/dating/types.ts` |
| No-repeat guarantee (enforced) | `lib/dating/select-delivery.ts` — `assertDeliveryUnique` |
| 390 shots, 135 locations, 156 lights, 1,170 outfits | `lib/dating/prompt-library.ts` |
| 16 interests, 3 wardrobes, 4 exclusions | `lib/dating/interests.ts` |
| Section labels | `lib/dating/lineup.ts` — `LINEUP_LABELS` |
| 30 re-shoots, 1 per regeneration | `app/api/dating-shoot/regenerate/route.ts` |
| 4-photo minimum | `lib/dating/create-order.ts` |

**One heads-up:** the in-app shoot screen and intake (`components/dating/StudioIntakeView.tsx`, `app/(protected)/dating-shoot/DatingShootClient.tsx`) were rebuilt recently. Read the current on-screen wording directly rather than trusting any older copy doc — landing page and app should agree.
