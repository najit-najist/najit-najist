DROP INDEX "user_email_idx";--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "users" USING btree (lower("email"));