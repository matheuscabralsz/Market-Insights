-- AlterTable
ALTER TABLE "Article" ADD COLUMN "guid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Article_guid_key" ON "Article"("guid");

-- Backfill existing articles: use URL as guid for existing records
UPDATE "Article" SET "guid" = url WHERE "guid" IS NULL;
