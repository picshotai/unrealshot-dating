# Photographic direction change — 24 September 2026

## Implementation

The production writer and retake refiner share a compact instruction in
`lib/dating/creative-director/photographic-direction.ts`. It separates camera
position, face orientation relative to the lens, gaze and crop. The LLM chooses
the views from the occasion; there is no assigned angle sequence or angle range.
The final capture prompt must carry the visible geometry, not just private plans.

Continuity preserves the physical location, outfit and light source while allowing
the projected background to change with camera position. Identity and anchor
clauses explicitly release the reference pose and composition. Ordinary walking,
standing and outfit presentation do not justify a wider crop.

The provider now sends 1152x1536 for 3:4 and 1536x1152 for 4:3. Previously those
requests became 2:3 and 3:2 respectively. 9:16 remains 864x1536.

Database contract versions remain unchanged because the output schema is compatible
and existing database functions check those versions. The wording revision is
`dating-photographic-direction-v3`, included in the writer instruction.

## Live evaluation

Three four-photo pier shoots were rendered during implementation (12 image
requests total). Each used the two user-supplied identity photographs, the actual
Gemini writer, production compiler and Sunburst input builder. The generated
anchor was appended to the identity references for all three followers. Prompts
were not manually edited between writing and rendering. No customer orders,
credits or stored production prompts were changed by this evaluation.

| Run | Observation | Correction |
| --- | --- | --- |
| Initial | Tighter photographs, but two face views remained similar and camera locations were vague. | Require visible nose/cheek/eye relationships and a physical camera sightline. |
| Second | Front, leftward and rightward face views appeared, with different railing perspectives. One walking frame was still too wide. | Ordinary walking and clothing no longer justify wide framing. |
| Final | All four were portrait crops; one pronounced sideward face view and several nearer-frontal views. Railing direction and background coverage changed across frames. | Retained as the final evaluated instruction. |

The final result improves framing and viewpoint variety, but some near-frontal
face angles and head tilt still resemble the references. This is not evidence of
perfect pose control or cross-customer reliability. Background additions such as
pier lamps also vary; continuity is recognizable rather than pixel-exact. This
was one identity and one location, not a launch-wide quality benchmark.

Private full-size images, writer output, prompts and request IDs remain under
`docs/generated/shoot-direction-test/` (gitignored). Final run:
`2026-09-24T08-57-26-289Z/contact-sheet.png`.

## Reproduce

With configured `GEMINI_API_KEY` and `FAL_KEY`:

```powershell
pnpm.cmd run test:shoot-direction photo1.jpg photo2.jpg
```

This is a paid live test. It creates one anchor and three followers. Use
`--brief=path/to/brief.json` to supply another brief in the production schema.
The default fixture is `scripts/fixtures/pier-direction-brief.json`.

## Checks

- Production prompt regression checks passed, including exact provider aspect ratios.
- Production TypeScript checks passed.
- ESLint passed for changed TypeScript files.
- Full repository lint has pre-existing failures in unrelated files (201 errors,
  153 warnings); this change does not resolve that existing backlog.

Existing saved prompt snapshots are not rewritten. New shoots use the new
guidance after deployment; unchanged retries of old snapshots retain their prompts.
