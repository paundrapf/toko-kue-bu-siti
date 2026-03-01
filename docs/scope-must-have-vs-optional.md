# Scope Map - Must Have vs Optional

## Objective
Define implementation priorities for Phase 1 based on `PROJECT_BRIEF (1).md`, with explicit boundaries against Appendix A (Phase 2/3) and Appendix B (out of scope).

## Priority Definitions
- `Must Have`: Required for Phase 1 sign-off.
- `Optional`: Can be implemented in Phase 1 if time allows, but not launch blockers.
- `Deferred`: Explicitly planned for Phase 2/3 (Appendix A or phase labels in main sections).
- `Out of Scope`: Explicitly excluded (Appendix B).

## Must Have - Phase 1 (Launch Blockers)

### Public Website
- Homepage with hero slider, featured products, blog highlights.
- Product catalog (search, filter, sort, responsive).
- Product detail page (gallery, variants, stock-aware add to cart).
- Cart (drawer + quantity adjustments + subtotal/total).
- Checkout multi-step with validation.
- Order confirmation page.
- Order tracking page (order number + email verification).
- Blog list/detail pages.
- About and Contact pages.
- Floating WhatsApp button.
- Mobile responsive layout.
- SEO basics (meta tags + sitemap + robots).

### Admin/CMS
- Dashboard with key metrics.
- Product CRUD with variants, category, status, featured, SEO fields.
- Order list/detail, status workflow, payment proof review, admin notes.
- Blog CRUD with draft/publish and category.
- Category management (product and blog).
- Media upload management.
- Site settings management (general/contact/social/shipping/order/payment/SEO/notification settings).

### Order and Payment
- Unique order number generation.
- Dummy payment flow for testing.
- Payment proof upload and verification flow.
- Order status workflow (Pending -> Confirmed -> Baking -> Ready -> Delivered, with Cancelled path).

### Integrations
- WhatsApp notifications via Fonnte (new order, status update, payment proof event).
- Email notifications via Resend (order confirmation/status update/invoice attachment).
- Instagram embed integration (simple embed method).

### Operations and Quality
- Basic analytics for orders/revenue/status/top products/low stock.
- Security baseline (server-side validation, auth, env handling, rate limiting).
- Testing baseline (unit/integration/manual critical flows).
- Launch readiness checklist aligned to Section 19.

## Optional in Phase 1 (Non-Blocking)
- Google Analytics 4 integration (Section 10.4 is optional).
- Error tracking with Sentry (not mandatory for launch in brief).
- Map embed in contact/settings where labeled optional.
- Cart expiry setting (marked optional in checkout/cart section).
- Additional polish items that do not alter core flow acceptance.

## Deferred to Phase 2/3 (Appendix A and inline "Phase 2" tags)

### Deferred to Phase 2
- Member registration/login and member dashboard.
- Loyalty points.
- Advanced promo code engine.
- Product reviews and ratings.
- Wishlist.
- Enhanced analytics dashboard.
- Advanced exports and reports.
- Scheduled publishing for blog.
- Free shipping threshold/zones and custom delivery slots.
- Admin limited/staff roles (full role matrix beyond super admin for production ops).

### Deferred to Phase 3
- Custom order and quotation workflow.
- Flash sales campaign engine.
- Product comparison.
- Advanced recommendation logic.
- Abandoned cart recovery automation.
- Multi-admin granular role management and advanced activity logging.
- Advanced notifications (SMS/push/marketing automation).
- Promotional banners campaign manager.
- Product Q&A.
- Bundle products.

## Out of Scope (Appendix B Boundary)
- Native mobile apps (iOS/Android/React Native/Flutter).
- Marketplace multi-vendor architecture.
- Real-time courier integrations and shipping label automation.
- Accounting/ERP/CRM direct integrations.
- Advanced internationalization (multi-language, multi-currency, international shipping/tax).
- Live chat/live shopping.
- Subscription billing flows.
- AI/ML features and custom hardware integrations.

## Scope Control Rules
- No Appendix A/B features are implemented unless approved via written change request.
- Any new request must be categorized first: Must Have, Optional, Deferred, or Out of Scope.
- Must Have scope has precedence over Optional scope when schedule conflicts occur.
