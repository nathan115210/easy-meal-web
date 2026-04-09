-- Add slug column to Meal (nullable first so backfill can run)
ALTER TABLE "Meal" ADD COLUMN "slug" TEXT;

-- Backfill: compute slug from title using the same rules as the TS slugify() helper:
--   1. LOWER + TRIM
--   2. Replace any run of non-alphanumeric characters with a single '-'
--   3. Strip leading/trailing '-'
UPDATE "Meal"
SET "slug" = REGEXP_REPLACE(
               REGEXP_REPLACE(LOWER(TRIM("title")), '[^a-z0-9]+', '-', 'g'),
               '^-+|-+$', '', 'g'
             );

-- Now enforce NOT NULL and UNIQUE
ALTER TABLE "Meal" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Meal_slug_key" ON "Meal"("slug");
