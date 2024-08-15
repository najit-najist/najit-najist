CREATE TABLE IF NOT EXISTS "product_alergens" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" varchar,
	CONSTRAINT "product_alergens_name_unique" UNIQUE("name"),
	CONSTRAINT "product_alergens_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_alergens_to_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"alergen_id" integer NOT NULL,
	"product_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_alergens_to_products" ADD CONSTRAINT "product_alergens_to_products_alergen_id_product_alergens_id_fk" FOREIGN KEY ("alergen_id") REFERENCES "public"."product_alergens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_alergens_to_products" ADD CONSTRAINT "product_alergens_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
