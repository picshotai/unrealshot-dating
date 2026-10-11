# Repository instructions

- Deploy Trigger.dev tasks through the repository's GitHub Actions workflows. Never deploy tasks directly from a local CLI. Publish approved changes to GitHub and verify the workflow result.
- Vercel deployments should originate from the connected GitHub repository. Verify that the pushed commit receives a successful Vercel deployment status.
- Do not run `pnpm.cmd run lint` for every minor change. Run checks appropriate to the affected code, and full lint after a sufficient amount of code changes.
- Keep the codebase organized into manageable modules and components rather than adding thousands of lines to individual files.
