ALTER TABLE "users" RENAME COLUMN "password_reset_token" TO "password_reset_secret";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "register_secret" varchar(1064);