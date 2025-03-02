ALTER TABLE "order_delivery_methods" ADD CONSTRAINT "order_delivery_methods_slug_unique" UNIQUE("slug");
ALTER TABLE "products_to_delivery_methods" ADD COLUMN "method_slug" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_to_delivery_methods" ADD CONSTRAINT "products_to_delivery_methods_method_slug_order_delivery_methods_slug_fk" FOREIGN KEY ("method_slug") REFERENCES "public"."order_delivery_methods"("slug") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
