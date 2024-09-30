CREATE TABLE IF NOT EXISTS "product_discounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"value" integer NOT NULL,
	"product_id" integer
);
--> statement-breakpoint
DROP TABLE "product_prices";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_discounts" ADD CONSTRAINT "product_discounts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
