ALTER TABLE "ordered_products" ADD COLUMN "discount" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount" real DEFAULT 0 NOT NULL;