# Implementation Execution Plan - Cloudflare Full Stack

## Goal
Implement Phase 1 e-commerce scope aligned with `PROJECT_BRIEF (1).md`, using Cloudflare-first stack for hosting, backend, and data services via `wrangler`.

## Agreed Architecture (per latest direction)
- Frontend: Cloudflare Pages (existing `app/` initially, migration-ready)
- API backend: Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- File storage: Cloudflare R2
- Caching/edge: Cloudflare native caching
- Jobs/async notifications: Worker queues or scheduled workers (as needed)

## Execution Rules
- Work in batches of 3 tasks.
- Each task must include verification output.
- Commit every meaningful change.
- Push after each completed phase.

## Phase 0 - Repo + Cloudflare Foundation

### Task 0.1 - Initialize Git and first commit
Steps:
1. Initialize git in project root.
2. Create root `README.md` (if missing).
3. Commit root README as `first commit`.
4. Rename branch to `main`.
5. Add `origin` remote.

Verification:
- `git status`
- `git branch --show-current`
- `git remote -v`

### Task 0.2 - Baseline import commit
Steps:
1. Add all current project files (`app/`, `PROJECT_BRIEF (1).md`, plan file).
2. Commit as baseline import.

Verification:
- `git status`
- `git log --oneline -n 3`

### Task 0.3 - Push Phase 0
Steps:
1. Push `main` branch to origin with upstream.

Verification:
- `git status`
- branch shows tracking remote.

## Phase 1 - Governance Docs (Traceability)

### Task 1.1 - Requirement traceability matrix
Output file: `docs/requirements-traceability.md`

### Task 1.2 - Must-have vs optional scope map
Output file: `docs/scope-must-have-vs-optional.md`

### Task 1.3 - Scope boundary + change-control policy
Output file: `docs/scope-boundary-and-change-control.md`

## Phase 2 - Cloudflare Backend Scaffolding

### Task 2.1 - Worker API project setup
- Create `backend/worker-api` with `wrangler.toml`.
- Add route placeholders for products, orders, blog, settings.

### Task 2.2 - D1 schema baseline + migrations
- Create D1 migration files for products, categories, variants, orders, order_items, blog, users, settings.
- Add script commands for local and remote migrations.

### Task 2.3 - R2/media and env binding setup
- Add R2 binding config and upload endpoint placeholder with validation.

## Phase 3 - Bridge Current Frontend to API

### Task 3.1 - API client layer in frontend
### Task 3.2 - Replace local-only orders flow with API-backed flow
### Task 3.3 - Tracking + payment proof upload API integration

## Phase 4 - Feature Completion (Public + Admin)

### Task 4.1 - Public pages completion: terms/privacy, SEO basics, sitemap, robots
### Task 4.2 - Admin operations: product/blog/settings CRUD via API
### Task 4.3 - Notifications: Fonnte + Resend integration through Worker

## Phase 5 - QA, Release, and Handover

### Task 5.1 - Automated tests and critical e2e flows
### Task 5.2 - Lighthouse/accessibility/performance hardening
### Task 5.3 - Docs, training package, release checklist

## Progress Snapshot (2026-03-02)
- Phase 0 to Phase 4 completed and pushed to `origin/main`.
- Task 5.1 completed: automated tests added for frontend API client and Worker critical routes.
- Task 5.2 completed: performance hardening via view-level code splitting, plus accessibility improvements and Lighthouse config.
- Task 5.3 completed: QA/release/handover package documented in `docs/phase-5-qa-release-handover.md`.
