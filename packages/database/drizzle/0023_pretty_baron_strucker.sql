ALTER TABLE "product_raw_materials_to_products" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_raw_materials_to_products" ADD COLUMN "description" varchar;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_material_to_product_combination" ON "product_raw_materials_to_products" USING btree ("product_id","raw_material_id");