ALTER TABLE "product_composition_items" RENAME TO "product_raw_materials";--> statement-breakpoint
ALTER TABLE "product_composition_items_to_product" RENAME TO "product_raw_materials_to_products";--> statement-breakpoint
ALTER TABLE "product_raw_materials_to_products" RENAME COLUMN "product_composition_id" TO "raw_material_id";--> statement-breakpoint
ALTER TABLE "product_raw_materials" DROP CONSTRAINT "product_composition_items_name_unique";--> statement-breakpoint
ALTER TABLE "product_raw_materials" DROP CONSTRAINT "product_composition_items_slug_unique";--> statement-breakpoint
ALTER TABLE "product_raw_materials_to_products" DROP CONSTRAINT "product_composition_items_to_product_product_composition_id_product_composition_items_id_fk";
--> statement-breakpoint
ALTER TABLE "product_raw_materials_to_products" DROP CONSTRAINT "product_composition_items_to_product_product_id_products_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_raw_materials_to_products" ADD CONSTRAINT "product_raw_materials_to_products_raw_material_id_product_raw_materials_id_fk" FOREIGN KEY ("raw_material_id") REFERENCES "public"."product_raw_materials"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_raw_materials_to_products" ADD CONSTRAINT "product_raw_materials_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "product_raw_materials" ADD CONSTRAINT "product_raw_materials_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "product_raw_materials" ADD CONSTRAINT "product_raw_materials_slug_unique" UNIQUE("slug");