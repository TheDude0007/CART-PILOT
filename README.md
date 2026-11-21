# CartPilot — Vercel App

Full-stack grocery route + savings app: static frontend, serverless API, and swappable storage. Deploys to Vercel with **zero configuration** and is fully functional the instant it's live.

## What's deployed

- **Frontend** (`public/index.html`) — the complete CartPilot UI: list building, 3D in-store route map, multi-store price comparison, split-cart optimizer, coupon stacking, budget mode, rewards wallet. Talks to the live API via `fetch`.
- **Serverless API** (`api/*.js`) — auth (JWT), carts, route optimization (nearest-neighbor + 2-opt), pricing/arbitrage, split-cart, coupons, ledger-backed rewards.
- **Storage** (`api/_lib/store.js`) — two interchangeable backends behind one interface.

## Storage: zero-config now, durable when you want it

- **Default — in-memory:** no setup. Seeded with a working demo account (`demo@cartpilot.app` / `demo1234`) and realistic catalog. Every endpoint works immediately. State resets on serverless cold starts — ideal for demos and pitches.
- **Durable — Postgres:** set the `POSTGRES_URL` environment variable (Vercel Postgres, Neon, or any Postgres). The app auto-detects it, creates its schema, and persists everything. No code change — just the env var.

## Deploy

This repo is Vercel-ready (`vercel.json` included). Three ways:

1. **Vercel dashboard** — import the repo, deploy. Done.
2. **CLI** — `npm i -g vercel && vercel --prod`
3. **MCP / automation** — already wired; deploy was triggered from chat.

### Recommended production env vars
- `JWT_SECRET` — set a strong secret (defaults to a dev value otherwise).
- `POSTGRES_URL` — *(optional)* turns on durable storage.

## Local dev

```bash
npm install
node dev-server.js     # http://localhost:3000 (mimics Vercel routing)
npm test               # 22-check end-to-end test against the handlers
```

## API (all money in integer cents)

Auth: `Authorization: Bearer <token>`.

- `GET  /api/health`
- `POST /api/auth?action=register|login` · `GET /api/auth?action=me`
- `GET  /api/catalog?resource=stores|search|resolve|product|suggestions`
- `GET  /api/cart?action=view|compare|route|split|clipped`
- `POST /api/cart?action=add|remove|check|clip|checkout`
- `PUT  /api/cart?action=store|budget`
- `GET  /api/rewards?action=wallet` · `POST /api/rewards?action=cashout|plus_subscribe|plus_cancel`

## Going live with real grocery data

Prices, inventory, and coupons are simulated to the **exact shape** of real partner APIs (Kroger, Instacart, Coupons.com). `api/_lib/catalog.js` is the data source. To use real data, implement those same exported functions against the partner APIs you've contracted — the routing, pricing, coupon, and rewards logic are all data-source-agnostic and keep working unchanged.

## Honest scope

Real-time grocery inventory, store pricing, and coupon networks are partner-gated APIs requiring signed agreements. This app is fully functional against simulated data shaped like those APIs — a real, deployed, multi-user system today, and a drop-in client for live data once partnerships exist.
