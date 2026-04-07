# Shoshin — Setup Guide

One-time setup for Cloudflare Pages (hosting + auth) and Gumroad (payments).

## 1. Cloudflare Pages

### Create the project
1. Go to Cloudflare Dashboard > Pages > Create a project
2. Connect your GitHub repo
3. Build settings: **no build command**, output directory: `/` (repo root)
4. Deploy

### Create KV namespace
```bash
npx wrangler kv namespace create SHOSHIN_KEYS
```
This outputs a namespace ID. You'll need it for the binding.

### Bind KV to Pages
1. Cloudflare Dashboard > Pages > your project > Settings > Functions
2. Under **KV namespace bindings**, add:
   - Variable name: `SHOSHIN_KEYS`
   - KV namespace: select the one you just created
3. Save and redeploy

### Set environment variables
1. Same Settings > Functions page, under **Environment variables**:
   - `GUMROAD_PRODUCT_ID` = your Gumroad product permalink (the short ID from your product URL, e.g. `abcde`)
   - `GUMROAD_SELLER_ID` = your Gumroad seller ID (optional, extra check)
2. Save and redeploy

## 2. Gumroad Product

### Create the product
1. Go to Gumroad > Products > New Product
2. Set it up as a digital product (the course)

### Enable license keys
1. Edit product > scroll to **License key** section
2. Toggle ON "Generate a unique license key per sale"

### Set up the ping (webhook)
1. Go to Gumroad > Settings > Advanced > Ping notification URL
2. Set to: `https://your-domain.pages.dev/api/webhook`
3. This fires on every purchase and refund

### Test the flow
1. Use Gumroad's test purchase flow
2. Check Cloudflare KV for the stored key:
   ```bash
   npx wrangler kv key get --namespace-id=YOUR_NS_ID "key:YOUR_TEST_KEY"
   ```
3. Visit `https://your-domain.pages.dev/enter` and paste the key

## 3. Local Development

### Install wrangler
```bash
npm install -g wrangler
# or
bunx wrangler
```

### Run locally with KV
```bash
npx wrangler pages dev . --kv SHOSHIN_KEYS --port 8080
```
This starts a local dev server with a local KV store. The local KV is separate from production.

### Seed a test key locally
```bash
npx wrangler kv key put --local --namespace-id=unused "key:test-key-123" '{"email":"test@test.com","createdAt":"2026-04-06"}'
```
Then visit `http://localhost:8080/enter` and enter `test-key-123`.

### Static-only dev (no auth)
```bash
bunx serve . -l 8080
```
Serves files directly — no middleware, no KV, no auth. Useful for working on practice tools.
