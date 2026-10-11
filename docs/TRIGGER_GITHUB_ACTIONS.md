# Trigger.dev auto-deploy via GitHub Actions

## Workflows

| File | When | Env |
|---|---|---|
| `.github/workflows/deploy-trigger-prod.yml` | Every push to `main` or manual | prod |
| `.github/workflows/deploy-trigger-staging.yml` | Manual only | staging |

Production task deployments must go through this GitHub Actions workflow, not a
direct local CLI deployment. Push approved changes to `main` and verify the
workflow result. The connected Vercel project separately builds that same commit.

## Required GitHub secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Where to get it |
|---|---|
| `TRIGGER_ACCESS_TOKEN` | [cloud.trigger.dev → Account → Personal Access Tokens](https://cloud.trigger.dev/account/tokens) |
| `TRIGGER_PROJECT_REF` | Optional if `project` is hard-coded in `trigger.config.ts`. Format: `proj_...` |

## Project ref in config

`trigger.config.ts` currently uses:

```ts
project: process.env.TRIGGER_PROJECT_REF || "proj_replace_me",
```

**Recommended for CI:** set the real project ref in `trigger.config.ts` (or always set `TRIGGER_PROJECT_REF` secret).

## Version pinning

Deploy uses the local CLI from `devDependencies` (`trigger.dev` package), not `@latest`:

```json
"trigger:deploy": "trigger deploy"
```

Keep `@trigger.dev/sdk` and `trigger.dev` on the **same version** or deploy will fail on version mismatch.

## Worker env vars (Trigger.dev dashboard)

CI only deploys task code. Runtime secrets still live in Trigger.dev:

- `FAL_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

## Verify

1. Add `TRIGGER_ACCESS_TOKEN` secret
2. Push a change under `trigger/` to `main`
3. Actions tab → **Deploy Trigger.dev (prod)** should go green
4. Trigger.dev dashboard → Deployments shows new version
