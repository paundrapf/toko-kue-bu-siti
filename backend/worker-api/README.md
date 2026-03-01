# Worker API (Cloudflare)

## Scripts
- `npm run dev` - Run worker locally with Wrangler.
- `npm run typecheck` - Type-check TypeScript sources.
- `npm run deploy` - Deploy worker.
- `npm run d1:migrate:local` - Apply D1 migrations locally.
- `npm run d1:migrate:remote` - Apply D1 migrations on remote database.
- `npm run d1:execute:local -- --command "<sql>"` - Execute SQL locally.

## D1 Migrations
- Migration files are stored in `migrations/`.
- Initial baseline schema: `migrations/0001_initial_schema.sql`.

## Placeholder Routes
- `GET /health`
- `GET /api/products`
- `GET /api/orders`
- `GET /api/blog/posts`
- `GET /api/settings`
