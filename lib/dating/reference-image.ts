import sharp from "sharp";

/**
 * Phone camera stamps are burned into the bottom edge and Seedream copies them
 * into generated photos. Detection proved unreliable on real uploads, so every
 * dating reference is normalized and the unsafe edge is removed deterministically.
 */
const BOTTOM_EDGE_CROP = 0.08;
const MAX_REFERENCE_EDGE = 2400;

export async function sanitizeDatingReferenceImage(input: Buffer): Promise<Buffer> {
  const normalized = await sharp(input, { animated: false })
    .rotate()
    .toBuffer({ resolveWithObject: true });

  if (normalized.info.width < 320 || normalized.info.height < 320) {
    throw new Error("Reference image is too small; use a photo at least 320px on each side");
  }

  const safeHeight = Math.max(
    320,
    normalized.info.height - Math.ceil(normalized.info.height * BOTTOM_EDGE_CROP)
  );

  return sharp(normalized.data)
    .extract({
      left: 0,
      top: 0,
      width: normalized.info.width,
      height: safeHeight,
    })
    .resize({
      width: MAX_REFERENCE_EDGE,
      height: MAX_REFERENCE_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();
}

export type StoredDatingReference = {
  uri: string;
  reference_sanitized?: boolean | null;
};

export function verifiedDatingReferenceUrls(
  samples: readonly StoredDatingReference[],
  minimum = 1
): string[] {
  const usable = samples.filter((sample) => Boolean(sample.uri));
  if (usable.length < minimum) {
    throw new Error(`Upload at least ${minimum} reference photos before ordering`);
  }
  if (usable.some((sample) => sample.reference_sanitized !== true)) {
    throw new Error(
      "Your saved reference photos predate watermark protection. Re-upload them before generating another dating shoot."
    );
  }
  return usable.map((sample) => sample.uri);
}
