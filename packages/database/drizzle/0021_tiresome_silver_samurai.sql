CREATE TABLE IF NOT EXISTS "product_composition_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	CONSTRAINT "product_composition_items_name_unique" UNIQUE("name"),
	CONSTRAINT "product_composition_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_composition_items_to_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_composition_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"notes" varchar,
	"order" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_composition_items_to_product" ADD CONSTRAINT "product_composition_items_to_product_product_composition_id_product_composition_items_id_fk" FOREIGN KEY ("product_composition_id") REFERENCES "public"."product_composition_items"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_composition_items_to_product" ADD CONSTRAINT "product_composition_items_to_product_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
