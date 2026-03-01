# Toko Kue Bu Siti

[![CI](https://github.com/paundrapf/toko-kue-bu-siti/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/paundrapf/toko-kue-bu-siti/actions/workflows/ci.yml)
[![Deploy Cloudflare](https://github.com/paundrapf/toko-kue-bu-siti/actions/workflows/deploy-cloudflare.yml/badge.svg)](https://github.com/paundrapf/toko-kue-bu-siti/actions/workflows/deploy-cloudflare.yml)
[![Smoke Check](https://github.com/paundrapf/toko-kue-bu-siti/actions/workflows/smoke-check.yml/badge.svg)](https://github.com/paundrapf/toko-kue-bu-siti/actions/workflows/smoke-check.yml)

Repository for the Toko Kue Bu Siti ecommerce project.

## Current Structure
- `app/` - Existing frontend application (React + Vite)
- `backend/worker-api/` - Cloudflare Worker API + D1 migrations
- `docs/` - Governance, QA, and handover documentation
- `PROJECT_BRIEF (1).md` - Approved project brief and scope
- `IMPLEMENTATION_EXECUTION_PLAN.md` - Execution plan and phase roadmap

## Execution Direction
The implementation is being migrated toward a Cloudflare full-stack architecture using Wrangler:
- Cloudflare Pages for frontend hosting
- Cloudflare Workers for backend API
- Cloudflare D1 for relational data
- Cloudflare R2 for media storage

## QA and Release Docs
- `docs/requirements-traceability.md`
- `docs/scope-must-have-vs-optional.md`
- `docs/scope-boundary-and-change-control.md`
- `docs/phase-5-qa-release-handover.md`
- `docs/cloudflare-cicd-runbook.md`

## Automation
- `.github/workflows/ci.yml` runs tests/build and Lighthouse checks.
- `.github/workflows/deploy-cloudflare.yml` handles manual Cloudflare deployment.
- `.github/workflows/smoke-check.yml` runs ad-hoc smoke checks against any URL.
- `scripts/smoke-check.mjs` provides post-deploy smoke checks for core API routes.

## GitHub Secrets Bootstrap
Set these in `Settings` -> `Secrets and variables` -> `Actions`:
- Required for deploy: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT_NAME`
- Optional for auto smoke check in deploy: `SMOKE_BASE_URL`, `SMOKE_ORDER_NUMBER`, `SMOKE_ORDER_EMAIL`
