import type { DatingBucket } from "./types";

export type DatingTestMode = "mock" | "sample" | "off";

/**
 * Returns the active testing mode for the dating photoshoot pipeline.
 * - 'mock': 100% simulated, $0.00 cost, zero Fal or R2 calls.
 * - 'sample': 1 real Fal photo per bucket (5 total = $0.20), remaining 95 mocked.
 * - 'off': 100 real Fal photos ($4.00 total) for production.
 */
export function getDatingTestMode(): DatingTestMode {
  const mode = process.env.DATING_TEST_MODE?.toLowerCase().trim();
  if (mode === "mock") return "mock";
  if (mode === "sample" || mode === "sample_5" || mode === "test") return "sample";
  return "off";
}

/**
 * Determines whether a specific slot (1..20) should use mock generation
 * based on the active test mode.
 */
export function shouldUseMockForSlot(testMode: DatingTestMode, slot: number): boolean {
  if (testMode === "mock") return true;
  if (testMode === "sample") {
    // In sample mode, only slot 1 (first photo of each bucket) is generated with real Fal AI.
    // Slots 2..20 use mock images to keep the UI complete without burning GPU cost.
    return slot !== 1;
  }
  return false;
}

const BUCKET_COLORS: Record<DatingBucket, { bg: string; accent: string; label: string }> = {
  anchor: { bg: "#1e1b4b", accent: "#818cf8", label: "Anchor Portrait" },
  social: { bg: "#14532d", accent: "#4ade80", label: "Social Candid" },
  travel: { bg: "#78350f", accent: "#fbbf24", label: "Travel Lifestyle" },
  active: { bg: "#831843", accent: "#f472b6", label: "Active Vitality" },
  street: { bg: "#18181b", accent: "#a1a1aa", label: "Casual Streetwear" },
};

/**
 * Generates an inline SVG data URI representing a styled preview card.
 * Works offline, renders instantly in any <img> tag with zero network latency.
 */
export function getMockPlaceholderImageUrl(
  bucket: DatingBucket,
  slot: number,
  aspectRatio: string = "3:4"
): string {
  const theme = BUCKET_COLORS[bucket] || {
    bg: "#18181b",
    accent: "#a1a1aa",
    label: bucket,
  };

  const isWide = aspectRatio === "4:3";
  const isTall = aspectRatio === "9:16";
  const width = isWide ? 800 : isTall ? 450 : 600;
  const height = 800;

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="#09090b" />
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <!-- Border -->
  <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="16" fill="none" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="8 8" />
  
  <!-- Content -->
  <g transform="translate(${width / 2}, ${height / 2})" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <!-- Camera Icon Circle -->
    <circle cx="0" cy="-70" r="44" fill="${theme.accent}" fill-opacity="0.15" />
    <circle cx="0" cy="-70" r="32" fill="none" stroke="${theme.accent}" stroke-width="3" />
    <circle cx="0" cy="-70" r="14" fill="${theme.accent}" />
    
    <!-- Bucket Badge -->
    <rect x="-110" y="0" width="220" height="32" rx="16" fill="${theme.accent}" fill-opacity="0.2" stroke="${theme.accent}" stroke-width="1" />
    <text x="0" y="21" font-size="13" font-weight="700" fill="${theme.accent}" letter-spacing="1.5">${theme.label.toUpperCase()}</text>
    
    <!-- Slot Number -->
    <text x="0" y="75" font-size="28" font-weight="800" fill="#ffffff">PHOTO #${slot}</text>
    
    <!-- Test Mode Label -->
    <text x="0" y="110" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)">[MOCK TEST PREVIEW]</text>
    <text x="0" y="132" font-size="12" fill="rgba(255,255,255,0.4)">Ratio: ${aspectRatio} · Zero GPU Cost</text>
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
