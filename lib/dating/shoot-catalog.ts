/**
 * Human-authored meaning for every shoot in the prompt library.
 *
 * Prompt prose is deliberately not parsed to decide whether two shoots look the
 * same. "Garage" and "workshop" are different strings but the same visual idea;
 * this catalog is the reviewable source of truth the selector and checker use.
 */

export type ShootAvailability = "active" | "quarantined";
export type ShootEvidence = "rendered-approved" | "prompt-reviewed" | "quarantined";
export type ShootLightFamily = "window" | "open-door" | "overcast" | "flash";

export type ShootCatalogMetadata = {
  /** Only one member of a concept family may appear in a delivery. */
  conceptFamily: string;
  /** Broad environment family, capped to stop a delivery becoming all walls/gyms. */
  settingFamily: string;
  /** Reported for portfolio balance; several lights from one family are allowed. */
  lightFamily: ShootLightFamily;
  availability: ShootAvailability;
  /** Separates mechanically reviewed prose from a shoot proven by real renders. */
  evidence: ShootEvidence;
  quarantineReason?: string;
};

const active = (
  conceptFamily: string,
  settingFamily: string,
  lightFamily: ShootLightFamily,
  evidence: ShootEvidence = "prompt-reviewed"
): ShootCatalogMetadata => ({
  conceptFamily,
  settingFamily,
  lightFamily,
  availability: "active",
  evidence,
});

const quarantined = (
  conceptFamily: string,
  settingFamily: string,
  lightFamily: ShootLightFamily,
  quarantineReason: string
): ShootCatalogMetadata => ({
  conceptFamily,
  settingFamily,
  lightFamily,
  availability: "quarantined",
  evidence: "quarantined",
  quarantineReason,
});

