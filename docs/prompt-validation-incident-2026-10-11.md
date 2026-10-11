# Prompt validation incident — 11 October 2026

Order `fb2c915a-3683-4e8c-bb96-fb946498548f` failed at prompt validation. Gemini calls succeeded, but expression keyword checks interpreted prohibitions such as “no teeth visible” and “without smiling, grinning, or showing teeth” as requests for prohibited expressions. Correction attempts strengthened those prohibitions and repeatedly failed the same checks. Eleven of fifteen shoots passed; four remained reserved after ten writer attempts each. No images were allocated before recovery. The failed order released its reserved pack.

The fix removes only explicit expression prohibitions from the text inspected by expression checks. Original capture prompts remain intact. Anchor neutrality, one warm frame per shoot, actual prohibited expressions, and all other validation rules remain enforced. Workers now log individual validation errors alongside their completion result.

Regression checks cover the production phrases, coordinated negative lists, prohibited expressions later in the same sentence, anchor violations, and excess warm frames. Run `pnpm run check:expression-validation` and the existing production prompt/type checks.

Recovery revalidated all four latest saved provider responses against the complete corrected contract. Each passed. The recovery script created a new zero-cost attempt with its source attempt ID recorded, retained the original failure records, and resumed the existing order through normal pack reservation. No additional Gemini calls were made. Recovery run: `run_06gijke1kktuutahmkuo6cga01`.

The recovery script defaults to a dry run:

```text
node --env-file=.env.local --import tsx scripts/recover-prompt-validation-order.ts ORDER_UUID
```

`--apply --resume` saves validated recovery attempts and resumes the order. It requires the current prompt contract, a terminal prompt-validation failure, verified references, and an available returned pack. It refuses candidates that still violate the contract.

The initial production deployment request was rejected by automatic approval review pending explicit approval for the Trigger.dev source upload. The recovered order rendered on the existing worker because all fifteen shoots had validated accepted outputs. After the user explicitly approved deployment, both the prompt-validation and notification fixes were successfully deployed to production as version `20261011.1`. The code bundle, runtime image build, and task indexing succeeded, and the CLI confirmed deployment completion with promotion enabled. Deployment: https://cloud.trigger.dev/projects/v3/proj_cviukwishlktvpcdfqfh/deployments/9lued391.

Recovery completed at 12:50:39 IST on 11 October 2026. The parent run is `COMPLETED`; the order is `ready`, all 60 photos are completed, all 15 whole shoots are delivered, zero photos failed, and the normal pack reservation is captured. Production prompt checks, expression regressions, pipeline type checks, targeted ESLint, and diff whitespace checks passed.

## Ready email rejection

The customer supplied the Resend request log showing a 403 rejection for `photos@unrealshot.com`: the root domain is not verified. The configured sender is `RESEND_SENDER_EMAIL=support@noreply.unrealshot.com`, but the ready-email worker only read `RESEND_FROM_EMAIL` and used the unverified root-domain fallback. A live read of Resend confirmed that `noreply.unrealshot.com` is verified.

The email fix respects the configured sender (retaining the existing `RESEND_FROM_EMAIL` override), uses the verified subdomain for its fallback, checks Resend's returned error before logging acceptance, records the accepted email ID in logs, and uses a per-order idempotency key. The parent logs unsuccessful notification results while keeping completed photos ready. Email regression checks use stubs and send no messages. The rejected customer notification has not been resent; sending it requires explicit user authorization.

## Web deployment follow-up

The direct Trigger.dev deployment uploaded the local worker source; it did not publish a Git commit or deploy the Next.js application. On 11 October, remote `main` still pointed to `021e736` from 1 October, and its Vercel failure status was also dated 1 October. Today's missing Vercel deployment was therefore caused by the fixes remaining uncommitted and unpushed, rather than a new Vercel build failure. Publishing the approved hotfix to `main` is required to trigger the connected Vercel deployment. Photo-quality changes remain outside this hotfix.

The hotfix was pushed as `a83f168`; both its Vercel deployment and Trigger.dev GitHub Action completed successfully. The supplied older build log separately showed a WordPress timeout during article path enumeration. Articles now generate on demand with the existing 600-second ISR interval, and the sitemap defers its CMS query until request time while retaining the tagged data cache. CMS failures still throw instead of creating fake articles, 404s, or incomplete sitemaps. A full production build passed with `WORDPRESS_API_URL=http://127.0.0.1:9/graphql`, demonstrating that an unavailable CMS no longer blocks deployment. SEO and locale checks also passed. The build additionally exposed a legacy Fal image-size annotation incompatible with the installed SDK; the annotation now lists the existing supported literals without changing runtime values.

All subsequent Trigger.dev task deployments must originate from the repository's GitHub Actions workflow. This requirement is recorded in `AGENTS.md` and the deployment documentation.
