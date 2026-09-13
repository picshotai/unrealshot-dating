export const DATING_IMAGE_MODEL =
  "openai/gpt-image-2.5/sunburst/edit" as const;

type DatingImageDimensions = {
  width: number;
  height: number;
};

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
    image_size: imageSize,
    background: "auto" as const,
    quality: "high" as const,
    num_images: 1,
    output_format: "png" as const,
  };
}
