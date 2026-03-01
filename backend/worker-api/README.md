# Worker API (Cloudflare)

## Scripts
- `npm run dev` - Run worker locally with Wrangler.
- `npm run test` - Run worker route tests.
- `npm run typecheck` - Type-check TypeScript sources.
- `npm run deploy` - Deploy worker.
- `npm run d1:migrate:local` - Apply D1 migrations locally.
- `npm run d1:migrate:remote` - Apply D1 migrations on remote database.
- `npm run d1:execute:local -- --command "<sql>"` - Execute SQL locally.

## D1 Migrations
- Migration files are stored in `migrations/`.
- Initial baseline schema: `migrations/0001_initial_schema.sql`.
- CRUD media extension: `migrations/0002_product_blog_media_fields.sql`.

## Routes
- `GET /health`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/track?orderNumber=<id>&email=<email>`
- `PATCH /api/orders/:id/status`
- `POST /api/orders/:id/payment-proof`
- `GET /api/blog/posts`
- `POST /api/blog/posts`
- `PUT /api/blog/posts/:id`
- `DELETE /api/blog/posts/:id`
- `GET /api/settings`
- `PUT /api/settings`
- `POST /api/media/upload`
- `GET /api/media/:key`
- `POST /api/notifications/test`

## Media Upload Placeholder
- Upload endpoint expects `multipart/form-data` with field `file`.
- Allowed mime types: `image/jpeg`, `image/png`, `image/webp`.
- Max file size: 5MB.

## Notes
- Notification routes use `FONNTE_API_KEY` and `RESEND_API_KEY` when configured.
- Tracking requires `orderNumber + email` pair.
