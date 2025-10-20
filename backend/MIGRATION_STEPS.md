# Simple Migration Guide (WSL + Supabase)

## TL;DR - The Problem

Your WSL environment can't reach Supabase's direct connection (IPv6 only), so Prisma migration commands hang. Here are your **practical options**.

---

## ✅ Option 1: Manual Migration Files (Recommended)

This gives you full control and works reliably.

### Step-by-Step:

**1. Create migration folder**
```bash
cd backend
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mkdir -p prisma/migrations/${TIMESTAMP}_your_migration_name
```

**2. Write SQL**
```bash
nano prisma/migrations/${TIMESTAMP}_your_migration_name/migration.sql
```

Example content:
```sql
-- Add new column
ALTER TABLE "Article" ADD COLUMN "newField" TEXT;

-- Or remove column
ALTER TABLE "Article" DROP COLUMN "oldField";
```

**3. Update `schema.prisma`**

Match your SQL changes in the schema file.

**4. Apply migration**
```bash
npm run prisma:generate
```

**5. Test it**
```bash
npm run dev
# Check if your app works with the new schema
```

---

## ✅ Option 2: Use Supabase SQL Editor (Easiest)

**1. Go to Supabase Dashboard**
- https://supabase.com/dashboard
- Select your project
- Go to **SQL Editor**

**2. Write and execute SQL**
```sql
ALTER TABLE "Article" ADD COLUMN "newField" TEXT;
```

**3. Update `schema.prisma`** to match

**4. Regenerate client**
```bash
npm run prisma:generate
```

---

## ✅ Option 3: Run from Windows (Not WSL)

If you have Node.js installed on Windows:

**1. Open PowerShell** (not WSL terminal)

**2. Navigate to project**
```powershell
cd C:\Users\YourUser\path\to\tradingapp\backend
```

**3. Run migration**
```powershell
npx prisma migrate dev --name your_migration_name
```

This works because Windows has better IPv6 connectivity.

---

## Quick Migration Templates

### Add Column
```sql
ALTER TABLE "Article" ADD COLUMN "fieldName" TEXT;
ALTER TABLE "Article" ADD COLUMN "fieldName" INTEGER DEFAULT 0;
ALTER TABLE "Article" ADD COLUMN "fieldName" BOOLEAN DEFAULT false;
```

### Remove Column
```sql
ALTER TABLE "Article" DROP COLUMN "fieldName";
```

### Add Index
```sql
CREATE INDEX "Article_fieldName_idx" ON "Article"("fieldName");
```

### Add Unique Constraint
```sql
ALTER TABLE "Article" ADD CONSTRAINT "Article_fieldName_key" UNIQUE ("fieldName");
```

### Add Foreign Key
```sql
ALTER TABLE "Article"
  ADD CONSTRAINT "Article_sourceId_fkey"
  FOREIGN KEY ("sourceId")
  REFERENCES "Source"("id")
  ON DELETE CASCADE;
```

---

## Current Setup Summary

### `.env` (already configured)
```bash
# Both point to pooler due to WSL IPv6 limitation
DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
DATABASE_MIGRATION_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true
```

### `schema.prisma` (already configured)
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_MIGRATION_URL")
}
```

### `package.json` scripts (already configured)
```json
{
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:migrate:deploy": "prisma migrate deploy",
  "prisma:studio": "prisma studio"
}
```

---

## Example: Adding a New Field

Let's say you want to add `metadata` field to `Article`:

### Using Manual Migration (Option 1):

```bash
# 1. Create folder
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_add_metadata

# 2. Create SQL file
cat > prisma/migrations/$(date +%Y%m%d%H%M%S)_add_metadata/migration.sql << 'EOF'
-- AlterTable
ALTER TABLE "Article" ADD COLUMN "metadata" JSONB;
EOF

# 3. Update schema.prisma
# Add: metadata Json?

# 4. Generate
npm run prisma:generate
```

### Using Supabase Editor (Option 2):

```sql
-- Run in Supabase SQL Editor
ALTER TABLE "Article" ADD COLUMN "metadata" JSONB;
```

Then update `schema.prisma` and run `npm run prisma:generate`.

---

## Troubleshooting

**Q: Command hangs without output**
A: Normal with pooler. Use manual migration or Supabase SQL Editor.

**Q: How do I know if migration applied?**
A: Check in Supabase Dashboard → Table Editor, or use:
```bash
npm run prisma:studio
```

**Q: Can I fix IPv6 in WSL?**
A: Yes, but complex. See `DATABASE_SETUP.md` for details.

**Q: What if I want to rollback?**
A: Write a new migration that reverses the changes:
```sql
ALTER TABLE "Article" DROP COLUMN "fieldName";
```

---

## Need More Details?

See `DATABASE_SETUP.md` for comprehensive documentation including:
- IPv6 troubleshooting
- Alternative solutions
- Advanced migration patterns
- Production deployment considerations
