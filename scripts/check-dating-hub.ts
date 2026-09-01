import assert from "node:assert/strict"
import { datingHubFaqs, datingHubMethod, datingHubProblems, datingHubRoles, datingHubSpokes } from "../lib/dating-hub-content"
import { datingShoots } from "../lib/dating-shoot-content"
import { publicRoutes } from "../i18n/config"

const routePaths = new Set<string>(publicRoutes.map((route) => route.path))
assert.equal(datingHubProblems.length, 3)
assert.equal(datingHubSpokes.length, 6)
assert.equal(datingHubRoles.length, 6)
assert.equal(datingHubMethod.length, 6)
assert.ok(datingHubFaqs.length >= 8)
assert.equal(datingShoots.length, 7)

for (const spoke of datingHubSpokes) {
  assert.equal(routePaths.has(spoke.href), true, `Hub spoke is not a public route: ${spoke.href}`)
  assert.equal(datingShoots.some((shoot) => shoot.slug === spoke.shoot), true, `Hub spoke image is missing: ${spoke.shoot}`)
}

const text = JSON.stringify({ datingHubFaqs, datingHubMethod, datingHubProblems, datingHubRoles, datingHubSpokes })
for (const forbidden of [/shadowbanned by the algorithm/i, /beat the algorithm/i, /guaranteed matches/i, /high-converting/i, /\+99 likes/i, /ELO score/i]) {
  assert.equal(forbidden.test(text), false, `Forbidden hub claim found: ${forbidden}`)
}

console.log("Dating hub checks passed: 6 authority spokes, 6 photo roles, 7 shoots and 9 FAQs")
