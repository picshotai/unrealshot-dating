import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import JSZip from "jszip"

const version = "1.0.0"
const pluginDirectory = resolve(process.cwd(), "wordpress/unrealshot-next-revalidation")
const sourcePath = resolve(pluginDirectory, "unrealshot-next-revalidation.php")
const readmePath = resolve(pluginDirectory, "readme.txt")
const releasePath = resolve(
  process.cwd(),
  `wordpress/releases/unrealshot-next-revalidation-${version}.zip`,
)

const [source, readme, release] = await Promise.all([
  readFile(sourcePath, "utf8"),
  readFile(readmePath, "utf8"),
  readFile(releasePath),
])

for (const requiredContract of [
  "Plugin Name: Unrealshot Next.js Revalidation",
  `Version: ${version}`,
  "UNREALSHOT_REVALIDATION_SECRET",
  "x-wordpress-timestamp",
  "x-wordpress-signature",
  "hash_hmac( 'sha256', $timestamp . '.' . $body, $secret )",
  "pll_get_post_translations",
  "transition_post_status",
  "post_updated",
  "before_delete_post",
  "wp_schedule_single_event",
  "unrealshot_revalidation_admin_test",
]) {
  assert.ok(source.includes(requiredContract), `Plugin is missing contract: ${requiredContract}`)
}

assert.ok(readme.includes(`Stable tag: ${version}`), "Plugin readme version is stale")

const zip = await JSZip.loadAsync(release)
const entries = Object.keys(zip.files).sort()
const expectedEntries = [
  "unrealshot-next-revalidation/",
  "unrealshot-next-revalidation/readme.txt",
  "unrealshot-next-revalidation/unrealshot-next-revalidation.php",
]
assert.deepEqual(entries, expectedEntries, "Release ZIP contains missing or unexpected files")

const zippedSource = await zip
  .file("unrealshot-next-revalidation/unrealshot-next-revalidation.php")
  ?.async("string")
const zippedReadme = await zip
  .file("unrealshot-next-revalidation/readme.txt")
  ?.async("string")
assert.equal(zippedSource, source, "Release ZIP PHP file is stale")
assert.equal(zippedReadme, readme, "Release ZIP readme is stale")

console.log("WordPress companion plugin checks passed")
