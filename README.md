# Trade Log

A personal trading history dashboard — log trades once a day, see running
P&L stats, filter by type, and attach a screenshot per trade.

## Columns

Date, Trade name, Trade type (Future / Option / Commodity), Direction
(Long / Short), Entry & Exit price, Quantity, Strike price & Expiry
(options only), Gross P&L, Realized PnL, Charges, Net PnL (auto-calculated),
Strategy tag, Notes, Status (Open / Closed), Screenshot.

## Stack

- **Next.js 16** (App Router) — one app for both the UI and the API routes
- **Prisma + Postgres** — trade data
- **Vercel Blob** — screenshot storage
- Deployed on **Vercel**

## 1. Local setup

```bash
npm install
```

`npm install` also runs `prisma generate` automatically (via the
`postinstall` script) — this requires internet access to Prisma's engine
CDN, which is normal on your machine/CI but was blocked in the sandbox
this project was built in.

## 2. Create the database and blob store (on Vercel)

1. Push this project to a GitHub repo and import it into Vercel
   (New Project → your repo).
2. In the Vercel project → **Storage** tab:
   - Create a **Postgres** database (or Neon, via Vercel's Marketplace) and
     connect it to the project. This sets `POSTGRES_PRISMA_URL` and
     `POSTGRES_URL_NON_POOLING` automatically.
   - Create a **Blob** store and connect it. This sets
     `BLOB_READ_WRITE_TOKEN` automatically.
3. Pull those env vars locally if you want to run against the real DB:
   ```bash
   vercel env pull .env.local
   ```

## 3. Create the database tables

Once `.env.local` has real values:

```bash
npm run db:push
```

This applies `prisma/schema.prisma` to your Postgres database (no separate
migration files needed for a single-user project like this).

## 4. Run locally

```bash
npm run dev
```

## 5. Deploy

Push to GitHub — Vercel redeploys automatically on every push, and picks
up the env vars from the Storage integrations you connected in step 2.

## Notes

- **Net PnL** is calculated automatically as `Realized PnL − Charges` —
  you don't need to enter it directly.
- Strike price and expiry fields only appear in the form when trade type
  is **Option**.
- Screenshots upload to Vercel Blob and are stored as a public URL on the
  trade row — click a thumbnail in the table to view it full-size.
- This is intentionally unauthenticated (a personal single-user tool). If
  you ever share the link, anyone with it can view and edit entries — add
  auth (e.g. a simple password gate via middleware, or Vercel's
  password-protection on the deployment) before sharing it.
