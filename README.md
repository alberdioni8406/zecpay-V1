# ZecPay

A simple private payment page and invoice system for Zcash.

**Working name only.** No production domain is claimed. All public URLs come from `NEXT_PUBLIC_APP_URL`.

## What it is

Create → Share → Receive.

Creators get a clean payment page and lightweight invoices. Payers never need an account. Funds go straight to the creator’s Zcash address.

This is **not** a wallet.

## Features (MVP)

- Landing page (dark, cypherpunk-leaning UI)
- Email/password auth for creators only
- Create / edit / publish payment pages with live preview
- Public page at `/{username}` with preset + custom amounts
- ZIP-321 payment requests + QR + copy + open-wallet link
- Invoices at `/i/{publicId}`
- Dashboard: copy links, edit pages, create invoices
- Operator invoice status updates (paid only with explicit tx id)
- Security headers middleware + basic rate limits
- Privacy page documenting what is stored
- Dynamic Open Graph image for payment pages
- Local JSON data store (no hosted DB required to try)

## Non-custodial rules

- No wallet generation
- No private keys / seeds stored
- No holding of ZEC
- Creator supplies a receiving address they control
- Payer pays from their own wallet

## Privacy

Stored: creator account, public profile fields, receiving address, invoice metadata.

Not stored by default: payer identity, seeds, wallet balances, invasive analytics.

See `/privacy`.

## Architecture

```
src/app/
  page.tsx                 Landing
  login/                   Creator auth
  create/                  New payment page
  dashboard/               Manage pages + invoices
  dashboard/edit/[id]/    Edit page
  [username]/             Public pay page + OG image
  i/[id]/                 Public invoice
  privacy/                 Privacy notes
  api/auth|pages|invoices  JSON APIs

src/lib/
  zip321.ts                ZIP-321 URI builder
  store.ts                 Local JSON persistence
  auth.ts                  JWT session + bcrypt
  validation.ts            Zod schemas
  rateLimit.ts             Simple in-memory limits

prisma/schema.prisma       Production Postgres model (ready, not required locally)
data/                      Runtime JSON files (gitignored)
```

## ZIP-321

Payment URIs follow https://zips.z.cash/zip-0321/

```
zcash:<address>?amount=<zec>&memo=<base64url>&message=...&label=...
```

## Payment verification

Shielded payments cannot be auto-confirmed from a public address alone.

Invoice statuses:

- `pending` — waiting for payment
- `awaiting_verification` — possible payment, not proven
- `paid` — only if the creator supplies a transaction id (operator confirmation, not chain proof)
- `expired` / `cancelled`

The UI never pretends a shielded payment was received without that explicit step.

## Local development

```bash
cd zecpay
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:3000

1. Register at `/login`
2. Create a page at `/create`
3. Open `/{username}` on a phone
4. Select amount → scan QR or copy ZIP-321 URI
5. Create invoice from `/dashboard`
6. Share `/i/{publicId}`

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Origin for links and metadata (default `http://localhost:3000`) |
| `AUTH_SECRET` | Signs session cookies |
| `DATABASE_URL` | Reserved for Prisma/Postgres later |

## Production notes

- Set a strong `AUTH_SECRET`
- Set real `NEXT_PUBLIC_APP_URL`
- Replace JSON store with Postgres via Prisma when ready
- TLS required
- Review rate limits and host logs

## Not in this MVP

Custodial wallets, swaps, explorers, mining, tokens, DAOs, native apps, analytics suites, AI features, POS plugins, chat bots.
