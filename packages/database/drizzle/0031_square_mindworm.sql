ALTER TABLE "product_categories" RENAME COLUMN "parent_category_id" TO "parent_id";--> statement-breakpoint
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_parent_category_id_product_categories_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
