/**
 * Save a delivered photo to disk.
 *
 * `<a href={r2Url} download="name.png">` does not work here. The `download`
 * attribute is ignored on a cross-origin href, so the browser navigated to the
 * image instead of saving it — and with `target="_blank"` that meant a new tab
 * showing the picture, which is what a user reported. On mobile it is worse:
 * the tab opens and the photo is still not in their camera roll.
 *
 * Fetching the bytes and handing over a blob URL makes the download same-origin
 * as far as the browser is concerned, so the filename and the save both work.
 * The gallery ZIP already fetches these URLs directly, which is how we know R2
 * allows it.
 */
export async function downloadPhoto(
  url: string,
  filename: string
): Promise<void> {
  // A mock placeholder is already inline; there is nothing to fetch.
  if (url.startsWith("data:")) {
    triggerDownload(url, filename);
    return;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch the photo (${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    triggerDownload(objectUrl, filename);
  } finally {
    // Revoked on the next tick: revoking synchronously can cancel the save in
    // Safari before it has read the blob.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
  }
}

function triggerDownload(href: string, filename: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Shoot titles are prose ("Kitchen, morning"); filenames are not. */
export function photoFilename(
  shootTitle: string,
  frameIndex: number,
  isMock: boolean
): string {
  const slug =
    shootTitle
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "shoot";
  return `${slug}-${frameIndex}.${isMock ? "svg" : "png"}`;
}