export const SHOOT_CATALOG: Readonly<Record<string, ShootCatalogMetadata>> = {
  "kitchen-window-morning": active("kitchen-window", "home-interior", "window", "rendered-approved"),
  "hotel-forecourt-evening": active("hotel-arrival", "hotel", "flash"),
  "marina-pontoon-overcast": active("marina-walk", "waterfront", "overcast"),
  "living-room-window-afternoon": active("quiet-home-window", "home-interior", "window"),
  "gym-glass-wall-morning": active("strength-training", "fitness-studio", "window"),
  "roof-terrace-breakfast": active("terrace-breakfast", "terrace", "window"),
  "tennis-clay-court-morning": active("tennis-clay", "sports-court", "overcast"),
  "golf-fairway-overcast": active("golf-day", "golf", "overcast"),
  "coast-path-hike-overcast": active("coastal-hike", "upland", "overcast"),
  "climbing-gym-daylight": active("indoor-bouldering", "fitness-studio", "open-door"),
  "home-studio-guitar-evening": active("guitar-at-home", "home-interior", "window"),
  "gallery-atrium-daylight": active("gallery-visit", "art-space", "window"),
  "garage-motorcycle-daylight": quarantined(
    "motorcycle-workshop",
    "industrial-interior",
    "open-door",
    "Rendered as a prop-dominated garage catalogue and duplicates workshop-motorcycle-daylight"
  ),
  "beach-after-surf-overcast": active("surf-coast", "coast", "overcast"),
  "mountain-terrace-snow": active("snow-mountain", "snow", "overcast"),
  "park-with-the-dog-morning": active("dog-day-out", "park", "overcast"),
  "wine-bar-late-afternoon": active("evening-drink", "hospitality", "window"),
  "reservoir-road-ride-overcast": active("cycling-day", "road", "overcast"),
  "deli-counter-morning": active("cafe-counter", "hospitality", "window"),
  "window-seat-reading-afternoon": active("quiet-home-window", "home-interior", "window"),
  "stone-bridge-hills-overcast": active("country-bridge", "upland", "overcast"),
  "venue-entrance-evening": active("music-night-out", "nightlife", "flash"),
  "ceramics-studio-afternoon": quarantined(
    "ceramics-making",
    "art-space",
    "open-door",
    "Rendered as a cold working studio rather than an attractive dating-profile moment"
  ),
  "minimalist-kitchen-morning": active("kitchen-window", "home-interior", "window"),
  "minimalist-study-afternoon": active("quiet-home-window", "home-interior", "window"),
  "guitar-brick-wall-home": active("guitar-at-home", "home-interior", "window"),
  "minimalist-cafe-morning": active("cafe-counter", "hospitality", "window"),
  "courtyard-doorway-afternoon": active("home-courtyard", "home-interior", "open-door"),
  "mountain-pass-overcast-midday": active("mountain-travel", "upland", "overcast"),
  "moorland-ridge-overcast": active("moorland-hike", "upland", "overcast"),
  "riverside-path-morning-run": active("outdoor-run", "park", "overcast"),
  "shoreline-rippled-sand-midday": active("surf-coast", "coast", "overcast"),
  "sailing-yacht-foredeck-morning": active("sailing-day", "waterfront", "overcast"),
  "snowfield-ridge-midday": active("snow-mountain", "snow", "overcast"),
  "granite-slab-midday": active("outdoor-climbing", "upland", "overcast"),
  "beach-run-retriever-morning": active("dog-day-out", "coast", "overcast"),
  "hillside-gate-afternoon": active("dog-day-out", "upland", "window"),
  "high-fell-hiking-afternoon": active("moorland-hike", "upland", "overcast"),
  "running-track-overcast": active("outdoor-run", "sports-court", "overcast"),
  "tennis-baseline-midday": active("tennis-clay", "sports-court", "overcast"),
  "padel-court-afternoon": quarantined(
    "padel-court",
    "sports-court",
    "open-door",
    "Rendered with changing glass-wall geometry and non-sport wardrobe across its four frames"
  ),
  "boxing-warehouse-daylight": quarantined(
    "boxing-training",
    "fitness-studio",
    "open-door",
    "A warehouse is a quarantined industrial setting for this dating product"
  ),
  "gym-private-daylight": active("strength-training", "fitness-studio", "open-door"),
  "boxing-gym-daylight": active("boxing-training", "fitness-studio", "window"),
  "football-pitch-touchline-overcast": active("football-day", "sports-field", "overcast"),
  "football-cage-dusk": active("football-day", "sports-field", "overcast"),
  "hilltop-cycling-overcast": active("cycling-day", "road", "overcast"),
  "bouldering-gym-afternoon": active("indoor-bouldering", "fitness-studio", "open-door"),
  "mountain-piste-midday": active("snow-mountain", "snow", "overcast"),
  "jetty-morning-sailing": active("sailing-day", "waterfront", "overcast"),
  "workshop-motorcycle-daylight": quarantined(
    "motorcycle-workshop",
    "industrial-interior",
    "open-door",
    "Rendered as a prop-dominated workshop catalogue and duplicates garage-motorcycle-daylight"
  ),
  "mountain-layby-motorcycle": quarantined(
    "motorcycle-road-trip",
    "road",
    "overcast",
    "The vehicle and roadside lay-by dominate the portrait instead of the person"
  ),
  "hotel-canopy-night-sharp": active("hotel-arrival", "hotel", "flash"),
  "club-doorway-night": active("music-night-out", "nightlife", "flash"),
  "restaurant-terrace-afternoon": active("terrace-dining", "terrace", "window"),
  "minimalist-art-studio-daylight": quarantined(
    "drawing-studio",
    "art-space",
    "window",
    "A bare working studio reads as occupational documentation rather than a dating photo"
  ),
  "hotel-corridor-sharp": active("hotel-portrait", "hotel", "window"),
  "minimalist-boxing-daylight": active("boxing-training", "fitness-studio", "open-door"),
  "minimalist-kitchen-morning-coffee": active("kitchen-window", "home-interior", "window"),
  "surf-dune-overcast": active("surf-coast", "coast", "overcast"),
  "coastal-terrace-wall-midday": active("coastal-overlook", "terrace", "overcast"),
  "civic-steps-afternoon": active("city-architecture", "city", "overcast"),
  "cafe-window-bicycle-morning": active("cycling-day", "hospitality", "window"),
  "dune-path-board-midday": active("surf-coast", "coast", "overcast"),
  "hotel-breakfast-terrace-morning": active("terrace-breakfast", "terrace", "window"),
  "pottery-doorway-afternoon": quarantined(
    "ceramics-making",
    "art-space",
    "open-door",
    "Duplicates the rejected ceramics-studio concept and has the same dating-value problem"
  ),
  "cafe-doorway-square-morning": active("cafe-counter", "hospitality", "open-door"),
  "pale-wall-portrait-afternoon": active("minimal-wall-portrait", "plain-wall", "window"),
  "dark-wall-flash-night": active("minimal-wall-portrait", "plain-wall", "flash"),
  "clubhouse-wall-overcast": active("golf-day", "golf", "overcast"),
};
