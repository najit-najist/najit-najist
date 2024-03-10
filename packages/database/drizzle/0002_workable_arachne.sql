DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastname" varchar(256) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "users" ("firstname","lastname");