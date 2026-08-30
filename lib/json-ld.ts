/** Serialize JSON-LD without allowing a CMS value to terminate the script tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

