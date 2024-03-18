ALTER TABLE "municipalities" RENAME COLUMN "firstname" TO "name";--> statement-breakpoint
DROP INDEX IF EXISTS "name_slug_idx";--> statement-breakpoint
ALTER TABLE "contact_form_replies" ADD COLUMN "lastname" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "municipalities" ADD COLUMN "slug" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "lastname" varchar(256) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_slug_idx" ON "municipalities" ("name","slug");