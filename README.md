# Toko Kue Bu Siti

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
