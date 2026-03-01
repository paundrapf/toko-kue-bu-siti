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

## Required GitHub Secrets

Set these in repository or environment secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`

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

## Rollback

1. Re-run deploy workflow from last known good commit.
2. If issue is frontend-only, redeploy previous frontend build.
3. If issue is Worker-only, redeploy previous Worker commit and verify `GET /health`.
4. Re-run critical smoke flow: checkout -> track order -> admin status update.
