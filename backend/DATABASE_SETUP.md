# Database Configuration Guide

## Overview

This project uses **Supabase PostgreSQL** with two connection strategies:
- **Pooled connection** for application API requests (high concurrency)
- **Direct/Migration connection** for database migrations (long-running transactions)

## Environment Variables

### `.env` Configuration

```bash
# Connection pooler - Used by the application
DATABASE_URL=postgresql://postgres.PROJECT:PASSWORD@aws-X-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Direct connection - Used for migrations
DATABASE_MIGRATION_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres
```

### Prisma Schema Configuration

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_MIGRATION_URL")
}
```

## WSL IPv6 Connectivity Issue ⚠️

**Problem:** The direct connection URL (`db.*.supabase.co:5432`) only resolves to IPv6 addresses, but WSL (Windows Subsystem for Linux) doesn't have IPv6 connectivity by default.

**Evidence:**
```bash
$ getent ahosts db.owxejauxgwjluxqengnq.supabase.co
2600:1f18:2e13:9d24:7897:dd65:52bb:ee73  # IPv6 only - not reachable from WSL

$ getent ahosts aws-1-us-east-1.pooler.supabase.com
18.213.155.45  # IPv4 - works in WSL
3.227.209.82   # IPv4 - works in WSL
```

## Current Workaround

Since the direct connection doesn't work in WSL, we use the **pooler for both** application and migrations:

```bash
DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_MIGRATION_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Limitation:** `prisma migrate dev` may hang indefinitely because PgBouncer in transaction mode doesn't support the interactive migration workflow well.

## Migration Workflow

### ✅ Recommended Approach (Manual Migration Files)

**Step 1:** Create migration file manually

```bash
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_your_migration_name
```

**Step 2:** Write SQL in `migration.sql`

```sql
-- Example: Add new column
ALTER TABLE "Article" ADD COLUMN "newField" TEXT;
```

**Step 3:** Apply migration

```bash
npm run prisma:migrate:deploy
```

**Step 4:** Regenerate Prisma Client

```bash
npm run prisma:generate
```

### ⚠️ Using `prisma migrate dev` (May Hang)

If you must use `prisma migrate dev`:

```bash
# Update schema.prisma
# Then run (may hang - wait or Ctrl+C after seeing "Applying migration...")
npx prisma migrate dev --name your_migration_name

# If it hangs, the migration likely applied successfully
# Check with:
npx ts-node -e "
import prisma from './src/config/database';
prisma.\$queryRaw\`
  SELECT column_name
  FROM information_schema.columns
  WHERE table_name = 'YourTable'
  AND column_name = 'yourNewColumn'
\`.then(console.log).finally(() => prisma.\$disconnect());
"
```

### ✅ Alternative: Use Supabase SQL Editor

1. Go to Supabase Dashboard → SQL Editor
2. Write your migration SQL
3. Execute directly
4. Update `schema.prisma` to match
5. Run `npx prisma db pull` to sync (or manually update schema)
6. Run `npx prisma generate`

## Solutions for the Future

### Option 1: Enable IPv6 in WSL2

Add to `/etc/wsl.conf`:
```ini
[network]
generateResolvConf = false
```

Then create `/etc/resolv.conf`:
```
nameserver 8.8.8.8
nameserver 2001:4860:4860::8888  # Google IPv6 DNS
```

Restart WSL:
```powershell
wsl --shutdown
```

### Option 2: Run Migrations from Windows (Not WSL)

Install Node.js on Windows and run migrations from PowerShell/CMD:
```powershell
cd backend
npx prisma migrate dev --name your_migration
```

### Option 3: Use Docker for Migrations

Create a Docker container with IPv6 support:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npx", "prisma", "migrate", "deploy"]
```

### Option 4: Use Supabase CLI

```bash
supabase db push  # Pushes schema changes
supabase db diff  # Shows schema differences
```

## Package.json Scripts

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio"
  }
}
```

## Quick Reference

| Task | Command |
|------|---------|
| Generate Prisma Client | `npm run prisma:generate` |
| Create & apply migration | `npx prisma migrate dev --name NAME` |
| Apply pending migrations | `npm run prisma:migrate:deploy` |
| Check migration status | `npx prisma migrate status` |
| Open database GUI | `npm run prisma:studio` |
| Pull schema from DB | `npx prisma db pull` |
| Push schema to DB | `npx prisma db push` (⚠️ destructive) |

## Getting Connection Strings from Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database**
4. **Connection Pooling** section → Copy URI (port 6543)
   - Use for `DATABASE_URL`
5. **Connection String** section → Copy URI (port 5432)
   - Use for `DATABASE_MIGRATION_URL` (if IPv6 works)

## Troubleshooting

### Migration hangs without output
- **Cause:** Using pooler with `migrate dev`
- **Solution:** Use manual migration files or Supabase SQL Editor

### Can't reach database server
- **Cause:** IPv6 connectivity issue in WSL
- **Solution:** Use pooler connection or fix WSL IPv6

### Prepared statement already exists
- **Cause:** PgBouncer transaction pooling limitation
- **Solution:** Normal for pooled connections, ignore if app works

### Migration applied but command hangs
- **Check:** Query database directly to verify column exists
- **Action:** Safe to Ctrl+C and continue
