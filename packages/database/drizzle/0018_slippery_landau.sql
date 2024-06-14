ALTER TABLE "coupons_for_products" DROP CONSTRAINT "coupons_for_products_product_id_product_categories_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coupons_for_products" ADD CONSTRAINT "coupons_for_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
