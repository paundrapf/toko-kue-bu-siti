# Scope Boundary and Change Control Policy

## Purpose
This policy operationalizes Section 15 (Change Management) of `PROJECT_BRIEF (1).md` for day-to-day implementation decisions.

## Scope Boundary (Phase 1)

### In Scope (Phase 1 Delivery Target)
- Public website core pages and commerce flow.
- Admin operations for products, orders, blog, categories, media, and settings.
- Order lifecycle and payment proof workflow.
- WhatsApp and email notification integrations.
- Basic analytics, testing baseline, launch-readiness controls.

### Out of Scope by Default
- Any feature marked Phase 2 or Phase 3 in brief sections.
- All items listed in Appendix B.
- Platform pivots beyond agreed Cloudflare-first architecture unless approved.

## Change Categories (from Section 15.2)

### Minor Change
- Typical effort: under 2 hours.
- Examples: copy edits, small style adjustments, bug fix from implementation defect.
- Commercial policy: included (subject to agreed limit).

### Medium Change
- Typical effort: larger than minor and can affect schedule.
- Examples: new page, notable layout changes, additional template, integration tweak.
- Commercial policy: paid change request with explicit quote.

### Major Change
- Typical effort: core feature addition or architecture shift.
- Examples: payment gateway, member system, advanced promotion engine, large redesign.
- Commercial policy: move to later phase or separate project agreement.

## Decision Protocol and Approval Gate

### Step 1 - Intake
- Request must include: change description, reason, urgency, expected outcome.

### Step 2 - Impact Assessment
- Assess effect on scope, timeline, quality, risk, and cost.
- Provide technical notes and trade-offs.

### Step 3 - Classification
- Label request as Minor, Medium, or Major.
- Map to `Must Have`, `Optional`, `Deferred`, or `Out of Scope`.

### Step 4 - Approval Gate
- No implementation starts before written approval for Medium/Major changes.
- Minor changes can proceed within allocated allowance.

### Step 5 - Plan Update
- Update backlog, milestone plan, and acceptance criteria.
- Add/update traceability entry in `docs/requirements-traceability.md`.

### Step 6 - Delivery and Verification
- Implement change.
- Execute tests and verification linked to changed requirement(s).
- Record result in release notes/changelog.

## Do-Not-Implement List (Without Formal Approval)
- Real payment gateway integration (Midtrans/Xendit/etc.).
- Member auth/loyalty/wishlist/reviews.
- Multi-language and multi-currency support.
- Native mobile applications.
- Live chat/live commerce.
- Marketplace multi-vendor features.
- AI recommendation/chatbot features.

## Schedule Protection Rules
- Must Have Phase 1 work cannot be displaced by Optional requests.
- If conflict occurs, Optional items are deferred first.
- Medium/Major approved changes require explicit timeline revision.

## Documentation and Audit Trail
- Every approved change must have:
  - unique change ID,
  - impact summary,
  - approver,
  - implementation commit references,
  - verification evidence.

## Escalation
- If request ambiguity or blocker appears, work pauses on affected item and issue is escalated for clarification before proceeding.
