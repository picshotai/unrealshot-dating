/**
 * Save a delivered photo to disk.
 *
 * `<a href={r2Url} download="name.png">` does not work here. The `download`
 * attribute is ignored on a cross-origin href, so the browser navigated to the
 * image instead of saving it — and with `target="_blank"` that meant a new tab
 * showing the picture, which is what a user reported. On mobile it is worse:
 * the tab opens and the photo is still not in their camera roll.
 *
 * The authenticated download endpoint verifies ownership, fetches the trusted
 * stored URL on the server, and returns the bytes through this origin. Turning
 * that response into a blob URL gives every supported browser a reliable save
 * with the requested filename.
 */
export async function downloadPhoto(
  photoId: string,
  url: string,
  filename: string
): Promise<void> {
  // A mock placeholder is already inline; there is nothing to fetch.
  if (url.startsWith("data:")) {
    triggerDownload(url, filename);
    return;
  }

  const params = new URLSearchParams({ photoId, filename });
  const response = await fetch(`/api/download?${params.toString()}`);
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(
      payload?.error || `Could not download the photo (${response.status})`
    );
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
