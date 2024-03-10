DO $$ BEGIN
 CREATE TYPE "user_states" AS ENUM('new', 'unpaid', 'unconfirmed', 'confirmed', 'finished', 'dropped', 'shipped');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comgate_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"transaction_id" varchar(256) NOT NULL,
	"order_id" integer NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "name_idx";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'invited';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ordered_products" ADD COLUMN "order_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "state" "user_states" DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_token" varchar(1064);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(1064) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "users" ("firstname","firstname");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comgate_payments" ADD CONSTRAINT "comgate_payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");