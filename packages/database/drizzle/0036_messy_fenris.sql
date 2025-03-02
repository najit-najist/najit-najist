CREATE TABLE IF NOT EXISTS "products_to_delivery_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"product_id" integer,
	"method_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_to_delivery_methods" ADD CONSTRAINT "products_to_delivery_methods_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_to_delivery_methods" ADD CONSTRAINT "products_to_delivery_methods_method_id_order_delivery_methods_id_fk" FOREIGN KEY ("method_id") REFERENCES "public"."order_delivery_methods"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;


DO
$do$
DECLARE
  _product RECORD;
BEGIN
    FOR _product IN SELECT * FROM "products"
    LOOP
        IF _product.only_for_delivery_method_id IS NULL THEN
        ELSE
            INSERT INTO "products_to_delivery_methods" (product_id, method_id) VALUES (_product.id, _product.only_for_delivery_method_id);
        END IF;
    END LOOP;
END
$do$;
