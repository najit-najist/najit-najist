ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
DROP INDEX "user_email_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "users" USING btree (lower("email"));