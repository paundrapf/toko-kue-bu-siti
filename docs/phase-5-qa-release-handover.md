# Phase 5 QA, Release, and Handover

## Scope
This document covers final QA checks, release execution steps, and operator training notes for the Cloudflare full-stack setup.

## 1) Automated Verification Commands

### Frontend (`app/`)
1. `npm install`
2. `npm run test`
3. `npm run build`
4. `npm run lighthouse`

Expected:
- Unit tests pass.
- Build succeeds without errors.
- Lighthouse report is generated in `app/.lighthouseci/`.

### Worker API (`backend/worker-api/`)
1. `npm install`
2. `npm run test`
3. `npm run typecheck`

Expected:
- Worker route tests pass.
- TypeScript type-check passes.

## 2) Critical Manual Flow Checklist

### Customer Flow
- Browse products and add item to cart.
- Checkout with valid customer data.
- Confirm order number is generated.
- Track order using `orderNumber + email`.
- Upload payment proof from tracking page.

### Admin Flow
- Open admin panel and confirm orders list appears.
- Update order status (Pending -> Confirmed -> Delivered).
- Verify status history is visible from tracking page.
- Test product CRUD from admin panel.
- Test blog CRUD from admin panel.
- Save settings and verify persisted values.
- Send test WhatsApp and email notification.

## 3) Accessibility and Performance Baseline

Hardening implemented in Phase 5:
- Lazy-loaded non-primary views to reduce initial JS bundle.
- Added keyboard activation support for clickable content cards.
- Added skip link (`Lewati ke konten utama`) for keyboard navigation.
- Added improved ARIA labels for icon-only and social action buttons.
- Added reduced motion fallback via `prefers-reduced-motion`.

## 4) Cloudflare Release Checklist

### Pre-release
1. Ensure all commands in section (1) pass.
2. Ensure remote is up to date and tagged if needed.
3. Confirm required env vars/secrets are set in Cloudflare.

### Deploy Worker API
From `backend/worker-api/`:
1. `npm run d1:migrate:remote`
2. `npm run deploy`

Post-deploy checks:
- `GET /health` returns `success: true`.
- Order creation and tracking endpoints respond correctly.

### Deploy Frontend (Pages)
From `app/`:
1. `npm run build`
2. `npx wrangler pages deploy dist --project-name <pages-project-name>`

Post-deploy checks:
- Home page loads and navigation works.
- Checkout and order tracking connect to Worker API.
- Payment proof upload works on production domain.

## 5) Rollback Notes

If a release fails:
1. Re-deploy previous stable commit for frontend and Worker.
2. Re-run smoke checks from section (2).
3. Log incident summary: issue, impact window, fix, prevention action.

## 6) Operator Training Package (Admin)

### Daily operations
- Check incoming orders and prioritize by delivery date.
- Confirm payment proof validity before setting `Confirmed`.
- Move status progressively and avoid skipping states unless required.

### Weekly operations
- Review best-selling products and update featured products.
- Publish at least one blog post for SEO freshness.
- Send one notification test to verify provider connectivity.

### Incident handling
- If notification channel fails, continue order updates in admin and notify customer manually via WhatsApp.
- If payment proof upload fails, request customer resend while ops logs the order note.
