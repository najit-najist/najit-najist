ALTER TABLE "products" DROP CONSTRAINT "products_only_for_delivery_method_id_order_delivery_methods_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "only_for_delivery_method_id";
