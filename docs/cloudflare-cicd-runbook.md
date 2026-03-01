# Cloudflare CI/CD Runbook

## Purpose
This runbook defines how CI and release automation run for this repository after Phase 5.

## Workflows

### `CI` (`.github/workflows/ci.yml`)
Triggers:
- Pull requests
- Push to `main`

Checks:
- Frontend app (`app/`): install, test, build.
- Lighthouse audit on push to `main` and upload reports as GitHub artifacts.
- Worker API (`backend/worker-api/`): install, test, typecheck.

### `Deploy Cloudflare` (`.github/workflows/deploy-cloudflare.yml`)
Trigger:
- Manual (`workflow_dispatch`)

Execution order:
1. Deploy Worker API (after tests, typecheck, and remote D1 migrations).
2. Deploy frontend to Cloudflare Pages.
3. Run optional post-deploy smoke checks when `SMOKE_BASE_URL` secret is configured.

## Required GitHub Secrets

Set these in repository or environment secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`

Optional smoke-check secrets:
- `SMOKE_BASE_URL` (example: `https://tokokuebusiti.com`)
- `SMOKE_ORDER_NUMBER` (existing order number for optional tracking validation)
- `SMOKE_ORDER_EMAIL` (paired email for optional tracking validation)

### Secret Setup Steps (GitHub)
1. Open repository `Settings` -> `Secrets and variables` -> `Actions`.
2. Create each required secret listed above.
3. For production protection, prefer environment-level secrets and approvals.
4. Re-run `Deploy Cloudflare` workflow using `workflow_dispatch`.

Recommended token scope:
- Workers Scripts: Edit
- Workers KV/D1/R2 as needed by deployment
- Pages: Edit

## One-time Cloudflare Preconditions

1. Ensure `backend/worker-api/wrangler.toml` has real `database_id` for D1.
2. Ensure R2 buckets listed in `wrangler.toml` already exist.
3. Ensure Pages project already exists and its name matches `CLOUDFLARE_PAGES_PROJECT_NAME`.
4. Ensure runtime vars/secrets for notifications are set in Worker environment when used.

## Operational Notes

- Deploy workflow runs migrations before Worker deploy. Keep migrations backward compatible.
- If Worker deploy fails after migration, fix and re-run workflow; avoid deleting data in emergency fixes.
- Lighthouse reports are not committed; retrieve from CI artifacts.
- Smoke-check script path: `scripts/smoke-check.mjs`.

## Manual Smoke Check Command

Run from repository root:

```bash
SMOKE_BASE_URL=https://tokokuebusiti.com node scripts/smoke-check.mjs
```

Optional tracking validation:

```bash
SMOKE_BASE_URL=https://tokokuebusiti.com SMOKE_ORDER_NUMBER=TK-20260301-123 SMOKE_ORDER_EMAIL=customer@example.com node scripts/smoke-check.mjs
```

## Rollback

1. Re-run deploy workflow from last known good commit.
2. If issue is frontend-only, redeploy previous frontend build.
3. If issue is Worker-only, redeploy previous Worker commit and verify `GET /health`.
4. Re-run critical smoke flow: checkout -> track order -> admin status update.
