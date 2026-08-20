import { FRAMES_PER_SHOOT } from "./types";
import { SHOOT_BY_ID, type ShootKind } from "./shoots";

export type DatingTestMode = "mock" | "sample" | "off";

/**
 * Returns the active testing mode for the dating photoshoot pipeline.
 * - 'mock': 100% simulated, $0.00 cost, zero Fal or R2 calls.
 * - 'sample': SAMPLE_SHOOTS whole shoots rendered for real, the rest mocked.
 * - 'off': the full delivery, real.
 *
 * Sample mode renders *whole shoots* rather than scattered frames. A shoot's
 * only real question is whether its four frames hold the same place, clothes
 * and light together, and one frame of it cannot answer that.
 */
export function getDatingTestMode(): DatingTestMode {
  const mode = process.env.DATING_TEST_MODE?.toLowerCase().trim();
  if (mode === "mock") return "mock";
  if (mode === "sample" || mode === "sample_5" || mode === "test") return "sample";
  return "off";
}

/**
 * Fallback for a child dispatched without the orchestrator's decision.
 *
 * Which shoots a sample run renders is chosen by the orchestrator, which can see
 * the whole delivery; a child on its own cannot. So an undecided child under any
 * test mode mocks, which keeps GPU spend at zero rather than guessing.
 */
export function shouldUseMock(testMode: DatingTestMode): boolean {
  return testMode !== "off";
}

const KIND_COLORS: Record<ShootKind, { bg: string; accent: string }> = {
  portrait: { bg: "#1e1b4b", accent: "#818cf8" },
  home: { bg: "#78350f", accent: "#fbbf24" },
  outdoors: { bg: "#14532d", accent: "#4ade80" },
  social: { bg: "#831843", accent: "#f472b6" },
  activity: { bg: "#18181b", accent: "#a1a1aa" },
};

const FALLBACK = { bg: "#18181b", accent: "#a1a1aa" };

/**
 * Generates an inline SVG data URI representing a styled preview card.
 * Works offline, renders instantly in any <img> tag with zero network latency.
 *
 * It names the shoot and the frame's position within it, because that is the
 * structure a mock run exists to exercise — a grid of "PHOTO #7" placeholders
 * cannot show whether the shoot grouping works.
 */
export function getMockPlaceholderImageUrl(
  shootId: string,
  frameIndex: number,
  aspectRatio: string = "3:4"
): string {
  const shoot = SHOOT_BY_ID.get(shootId);
  const theme = shoot ? KIND_COLORS[shoot.kind] ?? FALLBACK : FALLBACK;
  const label = (shoot?.title ?? shootId).toUpperCase();

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

  <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="16" fill="none" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="2" stroke-dasharray="8 8" />

  <g transform="translate(${width / 2}, ${height / 2})" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <circle cx="0" cy="-70" r="44" fill="${theme.accent}" fill-opacity="0.15" />
    <circle cx="0" cy="-70" r="32" fill="none" stroke="${theme.accent}" stroke-width="3" />
    <circle cx="0" cy="-70" r="14" fill="${theme.accent}" />

    <rect x="-150" y="0" width="300" height="32" rx="16" fill="${theme.accent}" fill-opacity="0.2" stroke="${theme.accent}" stroke-width="1" />
    <text x="0" y="21" font-size="13" font-weight="700" fill="${theme.accent}" letter-spacing="1.5">${escapeXml(label)}</text>

    <text x="0" y="75" font-size="28" font-weight="800" fill="#ffffff">FRAME ${frameIndex} OF ${FRAMES_PER_SHOOT}</text>

    <text x="0" y="110" font-size="14" font-weight="500" fill="rgba(255,255,255,0.6)">[MOCK TEST PREVIEW]</text>
    <text x="0" y="132" font-size="12" fill="rgba(255,255,255,0.4)">Ratio: ${aspectRatio} · Zero GPU Cost</text>
  </g>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Shoot titles are authored prose, and an ampersand in one breaks the SVG. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
