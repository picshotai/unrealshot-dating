export const DATING_IMAGE_MODEL =
  "openai/gpt-image-2.5/sunburst/edit" as const;

type DatingImageDimensions = {
  width: number;
  height: number;
};

const REDUCED_PORTRAIT_SIZE = { width: 1024, height: 1536 } as const;
const REDUCED_TALL_SIZE = { width: 864, height: 1536 } as const;
const REDUCED_LANDSCAPE_SIZE = { width: 1536, height: 1024 } as const;

/**
 * Keep authored composition metadata stable while requesting a cheaper canvas
 * from GPT Image. This also reduces legacy and already-snapshotted dimensions.
 */
export function resolveDatingProviderImageDimensions(
  imageSize: DatingImageDimensions
): DatingImageDimensions {
  if (imageSize.width > imageSize.height) {
    return REDUCED_LANDSCAPE_SIZE;
  }

  if (imageSize.height / imageSize.width >= 1.6) {
    return REDUCED_TALL_SIZE;
  }

  return REDUCED_PORTRAIT_SIZE;
}

export function buildDatingImageInput({
  prompt,
  imageUrls,
  imageSize,
}: {
  prompt: string;
  imageUrls: string[];
  imageSize: DatingImageDimensions;
}) {
  return {
    prompt,
    image_urls: imageUrls,
    image_size: resolveDatingProviderImageDimensions(imageSize),
    background: "auto" as const,
    quality: "medium" as const,
    num_images: 1,
    output_format: "png" as const,
  };
}
